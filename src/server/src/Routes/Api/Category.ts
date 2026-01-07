import express, { Request, Response } from 'express'

import { UpdateCategoryRequestData } from 'Shared/Data/Types/index.js'
import { ROLE } from 'Shared/Data/Constants/index.js'

import Auth from 'Server/Middleware/Auth.js'
import Role from 'Server/Middleware/Role.js'
import Validate from 'Server/Middleware/Validate.js'
import Handler from 'Server/Middleware/Handler.js'

import {
	// Validations
	ValidateCategoryId,
	ValidateCategoryName,
	ValidateParentCategory,

	// Handlers
	GetAllCategories,
	CreateNewCategory,
	DeleteExistingCategory,
	UpdateExistingCategory,
} from 'Server/Services/CategoryService/index.js'

/** Router for category-related routes */
const router = express.Router()

/**
 * Retrieve all categories.
 *
 * @route GET /api/category
 */
router.get(
	'/',
	Handler(async (req: Request, res: Response) => {
		const result = await GetAllCategories()
		return res.status(result.status).json(result.data)
	})
)

/**
 * Create a new category.
 *
 * @route POST /api/category
 */
router.post(
	'/',
	Auth,
	Role(ROLE.Admin),
	Validate([ValidateCategoryName('name'), ValidateParentCategory('parent')]),
	Handler(async (req: Request, res: Response) => {
		const { name, parent } = req.body as UpdateCategoryRequestData

		const result = await CreateNewCategory(name, parent)
		return res.status(result.status).json(result.data)
	})
)

/**
 * Delete a category (Admin only)
 *
 * @route DELETE /api/category/:id
 */
router.delete(
	'/:id',
	Auth,
	Role(ROLE.Admin),
	ValidateCategoryId('id'),
	Handler(async (req: Request, res: Response) => {
		const categoryId = req.params.id

		const result = await DeleteExistingCategory(categoryId)
		return res.status(result.status).json(result.data)
	})
)

/**
 * Update a category (Admin only).
 *
 * @route PATCH /api/category/:id
 */
router.patch(
	'/:id',
	Auth,
	Role(ROLE.Admin),
	Validate([
		ValidateCategoryId('id'),
		ValidateCategoryName('name'),
		ValidateParentCategory('parent'),
	]),
	Handler(async (req: Request, res: Response) => {
		const categoryId = req.params.id
		const { name, parent } = req.body as UpdateCategoryRequestData

		const result = await UpdateExistingCategory(categoryId, name, parent)
		return res.status(result.status).json(result.data)
	})
)

export default router
