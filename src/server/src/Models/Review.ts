import mongoose, { Schema, Document, model } from 'mongoose'

import { RATING } from 'Shared/Data/Constants/index.js'
import { ReviewType } from 'Shared/Data/Types/index.js'
import { IUser } from './User.js'
import { IProduct } from './Product.js'

/**
 * Mongoose document interface for the Review model.
 *
 * @interface IReview
 * @property {IProduct | mongoose.Types.ObjectId} product - Reference to the Product being reviewed
 * @property {IUser | mongoose.Types.ObjectId} reviewer - Reference to the User who wrote the review
 * @property {IUser | mongoose.Types.ObjectId} reviewedUser - Reference to the User who is being reviewed
 * @property {RATING} rating - The rating given in the review
 * @property {string} comment - The comment provided in the review
 */
export interface IReview
	extends Omit<ReviewType, 'product' | 'reviewer' | 'reviewedUser'>,
		Document {
	product: IProduct | mongoose.Types.ObjectId
	reviewer: IUser | mongoose.Types.ObjectId
	reviewedUser: IUser | mongoose.Types.ObjectId
}

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
