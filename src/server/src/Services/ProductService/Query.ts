import { ClientSession, FilterQuery } from 'mongoose'

import Product, {
	IProduct,
	ProductDocument,
} from 'Server/Models/Product/index.js'

/**
 * Checks if a product exists by its unique identifier.
 *
 * @param {string} productId - The unique identifier of the product.
 * @returns boolean indicating existence
 */
export const ProductExistsById = async (productId: string) => {
	return Product.exists({ _id: productId }).then((exists) => !!exists)
}

/**
 * Checks if any product exists within a specific category.
 *
 * @param {string} categoryId - The unique identifier of the category.
 * @returns boolean indicating existence
 */
export const ProductExistsByCategory = async (categoryId: string) => {
	return Product.exists({ category: categoryId }).then((exists) => !!exists)
}

/**
 * Finds a product by its unique identifier.
 *
 * @param {string} productId - The unique identifier of the product.
 * @returns The ProductDocument if found, otherwise null.
 */
export const FindProductById = async (productId: string) => {
	return Product.where('_id', productId).findOne()
}

/**
 * Creates a new product.
 *
 * @param {Partial<IProduct>} productData - The data for the new product.
 * @param {ClientSession | null} session - Optional mongoose session for transaction.
 * @returns The created ProductDocument.
 */
export const CreateProduct = (
	productData: Partial<IProduct>,
	session: ClientSession | null = null
) => {
	return Product.create([productData], { session }).then(
		(products) => products[0]
	)
}

/**
 * Deletes a product by its unique identifier.
 *
 * @param {string} productId - The unique identifier of the product to delete.
 * @returns The result of the deletion operation.
 */
export const DeleteProduct = (productId: string) => {
	return Product.deleteOne({ _id: productId })
}

/**
 * Finds related products (same category, different ID).
 *
 * @param {string} categoryId - The category ID to match.
 * @param {string} excludeProductId - The product ID to exclude.
 * @param {number} limit - Maximum number of related products to return.
 * @returns An array of related ProductDocument.
 */
export const FindRelatedProducts = (
	categoryId: string,
	excludeProductId: string,
	limit: number
) => {
	return Product.where('category', categoryId)
		.where('_id')
		.ne(excludeProductId)
		.where('active', true)
		.gt('endTime', new Date())
		.find()
		.sort({ endTime: -1 }) // Prioritize ending soon/newest depending on logic
		.limit(limit)
}
