import type {
	LoginRequestData,
	SignupRequestData,
	ForgotPasswordRequestData,
	ResetPasswordRequestData,
	OtpVerificationRequestData,
} from 'Shared/Data/Types/index.js'
import { AuthResponseData, ApiResponseData } from 'Shared/Data/Types/index.js'
import Api from 'Client/Config/Api.js'

/**
 * Controller for Authentication related API calls.
 * Handles user sessions, registration, and password management.
 *
 * @class AuthController
 */
const AuthController = {
	/**
	 * Fetches the currently authenticated user's profile.
	 *
	 * @returns The API response containing user profile with auth token.
	 */
	me: () => Api.get<AuthResponseData>('/auth/me'),

	/**
	 * Logs in a user.
	 *
	 * @param data - The login credentials (email/username and password).
	 * @returns The API response containing user auth profile with auth token.
	 */
	login: (data: LoginRequestData) =>
		Api.post<AuthResponseData>('/auth/login', data),

	/**
	 * Registers a new user.
	 *
	 * @param data - The registration data.
	 * @returns The API response containing user auth profile with auth token.
	 */
	register: (data: SignupRequestData) =>
		Api.post<AuthResponseData>('/auth/register', data),

	/**
	 * Requests a password reset email.
	 *
	 * @param data - Object containing the user's email.
	 * @returns Standard API success/error response.
	 */
	forgotPassword: (data: ForgotPasswordRequestData) =>
		Api.post<ApiResponseData>('/auth/forgot', data),

	/**
	 * Resets password using a provided token.
	 *
	 * @param data - Object containing the token and the new password.
	 * @returns Standard API success/error response.
	 */
	resetPassword: (data: ResetPasswordRequestData) =>
		Api.post<ApiResponseData>('/auth/reset', data),

	/**
	 * Verifies OTP for registration.
	 *
	 * @param data - Object containing the email and OTP.
	 * @returns Standard API success/error response.
	 */
	verifyOtp: (data: OtpVerificationRequestData) =>
		Api.post<ApiResponseData>('/auth/otp', data),
}

export default AuthController
