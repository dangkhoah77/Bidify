import { User } from './types_User.js'

/**
 * Type representing a product category.
 *
 * @type CategoryType
 * @property {string} name - The name of the category.
 * @property {CategoryType} [parent] - The parent category, if any.
 */
export type CategoryType = {
	name: string
	parent?: CategoryType | null
}

/**
 * Type representing a product in the auction system.
 *
 * @type ProductType
 * @property {string} name - The name of the product.
 * @property {string} slug - The URL-friendly identifier for the product.
 * @property {string} description - The description of the product.
 * @property {CategoryType} category - The category of the product.
 * @property {User} seller - The user who is selling the product.
 * @property {string[]} images - An array of image URLs for the product.
 * @property {number} startPrice - The starting price of the product.
 * @property {number} priceStep - The minimum increment for bids on the product.
 * @property {number} currentPrice - The current highest bid price for the product.
 * @property {number} [buyNowPrice] - The "buy now" price for the product.
 * @property {User} [highestBidder] - The user who has placed the highest bid, if any.
 * @property {Date} [startTime] - The start time of the auction for the product.
 * @property {Date} endTime - The end time of the auction for the product.
 * @property {boolean} autoExtend - Indicates if the auction end time should be auto-extended.
 * @property {boolean} isActive - Indicates whether the product is currently active in the auction.
 * @property {User} [winner] - The user who won the auction, if any.
 */
export type ProductType = {
	name: string
	// slug: string
    _id: string
	description: string
	category: CategoryType
	seller: User
	images: string[]
	startPrice: number
	priceStep: number
	currentPrice: number
	buyNowPrice?: number | null
	highestBidder?: User | null
	startTime?: Date | null
	endTime: Date
	autoExtend: boolean
	isActive: boolean
	winner?: User | null
}

/**
 * Type representing a bid placed on a product.
 *
 * @type BidType
 * @property {string} id - The unique identifier of the bid.
 * @property {ProductType} product - The product on which the bid is placed.
 * @property {User} bidder - The user who placed the bid.
 * @property {number} price - The amount of the bid.
 * @property {number} maxPrice - The maximum auto-bid amount set by the bidder, if any.
 * @property {Date} joinedAt - The date the user registered bidding for the product.
 * @property {Date} createdAt - The date and time when the bid was placed.
 * @property {boolean} latest - Indicates if this bid is the latest bid placed.
 */
export type BidType = {
	id: string
	product: ProductType
	bidder: User
	price: number
	maxPrice: number
	joinedAt: Date
	createdAt: Date
	latest: boolean
}
