import { User, Product, ApiResponseData } from 'Shared/Data/Types/index.js'
import { UPGRADE_REQUEST_STATUS } from 'Shared/Data/Constants/index.js'

/**
 * Data payload for the Watchlist response.
 *
 * @interface WatchlistResponseData
 * @property {boolean} success - Indicates if the request was successful
 * @property {string} message - A message providing additional information about the response
 * @property {{ watchlist: Product[] }} [data] - Data payload containing the user's watchlist
 */
export interface WatchlistResponseData extends ApiResponseData {
	data?: { watchlist: Product[] }
}

/**
 * Data payload for the Bidding History response.
 *
 * @interface BiddingHistoryResponseData
 * @property {boolean} success - Indicates if the request was successful
 * @property {string} message - A message providing additional information about the response
 * @property {{ products: Product[] }} [data] - Data payload containing the user's bidding history
 */
export interface BiddingListResponseData extends ApiResponseData {
	data?: { products: Product[] }
}

/**
 * Data payload for User Listing response
 *
 * @interface UserListingResponseData
 * @property {boolean} success - Indicates if the authentication was successful
 * @property {string} message - A message providing additional information about the product list response
 * @property {{ users: User[]; pagination: { page: number; limit: number; total: number; totalPages: number } }} [data] - Contains the list of users and pagination info
 */
export interface UserListingResponseData extends ApiResponseData {
	data?: {
		users: User[]
		pagination: {
			page: number
			limit: number
			total: number
			totalPages: number
		}
	}
}
