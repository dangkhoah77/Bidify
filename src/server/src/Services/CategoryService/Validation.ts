import { param, body } from 'express-validator'

/**
 * Template for validating new category fields in requests.
 *
 * @param fieldName - The name of the new category field to validate
 * @returns Validation chain for the specified new category field
 */
export const ValidateCategoryName = (fieldName: string) => {
	return body(fieldName)
		.isString()
		.withMessage('Tên danh mục phải là một chuỗi ký tự.')
		.notEmpty()
		.withMessage('Tên danh mục không được để trống.')
}

/**
 * Template for validating parent category fields in requests.
 *
 * @param fieldName - The name of the parent category field to validate
 * @returns Validation chain for the specified parent category field
 */
export const ValidateParentCategory = (fieldName: string) => {
	return body(fieldName)
		.optional({ nullable: true })
		.isString()
		.withMessage('ID danh mục cha phải là một chuỗi ký tự.')
		.notEmpty()
		.withMessage('ID danh mục cha không được để trống.')
		.isMongoId()
		.withMessage('ID danh mục cha không hợp lệ.')
}

/**
 * Template for validating category ID parameters in requests.
 *
 * @param fieldName - The name of the category ID parameter to validate
 * @returns Validation chain for the specified category ID parameter
 */
export const ValidateCategoryId = (fieldName: string) => {
	return param(fieldName)
		.isString()
		.withMessage('ID danh mục phải là một chuỗi ký tự.')
		.notEmpty()
		.withMessage('ID danh mục không được để trống.')
		.isMongoId()
		.withMessage('ID danh mục không hợp lệ.')
}
