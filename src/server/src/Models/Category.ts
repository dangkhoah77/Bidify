import mongoose, { Schema, Document, model } from 'mongoose'

import { CategoryType } from 'Shared/Data/Types/index.js'

/**
 * Interface representing a Category document in MongoDB.
 *
 * @interface ICategory
 * @property {string} name - The name of the category.
 * @property {ICategory} [parent] - The parent category, if any.
 */
export interface ICategory extends Omit<CategoryType, 'parent'>, Document {
	parent?: ICategory | mongoose.Types.ObjectId | null
}

/**
 * Mongoose schema for the Category model.
 */
const CategorySchema = new Schema({
	name: { type: String, required: true, unique: true },
	parent: { type: Schema.Types.ObjectId, ref: 'Category', default: null },
})

export default model('Category', CategorySchema)
