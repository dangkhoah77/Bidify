import express, { Request, Response } from 'express'
import multer from 'multer'
import { SortOrder } from 'mongoose'

import Product from 'Server/Models/Product.js'
import Category from 'Server/Models/Category.js'
import Auth from 'Server/Middleware/Auth.js'
import Role from 'Server/Middleware/Role.js'
import S3Upload from 'Server/Utility/Storage.js'
import { ROLE } from 'Shared/Data/Constants/index.js'
import { ProductsQueryParams } from 'Shared/Data/Types/index.js'

const router = express.Router()

const storage = multer.memoryStorage()
const upload = multer({ storage })

/**
 * GET /api/products
 */
router.get('/', async (req: Request, res: Response) => {
	try {
		const {
			page = 1,
			limit = 12,
			category,
			search,
			sort,
		} = req.query as unknown as ProductsQueryParams

		const query: any = { isActive: true }

		if (search) {
			const regex = new RegExp(search, 'i')
			query.$or = [{ name: regex }, { description: regex }]
		}

		if (category) {
			const categoryDoc = await Category.findOne({
				$or: [
					{ name: category },
					{
						_id: category.match(/^[0-9a-fA-F]{24}$/)
							? category
							: null,
					},
				],
			})
			if (categoryDoc) {
				query.category = categoryDoc._id
			}
		}

		let sortOptions: { [key: string]: SortOrder } = { createdAt: -1 }
		if (sort === 'price_asc') sortOptions = { currentPrice: 1 }
		else if (sort === 'price_desc') sortOptions = { currentPrice: -1 }
		else if (sort === 'time_asc') sortOptions = { endTime: 1 }
		else if (sort === 'time_desc') sortOptions = { endTime: -1 }

		const skip = (Number(page) - 1) * Number(limit)

		const products = await Product.find(query)
			.populate('category', 'name')
			.populate('seller', 'firstName lastName')
			.sort(sortOptions)
			.skip(skip)
			.limit(Number(limit))
			.exec()

		if (!products) {
			throw new Error('Error fetching products from database.')
		}

		return res.status(200).json({
			success: true,
			data: {
				products,
				total: products.length,
				page: Number(page),
				totalPages: Math.ceil(products.length / Number(limit)),
			},
		})
	} catch (error: any) {
		return res.status(500).json({
			success: false,
			error: error.message || 'Failed to fetch products',
		})
	}
})

/**
 * GET /api/products/:id  <-- ✅ CHANGED from :slug
 * Fetch single product details by ID.
 */
router.get('/:id', async (req: Request, res: Response) => {
	try {
		const { id } = req.params // ✅ CHANGED

		// ✅ CHANGED: Query by _id instead of slug
		const product = await Product.findOne({ _id: id, isActive: true })
			.populate('category')
			.populate('seller', 'firstName lastName email')
			.populate('highestBidder', 'firstName lastName')

		if (!product) {
			return res
				.status(404)
				.json({ success: false, error: 'Product not found' })
		}

		return res.status(200).json({
			success: true,
			data: { product },
		})
	} catch (error: any) {
		return res.status(500).json({
			success: false,
			error: error.message || 'Failed to fetch product',
		})
	}
})

/**
 * POST /api/products
 * Create a new product (Seller only).
 */
router.post(
	'/',
	Auth,
	Role.check(ROLE.Seller, ROLE.Admin),
	upload.array('images', 5),
	async (req: Request, res: Response) => {
		try {
			const {
				name,
				category,
				startPrice,
				priceStep,
				buyNowPrice,
				description,
				endTime,
				autoExtend,
			} = req.body

			const files = req.files as Express.Multer.File[]
			const user = req.user as any

			if (!files || files.length === 0) {
				return res.status(400).json({
					success: false,
					error: 'At least one image is required',
				})
			}

			const uploadedImages = await Promise.all(
				files.map((file) => S3Upload(file))
			)
			const imageUrls = uploadedImages.map((img) => img.imageUrl)

			// ❌ REMOVED: Slug generation logic

			const newProduct = new Product({
				name,
				// slug, // ❌ REMOVED
				description,
				category,
				seller: user._id,
				imageUrl: imageUrls,
				imageKey: uploadedImages.map((img) => img.imageKey),
				startPrice: Number(startPrice),
				currentPrice: Number(startPrice),
				priceStep: Number(priceStep),
				buyNowPrice: buyNowPrice ? Number(buyNowPrice) : undefined,
				startTime: new Date(),
				endTime: new Date(endTime),
				autoExtend: autoExtend === 'true',
				isActive: true,
			})

			await newProduct.save()

			return res.status(201).json({
				success: true,
				data: { product: newProduct },
			})
		} catch (error: any) {
			return res.status(500).json({
				success: false,
				error: error.message || 'Failed to create product',
			})
		}
	}
)

export default router