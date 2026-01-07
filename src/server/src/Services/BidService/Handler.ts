import chalk from 'chalk'
import mongoose from 'mongoose'

import { ApiResponseData, BidResponseData } from 'Shared/Data/Types/index.js'
import { BID_STATE, RATING } from 'Shared/Data/Constants/index.js'

import { BidConfig } from './index.js'

import { UserDocument } from 'Server/Models/User/index.js'
import Product, { ProductDocument } from 'Server/Models/Product/index.js'
import Bid, { BidDocument } from 'Server/Models/Bid/index.js'
import { ReviewDocument } from 'Server/Models/Review/index.js'

import { FindProductById } from 'Server/Services/ProductService/Query.js'
import {
	FindLatestBidByProductAndBidder,
	DeleteBidsByProductAndBidder,
	UpdateBidsAsNotLatest,
	CreateBid,
} from './Query.js'

import {
	RecalculateAuctionState,
	SendWinningBidNotifications,
	SendNewBidNotifications,
	SendBidDeniedNotification,
} from './Helper.js'

/**
 * Places a bid using the Proxy Bidding (Auto-Bid) algorithm.
 * * Logic:
 * 1. Validates user balance and bid conditions.
 * 2. Handle auction auto-extension if bid is near end time.
 * 3. Compares this bid's maxPrice with current highest bid's maxPrice.
 * 4. Updates product price, highest bidder, and bid records accordingly.
 * 5. Handles Buy Now scenario if applicable.
 * 6. Sends email notifications to relevant parties.
 *
 * @param user - The user placing the bid
 * @param productId - ID of the product
 * @param maxPrice - The maximum price the user is willing to pay
 * @return Status and result data of the bid placement
 */
