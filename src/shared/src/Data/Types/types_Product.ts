import { User } from './types_User.js'
import { BID_STATE, TRANSACTION_STEP } from 'Shared/Data/Constants/index.js'

/**
 * Type representing an image associated with a product.
 *
 * @type Image
 * @property {string} url - The URL of the image.
 * @property {string} key - The storage key of the image.
 */
export type Image = {
	url: string
	key: string
}

/**
 * Type representing a product category.
 *
 * @type Category
 * @property {string} id - The unique identifier of the category.
 * @property {string} name - The name of the category.
 * @property {Category} [parent] - The parent category, if any.
 */
export type Category = {
	id: string
	name: string
	parent?: Category
}

/**
 * Type representing a comment made on a product.
 *
 * @type Comment
 * @property {string} id - The unique identifier of the comment.
 * @property {Product} product - The product on which the comment is made.
 * @property {User} commenter - The user who made the comment.
 * @property {string} text - The text content of the comment.
 * @property {Comment[]} answers - An array of answers (replies) to the comment.
 * @property {Date} createdAt - The date and time when the comment was created.
 * @property {Date} updatedAt - The date and time when the comment was last updated.
 */
export type Comment = {
	id: string
	product: Product
	commenter: User
	text: string
	answers: Comment[]
	createdAt: Date
	updatedAt: Date
}

/**
 * Type representing a product in the auction system.
 *
 * @type Product
 * @property {string} id - The unique identifier of the product.
 * @property {string} name - The name of the product.
 * @property {string} description - The description of the product.
 * @property {Category} category - The category of the product.
 * @property {User} seller - The user who is selling the product.
 * @property {Image[]} images - An array of images for the product.
 * @property {number} startPrice - The starting price of the product.
 * @property {number} priceStep - The minimum increment for bids on the product.
 * @property {number} currentPrice - The current highest bid price for the product.
 * @property {number} buyNowPrice - The "buy now" price for the product.
 * @property {User} [highestBidder] - The user who has placed the highest bid, if any.
 * @property {Date} [startTime] - The start time of the auction for the product.
 * @property {Date} endTime - The end time of the auction for the product.
 * @property {boolean} autoExtend - Indicates if the auction end time should be auto-extended.
 * @property {boolean} allowUnreviewedBidders - Indicates whether users without review history are allowed to bid.
 * @property {boolean} active - Indicates whether the product is currently active in the auction.
 * @property {User} [winner] - The user who won the auction, if any.
 * @property {TRANSACTION_STEP} [transactionStatus] - The current transaction status of the product, if applicable.
 */
export type Product = {
	id: string
	name: string
	description: string
	category: Category
	seller: User
	images: Image[]
	startPrice: number
	priceStep: number
	currentPrice: number
	buyNowPrice: number
	highestBidder?: User
	endTime: Date
	autoExtend: boolean
	allowUnreviewedBidders: boolean
	active: boolean
	winner?: User
	transactionStatus?: TRANSACTION_STEP
}

/**
 * Type representing a bid placed on a product.
 *
 * @type Bid
 * @property {string} id - The unique identifier of the bid.
 * @property {Product} product - The product on which the bid is placed.
 * @property {User} bidder - The user who placed the bid.
 * @property {number} price - The amount of the bid.
 * @property {number} maxPrice - The maximum auto-bid amount set by the bidder, if any.
 * @property {boolean} latest - Indicates if the bid is the latest bid by the user on the product.
 * @property {BID_STATE} state - The current state of the bid.
 * @property {Date} createdAt - The date and time when the bid was placed.
 */
export type Bid = {
	id: string
	product: Product
	bidder: User
	price: number
	maxPrice: number
	latest: boolean
	state: BID_STATE
	createdAt: Date
}
