import type {
	ProductType,
	CategoryType,
	BidType,
	ApiResponseData,
} from 'Shared/Data/Types/index.js'

/**
 * Data payload for Product List response
 *
 * @interface ProductListResponseData
 * @property {boolean} success - Indicates if the authentication was successful
 * @property {string} [error] - Optional error message if the authentication failed
 * @property {{ products: ProductType[]; total: number; page: number; totalPages: number }} [data] - Contains the list of products and pagination info
 */
export interface ProductListResponseData extends ApiResponseData {
	data?: {
		products: ProductType[]
		total: number
		page: number
		totalPages: number
	}
}

/**
 * Data payload for Single Product response.
 *
 * @interface ProductDetailResponseData
 * @property {boolean} success - Indicates if the authentication was successful
 * @property {string} [error] - Optional error message if the authentication failed
 * @property {{ product: ProductType }} [data] - Contains the product details
 */
export interface ProductDetailResponseData extends ApiResponseData {
	data?: { product: ProductType }
}

/**
 * Data payload for Category List response.
 *
 * @interface CategoryListResponseData
 * @property {boolean} success - Indicates if the authentication was successful
 * @property {string} [error] - Optional error message if the authentication failed
 * @property {{ categories: CategoryType[] }} [data] - Contains the list of categories
 */
export interface CategoryListResponseData extends ApiResponseData {
	data?: { categories: CategoryType[] }
}

/**
 * Data payload for Bid History response.
 *
 * @interface BidHistoryResponseData
 * @property {boolean} success - Indicates if the authentication was successful
 * @property {string} [error] - Optional error message if the authentication failed
 * @property {{ bids: BidType[] }} [data] - Contains the list of bids
 */
export interface BidHistoryResponseData extends ApiResponseData {
	data?: { bids: BidType[] }
}
