import { ClientSession } from 'mongoose'

import Comment, { IComment } from 'Server/Models/Comment/index.js'

/**
 * Creates a new comment or question.
 *
 * @param data - Partial comment data
 * @returns The created CommentDocument
 */
export const CreateComment = (
	data: Partial<IComment>,
	session: ClientSession | null = null
) => {
	return Comment.create([data], { session }).then((comments) => comments[0])
}

/**
 * Finds a comment by its ID.
 *
 * @param commentId - The unique identifier of the comment.
 */
export const FindCommentById = (commentId: string) => {
	return Comment.where('_id', commentId).findOne()
}

/**
 * Finds all comments for a specific product.
 *
 * @param productId - The unique identifier of the product.
 * @returns An array of CommentDocuments populated with commenter and answers.
 */
export const FindCommentsByProduct = (productId: string) => {
	return Comment.where('product', productId).sort({ createdAt: -1 })
}
