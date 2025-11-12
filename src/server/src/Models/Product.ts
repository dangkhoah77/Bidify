import { Schema, model } from 'mongoose'

/**
 * Mongoose schema for the Product model.
 */
const ProductSchema = new Schema(
	{
		name: { type: String, required: true },
		description: { type: String, required: true },
		category: {
			type: Schema.Types.ObjectId,
			ref: 'Category',
			required: true,
		},
		seller: { type: Schema.Types.ObjectId, ref: 'User', required: true },
		images: [{ type: String, required: true }],
		startPrice: { type: Number, required: true },
		priceStep: { type: Number, required: true },
		currentPrice: { type: Number, required: true },
		buyNowPrice: { type: Number },
		highestBidder: { type: Schema.Types.ObjectId, ref: 'User' },
		startTime: { type: Date, default: Date.now },
		endTime: { type: Date, required: true },
		autoExtend: { type: Boolean, default: false },
		isSold: { type: Boolean, default: false },
		winner: { type: Schema.Types.ObjectId, ref: 'User' },
	},
	{ timestamps: true }
)

// Create a text index for full-text search on product name
ProductSchema.index({ name: 'text' })

export default model('Product', ProductSchema)