export const PlaceBid = async (
	user: UserDocument,
	productId: string,
	maxPrice: number
): Promise<{ status: number; data: BidResponseData }> => {
	// Check if user has sufficient balance
	if (user.balance < maxPrice) {
		return {
			status: 400,
			data: {
				success: false,
				message: 'Số dư tài khoản không đủ để đặt giá tối đa này.',
			},
		}
	}

	// Create new session for transaction
	const session = await mongoose.startSession()
	session.startTransaction()

	try {
		// Fetch Product by its id
		const product: ProductDocument | null = await FindProductById(productId)
		if (!product) {
			return {
				status: 404,
				data: {
					success: false,
					message: 'Không tìm thấy sản phẩm.',
				},
			}
		}
		if (!product.active || new Date() >= product.endTime) {
			return {
				status: 400,
				data: {
					success: false,
					message: 'Đấu giá cho sản phẩm này đã kết thúc.',
				},
			}
		}

		// Prevent bidding in own-products
		if (product.seller == user.id) {
			return {
				status: 400,
				data: {
					success: false,
					message:
						'Bạn không thể đặt giá cho sản phẩm của chính mình.',
				},
			}
		}

		// Check user review history if there is one
		if (user.reviewsReceived && user.reviewsReceived.length > 0) {
			// Get positive reviews from user's received reviews
			await user.populate('reviewsReceived')
			const positiveReviews = user.reviewsReceived.filter(
				(review) => (review as ReviewDocument).rating == RATING.Positive
			)

			// Check if the user has 80% positive reviews
			const positiveRatio =
				positiveReviews.length / user.reviewsReceived.length
			if (positiveRatio < 0.8) {
				return {
					status: 400,
					data: {
						success: false,
						message:
							'Bạn cần có ít nhất 80% đánh giá tích cực để tham gia đấu giá.',
					},
				}
			}
		} else if (!product.allowUnreviewedBidders) {
			return {
				status: 400,
				data: {
					success: false,
					message:
						'Bạn cần có lịch sử đánh giá để tham gia đấu giá cho sản phẩm này.',
				},
			}
		}

		// Check if the user is already denied from bidding
		const existingDeniedBid = await FindLatestBidByProductAndBidder(
			productId,
			user.id,
			BID_STATE.Denied
		)

		// If a denied bid exists, prevent bidding
		if (existingDeniedBid) {
			return {
				status: 400,
				data: {
					success: false,
					message: 'Bạn không được phép đặt giá cho sản phẩm này.',
				},
			}
		}

		// Validate that maxPrice is a multiple of priceStep
		if (maxPrice % product.priceStep != 0) {
			return {
				status: 400,
				data: {
					success: false,
					message: `Giá tối đa phải là bội của bước giá: ${product.priceStep.toLocaleString()}.`,
				},
			}
		}

		// If bid is placed within last (AutoExtenThreshold) ms, extend by (AutoExtendIncrement) ms
		const now = new Date()
		const timeLeft = new Date(product.endTime).getTime() - now.getTime()

		// Auto-extend auction end time if within threshold
		if (product.autoExtend && timeLeft <= BidConfig.AutoExtendThreshold) {
			product.endTime = new Date(
				product.endTime.getTime() + BidConfig.AutoExtendIncrement
			)
			console.log(
				chalk.magenta(`[Auction] Auto-extended product ${product.id}`)
			)
		}

		// Get the current winning bid
		const currentWinningBid = await FindLatestBidByProductAndBidder(
			productId,
			product.highestBidder as string,
			BID_STATE.Active
		).session(session)

		let newPrice = 0
		let previousHighestBidderId: string | undefined = undefined

		// If there is an existing winning bid, compare maxPrices
		if (currentWinningBid) {
			const currentWinnerId = currentWinningBid.bidder as string
			const currentMaxPrice = currentWinningBid.maxPrice

			// If the current user is already the highest bidder, allow them to increase their maxPrice
			if (currentWinnerId == user.id) {
				if (maxPrice > currentMaxPrice) {
					currentWinningBid.maxPrice = maxPrice
					await currentWinningBid.save({ session })
					await session.commitTransaction()

					return {
						status: 200,
						data: {
							success: true,
							message: 'Cập nhật giá tối đa thành công.',
							data: {
								product: await Product.toDto(product),
								bid: await Bid.toDto(currentWinningBid),
							},
						},
					}
				} else {
					return {
						status: 400,
						data: {
							success: false,
							message:
								'Bạn đang giữ giá cao nhất. Giá tối đa mới phải cao hơn giá tối đa cũ.',
						},
					}
				}
			}

			if (maxPrice > currentMaxPrice) {
				/**
				 * Case 1: New maxPrice is higher than current maxPrice
				 * => New bidder becomes highest bidder
				 * => New price is current maxPrice + price step
				 * => Previous highest bidder's bid price is updated to their maxPrice
				 */
				previousHighestBidderId = currentWinnerId
				newPrice = currentMaxPrice + product.priceStep
				currentWinningBid.price = currentMaxPrice
			} else if (maxPrice < currentMaxPrice) {
				/**
				 * Case 2: New maxPrice is lower than current maxPrice
				 * => Current highest bidder remains highest bidder
				 * => New price is max of (new maxPrice + price step) and current price
				 * => Current highest bidder's bid price is updated accordingly
				 */
				newPrice = Math.max(
					product.currentPrice,
					maxPrice + product.priceStep
				)
				currentWinningBid.price = newPrice
			} else {
				/**
				 * Case 3: New maxPrice is equal to current maxPrice
				 * => Current highest bidder remains highest bidder
				 * => New price is current maxPrice
				 * => Current highest bidder's bid price is updated to current maxPrice
				 */
				newPrice = currentMaxPrice
				currentWinningBid.price = currentMaxPrice
			}

			// Update the winning bid record
			await currentWinningBid.save({ session })
		} else {
			// If there are no previous bids, price is the start price
			newPrice = product.startPrice
		}

		// Check for buy now case
		if (newPrice >= product.buyNowPrice) {
			product.active = false
			product.winner = previousHighestBidderId
				? user.id
				: product.highestBidder
			newPrice = product.buyNowPrice // Cap at buy now
		}

		// Mark existing bids by this user as not latest
		await UpdateBidsAsNotLatest(product.id, user.id).session(session)

		// Create a new bid record
		const newBidRecord = await CreateBid(
			{
				product: productId,
				bidder: user.id,
				price: previousHighestBidderId ? newPrice : maxPrice,
				maxPrice: maxPrice,
				state: BID_STATE.Active,
				latest: true,
			},
			session
		)

		// Update product state
		product.currentPrice = newPrice
		product.highestBidder =
			previousHighestBidderId || !product.highestBidder
				? user.id
				: product.highestBidder

		// Save the updated product
		await product.save({ session })
		await session.commitTransaction()

		// Send email notifications
		if (!product.winner) {
			SendNewBidNotifications(
				product.name,
				newPrice,
				maxPrice,
				product.seller as string,
				user.id,
				previousHighestBidderId
			)
		} else {
			// If auction ended due to buy now, send winning notifications
			SendWinningBidNotifications(
				product.name,
				newPrice,
				product.seller as string,
				user.id,
				previousHighestBidderId
			)
		}

		return {
			status: 200,
			data: {
				success: true,
				message: 'Đặt giá thành công.',
				data: {
					product: await Product.toDto(product),
					bid: await Bid.toDto(newBidRecord),
				},
			},
		}
	} catch (error) {
		await session.abortTransaction()
		throw error
	} finally {
		session.endSession()
	}
}

