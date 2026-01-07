import { model } from 'mongoose'

import { CommentModel } from './Types.js'
import CommentSchema from './Schema.js'

export * from './Types.js'

/**
 * Mongoose model for Comment.
 */
const CommentModel = model(
	'Comment',
	CommentSchema as any
) as any as CommentModel

export default CommentModel
