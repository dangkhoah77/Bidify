// import express, { Request, Response } from 'express'
// import { Document } from 'mongoose'
// import multer from 'multer'

// import Product from 'Models/Product.js'
// import Auth from 'Middleware/Auth.js'
// import Role from 'Middleware/Role.js'
// import S3Upload from 'Utility/Storage.js'

// /** Router for product-related API routes */
// const router = express.Router()

// // Configure multer for file uploads
// const storage = multer.memoryStorage()
// const upload = multer({ storage })

// /**
//  * Fetch product slug api
//  * Returns product details based on the provided slug.
//  *
//  * @route GET /item/:slug
//  */
// router.get('/item/:slug', async (req: Request, res: Response) => {
// 	try {
// 		const slug = req.params.slug

// 		// Find the product by slug and ensure it is active
// 		const productDoc = await Product.findOne({
// 			slug: slug,
// 			isActive: true,
// 		}).populate({
// 			path: 'seller',
// 			select: 'isActive',
// 		})

// 		// Check if the seller is active
// 		const seller = productDoc?.seller as any
// 		const hasNoSeller = seller === null || seller.isActive === false

// 		// If no product found or seller is inactive, return 404
// 		if (!productDoc || hasNoSeller) {
// 			return res.status(404).json({
// 				message: 'No product found.',
// 			})
// 		}

// 		// Return the product details
// 		res.status(200).json({
// 			product: productDoc,
// 		})
// 	} catch (error: any) {
// 		res.status(400).json({
// 			error:
// 				error.message ||
// 				'Your request could not be processed. Please try again.',
// 		})
// 	}
// })

// router.get('/list/search/:name', async (req: Request, res: Response) => {
// 	try {
// 		const name = req.params.name

// 		const productDoc = await Product.find(
// 			{
// 				name: { $regex: new RegExp(name), $options: 'is' },
// 				isActive: true,
// 			},
// 			{ name: 1, slug: 1, imageUrl: 1, price: 1, _id: 0 }
// 		)

// 		if (productDoc.length < 0) {
// 			return res.status(404).json({
// 				message: 'No product found.',
// 			})
// 		}

// 		res.status(200).json({
// 			products: productDoc,
// 		})
// 	} catch (error) {
// 		res.status(400).json({
// 			error: 'Your request could not be processed. Please try again.',
// 		})
// 	}
// })
