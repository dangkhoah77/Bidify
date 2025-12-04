import express, { Request, Response } from 'express'
import User from '../../Models/User.js'
import Product from '../../Models/Product.js'
import Auth from '../../Middleware/Auth.js'

const router = express.Router()

/**
 * GET /api/watchlist
 * Get current user's watchlist
 */
router.get('/', Auth, async (req: Request, res: Response) => {
	try {
		const userId = (req.user as any)._id

		const user = await User.findById(userId)
			.populate({
				path: 'watchlist',
				model: 'Product',
			})
			.lean()

		if (!user) {
			return res.status(404).json({ error: 'User not found.' })
		}

		// Map products to DTO format
		const watchlist = (user.watchlist as any[]).map((product) => ({
			_id: product._id.toString(),
			name: product.name,
			description: product.description,
			images: product.images,
			startPrice: product.startPrice,
			priceStep: product.priceStep,
			currentPrice: product.currentPrice,
			buyNowPrice: product.buyNowPrice,
			endTime: product.endTime.toISOString(),
			bidCount: product.bidCount ?? 0,
			isNew: false,
		}))

		return res.json({
			watchlist,
			count: watchlist.length,
		})
	} catch (error: any) {
		console.error('Get watchlist error:', error)
		return res.status(500).json({
			error: error.message || 'Failed to get watchlist.',
		})
	}
})

/**
 * POST /api/watchlist/:productId
 * Add product to watchlist
 */
router.post('/:productId', Auth, async (req: Request, res: Response) => {
	try {
		const userId = (req.user as any)._id
		const { productId } = req.params

		// Check if product exists
		const product = await Product.findById(productId)
		if (!product) {
			return res.status(404).json({ error: 'Product not found.' })
		}

		// Add to watchlist if not already there
		const user = await User.findById(userId)
		if (!user) {
			return res.status(404).json({ error: 'User not found.' })
		}

		if (user.watchlist.includes(productId as any)) {
			return res.status(400).json({
				error: 'Product already in watchlist.',
			})
		}

		user.watchlist.push(productId as any)
		await user.save()

		return res.json({
			success: true,
			message: 'Product added to watchlist.',
			watchlistCount: user.watchlist.length,
		})
	} catch (error: any) {
		console.error('Add to watchlist error:', error)
		return res.status(500).json({
			error: error.message || 'Failed to add to watchlist.',
		})
	}
})

/**
 * DELETE /api/watchlist/:productId
 * Remove product from watchlist
 */
router.delete('/:productId', Auth, async (req: Request, res: Response) => {
	try {
		const userId = (req.user as any)._id
		const { productId } = req.params

		const user = await User.findById(userId)
		if (!user) {
			return res.status(404).json({ error: 'User not found.' })
		}

		// Remove from watchlist
		user.watchlist = user.watchlist.filter(
			(id) => id.toString() !== productId
		)
		await user.save()

		return res.json({
			success: true,
			message: 'Product removed from watchlist.',
			watchlistCount: user.watchlist.length,
		})
	} catch (error: any) {
		console.error('Remove from watchlist error:', error)
		return res.status(500).json({
			error: error.message || 'Failed to remove from watchlist.',
		})
	}
})

/**
 * GET /api/watchlist/check/:productId
 * Check if product is in watchlist
 */
router.get('/check/:productId', Auth, async (req: Request, res: Response) => {
	try {
		const userId = (req.user as any)._id
		const { productId } = req.params

		const user = await User.findById(userId).lean()
		if (!user) {
			return res.status(404).json({ error: 'User not found.' })
		}

		const isInWatchlist = user.watchlist.some(
			(id) => id.toString() === productId
		)

		return res.json({
			isInWatchlist,
			productId,
		})
	} catch (error: any) {
		console.error('Check watchlist error:', error)
		return res.status(500).json({
			error: error.message || 'Failed to check watchlist.',
		})
	}
})

export default router
