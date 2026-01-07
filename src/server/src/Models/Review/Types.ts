import { Review } from 'Shared/Data/Types/index.js'
import { DocumentType, ModelType } from 'Server/Data/Types.js'

import { ServerUser, UserDocument } from 'Server/Models/User/index.js'
import { ServerProduct, ProductDocument } from 'Server/Models/Product/index.js'

/**
 * Review type representing a review given by a user to another user for a product.
 *
 * @type ServerReview
 * @property {string} id - The unique identifier of the review.
 * @property {ServerProduct} product - The product being reviewed.
 * @property {ServerUser} reviewer - The user who wrote the review.
 * @property {ServerUser} reviewedUser - The user who is being reviewed.
 * @property {string} text - The text provided in the review.
 * @property {RATING} rating - The rating given in the review.
 * @property {Date} createdAt - The date and time when the review was created.
 * @property {Date} updatedAt - The date and time when the review was last updated.
 */
export interface ServerReview
	extends Omit<Review, 'product' | 'reviewer' | 'reviewedUser'> {
	product: ServerProduct
	reviewer: ServerUser
	reviewedUser: ServerUser
}

/**
 * Interface representing a raw Review document type.
 *
 * @interface IReview
 * @property {string} id - The unique identifier of the review.
 * @property {ProductDocument | string} product - Reference to the Product being reviewed
 * @property {UserDocument | string} reviewer - Reference to the User who wrote the review
 * @property {UserDocument | string} reviewedUser - Reference to the User who is being reviewed
 * @property {string} text - The text provided in the review
 * @property {RATING} rating - The rating given in the review
 * @property {Date} createdAt - The date and time when the review was created.
 * @property {Date} updatedAt - The date and time when the review was last updated.
 */
export interface IReview
	extends Omit<ServerReview, 'product' | 'reviewer' | 'reviewedUser'> {
	product: ProductDocument | string
	reviewer: UserDocument | string
	reviewedUser: UserDocument | string
}

/**
 * Mongoose document interface for Review.
 *
 * @interface ReviewDocument
 * @property {ObjectId} _id - The MongoDB ObjectId.
 * @property {number} __v - The version key.
 * @property {string} id - The unique identifier of the review.
 * @property {ProductDocument | string} product - Reference to the Product being reviewed
 * @property {UserDocument | string} reviewer - Reference to the User who wrote the review
 * @property {UserDocument | string} reviewedUser - Reference to the User who is being reviewed
 * @property {string} text - The text provided in the review
 * @property {RATING} rating - The rating given in the review
 * @property {Date} createdAt - The date and time when the review was created.
 * @property {Date} updatedAt - The date and time when the review was last updated.
 */
export interface ReviewDocument extends DocumentType<IReview> {}

/**
 * Mongoose Model interface for Review.
 *
 * @interface ReviewModel
 * @property {(doc: ReviewDocument): Promise<ReviewDocument>} populateDocument - Static method to fully populate referenced fields in a ReviewDocument.
 * @property {(doc: ReviewDocument): Promise<ServerReview>} toObject - Static method to transform a ReviewDocument to a ServerReview object.
 * @property {(doc: ReviewDocument): Promise<Review>} toDto - Static method to transform a ReviewDocument to a Review DTO.
 */
export interface ReviewModel
	extends ModelType<Review, ServerReview, IReview, ReviewDocument> {}
