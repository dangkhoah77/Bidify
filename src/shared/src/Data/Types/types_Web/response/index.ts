/**
 * Generic API Response Payload Definition
 *
 * @type ApiResponse
 * @property {boolean} success - Indicates if the API request was successful
 * @property {string} message - A message providing additional information about the API response
 * @property {unknown} [data] - Optional data payload containing relevant information for the API response
 */
export type ApiResponseData = {
	success: boolean
	message: string
	data?: unknown
}

export * from './User.js'
export * from './Auth.js'
export * from './Category.js'
export * from './Product.js'
export * from './Bid.js'
export * from './Comment.js'
