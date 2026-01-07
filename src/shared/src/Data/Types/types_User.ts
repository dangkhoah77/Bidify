import { Product } from './types_Product.js'
import {
	ROLE,
	RATING,
	UPGRADE_REQUEST_STATUS,
} from 'Shared/Data/Constants/index.js'

/**
 * Name Type Definition
 *
 * @type Name
 * @property {string} firstName - The first name of the user
 * @property {string} lastName - The last name of the user
 */
export type Name = {
	firstName: string
	lastName: string
}

/**
 * Mail Type Definition
 *
 * @type Mail
 * @property {string} [from] - The sender's email address
 * @property {string} [to] - The recipient's email address
 * @property {string} subject - The subject of the email
 * @property {string} text - The body text of the email
 * @property {string} html - The HTML content of the email
 */
export type Mail = {
	from?: string
	to?: string
	subject: string
	text: string
	html: string
}

/**
 * Review type representing a review given by a user to another user for a product.
 *
 * @type Review
 * @property {string} id - The unique identifier of the review.
 * @property {ProductType} product - The product being reviewed.
 * @property {User} reviewer - The user who wrote the review.
 * @property {User} reviewedUser - The user who is being reviewed.
 * @property {string} text - The text provided in the review.
 * @property {RATING} rating - The rating given in the review.
 * @property {Date} createdAt - The date and time when the review was created.
 * @property {Date} updatedAt - The date and time when the review was last updated.
 */
export type Review = {
	id: string
	product: Product
	reviewer: User
	reviewedUser: User
	text: string
	rating: RATING
	createdAt: Date
	updatedAt: Date
}

/**
 * User Type representing a user in the system.
 *
 * @type User
 * @property {string} id - The unique identifier of the user.
 * @property {string} firstName - The user's first name.
 * @property {string} lastName - The user's last name.
 * @property {ROLE} role - The user's role in the system.
 * @property {Review[]} reviewsReceived - List of reviews the user has received.
 */
export type User = {
	id: string
	firstName: string
	lastName: string
	role: ROLE
	reviewsReceived: Review[]
}

/**
 * User profile type representing detailed information about a user.
 * Received upon profile retrieval or authentication.
 *
 * @type UserProfile
 * @property {string} id - The unique identifier of the user.
 * @property {string} firstName - The user's first name.
 * @property {string} lastName - The user's last name.
 * @property {string} email - The user's email address.
 * @property {ROLE} role - The user's role in the system.
 * @property {number} balance - The user's account balance.
 * @property {ProductType[]} watchlist - List of product IDs in the user's watchlist.
 * @property {ReviewType[]} reviewsWritten - List of reviews the user has written.
 * @property {ReviewType[]} reviewsReceived - List of reviews the user has received.
 * @property {UPGRADE_REQUEST_STATUS} upgradeRequestStatus - Status of the user's upgrade request to Seller.
 * @property {Date} [sellerRoleExpires] - Expiration date of the seller status, if applicable.
 */
export type UserProfile = User & {
	email: string
	balance: number
	watchlist: Product[]
	reviewsWritten: Review[]
	upgradeRequestStatus: UPGRADE_REQUEST_STATUS
	sellerRoleExpires?: Date
}
