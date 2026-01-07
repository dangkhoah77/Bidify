import express, { Request, Response } from 'express'

import { UsersQueryParams } from 'Shared/Data/Types/index.js'
import { ROLE } from 'Shared/Data/Constants/index.js'

import Auth from 'Server/Middleware/Auth.js'
import Role from 'Server/Middleware/Role.js'
import Validate from 'Server/Middleware/Validate.js'
import Deduplicate from 'Server/Middleware/Deduplicate.js'
import Handler from 'Server/Middleware/Handler.js'

import { UserDocument } from 'Server/Models/User/index.js'

import {
	// Handlers
	ToggleWatchlist,
	GetBiddingList,
	GetWonList,
	RequestSellerUpgrade,
	ApproveSellerUpgrade,
	ListUsers,
	ListUsersRequestingSellerUpgrade,
	DeleteUser,

	// Validations
	ValidateUserId,
	ValidateProductId,
	ValidateUserListingParams,
} from 'Server/Services/UserService/index.js'

/** Express router for user-related API endpoints. */
const router = express.Router()

/**
 * Toggle a product in the user's watchlist.
 *
 * @route POST /api/user/watchlist/:productId
 */
router.post(
	'/watchlist/:productId',
	Auth,
	Validate([ValidateProductId('productId')]),
	Deduplicate,
	Handler(async (req: Request, res: Response) => {
		const user = req.user as UserDocument
		const { productId } = req.params

		const result = await ToggleWatchlist(user, productId)
		return res.status(result.status).json(result.data)
	})
)

/**
 * Get the list of products the user is currently bidding on.
 *
 * @route GET /api/user/bidding
 */
router.get(
	'/bidding',
	Auth,
	Handler(async (req: Request, res: Response) => {
		const user = req.user as UserDocument

		const result = await GetBiddingList(user)
		return res.status(result.status).json(result.data)
	})
)

/**
 * Get the list of products the user has won.
 *
 * @route GET /api/user/won
 */
router.get(
	'/won',
	Auth,
	Handler(async (req: Request, res: Response) => {
		const user = req.user as UserDocument

		const result = await GetWonList(user)
		return res.status(result.status).json(result.data)
	})
)

/**
 * Request an upgrade to seller role.
 *
 * @route POST /api/user/upgrade
 */
router.post(
	'/upgrade',
	Auth,
	Deduplicate,
	Handler(async (req: Request, res: Response) => {
		const user = req.user as UserDocument

		const result = await RequestSellerUpgrade(user)
		return res.status(result.status).json(result.data)
	})
)

/**
 * Approve a user's upgrade request.
 *
 * @route PATCH /api/user/:id/upgrade
 */
router.patch(
	'/:id/upgrade',
	Auth,
	Role(ROLE.Admin),
	Validate([ValidateUserId('id')]),
	Handler(async (req: Request, res: Response) => {
		const userId = req.params.id

		const result = await ApproveSellerUpgrade(userId)
		return res.status(result.status).json(result.data)
	})
)

/**
 * Get list of all users.
 *
 * @route GET /api/user
 */
router.get(
	'/',
	Auth,
	Role(ROLE.Admin),
	Validate(ValidateUserListingParams()),
	Handler(async (req: Request, res: Response) => {
		const { page, limit } = req.query as unknown as UsersQueryParams

		const result = await ListUsers(page, limit)
		return res.status(result.status).json(result.data)
	})
)

/**
 * Get list of all users requesting seller upgrade.
 *
 * @route GET /api/user/upgrade/requests
 */
router.get(
	'/requests',
	Auth,
	Role(ROLE.Admin),
	Handler(async (req: Request, res: Response) => {
		const { page, limit } = req.query as unknown as UsersQueryParams

		const result = await ListUsersRequestingSellerUpgrade(page, limit)
		return res.status(result.status).json(result.data)
	})
)

/**
 * Delete a user.
 *
 * @route DELETE /api/user/:id
 */
router.delete(
	'/:id',
	Auth,
	Role(ROLE.Admin),
	Validate([ValidateUserId('id')]),
	Handler(async (req: Request, res: Response) => {
		const user = req.user as UserDocument
		const targetUserId = req.params.id

		const result = await DeleteUser(user, targetUserId)
		return res.status(result.status).json(result.data)
	})
)

export default router
