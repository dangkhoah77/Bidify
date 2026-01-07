import { param, body } from 'express-validator'

import { RATING } from 'Shared/Data/Constants/index.js'

/**
 * Validates the input data for creating a review.
 *
 * @returns An array of validation chain objects.
 */
export const ValidateCreateReview = () => {
	return [
		param('productId')
			.notEmpty()
			.withMessage('Product ID is required')
			.isMongoId()
			.withMessage('Invalid Product ID format'),
		body('text')
			.notEmpty()
			.withMessage('Nội dung đánh giá không được để trống'),
		body('rating')
			.isIn(Object.values(RATING))
			.withMessage('Điểm đánh giá không hợp lệ'),
	]
}
