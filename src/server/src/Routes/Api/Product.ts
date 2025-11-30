import express, { Request, Response } from 'express'
import Product from '../../Models/Product.js'
import Auth from '../../Middleware/Auth.js'
import { ROLES } from '../../Data/Constants/index.js'
import { check as checkRole } from '../../Middleware/Role.js'

const router = express.Router()

// Định nghĩa kiểu Product trả về (tối thiểu các field bạn dùng trên UI)
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
	// thêm bidCount nếu bạn muốn
	bidCount?: number
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
				.sort({ bidCount: -1 }) // nếu chưa có field bidCount thì tạm giữ, sau chỉnh
				.limit(5)
				.lean()

			const highestPriceDocs = await Product.find()
				.sort({ currentPrice: -1 })
				.limit(5)
				.lean()

			// ép sang DTO (chủ yếu để đảm bảo type)
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

export default router
