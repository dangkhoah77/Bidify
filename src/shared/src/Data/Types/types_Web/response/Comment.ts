import { Comment, ApiResponseData } from 'Shared/Data/Types/index.js'

/**
 * Response data structure for listing comments.
 *
 * @interface CommentListingResponseData
 * @property {boolean} success - Indicates if the operation was successful
 * @property {string} message - A message providing additional information about the response
 * @property {{ comments: Comment[] }} [data] - Contains the list of comments if successful
 */
export interface CommentListingResponseData extends ApiResponseData {
	data?: {
		comments: Comment[]
	}
}
