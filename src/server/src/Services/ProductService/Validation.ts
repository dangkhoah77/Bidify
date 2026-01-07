import { check, body, query } from 'express-validator'

/**
 * Template for validating product ID fields in requests.
 *
 * @param fieldName - The name of the product ID field to validate
 * @returns Validation chain for product ID
 */
export const ValidateProductId = (fieldName: string) => {
	return check(fieldName)
		.notEmpty()
		.withMessage('Id sản phẩm không được để trống.')
		.isMongoId()
		.withMessage('Id sản phẩm không hợp lệ.')
}

/**
 * Template for validating product name fields in requests.
 *
 * @param fieldName - The name of the product name field to validate
 * @returns Validation chain for the specified product name field
 */
export const ValidateProductName = (fieldName: string) => {
	return body(fieldName)
		.isString()
		.withMessage('Tên sản phẩm phải là chuỗi ký tự.')
		.trim()
		.isLength({ min: 5, max: 200 })
		.withMessage('Tên sản phẩm phải từ 5 đến 200 ký tự.')
}

/**
 * Template for validating product description fields in requests.
 *
 * @param fieldName - The name of the product description field to validate
 * @returns Validation chain for the specified product description field
 */
export const ValidateProductDescription = (fieldName: string) => {
	return body(fieldName)
		.isString()
		.withMessage('Mô tả sản phẩm phải là chuỗi ký tự.')
		.trim()
		.notEmpty()
		.withMessage('Mô tả sản phẩm không được để trống.')
}

/**
 * Template for validating category ID fields in requests.
 *
 * @param fieldName - The name of the category ID field to validate
 * @returns Validation chain for the specified category ID field
 */
export const ValidateCategoryId = (fieldName: string) => {
	return body(fieldName)
		.isMongoId()
		.withMessage('ID danh mục không hợp lệ.')
		.notEmpty()
		.withMessage('Danh mục không được để trống.')
}

/**
 * Template for validating price fields in requests.
 *
 * @param fieldName - The name of the price field to validate
 * @param messagePrefix - The prefix for error messages
 * @returns Validation chain for the specified price field
 */
export const ValidatePrice = (fieldName: string, messagePrefix: string) => {
	return body(fieldName)
		.isFloat({ min: 0 })
		.withMessage(`${messagePrefix} phải là số dương.`)
		.notEmpty()
		.withMessage(`${messagePrefix} không được để trống.`)
}

/**
 * Template for validating "buy now" price fields in requests.
 *
 * @param fieldName - The name of the "buy now" price field to validate
 * @param startPriceField - The name of the starting price field to compare against
 * @returns Validation chain for the specified "buy now" price field
 */
export const ValidateBuyNowPrice = (
	fieldName: string,
	startPriceField: string
) => {
	return body(fieldName)
		.optional({ nullable: true, checkFalsy: true })
		.isFloat({ min: 0 })
		.withMessage('Giá mua ngay phải là số dương.')
		.custom((value, { req }) => {
			if (
				value &&
				parseFloat(value) <= parseFloat(req.body[startPriceField])
			) {
				throw new Error('Giá mua ngay phải lớn hơn giá khởi điểm.')
			}
			return true
		})
}

/**
 * Template for validating end time fields in requests.
 *
 * @param fieldName - The name of the end time field to validate
 * @returns Validation chain for the specified end time field
 */
export const ValidateEndTime = (fieldName: string) => {
	return body(fieldName)
		.isISO8601()
		.withMessage('Thời gian kết thúc không đúng định dạng.')
		.custom((value) => {
			if (new Date(value) <= new Date()) {
				throw new Error('Thời gian kết thúc phải ở trong tương lai.')
			}
			return true
		})
}

/**
 * Template for validating images fields in requests.
 *
 * @param fieldName - The name of the images field to validate
 * @returns Validation chain for the specified images field
 */
export const ValidateImages = (fieldName: string) => {
	return body(fieldName).custom((_, { req }) => {
		const files: Express.Multer.File[] =
			(Array.isArray((req as any).files) && (req as any).files) ||
			((req as any).files?.[fieldName] as Express.Multer.File[]) ||
			[]

		if (files.length < 3) throw new Error('Sản phẩm phải có ít nhất 3 ảnh.')
		const allowed = ['image/jpeg', 'image/png']
		for (const f of files) {
			if (!allowed.includes(f.mimetype)) {
				throw new Error('Ảnh sản phẩm phải là JPEG/PNG.')
			}
		}
		return true
	})
}

/**
 * Template for validating auto extend fields in requests.
 *
 * @param fieldName - The name of the auto extend field to validate
 * @returns Validation chain for the specified auto extend field
 */
export const ValidateAutoExtend = (fieldName: string) => {
	return body(fieldName)
		.optional()
		.isBoolean()
		.withMessage('Tự động gia hạn phải là giá trị boolean.')
}

/**
 * Template for validating allow unreviewed bidders fields in requests.
 *
 * @param fieldName - The name of the allow unreviewed bidders field to validate
 * @returns Validation chain for the specified allow unreviewed bidders field
 */
export const ValidateAllowUnreviewedBidders = (fieldName: string) => {
	return body(fieldName)
		.optional()
		.isBoolean()
		.withMessage(
			'Cho phép người đấu giá chưa được duyệt phải là giá trị boolean.'
		)
}

/**
 * Template for validating product creation requests.
 *
 * @returns Array of validation chains for product creation/update
 */
export const ValidateProduct = () => {
	return [
		ValidateProductName('productName'),
		ValidateProductDescription('productDescription'),
		ValidateCategoryId('category'),
		ValidatePrice('startPrice', 'Giá khởi điểm'),
		ValidateBuyNowPrice('buyNowPrice', 'startPrice'),
		ValidateEndTime('endTime'),
		ValidateImages('images'),
		ValidateAutoExtend('autoExtend'),
		ValidateAllowUnreviewedBidders('allowUnreviewedBidders'),
	]
}

/**
 * Template for validating product query parameters in requests.
 *
 * @returns Array of validation chains for product query parameters
 */
export const ValidateProductQuery = () => {
	return [
		query('page')
			.optional()
			.isInt({ min: 1 })
			.withMessage('Trang phải là số nguyên dương.'),
		query('limit')
			.optional()
			.isInt({ min: 1, max: 50 })
			.withMessage('Giới hạn phải từ 1 đến 50.'),
		query('keyword')
			.optional()
			.isString()
			.withMessage('Từ khóa tìm kiếm phải là chuỗi ký tự.')
			.trim()
			.isLength({ max: 100 })
			.withMessage('Từ khóa tìm kiếm không được vượt quá 100 ký tự.'),
		query('sortBy')
			.optional()
			.isIn([
				'time_desc',
				'time_acs',
				'price_asc',
				'price_desc',
				'bids_desc',
			])
			.withMessage('Tiêu chí sắp xếp không hợp lệ.'),
		query('categoryId')
			.optional()
			.isMongoId()
			.withMessage('ID danh mục không hợp lệ.'),
	]
}
