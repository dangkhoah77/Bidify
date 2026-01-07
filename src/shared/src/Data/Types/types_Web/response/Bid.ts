import { Product, Bid, ApiResponseData } from 'Shared/Data/Types/index.js'

/**
 * Data payload for the Watchlist response.
 *
 * @interface BidResponseData
 * @property {boolean} success - Indicates if the bidding is successful
 * @property {string} message - A message providing additional information about the bidding response
 * @property {{ product: Product; bid: Bid }} [data] - Contains the bid details and associated product if successful
 */
export interface BidResponseData extends ApiResponseData {
	data?: { product: Product; bid: Bid }
}

/**
 * Data payload for Bid listing response.
 *
 * @interface BidListingResponseData
 * @property {boolean} success - Indicates if the authentication was successful
 * @property {string} message - A message providing additional information about the bid history response
 * @property {{ bids: Bid[] }} [data] - Contains the list of bids
 */
export interface BidListingResponseData extends ApiResponseData {
	data?: { bids: Bid[] }
}
