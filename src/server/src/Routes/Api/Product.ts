import express, { Request, Response } from 'express'
import Product from '../../Models/Product.js'
import Category from '../../Models/Category.js'
import Auth from '../../Middleware/Auth.js'
import { ROLES } from '../../Data/Constants/index.js'
import { check as checkRole } from '../../Middleware/Role.js'

const router = express.Router()

export type ProductDTO = {
	_id: string
	name: string
	description: string
	images: string[]
	startPrice: number
	priceStep: number
	currentPrice: number
	buyNowPrice?: number
	endTime: string
	bidCount?: number
	categoryName?: string
	highestBidderName?: string
	isNew?: boolean
}

// ✅ HÀM MAP CHUNG (tái sử dụng cho tất cả routes)
const mapDocToDTO = (doc: any): ProductDTO => ({
	_id: doc._id.toString(),
	name: doc.name,
	description: doc.description,
	images: doc.images,
	startPrice: doc.startPrice,
	priceStep: doc.priceStep,
	currentPrice: doc.currentPrice,
	buyNowPrice: doc.buyNowPrice,
	endTime: doc.endTime.toISOString(),
	bidCount: doc.bidCount ?? 0,
	categoryName: doc.category?.name || 'Chưa phân loại',
	highestBidderName: doc.highestBidder?.name
		? `****${doc.highestBidder.name.slice(-4)}`
		: 'Chưa có',
	isNew: false,
})

// GET /api/products/home
router.get('/home', async (req: Request, res: Response) => {
	try {
		const now = new Date()

		const endingSoonDocs = await Product.find({ endTime: { $gt: now } })
			.populate('category', 'name')
			.populate('highestBidder', 'name')
			.sort({ endTime: 1 })
			.limit(5)
			.lean()

		const mostBidsDocs = await Product.find()
			.populate('category', 'name')
			.populate('highestBidder', 'name')
			.sort({ bidCount: -1 })
			.limit(5)
			.lean()

		const highestPriceDocs = await Product.find()
			.populate('category', 'name')
			.populate('highestBidder', 'name')
			.sort({ currentPrice: -1 })
			.limit(5)
			.lean()

		res.json({
			endingSoon: endingSoonDocs.map(mapDocToDTO),
			mostBids: mostBidsDocs.map(mapDocToDTO),
			highestPrice: highestPriceDocs.map(mapDocToDTO),
		})
	} catch (error: any) {
		res.status(500).json({ error: error.message || 'Server error' })
	}
})

// GET /api/products/ending-soon
router.get('/ending-soon', async (req: Request, res: Response) => {
	try {
		const { page = 1, limit = 20 } = req.query
		const now = new Date()

		const products = await Product.find({ endTime: { $gt: now } })
			.populate('category', 'name')
			.populate('highestBidder', 'name')
			.sort({ endTime: 1 })
			.skip((Number(page) - 1) * Number(limit))
			.limit(Number(limit))
			.lean()

		const total = await Product.countDocuments({ endTime: { $gt: now } })

		res.json({
			products: products.map(mapDocToDTO),
			total,
			page: Number(page),
			totalPages: Math.ceil(total / Number(limit)),
		})
	} catch (error: any) {
		res.status(500).json({ error: error.message || 'Server error' })
	}
})

// GET /api/products/most-bids
router.get('/most-bids', async (req: Request, res: Response) => {
	try {
		const { page = 1, limit = 20 } = req.query

		const products = await Product.find()
			.populate('category', 'name')
			.populate('highestBidder', 'name')
			.sort({ bidCount: -1 })
			.skip((Number(page) - 1) * Number(limit))
			.limit(Number(limit))
			.lean()

		const total = await Product.countDocuments()

		res.json({
			products: products.map(mapDocToDTO),
			total,
			page: Number(page),
			totalPages: Math.ceil(total / Number(limit)),
		})
	} catch (error: any) {
		res.status(500).json({ error: error.message || 'Server error' })
	}
})

// GET /api/products/highest-price
router.get('/highest-price', async (req: Request, res: Response) => {
	try {
		const { page = 1, limit = 20 } = req.query

		const products = await Product.find()
			.populate('category', 'name')
			.populate('highestBidder', 'name')
			.sort({ currentPrice: -1 })
			.skip((Number(page) - 1) * Number(limit))
			.limit(Number(limit))
			.lean()

		const total = await Product.countDocuments()

		res.json({
			products: products.map(mapDocToDTO),
			total,
			page: Number(page),
			totalPages: Math.ceil(total / Number(limit)),
		})
	} catch (error: any) {
		res.status(500).json({ error: error.message || 'Server error' })
	}
})

// GET /api/products/by-category/:categoryName
router.get(
	'/by-category/:categoryName',
	async (req: Request, res: Response) => {
		try {
			const { categoryName } = req.params

			if (!categoryName) {
				return res
					.status(400)
					.json({ error: 'Category name is required.' })
			}

			const decodedName = decodeURIComponent(categoryName)

			const category = await Category.findOne({
				name: decodedName,
			}).lean()

			if (!category) {
				return res.status(404).json({
					error: 'Category not found.',
					categoryName: decodedName,
				})
			}

			const products = await Product.find({ category: category._id })
				.populate('category', 'name')
				.populate('highestBidder', 'name')
				.sort({ endTime: 1 })
				.lean()

			return res.json({
				products: products.map(mapDocToDTO),
				categoryName: decodedName,
			})
		} catch (error: any) {
			return res.status(500).json({
				error:
					error.message ||
					'Could not fetch products by category name.',
			})
		}
	}
)

// POST /api/products
router.post(
	'/',
	Auth,
	checkRole(ROLES.Seller, ROLES.Admin),
	async (req: Request, res: Response) => {
		try {
			const {
				name,
				description,
				categoryId,
				images,
				startPrice,
				priceStep,
				currentPrice,
				buyNowPrice,
				endTime,
				autoExtend,
			} = req.body

			if (
				!name ||
				!description ||
				!categoryId ||
				!images?.length ||
				!startPrice ||
				!priceStep ||
				!currentPrice ||
				!endTime
			) {
				return res
					.status(400)
					.json({ error: 'Missing required fields.' })
			}

			const sellerId = (req.user as any)._id

			const product = await Product.create({
				name,
				description,
				category: categoryId,
				seller: sellerId,
				images,
				startPrice,
				priceStep,
				currentPrice,
				buyNowPrice,
				endTime: new Date(endTime),
				autoExtend: autoExtend ?? false,
				isSold: false,
			})

			return res.status(201).json(product)
		} catch (error: any) {
			return res
				.status(500)
				.json({ error: error.message || 'Could not create product.' })
		}
	}
)

export default router
