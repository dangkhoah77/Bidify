/**
 * Generic API Response Payload Definition
 *
 * @type ApiResponse
 * @property {boolean} [success] - Indicates if the API request was successful
 * @property {string} [error] - Optional error message if the request failed
 * @property {unknown} [data] - Optional data returned from the API
 */
export type ApiResponseData = {
	success?: boolean
	error?: string
	data?: unknown
}

export * from './User.js'
export * from './Auth.js'
export * from './Product.js'
