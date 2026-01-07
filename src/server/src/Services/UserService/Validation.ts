import { check, param } from 'express-validator'

/**
 * Template for validating product ID fields in requests.
 *
 * @param fieldName - The name of the product id field to validate
 * @returns Validation chain for the specified product id field
 */
export const ValidateProductId = (fieldName: string) => {
	return check(fieldName)
		.isString()
		.withMessage('ID sản phẩm phải là một chuỗi ký tự.')
		.notEmpty()
		.withMessage('ID sản phẩm không được để trống.')
		.isMongoId()
		.withMessage('ID sản phẩm không hợp lệ.')
}

/**
 * Template for validating user ID fields in requests.
 *
 * @param fieldName - The name of the user id field to validate
 * @returns Validation chain for the specified user id field
 */
export const ValidateUserId = (fieldName: string) => {
	return check(fieldName)
		.isString()
		.withMessage('ID người dùng phải là một chuỗi ký tự.')
		.notEmpty()
		.withMessage('ID người dùng không được để trống.')
		.isMongoId()
		.withMessage('ID người dùng không hợp lệ.')
}

/**
 * Validation chain for user listing query parameters.
 *
 * @returns Array of validation chains for user listing parameters
 */
export const ValidateUserListingParams = () => {
	return [
		param('page')
			.optional()
			.isInt({ min: 1 })
			.withMessage('Trang phải là một số nguyên dương.'),
		param('limit')
			.optional()
			.isInt({ min: 1, max: 100 })
			.withMessage('Giới hạn phải là một số nguyên từ 1 đến 100.'),
	]
}
