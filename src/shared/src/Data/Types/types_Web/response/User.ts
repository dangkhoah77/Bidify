import { BidType, ProductType, ReviewType } from 'Shared/Data/Types/index.js'

/**
 * Data payload for the Watchlist response.
 *
 * @type WatchlistResponseData
 * @property {ProductType[]} watchlist - Array of products in the user's watchlist
 */
export type WatchlistResponseData = {
	watchlist: ProductType[]
}

/**
 * Data payload for the Bidding History response.
 *
 * @type BiddingHistoryResponseData
 * @property {Bid[]} bids - Array of bids placed by the user, populated with product info
 */
export type BiddingHistoryResponseData = {
	bids: BidType[]
}

/**
 * Data payload for the Personal Reviews response.
 *
 * @type PersonalReviewsResponseData
 * @property {ReviewType[]} reviews - Array of reviews received by the user
 */
export type PersonalReviewsResponseData = {
	reviews: ReviewType[]
}
