import Category, { ICategory } from 'Server/Models/Category/index.js'

/**
 * Finds a category by its unique identifier.
 *
 * @param {string} id - The unique identifier of the category.
 * @returns The CategoryDocument if found, otherwise null.
 */
export const FindCategoryById = async (id: string) => {
	return Category.where('_id', id).findOne()
}

/**
 * Finds a category by its name.
 *
 * @param {string} name - The name of the category.
 * @returns The CategoryDocument if found, otherwise null.
 */
export const FindCategoryByName = async (name: string) => {
	return Category.where('name', name).findOne()
}

/**
 * Retrieves all categories from the database.
 *
 * @returns An array of all CategoryDocuments.
 */
export const FindAllCategories = async () => {
	return Category.find()
}

/**
 * Creates a new category with the given name and optional parent category.
 *
 * @param {string} name - The name of the new category.
 * @param {string} [parent] - The optional ID of the parent category.
 * @returns The newly created CategoryDocument.
 */
export const CreateCategory = async (name: string, parent?: string) => {
	const parentCategory = parent ? await FindCategoryById(parent) : null
	return Category.create({
		name,
		parent: parentCategory ? parentCategory._id.toString() : null,
	})
}

/**
 * Updates an existing category.
 *
 * @param {string} id - The ID of the category to update.
 * @param {Partial<ICategory>} data - The data to update the category with.
 * @returns The updated CategoryDocument.
 */
export const UpdateCategoryById = (id: string, data: Partial<ICategory>) => {
	return Category.findByIdAndUpdate(id, data, { new: true })
}

/**
 * Deletes a category by ID.
 *
 * @param {string} id - The ID of the category to delete.
 * @returns The deleted CategoryDocument.
 */
export const DeleteCategoryById = (id: string) => {
	return Category.findByIdAndDelete(id)
}
