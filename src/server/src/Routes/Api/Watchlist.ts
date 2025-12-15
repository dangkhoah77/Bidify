import express, { Request, Response } from 'express'
import User from '../../Models/User.js'
import Product from '../../Models/Product.js'
import Auth from '../../Middleware/Auth.js'
import { Types } from 'mongoose'

const router = express.Router()

// Helper interface for the populated data structure
interface PopulatedProduct {
    _id: Types.ObjectId
    name: string
    description: string
    images: string[]
    startPrice: number
    priceStep: number
    currentPrice: number
    buyNowPrice: number
    endTime: Date
    bidCount: number
    category?: { name: string }
    highestBidder?: { firstName: string; lastName: string }
}

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
                populate: [
                    {
                        path: 'category',
                        model: 'Category',
                        select: 'name',
                    },
                    {
                        path: 'highestBidder',
                        model: 'User',
                        select: 'firstName lastName',
                    },
                ],
            })
            .lean()

        if (!user) {
            return res.status(404).json({ error: 'User not found.' })
        }

        // Safe casting since we know we populated it
        const watchlistItems = (user.watchlist || []) as unknown as PopulatedProduct[]

        const watchlist = watchlistItems.map((product) => ({
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
            categoryName: product.category?.name || 'Chưa phân loại',
            highestBidderName: product.highestBidder
                ? `****${product.highestBidder.lastName || product.highestBidder.firstName || ''}`
                : 'Chưa có',
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
 * Add product to watchlist (Using $addToSet for uniqueness)
 */
router.post('/:productId', Auth, async (req: Request, res: Response) => {
    try {
        const userId = (req.user as any)._id
        const { productId } = req.params

        // 1. Verify Product Exists
        const productExists = await Product.exists({ _id: productId })
        if (!productExists) {
            return res.status(404).json({ error: 'Product not found.' })
        }

        // 2. Atomic Update: Add to set (prevents duplicates automatically)
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $addToSet: { watchlist: productId } },
            { new: true } // Return the updated document to get the new count
        )

        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found.' })
        }

        console.log(`[Watchlist] Added ${productId}. New count: ${updatedUser.watchlist.length}`)

        return res.json({
            success: true,
            message: 'Product added to watchlist.',
            watchlistCount: updatedUser.watchlist.length,
        })
    } catch (error: any) {
        console.error('[Watchlist] Add error:', error)
        return res.status(500).json({
            error: error.message || 'Failed to add to watchlist.',
        })
    }
})

/**
 * DELETE /api/watchlist/:productId
 * Remove product from watchlist (Using $pull)
 */
router.delete('/:productId', Auth, async (req: Request, res: Response) => {
    try {
        const userId = (req.user as any)._id
        const { productId } = req.params

        // Atomic Update: Pull (remove) the item
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $pull: { watchlist: productId } },
            { new: true }
        )

        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found.' })
        }

        console.log(`[Watchlist] Removed ${productId}. New count: ${updatedUser.watchlist.length}`)

        return res.json({
            success: true,
            message: 'Product removed from watchlist.',
            watchlistCount: updatedUser.watchlist.length,
        })
    } catch (error: any) {
        console.error('[Watchlist] Remove error:', error)
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

        // Use countDocuments for a lighter query than finding the whole user
        const count = await User.countDocuments({
            _id: userId,
            watchlist: productId
        })

        return res.json({
            isInWatchlist: count > 0,
            productId,
        })
    } catch (error: any) {
        console.error('[Watchlist] Check error:', error)
        return res.status(500).json({
            error: error.message || 'Failed to check watchlist.',
        })
    }
})

export default router