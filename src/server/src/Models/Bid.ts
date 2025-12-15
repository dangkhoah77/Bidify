import mongoose, { Schema, Document, model } from 'mongoose'

import { BidType } from 'Shared/Data/Types/index.js'
import { IUser } from './User.js'
import { IProduct } from './Product.js'

/**
 * Interface representing a Bid document in MongoDB.
 *
 * @interface IBid
 * @property {IProduct | mongoose.Types.ObjectId} product - The product on which the bid is placed.
 * @property {IUser | mongoose.Types.ObjectId} bidder - The user who placed the bid.
 * @property {number} price - The amount of the bid.
 * @property {number} [maxPrice] - The maximum auto-bid amount set by the bidder, if any.
 * @property {boolean} latest - Indicates if this bid is the latest bid placed by the bidder on the product.
 */
export interface IBid extends Omit<BidType, 'product' | 'bidder'>, Document {
	product: IProduct | mongoose.Types.ObjectId
	bidder: IUser | mongoose.Types.ObjectId
	latest: boolean
}

/**
 * Mongoose schema for the Bid model.
 */
const BidSchema = new Schema({
	product: {
		type: Schema.Types.ObjectId,
		ref: 'Product',
		required: true,
	},
	bidder: { type: Schema.Types.ObjectId, ref: 'User', required: true },
	price: { type: Number, required: true },
	maxPrice: { type: Number, required: true },
	joinedAt: { type: Date, require: true },
	latest: { type: Boolean, default: true },
})

export default model('Bid', BidSchema)
