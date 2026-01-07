import express, { Request, Response } from 'express'

import {
	BidRegisterRequestData,
	BidUnregisterRequestData,
	BidDenyRequestData,
} from 'Shared/Data/Types/index.js'
import { ROLE } from 'Shared/Data/Constants/index.js'

import { UserDocument } from 'Server/Models/User/index.js'

import Auth from 'Server/Middleware/Auth.js'
import Role from 'Server/Middleware/Role.js'
import Validate from 'Server/Middleware/Validate.js'
import Deduplicate from 'Server/Middleware/Deduplicate.js'
import Handler from 'Server/Middleware/Handler.js'

import {
	// Validations
	ValidateProductId,
	ValidateBidderId,
	ValidateMaxPrice,

	// Handlers
	PlaceBid,
	UnregisterBid,
	DenyBid,
} from 'Server/Services/BidService/index.js'

/** Router for bid-related routes */
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
	Validate([ValidateProductId('productId'), ValidateMaxPrice('maxPrice')]),
	Deduplicate,
	Handler(async (req: Request, res: Response) => {
		const user = req.user as UserDocument
		const { productId, maxPrice } = req.body as BidRegisterRequestData

		const result = await PlaceBid(user, productId, maxPrice)
		return res.status(result.status).json(result.data)
	})
)

/**
 * Unregister the user from bidding on a product.
 *
 * @route DELETE /api/bid/unregister
 */
router.delete(
	'/unregister',
	Auth,
	Validate([ValidateProductId('productId')]),
	Deduplicate,
	Handler(async (req: Request, res: Response) => {
		const user = req.user as UserDocument
		const { productId } = req.body as BidUnregisterRequestData

		const result = await UnregisterBid(user, productId)
		return res.status(result.status).json(result.data)
	})
)

/**
 * Deny a bid placed by a bidder on the seller's product.
 *
 * @route DELETE /api/bid/deny
 */
router.delete(
	'/deny',
	Auth,
	Role(ROLE.Seller),
	Validate([ValidateProductId('productId'), ValidateBidderId('bidderId')]),
	Deduplicate,
	async (req: Request, res: Response) => {
		const user = req.user as UserDocument
		const { productId, bidderId } = req.body as BidDenyRequestData

		const result = await DenyBid(user, productId, bidderId)
		return res.status(result.status).json(result.data)
	}
)

export default router
