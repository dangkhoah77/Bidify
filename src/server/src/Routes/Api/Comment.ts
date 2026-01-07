import express, { Request, Response } from 'express'

import Auth from 'Server/Middleware/Auth.js'
import Validate from 'Server/Middleware/Validate.js'
import Handler from 'Server/Middleware/Handler.js'

import { UserDocument } from 'Server/Models/User/index.js'

import {
	// Handlers
	PostComment,
	ReplyComment,
	GetProductComments,

	// Validatiors
	ValidateCreateComment,
	ValidateReplyComment,
} from 'Server/Services/CommentService/index.js'

/** Express Router for Comment API Endpoints */
const router = express.Router()

/**
 * Get comments for a product.
 *
 * @route GET /api/comment/:productId
 */
router.get(
	'/:productId',
	Handler(async (req: Request, res: Response) => {
		const result = await GetProductComments(req.params.productId)
		return res.status(result.status).json(result.data)
	})
)

/**
 * Post a new question (comment) for a product.
 *
 * @route POST /api/comment/:productId
 */
router.post(
	'/:productId',
	Auth,
	Validate(ValidateCreateComment()),
	Handler(async (req: Request, res: Response) => {
		const user = req.user as UserDocument
		const productId = req.params.productId
		const { text } = req.body

		const result = await PostComment(user, productId, text)
		return res.status(result.status).json(result.data)
	})
)

/**
 * Reply to a question.
 *
 * @route POST /api/comment/:commentId/reply
 */
router.post(
	'/:commentId/reply',
	Auth,
	Validate(ValidateReplyComment()),
	Handler(async (req: Request, res: Response) => {
		const user = req.user as UserDocument
		const commentId = req.params.commentId
		const { text } = req.body

		const result = await ReplyComment(user, commentId, text)
		return res.status(result.status).json(result.data)
	})
)

export default router
