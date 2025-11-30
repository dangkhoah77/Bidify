import authRoutes from './Auth.js'
import productRoutes from './Product.js'
import categoryRoutes from './Category.js'
/** Main API router that aggregates all API route modules */
import express from 'express'
const router = express.Router()

// Auth routes
router.use('/auth', authRoutes)
router.use('/products', productRoutes)
router.use('/categories', categoryRoutes)
export default router
