/**
 * Login Request Payload
 *
 * @type LoginRequestData
 * @property {string} credential - The user's username or email
 * @property {string} password - The user's password
 */
export type LoginRequestData = {
	credential: string
	password: string
}

/**
 * Signup Request Payload
 *
 * @type SignupRequestData
 * @property {string} firstName - The user's first name
 * @property {string} lastName - The user's last name
 * @property {string} [email] - The user's email address
 * @property {string} [phoneNumber] - The user's phone number
 * @property {string} password - The user's password
 */
export type SignupRequestData = {
	firstName: string
	lastName: string
	email?: string
	phoneNumber?: string
	password: string
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
 * Reset Password Request Payload
 *
 * @type ResetPasswordRequestData
 * @property {string} token - The password reset token
 * @property {string} newPassword - The new password
 */
export type ResetPasswordRequestData = {
	token: string
	newPassword: string
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
