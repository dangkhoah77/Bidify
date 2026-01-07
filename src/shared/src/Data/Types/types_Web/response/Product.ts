import type {
	Product,
	Category,
	Bid,
	ApiResponseData,
} from 'Shared/Data/Types/index.js'

/**
 * Data payload for Product Listing response
 *
 * @interface ProductListingResponseData
 * @property {boolean} success - Indicates if the authentication was successful
 * @property {string} message - A message providing additional information about the product list response
 * @property {{ products: Product[]; pagination: { page: number; limit: number; total: number; totalPages: number } }} [data] - Contains the list of products and pagination info
 */
export interface ProductListingResponseData extends ApiResponseData {
	data?: {
		products: Product[]
		pagination: {
			page: number
			limit: number
			total: number
			totalPages: number
		}
	}
}

/**
 * Data payload for Single Product response.
 *
 * @interface ProductDetailResponseData
 * @property {boolean} success - Indicates if the authentication was successful
 * @property {string} message - A message providing additional information about the product detail response
 * @property {{ product: Product; relatedProducts?: Product[] }} [data] - Contains the product detail and optional related products
 */
export interface ProductDetailResponseData extends ApiResponseData {
	data?: { product: Product; relatedProducts?: Product[] }
}
