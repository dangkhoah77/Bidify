/**
 * Get Products Query Parameters
 *
 * @type ProductsQueryParams
 * @property {number} page - The page number for pagination
 * @property {number} limit - Number of items per page
 * @property {string} [keyword] - Search keyword for product name/description
 * @property {string} [categoryId] - Filter by category ID
 * @property {string} [sort] - Sort order (e.g., 'time_desc', 'price_asc', 'price_desc', 'bids_desc')
 */
export type ProductsQueryParams = {
	page: number
	limit: number
	keyword?: string
	categoryId?: string
	sortBy?: 'time_desc' | 'time_acs' | 'price_asc' | 'price_desc' | 'bids_desc'
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
 * @property {string} productName - Name of the product
 * @property {string} productDescription - Description of the product
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
	productName: string
	productDescription: string
	category: string
	startPrice: number
	priceStep: number
	buyNowPrice?: number
	endTime: string
	autoExtend: boolean
	images: File[]
	allowUnreviewedBidders: boolean
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
