import { RegisterBiddingRequestData } from 'Shared/Data/Types/index.js'
import {
	ApiResponseData,
	BidHistoryResponseData,
} from 'Shared/Data/Types/index.js'
import Api from 'Client/Config/Api.js'

/**
 * Controller for Auction and Bidding related API calls.
 */
const AuctionController = {
	/**
	 * Places a bid on a specific product.
	 *
	 * @param data - The bid details.
	 * @returns The API response.
	 */
	registerBid: (slug: string, data: RegisterBiddingRequestData) =>
		Api.post<ApiResponseData>(`/bid/${slug}/register`, data),

	/**
	 * Places a bid on a specific product.
	 *
	 * @param slug - The slug of the product to unregister bidding from
	 * @returns The API response.
	 */
	unregisterBid: (slug: string) =>
		Api.post<ApiResponseData>(`/bid/${slug}/unregister`),

	/**
	 * Gets the bid history for a specific product.
	 *
	 * @param slug - The slug of the product.
	 * @returns The bid history response data.
	 */
	getHistory: (slug: string) =>
		Api.get<BidHistoryResponseData>(`/bid/${slug}/history`),
}

export default AuctionController
