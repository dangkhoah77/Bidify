import { Schema } from 'mongoose'
import chalk from 'chalk'

import { RATING } from 'Shared/Data/Constants/index.js'
import { Review } from 'Shared/Data/Types/index.js'

import User, { UserDocument } from 'Server/Models/User/index.js'
import Product, { ProductDocument } from 'Server/Models/Product/index.js'

import { ServerReview, IReview, ReviewDocument, ReviewModel } from './Types.js'

/**
 * Mongoose schema for the Review model.
 */
const ReviewSchema = new Schema(
	{
		product: { type: String, ref: 'Product', required: true },
		reviewer: { type: String, ref: 'User', required: true },
		reviewedUser: { type: String, ref: 'User', required: true },
		text: { type: String, required: true },
		rating: { type: Number, enum: Object.values(RATING), required: true },
	},
	{
		timestamps: {
			createdAt: 'createdAt',
			updatedAt: 'updatedAt',
		},
		toObject: {
			transform: function (doc: ReviewDocument, ret: any): ServerReview {
				// Convert _id to string and assign to id
				ret.id = ret._id.toString()

				// Ensure necessary fields are populated
				if (
					!doc.populated('product') ||
					!doc.populated('reviewer') ||
					!doc.populated('reviewedUser')
				) {
					throw new Error(
						'Chưa populate các trường cần thiết trong ReviewDocument khi chuyển đổi sang ServerReview'
					)
				}

				// Transform populated fields to objects
				ret.product = Product.toObject(doc.product as ProductDocument)
				ret.reviewer = User.toObject(doc.reviewer as UserDocument)
				ret.reviewedUser = User.toObject(
					doc.reviewedUser as UserDocument
				)

				// Remove redundant fields
				delete ret._id
				delete ret.__v

				return ret
			},
		},
		toJSON: {
			transform: function (doc: ReviewDocument, ret: any): Review {
				// Convert _id to string and assign to id
				ret.id = ret._id.toString()

				// Ensure necessary fields are populated
				if (
					!doc.populated('product') ||
					!doc.populated('reviewer') ||
					!doc.populated('reviewedUser')
				) {
					throw new Error(
						'Chưa populate các trường cần thiết trong ReviewDocument khi chuyển sang Review DTO'
					)
				}

				// Transform populated fields to DTOs
				ret.product = Product.toDto(doc.product as ProductDocument)
				ret.reviewer = User.toDto(doc.reviewer as UserDocument)
				ret.reviewedUser = User.toDto(doc.reviewedUser as UserDocument)

				// Remove redundant fields
				delete ret._id
				delete ret.__v

				return ret
			},
		},
	}
) as Schema<IReview, ReviewModel>

/**
 * Static method to populate referenced fields in a ReviewDocument.
 *
 * @param doc - The ReviewDocument to populate.
 * @returns The populated ReviewDocument.
 */
ReviewSchema.statics.populateDocument = async function (
	doc: ReviewDocument
): Promise<ReviewDocument> {
	try {
		return await doc.populate('product reviewer reviewedUser')
	} catch (error) {
		console.log(
			chalk.red('Error populating fields in ReviewSchema:'),
			error
		)
		throw new Error(
			'Xảy ra lỗi trong quá trình populate các trường trong ReviewSchema'
		)
	}
}

/**
 * Static method to transform a ReviewDocument to a ServerReview object.
 *
 * @param doc - The ReviewDocument to transform.
 * @returns The transformed ServerReview object.
 */
ReviewSchema.statics.toObject = async function (
	doc: ReviewDocument
): Promise<ServerReview> {
	return (await this.populateDocument(doc)).toObject() as any
}

/**
 * Static method to transform a ReviewDocument to a Review DTO.
 *
 * @param doc - The ReviewDocument to transform.
 * @returns The transformed Review DTO.
 */
ReviewSchema.statics.toDto = async function (
	doc: ReviewDocument
): Promise<Review> {
	return (await this.populateDocument(doc)).toJSON() as any
}

export default ReviewSchema
