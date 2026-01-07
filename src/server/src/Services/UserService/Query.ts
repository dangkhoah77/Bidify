import { ROLE, UPGRADE_REQUEST_STATUS } from 'Shared/Data/Constants/index.js'

import User from 'Server/Models/User/index.js'
import Product from 'Server/Models/Product/index.js'
import Bid from 'Server/Models/Bid/index.js'

/**
 * Update user's watchlist by adding or removing a product.
 *
 * @param userId - The ID of the user
 * @param productId - The ID of the product
 * @param action - 'action' can be 'add' or 'remove'
 * @return The updated UserDocument
 */
export const UpdateUserWatchlist = (
	userId: string,
	productId: string,
	action: 'add' | 'remove'
) => {
	const updateQuery =
		action === 'add'
			? { $addToSet: { watchlist: productId } }
			: { $pull: { watchlist: productId } }

	return User.findByIdAndUpdate(userId, updateQuery, { new: true })
}

/**
 * Get products that a bidder has placed bids on.
 *
 * @param userId - The ID of the user
 * @return List of products the user has bid on
 */
export const FindProductsByBidder = async (userId: string) => {
	const distinctProductIds = await Bid.where('bidder', userId)
		.where('latest', true)
		.select('product')
		.find()
		.then((bids) => bids.map((bid) => bid.product))
	return Product.where('_id').in(distinctProductIds).find()
}

/**
 * Find products won by a user.
 *
 * @param userId - The ID of the user
 * @return List of products won by the user
 */
export const FindProductsWonByBidder = (userId: string) => {
	return Product.where('winner', userId).find()
}

/**
 * Finds users with expired Seller roles and downgrades them to Bidder role.
 *
 * @returns The result of the update operation.
 */
export const RemoveSellerRoleFromExpiredUsers = async () => {
	return User.where('role', ROLE.Seller).updateMany(
		{ sellerRoleExpires: { $lt: new Date() } },
		{
			$set: {
				role: ROLE.Bidder,
				upgradeRequestStatus: UPGRADE_REQUEST_STATUS.None,
			},
			$unset: { sellerRoleExpires: '' },
		}
	)
}
