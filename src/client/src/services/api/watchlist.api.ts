import { apiClient } from '../config/axios.config'
import { API_ENDPOINTS } from '../config/endpoints'
import type { ProductDTO } from '../types/product.types'

export interface WatchlistResponse {
	watchlist: ProductDTO[]
	count: number
}

export interface WatchlistActionResponse {
	success: boolean
	message: string
	watchlistCount: number
}

export interface CheckWatchlistResponse {
	isInWatchlist: boolean
	productId: string
}

/**
 * Get current user's watchlist
 */
export async function fetchWatchlist(): Promise<WatchlistResponse> {
	const response = await apiClient.get<WatchlistResponse>(
		API_ENDPOINTS.WATCHLIST.GET_ALL
	)
	return response.data
}

/**
 * Add product to watchlist
 */
export async function addToWatchlist(
	productId: string
): Promise<WatchlistActionResponse> {
	const response = await apiClient.post<WatchlistActionResponse>(
		API_ENDPOINTS.WATCHLIST.ADD(productId)
	)
	return response.data
}

/**
 * Remove product from watchlist
 */
export async function removeFromWatchlist(
	productId: string
): Promise<WatchlistActionResponse> {
	const response = await apiClient.delete<WatchlistActionResponse>(
		API_ENDPOINTS.WATCHLIST.REMOVE(productId)
	)
	return response.data
}

/**
 * Check if product is in watchlist
 */
export async function checkInWatchlist(
	productId: string
): Promise<CheckWatchlistResponse> {
	const response = await apiClient.get<CheckWatchlistResponse>(
		API_ENDPOINTS.WATCHLIST.CHECK(productId)
	)
	return response.data
}
