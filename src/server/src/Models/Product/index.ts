import { model } from 'mongoose'

import { ProductModel } from './Types.js'
import ProductSchema from './Schema.js'

export * from './Types.js'

/**
 * Mongoose model for Product.
 */
const ProductModel = model(
	'Product',
	ProductSchema as any
) as any as ProductModel

export default ProductModel
