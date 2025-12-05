import { apiClient } from '../config/axios.config'
import { API_ENDPOINTS } from '../config/endpoints'
import type {
	ProductDTO,
	HomeProductsResponse,
	ProductsByCategoryNameResponse,
	ProductsListResponse,
} from '../types/product.types'

/**
 * Fetch products for home page (ending soon, most bids, highest price)
 */
export async function fetchHomeProducts(): Promise<HomeProductsResponse> {
	const response = await apiClient.get<HomeProductsResponse>(
		API_ENDPOINTS.PRODUCTS.HOME
	)
	return response.data
}

/**
 * Fetch products by category name (supports Vietnamese with accents)
 */
export async function fetchProductsByCategoryName(
	categoryName: string
): Promise<ProductsByCategoryNameResponse> {
	const response = await apiClient.get<ProductsByCategoryNameResponse>(
		API_ENDPOINTS.PRODUCTS.BY_CATEGORY_NAME(categoryName)
	)
	return response.data
}

export async function fetchEndingSoonProducts(
	page: number = 1,
	limit: number = 20
): Promise<ProductsListResponse> {
	const response = await apiClient.get<ProductsListResponse>(
		API_ENDPOINTS.PRODUCTS.ENDING_SOON,
		{ params: { page, limit } }
	)
	return response.data
}

export async function fetchMostBidsProducts(
	page: number = 1,
	limit: number = 20
): Promise<ProductsListResponse> {
	const response = await apiClient.get<ProductsListResponse>(
		API_ENDPOINTS.PRODUCTS.MOST_BIDS,
		{ params: { page, limit } }
	)
	return response.data
}

export async function fetchHighestPriceProducts(
	page: number = 1,
	limit: number = 20
): Promise<ProductsListResponse> {
	const response = await apiClient.get<ProductsListResponse>(
		API_ENDPOINTS.PRODUCTS.HIGHEST_PRICE,
		{ params: { page, limit } }
	)
	return response.data
}
