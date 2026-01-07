import type { Category, ApiResponseData } from 'Shared/Data/Types/index.js'

/**
 * Data payload for the Watchlist response.
 *
 * @type BidBidResponseData
 * @property {boolean} success - Indicates if the bidding is successful
 * @property {string} message - A message providing additional information about the bidding response
 * @property {{ categories: Category[] }} [data] - Contains the list of categories if successful
 */
export interface CatgoryListingResponseData extends ApiResponseData {
	data?: { categories: Category[] }
}
