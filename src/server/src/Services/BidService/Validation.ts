import { body } from 'express-validator'

/**
 * Template for validating product ID fields in requests.
 *
 * @param fieldName - The name of the product ID field to validate
 * @returns Validation chain for the specified product ID field
 */
export const ValidateProductId = (fieldName: string) => {
	return body(fieldName)
		.notEmpty()
		.withMessage('ID sản phẩm không được để trống.')
		.isMongoId()
		.withMessage('ID sản phẩm không hợp lệ.')
}

/**
 * Template for validating bidder ID fields in requests.
 *
 * @param fieldName - The name of the bidder ID field to validate
 * @returns Validation chain for the specified bidder ID field
 */
export const ValidateBidderId = (fieldName: string) => {
	return body(fieldName)
		.notEmpty()
		.withMessage('ID người đặt giá không được để trống.')
		.isMongoId()
		.withMessage('ID người đặt giá không hợp lệ.')
}

/**
 * Template for validating maximum price fields in requests.
 *
 * @param fieldName - The name of the maximum price field to validate
 * @returns Validation chain for the specified maximum price field
 */
export const ValidateMaxPrice = (fieldName: string) => {
	return body(fieldName)
		.notEmpty()
		.withMessage('Giá tối đa không được để trống.')
		.isNumeric()
		.withMessage('Giá tối đa phải là một số hợp lệ.')
}
