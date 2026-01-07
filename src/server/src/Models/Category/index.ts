import { model } from 'mongoose'

import { CategoryModel } from './Types.js'
import CategorySchema from './Schema.js'

export * from './Types.js'

/**
 * Mongoose model for Category.
 */
const CategoryModel = model(
	'Category',
	CategorySchema as any
) as any as CategoryModel

export default CategoryModel
