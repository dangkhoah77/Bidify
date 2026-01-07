import multer from 'multer'
import express, { Request, Response } from 'express'

import {
	Image,
	ProductsQueryParams,
	CreateProductRequestData,
} from 'Shared/Data/Types/index.js'
import { ROLE } from 'Shared/Data/Constants/index.js'

import Auth from 'Server/Middleware/Auth.js'
import Role from 'Server/Middleware/Role.js'
import Validate from 'Server/Middleware/Validate.js'
import Deduplicate from 'Server/Middleware/Deduplicate.js'
import Handler from 'Server/Middleware/Handler.js'

import S3Upload from 'Server/Utility/Storage.js'

import { UserDocument } from 'Server/Models/User/index.js'

import {
	// Handlers
	CreateNewProduct,
	DeleteExistingProduct,
	ListProducts,
	GetProductDetails,
	AppendDescription,

	// Validators
	ValidateProduct,
	ValidateProductQuery,
	ValidateProductId,
	ValidateProductDescription,
} from 'Server/Services/ProductService/index.js'

/* Set up multer for handling file uploads */
const Storage = multer.memoryStorage()
const Upload = multer({ storage: Storage })

/** Express router for product-related API endpoints. */
const router = express.Router()

/**
 * Create a new product.
 *
 * @route POST /api/product/add
 */
router.post(
	'/',
	Auth,
	Role(ROLE.Seller),
	Validate(ValidateProduct()),
	Deduplicate,
	Upload.array('images', 20),
	Handler(async (req: Request, res: Response) => {
		const user = req.user as UserDocument
		const {
			productName,
			productDescription,
			category,
			startPrice,
			priceStep,
			buyNowPrice,
			endTime,
			autoExtend,
			allowUnreviewedBidders,
		} = req.body as CreateProductRequestData

		// Upload images to S3
		const imageFiles = req.files as Express.Multer.File[]
		const uploadedImages = [] as Image[]
		await Promise.all(
			imageFiles.map(async (file) => {
				const { imageUrl, imageKey } = await S3Upload(file)
				uploadedImages.push({ url: imageUrl, key: imageKey })
			})
		)

		const result = await CreateNewProduct(
			user,
			productName,
			productDescription,
			category,
			startPrice,
			priceStep,
			buyNowPrice || 0,
			endTime,
			uploadedImages,
			autoExtend,
			allowUnreviewedBidders
		)
		return res.status(result.status).json(result.data)
	})
)

/**
 * Delete an existing product.
 *
 * @route DELETE /api/product/:id
 */
router.delete(
	'/:id',
	Auth,
	Role(ROLE.Admin),
	Validate([ValidateProductId('id')]),
	Handler(async (req: Request, res: Response) => {
		const productId = req.params.id

		const result = await DeleteExistingProduct(productId)
		return res.status(result.status).json(result.data)
	})
)

/**
 * List products (Search, Filter, Sort, Pagination).
 *
 * @route GET /api/product
 */
router.get(
	'/',
	Validate(ValidateProductQuery()),
	Handler(async (req: Request, res: Response) => {
		const { page, limit, keyword, categoryId, sortBy } =
			req.query as unknown as ProductsQueryParams

		const result = await ListProducts(
			page,
			limit,
			keyword,
			categoryId,
			sortBy
		)
		return res.status(result.status).json(result.data)
	})
)

/**
 * Get product details.
 *
 * @route GET /api/product/:id
 */
router.get(
	'/:id',
	Validate([ValidateProductId('id')]),
	Handler(async (req: Request, res: Response) => {
		const productId = req.params.id

		const result = await GetProductDetails(productId)
		return res.status(result.status).json(result.data)
	})
)

/**
 * Append description to product.
 *
 * @route PATCH /api/products/:id/description
 */
router.patch(
	'/:id/description',
	Auth,
	Role(ROLE.Seller),
	Validate([
		ValidateProductId('id'),
		ValidateProductDescription('description'),
	]),
	Handler(async (req: Request, res: Response) => {
		const user = req.user as UserDocument
		const productId = req.params.id
		const { description } = req.body

		const result = await AppendDescription(user, productId, description)
		return res.status(result.status).json(result.data)
	})
)

export default router
