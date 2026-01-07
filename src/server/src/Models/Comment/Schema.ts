import { Schema } from 'mongoose'
import chalk from 'chalk'

import { Comment } from 'Shared/Data/Types/index.js'

import User, { UserDocument } from 'Server/Models/User/index.js'
import Product, { ProductDocument } from 'Server/Models/Product/index.js'

import CommentModel from './index.js'
import { ServerComment, IComment, CommentDocument } from './Types.js'

/**
 * Mongoose schema for the Comment model.
 */
const CommentSchema = new Schema(
	{
		product: { type: String, ref: 'Product', required: true },
		commenter: { type: Schema.Types.ObjectId, ref: 'User', required: true },
		text: { type: String, required: true },
		answers: [{ type: String, ref: 'Comment' }],
	},
	{
		timestamps: {
			createdAt: 'createdAt',
			updatedAt: 'updatedAt',
		},
		toObject: {
			transform: function (
				doc: CommentDocument,
				ret: any
			): ServerComment {
				// Convert _id to string and assign to id
				ret.id = ret._id.toString()

				// Ensure necessary fields are populated
				if (
					!doc.populated('product') ||
					!doc.populated('commenter') ||
					!doc.populated('answers')
				) {
					throw new Error(
						'Chưa populate các trường cần thiết trong CommentDocument khi chuyển đổi sang ServerComment'
					)
				}

				// Transform populated fields to objects
				ret.product = Product.toObject(doc.product as ProductDocument)
				ret.commenter = User.toObject(doc.commenter as UserDocument)
				ret.answers = (doc.answers as CommentDocument[]).map(
					(answer: CommentDocument) => CommentModel.toObject(answer)
				)

				// Remove redundant fields
				delete ret._id
				delete ret.__v

				return ret
			},
		},
		toJSON: {
			transform: function (doc: CommentDocument, ret: any): Comment {
				// Convert _id to string and assign to id
				ret.id = ret._id.toString()

				// Ensure necessary fields are populated
				if (
					!doc.populated('product') ||
					!doc.populated('commenter') ||
					!doc.populated('answers')
				) {
					throw new Error(
						'Chưa populate các trường cần thiết trong CommentDocument khi chuyển sang Comment DTO'
					)
				}

				// Transform populated fields to DTOs
				ret.product = Product.toDto(doc.product as ProductDocument)
				ret.commenter = User.toDto(doc.commenter as UserDocument)
				ret.answers = (doc.answers as CommentDocument[]).map(
					(answer: CommentDocument) => CommentModel.toDto(answer)
				)

				// Remove redundant fields
				delete ret._id
				delete ret.__v

				return ret
			},
		},
	}
) as Schema<IComment, CommentModel>

/**
 * Static method to populate referenced fields in a CommentDocument.
 *
 * @param doc - The CommentDocument to populate.
 * @returns The populated CommentDocument.
 */
CommentSchema.statics.populateDocument = async function (
	doc: CommentDocument
): Promise<CommentDocument> {
	try {
		return await doc.populate('product reviewer reviewedUser')
	} catch (error) {
		console.log(
			chalk.red('Error populating fields in CommentSchema:'),
			error
		)
		throw new Error(
			'Xảy ra lỗi trong quá trình populate các trường trong CommentSchema'
		)
	}
}

/**
 * Static method to transform a CommentDocument to a ServerComment object.
 *
 * @param doc - The CommentDocument to transform.
 * @returns The transformed ServerComment object.
 */
CommentSchema.statics.toObject = async function (
	doc: CommentDocument
): Promise<ServerComment> {
	return (await this.populateDocument(doc)).toObject() as any
}

/**
 * Static method to transform a CommentDocument to a Comment DTO.
 *
 * @param doc - The CommentDocument to transform.
 * @returns The transformed Comment DTO.
 */
CommentSchema.statics.toDto = async function (
	doc: CommentDocument
): Promise<Comment> {
	return (await this.populateDocument(doc)).toJSON() as any
}

export default CommentSchema
