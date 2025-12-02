import express, { Request, Response } from 'express'
import Product from '../../Models/Product.js'
import Category from '../../Models/Category.js'
import Auth from '../../Middleware/Auth.js'
import { ROLES } from '../../Data/Constants/index.js'
import { check as checkRole } from '../../Middleware/Role.js'

const router = express.Router()

// Định nghĩa kiểu Product trả về
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

// Kiểu response cho trang Home
export type HomeProductsResponse = {
	endingSoon: ProductDTO[]
	mostBids: ProductDTO[]
	highestPrice: ProductDTO[]
}

// GET /api/products/home
router.get(
	'/home',
	async (
		req: Request,
		res: Response<HomeProductsResponse | { error: string }>
	) => {
		try {
			const now = new Date()

			const endingSoonDocs = await Product.find({ endTime: { $gt: now } })
				.sort({ endTime: 1 })
				.limit(5)
				.lean()

			const mostBidsDocs = await Product.find()
				.sort({ bidCount: -1 })
				.limit(5)
				.lean()

			const highestPriceDocs = await Product.find()
				.sort({ currentPrice: -1 })
				.limit(5)
				.lean()

			const mapDoc = (doc: any): ProductDTO => ({
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
			})

			res.json({
				endingSoon: endingSoonDocs.map(mapDoc),
				mostBids: mostBidsDocs.map(mapDoc),
				highestPrice: highestPriceDocs.map(mapDoc),
			})
		} catch (error: any) {
			res.status(500).json({ error: error.message || 'Server error' })
		}
	}
)

// POST /api/products
// Tạo sản phẩm mới – yêu cầu đăng nhập và role Seller hoặc Admin
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

// GET /api/products/by-category/:categoryName
// Lấy sản phẩm theo tên category
router.get(
	'/by-category/:categoryName',
	async (req: Request, res: Response) => {
		try {
			const { categoryName } = req.params

			if (!categoryName) {
				return res.status(400).json({
					error: 'Category name is required.',
				})
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

			const products = await Product.find({
				category: category._id,
			})
				.sort({ endTime: 1 })
				.lean()

			const mapDoc = (doc: any): ProductDTO => ({
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
				categoryName: decodedName,
				highestBidderName: 'Ẩn danh',
				isNew: false,
			})

			return res.json({
				products: products.map(mapDoc),
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

export default router
