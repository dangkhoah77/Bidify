import { Schema, model } from 'mongoose'
import { RATING } from '../Data/Constants/index.js'

/**
 * Mongoose schema for the Category model.
 */
const ReviewSchema = new Schema(
	{
		product: {
			type: Schema.Types.ObjectId,
			ref: 'Product',
			required: true,
		},
		reviewer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
		reviewedUser: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		rating: { type: Number, enum: Object.values(RATING), required: true },
		comment: { type: String, required: true },
	},
	{ timestamps: true }
)

export default model('Review', ReviewSchema)
