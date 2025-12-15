import { RATING } from 'Shared/Data/Constants/index.js'
import { User } from './types_User.js'
import { ProductType } from './types_Product.js'

/**
 * Review type representing a review given by a user to another user for a product.
 *
 * @type ReviewType
 * @property {ProductType} product - The product being reviewed.
 * @property {User} reviewer - The user who wrote the review.
 * @property {User} reviewedUser - The user who is being reviewed.
 * @property {RATING} rating - The rating given in the review.
 * @property {string} comment - The comment provided in the review.
 */
export type ReviewType = {
	product: ProductType
	reviewer: User
	reviewedUser: User
	rating: RATING
	comment: string
}
