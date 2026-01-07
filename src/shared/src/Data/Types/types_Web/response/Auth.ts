import { UserProfile, ApiResponseData } from 'Shared/Data/Types/index.js'

/**
 * Data payload for "Get Current User" response.
 *
 * @interface CurrentUserResponseData
 * @property {boolean} success - Indicates if the request was successful
 * @property {string} message - A message providing additional information about the response
 * @property {{ user: UserProfile }} [data] - Contains the user profile information
 */
export interface CurrentUserResponseData extends ApiResponseData {
	data?: {
		user: UserProfile
	}
}

/**
 * Data payload for Authentication response.
 *
 * @interface AuthResponseData
 * @property {boolean} success - Indicates if the authentication was successful
 * @property {string} message - A message providing additional information about the authentication response
 * @property {{ token: string; user: UserProfile }} [data] - Contains the JWT token and user profile information
 */
export interface AuthResponseData extends ApiResponseData {
	data?: {
		token: string
		user: UserProfile
	}
}

/**
 * Data payload for Registration OTP response.
 *
 * @interface RegistrationOtpResponseData
 * @property {boolean} success - Indicates if the OTP request was successful
 * @property {string} message - A message providing additional information about the OTP response
 * @property {{ expiresIn: number }} [data] - Contains the OTP expiration time in milliseconds
 */
export interface RegistrationOtpResponseData extends ApiResponseData {
	data?: {
		expiresIn: number
	}
}
