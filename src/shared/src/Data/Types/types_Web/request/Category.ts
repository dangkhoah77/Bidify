/**
 * Update a category request payload definition
 *
 * @type UpdateCategoryRequestData
 * @property {string} name - The name of the category
 * @property {string} [parent] - The optional parent category ID
 */
export type UpdateCategoryRequestData = {
	name: string
	parent?: string
}
