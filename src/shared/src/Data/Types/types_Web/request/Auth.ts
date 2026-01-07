/**
 * Login Request Payload
 *
 * @type LoginRequestData
 * @property {string} email - The user's username
 * @property {string} password - The user's password
 */
export type LoginRequestData = {
	email: string
	password: string
}

/**
 * Register Request Payload
 *
 * @type RegisterRequestData
 * @property {string} firstName - The user's first name
 * @property {string} lastName - The user's last name
 * @property {string} email - The user's email address
 * @property {string} password - The user's password
 * @property {string} captchaToken - The ReCaptcha token for verification
 */
export type RegisterRequestData = {
	firstName: string
	lastName: string
	email: string
	password: string
	captchaToken: string
}

/**
 * Resend OTP Request Payload
 *
 * @type ResendOtpRequestData
 * @property {string} email - The email address to resend OTP to
 */
export type ResendOtpRequestData = {
	email: string
}

/**
 * OTP Verification Request Payload
 *
 * @type OtpVerificationRequestData
 * @property {string} email - The email address to verify
 * @property {string} otp - The One-Time Password sent to the user
 */
export type OtpVerificationRequestData = {
	email: string
	otp: string
}

/**
 * Forgot Password Request Payload
 *
 * @type ForgotPasswordRequest
 * @property {string} email - The user's email
 */
export type ForgotPasswordRequestData = {
	email: string
}

/**
 * Reset Password with Token Request Payload
 *
 * @type ResetPasswordWithTokenRequestData
 * @property {string} newPassword - The new password to set
 */
export type ResetPasswordWithTokenRequestData = {
	newPassword: string
}

/**
 * Reset Password Request Payload
 *
 * @type ResetPasswordRequestData
 * @property {string} currentPassword - The user's current password
 * @property {string} newPassword - The user's new password
 */
export type ResetPasswordRequestData = {
	currentPassword: string
	newPassword: string
}
