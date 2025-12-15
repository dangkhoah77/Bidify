import mongoose, { Schema, Document, model } from 'mongoose'

import { ProductType } from 'Shared/Data/Types/index.js'
import { IUser } from './User.js'
import { ICategory } from './Category.js'

/**
 * Mongoose document interface for the Product model.
 *
 * @interface IProduct
 * @property {string} name - Name of the product
 * @property {string} description - Description of the product
 * @property {ICategory | mongoose.Types.ObjectId} category - Reference to the Category of the product
 * @property {IUser | mongoose.Types.ObjectId} seller - Reference to the User who is selling the product
 * @property {string[]} images - Array of image URLs for the product
 * @property {number} startPrice - Starting price of the product
 * @property {number} priceStep - Minimum increment for bids
 * @property {number} currentPrice - Current highest bid price
 * @property {number} buyNowPrice - "Buy Now" price of the product
 * @property {IUser | mongoose.Types.ObjectId | null} [highestBidder] - Reference to the User who has the highest bid, if any
 * @property {Date} startTime - Auction start time
 * @property {Date} endTime - Auction end time
 * @property {boolean} autoExtend - Indicates if the auction end time should be auto-extended
 * @property {boolean} isActive - Indicates if the product is active for bidding
 * @property {IUser | mongoose.Types.ObjectId | null} [winner] - Reference to the User who won the auction, if any
 */
export interface IProduct
	extends Omit<
			ProductType,
			'category' | 'seller' | 'highestBidder' | 'winner'
		>,
		Document {
	category: ICategory | mongoose.Types.ObjectId
	seller: IUser | mongoose.Types.ObjectId
	highestBidder?: IUser | mongoose.Types.ObjectId | null
	winner?: IUser | mongoose.Types.ObjectId | null
}

/**
 * Mongoose schema for the Product model.
 */
const ProductSchema = new Schema(
	{
		name: { type: String, trim: true, required: true },
		slug: { type: String, trim: true, required: true, unique: true },
		description: { type: String, required: true },
		category: {
			type: Schema.Types.ObjectId,
			ref: 'Category',
			required: true,
		},
		seller: { type: Schema.Types.ObjectId, ref: 'User', required: true },
		imageUrl: [{ type: String, required: true }],
		imageKey: [{ type: String, required: true }],
		startPrice: { type: Number, required: true },
		priceStep: { type: Number, required: true },
		currentPrice: { type: Number, required: true },
		buyNowPrice: { type: Number },
		highestBidder: { type: Schema.Types.ObjectId, ref: 'User' },
		startTime: { type: Date },
		endTime: { type: Date, required: true },
		autoExtend: { type: Boolean, default: false },
		isActive: { type: Boolean, default: false },
		winner: { type: Schema.Types.ObjectId, ref: 'User' },
	},
	{ timestamps: true }
)

// Create a text index for full-text search on product name
ProductSchema.index({ name: 'text' })

export default model('Product', ProductSchema)
