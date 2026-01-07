import { Category } from 'Shared/Data/Types/index.js'
import { DocumentType, ModelType } from 'Server/Data/Types.js'

/**
 * Category type representing a product category.
 *
 * @type ServerCategory
 * @property {string} id - The unique identifier of the category.
 * @property {string} name - The name of the category.
 * @property {ServerCategory} [parent] - The parent category, if any.
 */
export interface ServerCategory extends Omit<Category, 'parent'> {
	parent?: ServerCategory
}

/**
 * Interface representing a raw Category document type.
 *
 * @interface ICategory
 * @property {string} id - The unique identifier of the category.
 * @property {string} name - The name of the category.
 * @property {CategoryDocument | string} [parent] - The parent category, if any.
 */
export interface ICategory extends Omit<ServerCategory, 'parent'> {
	parent?: CategoryDocument | string
}

/**
 * Mongoose document interface for Category.
 *
 * @interface CategoryDocument
 * @property {ObjectId} _id - The MongoDB ObjectId.
 * @property {number} __v - The version key.
 * @property {string} id - The unique identifier of the category.
 * @property {string} name - The name of the category.
 * @property {CategoryDocument | string} [parent] - The parent category, if any.
 */
export interface CategoryDocument extends DocumentType<ICategory> {}

/**
 * Mongoose Model interface for Category with additional static methods.
 *
 * @property {(doc: CategoryDocument): Promise<CategoryDocument>} populateDocument - Static method to fully populate referenced fields in a Category document.
 * @property {(doc: CategoryDocument): Promise<ServerCategory>} toObject - Static method to transform a Category document to a ServerCategory object.
 * @property {(doc: CategoryDocument): Promise<Category>} toDto - Static method to transform a Category document to a Category DTO.
 */
export interface CategoryModel
	extends ModelType<Category, ServerCategory, ICategory, CategoryDocument> {}
