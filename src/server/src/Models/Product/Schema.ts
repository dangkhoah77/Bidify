import { Schema } from 'mongoose'
import chalk from 'chalk'

import { TRANSACTION_STEP } from 'Shared/Data/Constants/index.js'
import { Product } from 'Shared/Data/Types/index.js'

import User, { UserDocument } from 'Server/Models/User/index.js'
import Category, { CategoryDocument } from 'Server/Models/Category/index.js'

import {
	ServerProduct,
	IProduct,
	ProductDocument,
	ProductModel,
} from './Types.js'

/**
 * Mongoose schema for the Product model.
 */
const ProductSchema = new Schema(
	{
		name: { type: String, trim: true, required: true },
		description: { type: String, required: true },
		category: {
			type: String,
			ref: 'Category',
			required: true,
		},
		seller: { type: String, ref: 'User', required: true },
		images: [
			{
				url: { type: String, required: true },
				key: { type: String, required: true },
			},
		],
		startPrice: { type: Number, required: true },
		priceStep: { type: Number, required: true },
		currentPrice: { type: Number, required: true },
		buyNowPrice: { type: Number },
		highestBidder: { type: String, ref: 'User' },
		endTime: { type: Date, required: true },
		autoExtend: { type: Boolean, default: false },
		allowUnreviewedBidders: { type: Boolean, default: false },
		active: { type: Boolean, default: false },
		winner: { type: String, ref: 'User' },
		transactionStatus: {
			type: String,
			enum: Object.values(TRANSACTION_STEP),
		},
	},
	{
		timestamps: {
			createdAt: 'createdAt',
			updatedAt: 'updatedAt',
		},
		toObject: {
			transform: function (
				doc: ProductDocument,
				ret: any
			): ServerProduct {
				// Convert _id to string and assign to id
				ret.id = ret._id.toString()

				// Ensure necessary fields are populated
				if (
					!doc.populated('category') ||
					!doc.populated('seller') ||
					(doc.highestBidder && !doc.populated('highestBidder')) ||
					(doc.winner && !doc.populated('winner'))
				) {
					throw new Error(
						'Chưa populate các trường cần thiết trong ProductDocument khi chuyển đổi sang ServerProduct'
					)
				}

				// Transform populated fields to objects
				ret.category = Category.toObject(
					doc.category as CategoryDocument
				)
				ret.seller = User.toObject(doc.seller as UserDocument)
				if (doc.highestBidder) {
					ret.highestBidder = User.toObject(
						doc.highestBidder as UserDocument
					)
				}
				if (doc.winner) {
					ret.winner = User.toObject(doc.winner as UserDocument)
				}

				// Remove redundant fields
				delete ret._id
				delete ret.__v

				return ret
			},
		},
		toJSON: {
			transform: function (doc: ProductDocument, ret: any): Product {
				ret.id = ret._id.toString()

				// Ensure necessary fields are populated
				if (
					!doc.populated('category') ||
					!doc.populated('seller') ||
					(doc.highestBidder && !doc.populated('highestBidder')) ||
					(doc.winner && !doc.populated('winner'))
				) {
					throw new Error(
						'Chưa populate các trường cần thiết trong ProductDocument khi chuyển sang Product DTO'
					)
				}

				// Transform populated fields to DTOs
				ret.category = Category.toDto(doc.category as CategoryDocument)
				ret.seller = User.toDto(doc.seller as UserDocument)
				if (doc.highestBidder) {
					ret.highestBidder = User.toDto(
						doc.highestBidder as UserDocument
					)
				}
				if (doc.winner) {
					ret.winner = User.toDto(doc.winner as UserDocument)
				}

				// Remove redundant fields
				delete ret._id
				delete ret.__v

				return ret
			},
		},
	}
) as Schema<IProduct, ProductModel>

/**
 * Static method to fully populate referenced fields in a Product document.
 *
 * @param doc - The Product document to populate.
 * @returns The populated Product document.
 */
ProductSchema.statics.populateDocument = async function (
	doc: ProductDocument
): Promise<ProductDocument> {
	try {
		return doc.populate('category seller highestBidder winner')
	} catch (error) {
		console.error(
			chalk.red('Error populating fields in ProductSchema:'),
			error
		)
		throw new Error(
			'Xảy ra lỗi trong quá trình populate các trường trong ProductSchema'
		)
	}
}

/**
 * Static method to convert a Product document to its ServerProduct representation.
 *
 * @param doc - The Product document to convert.
 * @returns The ServerProduct representation of the document.
 */
ProductSchema.statics.toObject = async function (
	doc: ProductDocument
): Promise<ServerProduct> {
	return (await this.populateDocument(doc)).toObject() as any
}

/**
 * Static method to convert a Product document to its Product DTO representation.
 *
 * @param doc - The Product document to convert.
 * @returns The Product DTO representation of the document.
 */
ProductSchema.statics.toDto = async function (
	doc: ProductDocument
): Promise<Product> {
	return (await this.populateDocument(doc)).toJSON() as any
}

// Create a text index for full-text search on product name
ProductSchema.index({ name: 'text' })

export default ProductSchema
