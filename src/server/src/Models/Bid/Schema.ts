import { Schema } from 'mongoose'
import chalk from 'chalk'

import { BID_STATE } from 'Shared/Data/Constants/index.js'
import { Bid } from 'Shared/Data/Types/index.js'

import User, { UserDocument } from 'Server/Models/User/index.js'
import Product, { ProductDocument } from 'Server/Models/Product/index.js'

import { ServerBid, IBid, BidDocument, BidModel } from './Types.js'

/**
 * Mongoose schema for the Bid model.
 */
const BidSchema = new Schema(
	{
		product: {
			type: String,
			ref: 'Product',
			required: true,
		},
		bidder: { type: String, ref: 'User', required: true },
		price: { type: Number, required: true },
		maxPrice: { type: Number, required: true },
		latest: { type: Boolean, default: true },
		state: {
			type: String,
			required: true,
			default: BID_STATE.Active,
			enum: Object.values(BID_STATE),
		},
	},
	{
		timestamps: {
			createdAt: 'createdAt',
		},
		toObject: {
			transform: function (doc: BidDocument, ret: any): ServerBid {
				// Convert _id to string and assign to id
				ret.id = ret._id.toString()

				// Ensure necessary fields are populated
				if (!doc.populated('product') || !doc.populated('bidder')) {
					throw new Error(
						'Chưa populate các trường cần thiết trong BidDocument khi chuyển đổi sang ServerBid'
					)
				}

				// Transform populated fields to objects
				ret.product = Product.toObject(doc.product as ProductDocument)
				ret.bidder = User.toObject(doc.bidder as UserDocument)

				// Remove redundant fields
				delete ret._id
				delete ret.__v

				return ret
			},
		},
		toJSON: {
			transform: function (doc: BidDocument, ret: any): Bid {
				// Convert _id to string and assign to id
				ret.id = ret._id.toString()

				// Ensure necessary fields are populated
				if (!doc.populated('product') || !doc.populated('bidder')) {
					throw new Error(
						'Chưa populate các trường cần thiết trong BidDocument khi chuyển đổi sang Bid DTO'
					)
				}

				// Transform populated fields to DTOs
				ret.product = Product.toDto(doc.product as ProductDocument)
				ret.bidder = User.toDto(doc.bidder as UserDocument)

				// Remove redundant fields
				delete ret._id
				delete ret.__v

				return ret
			},
		},
	}
) as Schema<IBid, BidModel>

/**
 * Static method to fully populate referenced fields in a Bid document.
 *
 * @param doc - The Bid document to populate.
 * @returns The populated Bid document.
 */
BidSchema.statics.populateDocument = async function (
	doc: BidDocument
): Promise<BidDocument> {
	try {
		return doc.populate('product bidder')
	} catch (error) {
		console.log(chalk.red('Error populating fields in BidSchema:'), error)
		throw new Error(
			'Xảy ra lỗi trong quá trình populate các trường trong BidSchema'
		)
	}
}

/**
 * Static method to transform a Bid document to a ServerBid object.
 *
 * @param doc - The Bid document to transform.
 * @returns The transformed ServerBid object.
 */
BidSchema.statics.toObject = async function (
	doc: BidDocument
): Promise<ServerBid> {
	return (await this.populateDocument(doc)).toObject() as any
}

/**
 * Static method to transform a Bid document to a Bid DTO.
 *
 * @param doc - The Bid document to transform.
 * @returns The transformed Bid DTO.
 */
BidSchema.statics.toDto = async function (doc: BidDocument): Promise<Bid> {
	return (await this.populateDocument(doc)).toJSON() as any
}

export default BidSchema
