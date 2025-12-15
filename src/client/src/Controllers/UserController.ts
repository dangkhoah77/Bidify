import {
	WatchlistResponseData,
	BiddingHistoryResponseData,
	PersonalReviewsResponseData,
	ApiResponseData,
} from 'Shared/Data/Types/index.js'
import Api from 'Client/Config/Api.js'

/**
 * Controller for User specific data fetching.
 */
const UserController = {
	/**
	 * Fetches the current user's watchlist.
	 *
	 * @returns API response containing the watchlist products.
	 */
	getWatchlist: () => Api.get<WatchlistResponseData>('/users/watchlist'),

	/**
	 * Fetches the current user's bidding history.
	 *
	 * @returns API response containing the user's bids.
	 */
	getBiddingHistory: () =>
		Api.get<BiddingHistoryResponseData>('/users/biddings'),

	/**
	 * Fetches the current user's personal reviews.
	 *
	 * @returns API response containing the user's reviews.
	 */
	getPersonalReviews: () =>
		Api.get<PersonalReviewsResponseData>('/users/reviews'),

	/**
	 * Updates user profile settings.
	 *
	 * @param data - The profile data to update
	 */
	updateProfile: (data: any) =>
		Api.put<ApiResponseData>('/users/profile', data),
}

export default UserController
