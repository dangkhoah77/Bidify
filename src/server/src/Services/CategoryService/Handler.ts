import {
	ApiResponseData,
	CatgoryListingResponseData,
} from 'Shared/Data/Types/index.js'

import Category from 'Server/Models/Category/index.js'

import {
	FindCategoryById,
	FindCategoryByName,
	FindAllCategories,
	CreateCategory,
	DeleteCategoryById,
	UpdateCategoryById,
} from './Query.js'
import { ProductExistsByCategory } from 'Server/Services/ProductService/Query.js'

/**
 * Create a new category.
 *
 * @param name - Name of the category
 * @param parent - Optional parent category ID
 * @returns The status and result data of the operation
 */
export const CreateNewCategory = async (
	name: string,
	parent?: string
): Promise<{ status: number; data: ApiResponseData }> => {
	// Check if category with the same name already exists
	const existingCategory = await FindCategoryByName(name)
	if (existingCategory) {
		return {
			status: 409,
			data: {
				success: false,
				message: 'Danh mục với tên này đã tồn tại.',
			},
		}
	}

	// Create new category
	await CreateCategory(name, parent)

	return {
		status: 201,
		data: {
			success: true,
			message: 'Tạo danh mục thành công.',
		},
	}
}

/**
 * Update an existing category.
 *
 * @param id - ID of the category to update
 * @param name - New name for the category
 * @param parent - Optional new parent category ID
 * @returns The status and result data of the operation
 */
export const UpdateExistingCategory = async (
	id: string,
	name: string,
	parent?: string
): Promise<{ status: number; data: ApiResponseData }> => {
	const category = await FindCategoryById(id)
	if (!category) {
		return {
			status: 404,
			data: { success: false, message: 'Danh mục không tồn tại.' },
		}
	}

	// If name changed, check duplicate
	if (name !== category.name) {
		const duplicate = await FindCategoryByName(name)
		if (duplicate) {
			return {
				status: 409,
				data: { success: false, message: 'Tên danh mục đã tồn tại.' },
			}
		}
	}

	await UpdateCategoryById(id, { name, parent })

	return {
		status: 200,
		data: {
			success: true,
			message: 'Cập nhật danh mục thành công.',
		},
	}
}

/**
 * Delete a category.
 *
 * @param categoryId - ID of the category to delete
 * @returns The status and result data of the operation
 */
export const DeleteExistingCategory = async (
	categoryId: string
): Promise<{ status: number; data: ApiResponseData }> => {
	const category = await FindCategoryById(categoryId)
	if (!category) {
		return {
			status: 404,
			data: { success: false, message: 'Danh mục không tồn tại.' },
		}
	}

	// Check if any product uses this category
	const productExists = await ProductExistsByCategory(categoryId)
	if (productExists) {
		return {
			status: 400,
			data: {
				success: false,
				message: 'Không thể xóa danh mục đã có sản phẩm.',
			},
		}
	}

	// Delete the category
	await DeleteCategoryById(categoryId)

	return {
		status: 200,
		data: {
			success: true,
			message: 'Xóa danh mục thành công.',
		},
	}
}

/**
 * Retrieve all categories.
 *
 * @returns The status and result data containing the list of categories
 */
export const GetAllCategories = async (): Promise<{
	status: number
	data: CatgoryListingResponseData
}> => {
	const categories = await FindAllCategories()
	const categoriesList = []

	for (const category of categories) {
		categoriesList.push(await Category.toDto(category))
	}

	return {
		status: 200,
		data: {
			success: true,
			message: 'Lấy danh sách danh mục thành công.',
			data: {
				categories: categoriesList,
			},
		},
	}
}
