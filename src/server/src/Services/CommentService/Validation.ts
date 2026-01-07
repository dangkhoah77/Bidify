import { body, param } from 'express-validator'

/**
 * Validation middleware for creating a new comment.
 *
 * @return An array of validation chains
 */
export const ValidateCreateComment = () => {
	return [
		body('text')
			.notEmpty()
			.withMessage('Nội dung bình luận không được để trống'),
		param('productId')
			.notEmpty()
			.withMessage('ID của sản phẩm không được để trống')
			.isMongoId()
			.withMessage('ID của sản phẩm không hợp lệ'),
	]
}

/**
 * Validation middleware for replying to a comment.
 *
 * @return An array of validation chains
 */
export const ValidateReplyComment = () => {
	return [
		body('text')
			.notEmpty()
			.withMessage('Nội dung câu trả lời không được để trống'),
		param('commentId')
			.notEmpty()
			.withMessage('ID của bình luận cha không được để trống')
			.isMongoId()
			.withMessage('ID của bình luận cha không hợp lệ'),
	]
}
