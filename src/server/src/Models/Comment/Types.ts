import { Comment } from 'Shared/Data/Types/index.js'
import { DocumentType, ModelType } from 'Server/Data/Types.js'

import { ServerUser, UserDocument } from 'Server/Models/User/index.js'
import { ServerProduct, ProductDocument } from 'Server/Models/Product/index.js'

/**
 * Type representing a comment made on a product.
 *
 * @type ServerComment
 * @property {string} id - The unique identifier of the comment.
 * @property {ServerProduct} product - The product on which the comment is made.
 * @property {ServerUser} commenter - The user who made the comment.
 * @property {string} text - The text content of the comment.
 * @property {ServerComment[]} answers - An array of answers (replies) to the comment.
 * @property {Date} createdAt - The date and time when the comment was created.
 * @property {Date} updatedAt - The date and time when the comment was last updated.
 */
export type ServerComment = Omit<
	Comment,
	'product' | 'commenter' | 'answers'
> & {
	product: ServerProduct
	commenter: ServerUser
	answers: ServerComment[]
}

/**
 * Interface representing a raw Comment document type.
 *
 * @interface IComment
 * @property {string} id - The unique identifier of the comment.
 * @property {ProductDocument | string} product - The product on which the comment is made.
 * @property {UserDocument | string} commenter - The user who made the comment.
 * @property {string} text - The text content of the comment.
 * @property {(ServerComment | string)[]} answers - An array of answers (replies) to the comment.
 * @property {Date} createdAt - The date and time when the comment was created.
 * @property {Date} updatedAt - The date and time when the comment was last updated.
 */
export interface IComment
	extends Omit<ServerComment, 'product' | 'commenter' | 'answers'> {
	product: ProductDocument | string
	commenter: UserDocument | string
	answers: (ServerComment | string)[]
}

/**
 * Mongoose document interface for Comment.
 *
 * @interface CommentDocument
 * @property {ObjectId} _id - The MongoDB ObjectId.
 * @property {number} __v - The version key.
 * @property {ProductDocument | string} product - The product on which the comment is made.
 * @property {UserDocument | string} commenter - The user who made the comment.
 * @property {string} text - The text content of the comment.
 * @property {(ServerComment | string)[]} answers - An array of answers (replies) to the comment.
 * @property {Date} createdAt - The date and time when the comment was created.
 * @property {Date} updatedAt - The date and time when the comment was last updated.
 */
export interface CommentDocument extends DocumentType<IComment> {}

/**
 * Mongoose Model interface for Comment.
 *
 * @interface CommentModel
 * @property {function} populateDocument - Populates the referenced fields in a Comment document.
 * @property {function} toObject - Converts a Comment document to its ServerComment representation.
 * @property {function} toDto - Converts a Comment document to its Comment DTO representation.
 */
export interface CommentModel
	extends ModelType<Comment, ServerComment, IComment, CommentDocument> {}
