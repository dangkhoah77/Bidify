import { Schema, model } from 'mongoose'

/**
 * Mongoose schema for the Category model.
 */
const CategorySchema = new Schema({
	name: { type: String, required: true, unique: true },
	parent: { type: Schema.Types.ObjectId, ref: 'Category', default: null },
})

export default model('Category', CategorySchema)
