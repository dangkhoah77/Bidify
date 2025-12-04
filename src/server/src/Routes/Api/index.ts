import authRoutes from './Auth.js'
import productRoutes from './Product.js'
import categoryRoutes from './Category.js'
import watchlistRoutes from './Watchlist.js'
/** Main API router that aggregates all API route modules */
import express from 'express'
const router = express.Router()

// Auth routes
router.use('/auth', authRoutes)
router.use('/products', productRoutes)
router.use('/categories', categoryRoutes)
router.use('/watchlist', watchlistRoutes)
export default router
