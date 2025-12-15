import chalk from 'chalk'
import mongoose from 'mongoose'

import { INTERVAL_AUCTION_CHECK_MS } from 'Server/Data/Constants.js'
import { IUser } from 'Server/Models/User.js'
import Product, { IProduct } from 'Server/Models/Product.js'
import Bid from 'Server/Models/Bid.js'

/**
 * Map of active bidding schedulers.
 * Contains participants and timer for each product.
 *
 * @prop ActiveBiddings - { [string]: NodeJS.Timeout }
 */
const ActiveBiddings = new Map<string, NodeJS.Timeout>()

/**
 * Setup bidding schedulers for all active products.
 */
export const setupBidScheduler = async () => {
	console.log(chalk.blue('Initializing Product Schedulers...'))

	try {
		// Fetch all active products that need schedulers
		const activeProducts = await Product.find({
			isActive: true,
			endTime: { $gt: new Date() },
		})

		// Initialize a scheduler for each active product
		activeProducts.forEach((product) => {
			startAuction(product.id)
		})

		console.log(
			chalk.green(
				`Initialized ${activeProducts.length} Product Schedulers.`
			)
		)
	} catch (error) {
		console.error(
			`${chalk.red('[Error]')} Failed to initialize Product Schedulers:`,
			error
		)
	}
}

/**
 * Stops the bidding scheduler for a specific product.
 *
 * @param productId - The ID of the product whose auction to stop.
 */
const stopAuction = (productId: string) => {
	if (ActiveBiddings.has(productId)) {
		// Retrieve and remove the auto-bid timer
		const autoBidTimer = ActiveBiddings.get(productId)
		ActiveBiddings.delete(productId)

		// Clear the interval timer to stop the scheduler
		if (autoBidTimer) {
			clearInterval(autoBidTimer)
		}

		console.log(
			chalk.yellow(`[Scheduler] Stopped for Product: ${productId}`)
		)
	}
}

/**
 * Starts a dedicated bidding scheduler for a specific product.
 *
 * @param productId - The ID of the product for which to start the auction.
 */
const startAuction = (productId: string) => {
	// Prevent duplicate schedulers for the same product
	if (ActiveBiddings.has(productId)) {
		console.log(
			chalk.yellow(
				`[Scheduler] Already running for Product: ${productId}`
			)
		)
		return
	}

	// Initialize the bidding scheduler for the product
	ActiveBiddings.set(
		productId,
		setInterval(
			() => processBiddingSession(productId),
			INTERVAL_AUCTION_CHECK_MS
		)
	)

	console.log(chalk.green(`[Scheduler] Started for Product: ${productId}`))
}

/**
 * Handle a bid on a product, updating product state accordingly.
 *
 * @param session - Mongoose client session for transaction
 * @param product - The product being bid on
 * @param bid - The bid being placed
 * @param price - The bid price
 * @param options - Additional options for handling the bid
 * @returns Updated product after handling the bid
 */
export const handleBid = async (
	product: IProduct,
	bidder: IUser | mongoose.Types.ObjectId,
	price: number,
	options?: { session?: mongoose.ClientSession; skipUpdate?: boolean }
): Promise<IProduct> => {
	try {
		// Check if the user's immediate price OR their max willingness meets the Buy Now price
		if (product.buyNowPrice && price >= product.buyNowPrice) {
			// Update product as sold to the bidder
			product.highestBidder = bidder
			product.winner = bidder
			product.currentPrice = product.buyNowPrice
			product.isActive = false
		} else {
			// Otherwise, just update the product's current highest bid
			product.currentPrice = price
			product.highestBidder = bidder
		}

		let updatedProduct = product

		// Save the product state if not skipping
		if (!options?.skipUpdate) {
			updatedProduct = await product.save({
				session: options?.session,
			})

			// Check if product save was successful
			if (!updatedProduct) {
				throw new Error(
					"You can't process the bid at the moment. Please try again later."
				)
			}
		}

		return updatedProduct
	} catch (error) {
		throw error
	}
}

/**
 * Start a dedicated scheduler for a specific product.
 * will be called when new product is created
 *
 * @param productId - The ID of the product for which to start the auction.
 */
const processBiddingSession = async (productId: string) => {
	const session = await mongoose.startSession()

	try {
		let product = (await Product.findById(productId)) as
			| IProduct
			| undefined

		// Stop scheduler if product is no longer active
		if (!product || !product.isActive || new Date() >= product.endTime) {
			return stopAuction(productId)
		}

		// Begin transaction
		session.startTransaction()

		// Fetch latest bids on the product
		const activeBids = await Bid.find({
			product: productId,
			latest: true,
		})
			.sort({ joinedAt: 1 })
			.session(session)

		// Skip if there are only 1 or no active bids
		if (activeBids.length < 2) {
			return
		}

		// Process each active bid for auto-bidding
		for (const bid of activeBids) {
			// Skip if bidder is already the highest
			if (
				bid.price == product.currentPrice ||
				bid.bidder._id.equals(
					product.highestBidder as mongoose.Types.ObjectId
				)
			) {
				continue
			}

			// Update the bid as no longer latest
			bid.latest = false
			await bid.save({ session })

			// Determine the next bid price
			const nextBidPrice: number =
				product.currentPrice + product.priceStep

			// Check if the bidder can outbid the current highest
			if (bid.maxPrice >= nextBidPrice) {
				// Create a new bid for the next bid price
				bid.isNew = true
				bid.price = nextBidPrice
				bid.latest = true
				await bid.save({ session })

				// Handle the bid logic
				product = await handleBid(product, bid.bidder, nextBidPrice, {
					session,
					skipUpdate: true,
				})

				// Check if auction for this product ended due to Buy Now
				if (!product.isActive) {
					break
				}
			}
		}

		// Update product with new state after processing bids
		await product.save({ session })
		await session.commitTransaction()

		// Stop the auction if the product is no longer active
		if (!product.isActive) {
			stopAuction(productId)
		}
	} catch (err) {
		await session.abortTransaction()
		console.error(
			`${chalk.red('[Error]')} in scheduler for ${productId}:`,
			err
		)
	} finally {
		session.endSession()
	}
}
