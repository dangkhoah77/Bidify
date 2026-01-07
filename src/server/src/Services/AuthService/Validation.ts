import { body, param } from 'express-validator'
import bcrypt from 'bcryptjs'

/**
 * Template for validating email fields in requests.
 *
 * @param fieldName - The name of the email field to validate
 * @returns Validation chain for the specified email field
 */
export const ValidateEmail = (fieldName: string) => {
	return body(fieldName)
		.isString()
		.withMessage('Địa chỉ email phải là một chuỗi ký tự.')
		.notEmpty()
		.withMessage('Địa chỉ email không được để trống.')
		.isEmail()
		.withMessage('Địa chỉ email không hợp lệ.')
}

/**
 * Template for validating password fields in requests.
 *
 * @param fieldName - The name of the password field to validate
 * @returns Validation chain for the specified password field
 */
export const ValidatePassword = (fieldName: string) => {
	return body(fieldName)
		.isString()
		.withMessage('Mật khẩu phải là một chuỗi ký tự.')
		.notEmpty()
		.withMessage('Mật khẩu không được để trống.')
		.isLength({ min: 6 })
		.withMessage('Mật khẩu phải có ít nhất 6 ký tự.')
		.matches(/[A-Z]/)
		.withMessage('Mật khẩu phải chứa ít nhất một chữ cái viết hoa.')
		.matches(/[a-z]/)
		.withMessage('Mật khẩu phải chứa ít nhất một chữ cái viết thường.')
		.matches(/[0-9]/)
		.withMessage('Mật khẩu phải chứa ít nhất một chữ số.')
		.matches(/[@$!%*?&]/)
		.withMessage(
			'Mật khẩu phải chứa ít nhất một ký tự đặc biệt (@, $, !, %, *, ?, &).'
		)
}

/**
 * Template for validating current password fields in requests.
 *
 * @param fieldName - The name of the current password field to validate
 * @returns Validation chain for the specified current password field
 */
export const ValidateCurrentPassword = (fieldName: string) => {
	return body(fieldName)
		.isString()
		.withMessage('Mật khẩu hiện tại phải là một chuỗi ký tự.')
		.notEmpty()
		.withMessage('Bạn phải nhập mật khẩu hiện tại.')
}

/**
 * Template for validating new password fields in requests.
 *
 * @param fieldName - The name of the new password field to validate
 * @returns Validation chain for the specified new password field
 */
export const ValidateNewPassword = (fieldName: string) => {
	return ValidatePassword(fieldName)
		.custom((value: string, { req }) => value != req.body.currentPassword)
		.withMessage('Mật khẩu mới phải khác mật khẩu hiện tại.')
}

/**
 * Template for validating first name fields in requests.
 *
 * @param fieldName - The name of the first name field to validate
 * @returns Validation chain for the specified first name field
 */
export const ValidateFirstName = (fieldName: string) => {
	return body(fieldName)
		.isString()
		.withMessage('Họ phải là một chuỗi ký tự.')
		.notEmpty()
		.withMessage('Họ không được để trống.')
}

/**
 * Template for validating last name fields in requests.
 *
 * @param fieldName - The name of the last name field to validate
 * @returns Validation chain for the specified last name field
 */
export const ValidateLastName = (fieldName: string) => {
	return body(fieldName)
		.isString()
		.withMessage('Tên phải là một chuỗi ký tự.')
		.notEmpty()
		.withMessage('Tên không được để trống.')
}

/**
 * Template for validating captcha token fields in requests.
 *
 * @param fieldName - The name of the captcha token field to validate
 * @returns Validation chain for the captcha token parameter
 */
export const ValidateCaptchaToken = (fieldName: string) => {
	return body(fieldName)
		.isString()
		.withMessage('Mã token captcha phải là một chuỗi ký tự.')
		.notEmpty()
		.withMessage('Mã token captcha không được để trống.')
}

/**
 * Template for validating OTP token fields in requests.
 *
 * @returns Validation chain for the OTP token parameter
 */
export const ValidateOptToken = (fieldName: string) => {
	return body(fieldName)
		.isString()
		.withMessage('Mã OTP phải là một chuỗi ký tự.')
		.isLength({ min: 6, max: 6 })
		.withMessage('Mã OTP phải gồm 6 ký tự.')
}

/**
 * Template for validating reset token parameters in requests.
 *
 * @returns Validation chain for the reset token parameter
 */
export const ValidateResetToken = (fieldName: string) => {
	return param(fieldName)
		.isString()
		.withMessage('Token đặt lại mật khẩu phải là một chuỗi ký tự.')
		.isLength({ min: 20 })
		.withMessage('Token đặt lại mật khẩu không hợp lệ.')
}
