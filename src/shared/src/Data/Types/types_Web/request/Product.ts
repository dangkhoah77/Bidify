/**
 * Get Products Query Parameters
 *
 * @type ProductsQueryParams
 * @property {number} [page] - The page number for pagination
 * @property {number} [limit] - Number of items per page
 * @property {string} [category] - Filter by category name or ID
 * @property {string} [search] - Search keyword for product title/description
 * @property {string} [sort] - Sort order (e.g., 'price_asc', 'time_desc')
 */
export type ProductsQueryParams = {
	page?: number
	limit?: number
	category?: string
	search?: string
	sort?: string
}

/**
 * Get Products Request Payload
 *
 * @type GetProductsRequestData
 * @property {ProductsQueryParams} params - The query parameters for fetching products
 */
export type GetProductsRequestData = {
	params: ProductsQueryParams
}

/**
 * Register Bidding Request Payload
 *
 * @type RegisterBiddingRequestData
 * @property {number} bidPrice - The initial bid amount
 * @property {number} maxBidPrice - The maximum bid amount for auto-bidding
 */
export type RegisterBiddingRequestData = {
	bidPrice: number
	maxBidPrice: number
}

/**
 * Create Product Form Data Type
 * This represents the raw data structure before appending to FormData.
 *
 * @type CreateProductRequestData
 * @property {string} name - Product title
 * @property {string} category - Category ID
 * @property {number} startPrice - Starting auction price
 * @property {number} priceStep - Minimum bid increment
 * @property {number} [buyNowPrice] - Immediate purchase price (optional)
 * @property {string} description - Product description (HTML/Text)
 * @property {string} endTime - Auction end datetime string
 * @property {boolean} autoExtend - Whether to enable auto-extension
 * @property {File[]} images - Array of selected image files
 */
export type CreateProductRequestData = {
	name: string
	category: string
	startPrice: number
	priceStep: number
	buyNowPrice?: number
	description: string
	endTime: string
	autoExtend: boolean
	images: File[]
}

/**
 * Append Product Description Request Payload
 *
 * @type AppendDescriptionRequestData
 * @property {string} description - The additional description content to append
 */
export type AppendDescriptionRequestData = {
	description: string
}
