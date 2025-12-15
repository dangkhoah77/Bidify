import { ServerUser, ApiResponseData } from 'Shared/Data/Types/index.js'

/**
 * Data payload for Authentication response.
 *
 * @interface AuthResponseData
 * @property {boolean} success - Indicates if the authentication was successful
 * @property {string} [error] - Optional error message if the authentication failed
 * @property {{ token: string; user: ServerUser }} [data] - Contains the JWT token and user information
 */
export interface AuthResponseData extends ApiResponseData {
	data?: {
		token: string
		user: ServerUser
	}
}
