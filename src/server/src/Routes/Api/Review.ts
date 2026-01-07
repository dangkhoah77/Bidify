import express, { Request, Response } from 'express'

import Auth from 'Server/Middleware/Auth.js'
import Validate from 'Server/Middleware/Validate.js'
import Handler from 'Server/Middleware/Handler.js'

import { UserDocument } from 'Server/Models/User/index.js'

import {
	PostReview,
	ValidateCreateReview,
} from 'Server/Services/ReviewService/index.js'

/** Express router for review-related API endpoints */
const router = express.Router()

/**
 * Post a review for a transaction.
 *
 * @route POST /api/review/:productId
 */
router.post(
	'/:productId',
	Auth,
	Validate(ValidateCreateReview()),
	Handler(async (req: Request, res: Response) => {
		const user = req.user as UserDocument
		const productId = req.params.productId
		const { rating, text } = req.body

		const result = await PostReview(user, productId, rating, text)
		return res.status(result.status).json(result.data)
	})
)

export default router