/**
 * Unregisters the user from bidding on a product.
 * Remove all bids from the user but the latest and mark it as removed.
 *
 * @param user - The user unregistering the bid
 * @param productId - ID of the product to unregister from
 * @return Status and result data of the unregistration
 */
export const UnregisterBid = async (
	user: UserDocument,
	productId: string
): Promise<{ status: number; data: ApiResponseData }> => {
	const session = await mongoose.startSession()
	session.startTransaction()

	try {
		// Delete user's bids except the latest one
		DeleteBidsByProductAndBidder(productId, user.id).session(session)

		// Fetch the latest bid of the user
		const bid = await FindLatestBidByProductAndBidder(
			productId,
			user.id,
			BID_STATE.Active
		).session(session)

		// If no active latest bid found, return early
		if (!bid) {
			return {
				status: 400,
				data: {
					success: false,
					message:
						'Bạn chưa đặt giá cho sản phẩm này hoặc đã bị hủy.',
				},
			}
		}

		// Mark the latest bid as removed
		bid.state = BID_STATE.Removed
		await bid.save({ session })

		// Recalculate Winner & Price based on remaining bids
		const product = await FindProductById(productId)
		if (product) {
			await RecalculateAuctionState(product, session)
		} else {
			return {
				status: 404,
				data: {
					success: false,
					message: 'Không tìm thấy sản phẩm.',
				},
			}
		}

		await session.commitTransaction()
		return {
			status: 200,
			data: {
				success: true,
				message: 'Hủy đăng ký đặt giá thành công.',
			},
		}
	} catch (error) {
		await session.abortTransaction()
		console.log(chalk.red('Error removing bid:'), error)
		throw error
	} finally {
		session.endSession()
	}
}

/**
 * Denies a bidder from participating in the auction for a specific product.
 * Removes all active bids from the bidder but the latest and it as denied.
 *
 * @param seller - The seller denying the bid
 * @param productId - ID of the product
 * @param bidderId - ID of the bidder to be denied
 * @return Status and result data of the denial operation
 */
export const DenyBid = async (
	seller: UserDocument,
	productId: string,
	bidderId: string
): Promise<{ status: number; data: ApiResponseData }> => {
	const session = await mongoose.startSession()
	session.startTransaction()

	try {
		const product = await FindProductById(productId)
		if (!product) {
			return {
				status: 404,
				data: {
					success: false,
					message: 'Sản phẩm không tồn tại.',
				},
			}
		}

		// Verify if seller owns the product
		if (product.seller !== seller.id) {
			return {
				status: 403,
				data: {
					success: false,
					message: 'Bạn không có quyền từ chối lượt đặt giá này.',
				},
			}
		}

		// Delete bidder's bids except the latest one
		DeleteBidsByProductAndBidder(productId, bidderId).session(session)

		// Fetch the latest bid of the user with the bidderId
		const bid = await FindLatestBidByProductAndBidder(
			productId,
			bidderId,
			BID_STATE.Active
		).session(session)

		// If no active latest bid found, throw error
		if (!bid) {
			return {
				status: 400,
				data: {
					success: false,
					message:
						'Người dùng này chưa đặt giá cho sản phẩm hoặc đã bị hủy.',
				},
			}
		}

		// Mark the latest bid as denied
		bid.state = BID_STATE.Denied
		await bid.save({ session })

		// Recalculate product auction state
		await RecalculateAuctionState(product, session)

		// Send bid denied notification to the bidder
		SendBidDeniedNotification(product.name, bidderId)

		await session.commitTransaction()
		return {
			status: 200,
			data: {
				success: true,
				message: 'Người đặt giá đã bị từ chối thành công.',
			},
		}
	} catch (error) {
		await session.abortTransaction()
		throw error
	} finally {
		session.endSession()
	}
}
