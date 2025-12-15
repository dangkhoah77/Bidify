import express, { Request, Response } from 'express'
import mongoose from 'mongoose'
import { body } from 'express-validator'
import chalk from 'chalk'

import Auth from 'Server/Middleware/Auth.js'
import Validate from 'Server/Middleware/Validate.js'
import Product, { IProduct } from 'Server/Models/Product.js'
import Bid from 'Server/Models/Bid.js'
import { IUser } from 'Server/Models/User.js'
import { handleBid } from 'Server/Utility/Bid.js'

const router = express.Router()

/**
 * Register the user from bidding on a product.
 * If the bid meets or exceeds the Buy Now price, the product is sold immediately.
 *
 * @route POST /api/bid/register
 */
router.post(
	'/register',
	Auth,
	Validate([
		body('productId').notEmpty().withMessage('product Id is required'),
		body('price')
			.notEmpty()
			.isNumeric()
			.withMessage('price must be a number'),
		body('maxPrice')
			.notEmpty()
			.isNumeric()
			.withMessage('max price must be a number')
			.custom((value, { req }) => {
				if (parseFloat(value) < parseFloat(req.body.price)) {
					throw new Error(
						'Max Price cannot be lower than the starting Bid Price'
					)
				}
				return true
			}),
	]),
	async (req: Request, res: Response) => {
		try {
			const { productId, price, maxPrice } = req.body

			// Get user from auth and product by its id
			const user = req.user as IUser
			const userId = user._id as mongoose.Types.ObjectId
			const product = (await Product.findById(productId)) as IProduct

			// Check if product exists
			if (!product) {
				return res.status(404).json({ error: 'Product not found' })
			}

			// Validate product state
			if (!product.isActive || new Date() >= product.endTime) {
				return res
					.status(400)
					.json({ error: 'Product is not active for bidding' })
			}

			// Prevent seller from bidding on own product
			if (product.seller.toString() == userId.toString()) {
				return res
					.status(400)
					.json({ error: 'You cannot bid on your own product' })
			}

			// Validate bid price
			if (price < product.currentPrice + product.priceStep) {
				return res.status(400).json({
					error: `Bid price must be ${product.currentPrice + product.priceStep} at minimum`,
				})
			}

			// Create a session for placing bif safely
			const session = await mongoose.startSession()
			session.startTransaction()

			try {
				// Create a new bid
				const bid = new Bid({
					product: product._id,
					bidder: userId,
					price: price,
					maxPrice: maxPrice,
					joinedAt: new Date(),
					latest: true,
				}).save({ session })

				// Handle the bid logic
				const updatedProduct = await handleBid(product, userId, price, {
					session,
				})
				await session.commitTransaction()

				// Check if the bid resulted in an immediate purchase
				if (
					!updatedProduct.isActive &&
					updatedProduct.winner?.toString() == userId.toString()
				) {
					return res.status(200).json({
						success: true,
						message: 'Item purchased via Buy Now',
						data: { product: updatedProduct, bid: bid },
					})
				}

				return res.status(200).json({
					success: true,
					message: 'Bid registered successfully',
					data: { bid: bid },
				})
			} catch (error) {
				await session.abortTransaction()
				throw error
			} finally {
				await session.endSession()
			}
		} catch (error) {
			console.log(
				`${chalk.red('[Error]')} Bid Registration Error:`,
				error
			)
			return res.status(400).json({ error: 'Failed to register bid' })
		} finally {
		}
	}
)

/**
 * Unregister the user from bidding on a product.
 *
 * @route POST /api/bid/unregister
 */
router.post(
	'/unregister',
	Auth,
	Validate([
		body('productId').notEmpty().withMessage('product ID is required'),
	]),
	async (req: Request, res: Response) => {
		try {
			const { productId } = req.body
			const user = req.user as IUser
			const userId = user._id as mongoose.Types.ObjectId

			// Get the latest bid by the user on the product
			const bid = await Bid.findOne({
				product: productId,
				bidder: userId,
				latest: true,
			})

			// If no active bid found, return error
			if (!bid) {
				return res
					.status(404)
					.json({ error: 'No active bid found to unregister' })
			}

			// Start a transaction for safe bid unregistration
			const session = await mongoose.startSession()
			session.startTransaction()

			try {
				// Mark the bid as not latest
				bid.latest = false
				await bid.save({ session })
				await session.commitTransaction()

				return res.status(200).json({
					success: true,
					message: 'Bid unregistered successfully.',
				})
			} catch (error) {
				await session.abortTransaction()
				throw error
			} finally {
				await session.endSession()
			}
		} catch (error) {
			console.log(error)
			return res.status(500).json({ error: 'Failed to unregister bid' })
		}
	}
)

export default router
