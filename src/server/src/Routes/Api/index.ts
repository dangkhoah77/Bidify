import express from 'express'
import authRoutes from './Auth.js'
import userRoutes from './User.js'
import categoryRoutes from './Category.js'
import productRoutes from './Product.js'
import bidRoutes from './Bid.js'
import commentRoutes from './Comment.js'
import reviewRoutes from './Review.js'

const router = express.Router()

// Mount routes
router.use('/auth', authRoutes)
router.use('/user', userRoutes)
router.use('/category', categoryRoutes)
router.use('/product', productRoutes)
router.use('/bids', bidRoutes)
router.use('/comment', commentRoutes)
router.use('/review', reviewRoutes)

export default router
