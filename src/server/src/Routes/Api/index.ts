// server/src/Routes/Api/index.ts
import express from 'express'
import authRoutes from './Auth/index.js'
import productRoutes from './Product.js'
import categoryRoutes from './Category.js'
import bidRoutes from './Bid.js'
import watchlistRoutes from './Watchlist.js'
// import userRoutes from './User.js' // To be implemented in Phase 3
// import reviewRoutes from './Review.js' // To be implemented in Phase 3

const router = express.Router()

// Mount routes
router.use('/auth', authRoutes)
router.use('/products', productRoutes)
router.use('/categories', categoryRoutes)
router.use('/bids', bidRoutes)
router.use('/watchlist', watchlistRoutes)

// Placeholders for Phase 3
// router.use('/users', userRoutes)
// router.use('/reviews', reviewRoutes)

export default router