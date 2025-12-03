import { apiClient } from '../config/axios.config'
import { API_ENDPOINTS } from '../config/endpoints'
import type {
	ProductDTO,
	HomeProductsResponse,
	ProductsByCategoryNameResponse,
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

// ✅ Có thể thêm các API khác sau:
// export async function fetchProductDetail(id: string): Promise<ProductDTO> {
//   const response = await apiClient.get<ProductDTO>(
//     API_ENDPOINTS.PRODUCTS.DETAIL(id)
//   )
//   return response.data
// }
