import { Schema } from 'mongoose'
import chalk from 'chalk'

import { Category } from 'Shared/Data/Types/index.js'

import { ServerCategory, ICategory, CategoryDocument } from './Types.js'
import CategoryModel from './index.js'

/**
 * Mongoose schema for the Category model.
 */
const CategorySchema = new Schema(
	{
		name: { type: String, required: true, unique: true },
		parent: { type: String, ref: 'Category', default: null },
	},
	{
		toObject: {
			transform: function (
				doc: CategoryDocument,
				ret: any
			): ServerCategory {
				// Convert _id to string and assign to id
				ret.id = ret._id.toString()

				// Ensure necessary fields are populated
				if (!doc.populated('parent')) {
					throw new Error(
						'Chưa populate các trường cần thiết trong CategoryDocument khi chuyển đổi sang ServerCategory'
					)
				}

				// Transform populated fields to objects
				ret.parent = CategoryModel.toObject(
					doc.parent as CategoryDocument
				)

				// Remove redundant fields
				delete ret._id
				delete ret.__v

				return ret
			},
		},
		toJSON: {
			transform: function (doc: CategoryDocument, ret: any): Category {
				// Convert _id to string and assign to id
				ret.id = ret._id.toString()

				// Ensure necessary fields are populated
				if (!doc.populated('parent')) {
					throw new Error(
						'Chưa populate các trường cần thiết trong CategoryDocument khi chuyển đổi sang Category DTO'
					)
				}

				// Transform populated fields to DTOs
				ret.parent = CategoryModel.toDto(doc.parent as CategoryDocument)

				// Remove redundant fields
				delete ret._id
				delete ret.__v

				return ret
			},
		},
	}
) as Schema<ICategory, CategoryModel>

/**
 * Static method to fully populate referenced fields in a Category document.
 *
 * @param doc - The Category document to populate.
 * @returns The populated Category document.
 */
CategorySchema.statics.populateDocument = async function (
	doc: CategoryDocument
): Promise<CategoryDocument> {
	try {
		return await doc.populate('parent')
	} catch (error) {
		console.log(
			chalk.red('Error populating fields in CategorySchema:'),
			error
		)
		throw new Error(
			'Xảy ra lỗi trong quá trình populate các trường trong CategorySchema'
		)
	}
}

/**
 * Static method to transform a Category document to a ServerCategory object.
 *
 * @param doc - The Category document to transform.
 * @return The ServerCategory object.
 */
CategorySchema.statics.toObject = async function (
	doc: CategoryDocument
): Promise<ServerCategory> {
	return (await this.populateDocument(doc)).toObject() as any
}

/**
 * Static method to transform a Category document to a Category DTO.
 *
 * @param doc - The Category document to transform.
 * @return The Category DTO.
 */
CategorySchema.statics.toDto = async function (
	doc: CategoryDocument
): Promise<Category> {
	return (await this.populateDocument(doc)).toJSON() as any
}

export default CategorySchema
