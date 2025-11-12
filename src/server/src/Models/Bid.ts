import { Schema, model } from 'mongoose'

/**
 * Mongoose schema for the Bid model.
 */
const BidSchema = new Schema(
	{
		product: {
			type: Schema.Types.ObjectId,
			ref: 'Product',
			required: true,
		},
		bidder: { type: Schema.Types.ObjectId, ref: 'User', required: true },
		price: { type: Number, required: true },
		maxPrice: { type: Number }, // User's maximum auto-bid amount
	},
	{ timestamps: { createdAt: true, updatedAt: false } } // Only need createdAt
)

export default model('Bid', BidSchema)
