import mongoose from 'mongoose'
import chalk from 'chalk'

import { UserDocument } from 'Server/Models/User/index.js'
import { ProductDocument } from 'Server/Models/Product/index.js'

import SendMail from 'Server/Modules/Mail/index.js'

import { FindValidBidsByProduct, FindExpiredAuctions } from './Query.js'
import { FindVerifiedUserById } from 'Server/Services/AuthService/Query.js'

/**
 * Checks for products that have passed their endTime and are still active.
 */
export const CheckAuctionsEnd = async () => {
	try {
		// Find active products that have expired
		const expiredProducts = await FindExpiredAuctions()

		// If no expired products, exit early
		if (expiredProducts.length == 0) return

		console.log(
			chalk.yellow(
				`[Scheduler] Found ${expiredProducts.length} expired auctions. Closing...`
			)
		)

		for (const product of expiredProducts) {
			product.active = false

			// If there is a highest bidder, they are the winner
			if (product.highestBidder) {
				product.winner = product.highestBidder
			}

			await product.save()

			// Send winning notifications if there was a winner
			if (product.winner) {
				SendWinningBidNotifications(
					product.name,
					product.currentPrice,
					product.seller as string,
					product.winner as string
				)
			} else {
				// Notify seller of no bids
				const seller = await FindVerifiedUserById(
					product.seller as string
				)
				if (seller && seller.email) {
					SendMail(seller.email, 'AuctionEndedNoBids', {
						productName: product.name,
					})
				}
			}
		}
	} catch (error) {
		console.error(
			chalk.red('[Scheduler] Error checking auction ends:'),
			error
		)
	}
}

/**
 * Recalculates the auction state for a product after a bid has been denied or removed.
 *
 * @param product - The product document to recalculate
 * @param session - The mongoose client session for transaction
 * @returns The updated product document
 */
export const RecalculateAuctionState = async (
	product: ProductDocument,
	session: mongoose.ClientSession
) => {
	// Fetch all valid bids, sorted by Max Price desc, then Time asc
	const validBids = await FindValidBidsByProduct(product.id).session(session)

	if (validBids.length == 0) {
		// No bids left -> Reset to start
		product.currentPrice = product.startPrice
		product.highestBidder = undefined
		product.winner = undefined
	} else if (validBids.length == 1) {
		// Only 1 bidder left -> They win at Start Price
		const winner = validBids[0]
		product.highestBidder = winner.bidder
		product.currentPrice = product.startPrice

		// Reset winner's price to start price
		winner.price = product.startPrice
		await winner.save({ session })
	} else {
		// 2+ bidders -> Proxy Logic between #1 and #2
		const winnerBid = validBids[0] // Highest Max
		const runnerUpBid = validBids[1] // 2nd Highest Max

		// Set highest bidder
		product.highestBidder = winnerBid.bidder

		// Price is RunnerUp's Max + Step (capped at Winner's Max)
		const newPrice = Math.min(
			runnerUpBid.maxPrice + product.priceStep,
			winnerBid.maxPrice
		)

		// Update product current price
		product.currentPrice = newPrice

		// Update the winner's current bid price
		winnerBid.price = newPrice
		await winnerBid.save({ session })

		// Also update the runner-up's current bid price if needed
		if (runnerUpBid.price !== runnerUpBid.maxPrice) {
			runnerUpBid.price = runnerUpBid.maxPrice
			await runnerUpBid.save({ session })
		}
	}

	return product.save({ session })
}

/**
 * Send notifications for winning bid.
 *
 * @param productName - Name of the product
 * @param finalPrice - Final price of the auction
 * @param sellerId - ID of the seller
 * @param winnerId - ID of the winning bidder
 * @param prevBidderId - ID of the previous highest bidder (if any)
 */
export const SendWinningBidNotifications = async (
	productName: string,
	finalPrice: number,
	sellerId: string,
	winnerId: string,
	prevBidderId?: string
) => {
	try {
		// Fetch users involved
		const seller = await FindVerifiedUserById(sellerId)
		const winner = await FindVerifiedUserById(winnerId)

		let prevBidder: UserDocument | null = null
		if (prevBidderId) {
			prevBidder = await FindVerifiedUserById(prevBidderId)
		}

		// Notify seller of auction end
		if (seller && seller.email) {
			SendMail(seller.email, 'AuctionEndedSeller', {
				productName: productName,
				finalPrice: finalPrice,
			})
		}

		if (winner) {
			// Notify winner of auction win
			if (winner.email) {
				SendMail(winner.email, 'AuctionWon', {
					productName: productName,
					finalPrice: finalPrice,
				})
			}

			// Notify previous bidder if outbid
			if (prevBidder && prevBidder.email) {
				SendMail(prevBidder.email, 'OutbidAuctionEnded', {
					productName: productName,
					winnerName: winner.lastName,
					finalPrice: finalPrice,
				})
			}
		}
	} catch (err) {
		console.error(
			chalk.red('Failed to send winning bid notifications'),
			err
		)
	}
}

/**
 * Send notifications for new bid placement.
 *
 * @param productName - Name of the product
 * @param newPrice - New current price after bid
 * @param maxPrice - Max price of the new bid
 * @param sellerId - ID of the seller
 * @param winnerId - ID of the winning bidder
 * @param prevBidderId - ID of the previous highest bidder (if any)
 */
export const SendNewBidNotifications = async (
	productName: string,
	newPrice: number,
	maxPrice: number,
	sellerId: string,
	winnerId: string,
	prevBidderId?: string
) => {
	try {
		// Fetch users involved
		const seller = await FindVerifiedUserById(sellerId)
		const winner = await FindVerifiedUserById(winnerId)

		let prevBidder: UserDocument | null = null
		if (prevBidderId) {
			prevBidder = await FindVerifiedUserById(prevBidderId)
		}

		// Notify seller of new bid
		if (seller && seller.email) {
			SendMail(seller.email, 'NewBid', {
				productName: productName,
				bidderName: winner?.lastName,
				price: newPrice,
			})
		}

		if (winner) {
			// Notify winner of successful bid
			if (winner.email) {
				SendMail(winner.email, 'BidPlaced', {
					productName: productName,
					price: newPrice,
					maxPrice: maxPrice,
				})
			}

			// Notify previous bidder if outbid
			if (prevBidder && prevBidder.email) {
				SendMail(prevBidder.email, 'Outbid', {
					productName: productName,
					newWinner: winner && winner.lastName,
					newPrice: newPrice,
				})
			}
		}
	} catch (err) {
		console.error(chalk.red('Failed to send bid notifications'), err)
	}
}

/**
 * Send notification for denied bid.
 *
 * @param productName - Name of the product
 * @param bidderId - ID of the bidder whose bid was denied
 */
export const SendBidDeniedNotification = async (
	productName: string,
	bidderId: string
) => {
	try {
		const bidder = await FindVerifiedUserById(bidderId)
		if (bidder && bidder.email) {
			SendMail(bidder.email, 'BidDenied', {
				productName: productName,
			})
		}
	} catch (err) {
		console.error(chalk.red('Failed to send bid denied notification'), err)
	}
}
