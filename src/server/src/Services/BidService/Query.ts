import { ClientSession } from 'mongoose'

import { BID_STATE } from 'Shared/Data/Constants/index.js'

import Bid, { IBid } from 'Server/Models/Bid/index.js'
import Product from 'Server/Models/Product/index.js'

/**
 * Finds all valid bids for a specific product, sorted by maxPrice descending and createdAt ascending.
 *
 * @param {string} productId - The ID of the product to find bids for.
 * @returns An array of BidDocument representing valid bids for the product.
 */
export const FindValidBidsByProduct = (productId: string) => {
	return Bid.where('product', productId)
		.where('state', BID_STATE.Active)
		.sort({ maxPrice: -1, createdAt: 1 })
}

/**
 * Finds the latest bid of a user by product ID, bidder ID, and bid state.
 *
 * @param {string} productId - The ID of the product.
 * @param {string} bidderId - The ID of the bidder.
 * @param {BID_STATE} state - The state of the bid to find.
 * @returns A BidDocument representing the found bid, or null if not found.
 */
export const FindLatestBidByProductAndBidder = (
	productId: string,
	bidderId: string,
	state: BID_STATE = BID_STATE.Active
) => {
	return Bid.where('product', productId)
		.where('bidder', bidderId)
		.where('state', state)
		.where('latest', true)
		.findOne()
}

/**
 * Finds and returns all active products that have expired auctions.
 *
 * @returns An array of ProductDocument representing expired auctions.
 */
export const FindExpiredAuctions = async () => {
	return Product.where('active', true).lte('endTime', new Date())
}

/**
 * Updates all bids for a specific product and bidder to mark them as not the latest.
 *
 * @param {string} productId - The ID of the product.
 * @param {string} bidderId - The ID of the bidder.
 * @returns A promise that resolves when the bids are updated.
 */
export const UpdateBidsAsNotLatest = (productId: string, bidderId: string) => {
	return Bid.updateMany(
		{ product: productId, bidder: bidderId },
		{ $set: { latest: false } }
	)
}

/**
 * Deletes all bids associated with a specific product.
 *
 * @param {string} productId - The ID of the product.
 * @returns A promise that resolves when the bids are deleted.
 */
export const DeleteBidsByProduct = (productId: string) => {
	return Bid.deleteMany({
		product: productId,
	})
}

/**
 * Deletes all bids associated with a specific product and bidder.
 * Except the latest bid which is kept for record purposes.
 *
 * @param {string} productId - The ID of the product.
 * @param {string} bidderId - The ID of the bidder.
 * @returns A promise that resolves when the bids are deleted.
 */
export const DeleteBidsByProductAndBidder = (
	productId: string,
	bidderId: string
) => {
	return Bid.deleteMany({
		product: productId,
		bidder: bidderId,
		latest: false,
	})
}

/**
 * Creates a new bid record.
 *
 * @param {Partial<IBid>} info - The bid information to create the bid.
 * @param {ClientSession} [session] - Optional mongoose client session for transaction support.
 * @returns A promise that resolves to the created BidDocument.
 */
export const CreateBid = (
	info: Partial<IBid>,
	session: ClientSession | null = null
) => {
	return Bid.create([info], { session }).then((bids) => bids[0])
}
