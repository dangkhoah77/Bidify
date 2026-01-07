import { model } from 'mongoose'

import { ReviewModel } from './Types.js'
import ReviewSchema from './Schema.js'

export * from './Types.js'

/**
 * Mongoose model for Review.
 */
const ReviewModel = model('Review', ReviewSchema as any) as any as ReviewModel

export default ReviewModel
