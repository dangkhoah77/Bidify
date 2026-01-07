import {
	ApiResponseData,
	CommentListingResponseData,
} from 'Shared/Data/Types/index.js'

import { UserDocument } from 'Server/Models/User/index.js'
import Product from 'Server/Models/Product/index.js'
import Comment from 'Server/Models/Comment/index.js'

import {
	CreateComment,
	FindCommentById,
	FindCommentsByProduct,
} from './Query.js'
import { FindVerifiedUserById } from 'Server/Services/AuthService/Query.js'
import { FindProductById } from 'Server/Services/ProductService/Query.js'

import SendMail from 'Server/Modules/Mail/index.js'
import Keys from 'Server/Config/Keys.js'

/**
 * Post a question/comment on a product.
 *
 * @param user - The user posting the comment
 * @param productId - The ID of the product
 * @param text - The comment text
 * @returns Status and result data of the operation
 */
export const PostComment = async (
	user: UserDocument,
	productId: string,
	text: string
): Promise<{ status: number; data: ApiResponseData }> => {
	const product = await FindProductById(productId)
	if (!product) {
		return {
			status: 404,
			data: { success: false, message: 'Sản phẩm không tồn tại.' },
		}
	}

	// Create the comment
	await CreateComment({
		product: productId,
		commenter: user.id,
		text: text,
		answers: [],
	})

	// Notify Seller via Email
	const seller = await FindVerifiedUserById(product.seller as string)
	if (seller) {
		SendMail(seller.email, 'NewQuestion', {
			productName: product.name,
			customerName: user.lastName,
			question: text,
			productLink: `${Keys.app.clientURL}/product/${product.id}`,
		})
	}

	return {
		status: 201,
		data: {
			success: true,
			message: 'Gửi câu hỏi thành công.',
		},
	}
}

/**
 * Reply to a comment.
 *
 * @param user - The user replying to the comment
 * @param commentId - The ID of the comment to reply to
 * @param text - The reply text
 * @returns Status and result data of the operation
 */
export const ReplyComment = async (
	user: UserDocument,
	commentId: string,
	text: string
): Promise<{ status: number; data: ApiResponseData }> => {
	const parentComment = await FindCommentById(commentId)
	if (!parentComment) {
		return {
			status: 404,
			data: { success: false, message: 'Câu hỏi không tồn tại.' },
		}
	}

	const product = await FindProductById(parentComment.product as string)
	if (!product) {
		return {
			status: 404,
			data: { success: false, message: 'Sản phẩm không tồn tại.' },
		}
	}

	// Create answer comment
	const answer = await CreateComment({
		product: product.id,
		commenter: user.id,
		text: text,
		answers: [],
	})

	// Link answer to parent
	parentComment.answers.push(answer.id)
	await parentComment.save()

	return {
		status: 201,
		data: {
			success: true,
			message: 'Trả lời thành công.',
		},
	}
}

/**
 * Get comments for a product.
 *
 * @param productId - The ID of the product
 * @returns Status and result data of the operation
 */
export const GetProductComments = async (
	productId: string
): Promise<{ status: number; data: CommentListingResponseData }> => {
	// Fetch all comments
	const comments = await FindCommentsByProduct(productId)

	// Get all answer IDs and filter out comments that are already inside another comment's "answers" array.
	const answerIds = new Set<string>()
	comments.forEach((c) => {
		if (c.answers && c.answers.length > 0) {
			c.answers.forEach((a: any) => answerIds.add(a.id))
		}
	})

	// Filter roots
	const rootComments = comments.filter((c) => !answerIds.has(c.id))
	const commentDtos = await Promise.all(
		rootComments.map((c) => Comment.toDto(c))
	)

	return {
		status: 200,
		data: {
			success: true,
			message: 'Lấy danh sách câu hỏi thành công.',
			data: { comments: commentDtos },
		},
	}
}
