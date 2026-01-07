import ms from 'ms'

import {
	ApiResponseData,
	UserListingResponseData,
	BiddingListResponseData,
} from 'Shared/Data/Types/index.js'
import { ROLE, UPGRADE_REQUEST_STATUS } from 'Shared/Data/Constants/index.js'

import Keys from 'Server/Config/Keys.js'

import User, { UserDocument } from 'Server/Models/User/index.js'
import Product from 'Server/Models/Product/index.js'

import {
	UpdateUserWatchlist,
	FindProductsByBidder,
	FindProductsWonByBidder,
} from './Query.js'
import {
	FindVerifiedUserById,
	FindVerifiedUsers,
	CountVerifiedUsers,
	DeleteUserById,
} from 'Server/Services/AuthService/Query.js'
import { ProductExistsById } from 'Server/Services/ProductService/Query.js'

/**
 * Add or remove a product from user's watchlist.
 *
 * @param user - The current user
 * @param productId - The ID of the product to toggle
 * @return The status and result data of the operation
 */
export const ToggleWatchlist = async (
	user: UserDocument,
	productId: string
): Promise<{ status: number; data: ApiResponseData }> => {
	// Verify product exists
	const productExists = await ProductExistsById(productId)
	if (!productExists) {
		return {
			status: 404,
			data: { success: false, message: 'Sản phẩm không tồn tại.' },
		}
	}

	// Check if product is already in watchlist
	const isInWatchlist = user.watchlist.some(
		(p: any) => p.toString() == productId || p._id?.toString() == productId
	)

	// Update watchlist with appropriate action
	const action = isInWatchlist ? 'remove' : 'add'
	await UpdateUserWatchlist(user.id, productId, action)

	return {
		status: 200,
		data: {
			success: true,
			message:
				action === 'add'
					? 'Đã thêm vào danh sách yêu thích.'
					: 'Đã xóa khỏi danh sách yêu thích.',
		},
	}
}

/**
 * Get the list of products the user is currently bidding on.
 *
 * @param user - The current user
 * @return The status and result data containing the bidding list
 */
export const GetBiddingList = async (
	user: UserDocument
): Promise<{ status: number; data: BiddingListResponseData }> => {
	const products = await FindProductsByBidder(user.id)
	const productDtos = await Promise.all(products.map((p) => Product.toDto(p)))

	return {
		status: 200,
		data: {
			success: true,
			message: 'Lấy danh sách đang đấu giá thành công.',
			data: { products: productDtos },
		},
	}
}

/**
 * Get the list of products the user has won.
 *
 * @param user - The current user
 * @return The status and result data containing the won list
 */
export const GetWonList = async (
	user: UserDocument
): Promise<{ status: number; data: BiddingListResponseData }> => {
	const products = await FindProductsWonByBidder(user.id)
	const productDtos = await Promise.all(products.map((p) => Product.toDto(p)))

	return {
		status: 200,
		data: {
			success: true,
			message: 'Lấy danh sách đã thắng thành công.',
			data: { products: productDtos },
		},
	}
}

/**
 * Request an upgrade to Seller role.
 *
 * @param user - The current user
 * @return The status and result data of the operation
 */
export const RequestSellerUpgrade = async (
	user: UserDocument
): Promise<{ status: number; data: ApiResponseData }> => {
	// Check if there's an existing pending request
	if (user.upgradeRequestStatus == UPGRADE_REQUEST_STATUS.Pending) {
		return {
			status: 400,
			data: {
				success: false,
				message: 'Yêu cầu của bạn đang chờ duyệt.',
			},
		}
	}

	// Check if user is no longer a Bidder
	if (user.role != ROLE.Bidder) {
		return {
			status: 400,
			data: {
				success: false,
				message: 'Tài khoản của bạn đã là Seller.',
			},
		}
	}

	// Create upgrade request
	user.upgradeRequestStatus = UPGRADE_REQUEST_STATUS.Pending
	user.sellerRoleExpires = new Date(Date.now() + ms(Keys.sellerRoleLife))
	await user.save()

	return {
		status: 200,
		data: {
			success: true,
			message:
				'Gửi yêu cầu nâng cấp thành công. Vui lòng chờ Admin duyệt.',
		},
	}
}

/**
 * Approve a seller upgrade request.
 *
 * @param userId - The ID of the user to approve
 */
export const ApproveSellerUpgrade = async (
	userId: string
): Promise<{ status: number; data: ApiResponseData }> => {
	const targetUser = await FindVerifiedUserById(userId)
	if (!targetUser) {
		return {
			status: 404,
			data: { success: false, message: 'Người dùng không tồn tại.' },
		}
	}

	// Check if there's a pending upgrade request
	if (targetUser.upgradeRequestStatus !== UPGRADE_REQUEST_STATUS.Pending) {
		return {
			status: 400,
			data: {
				success: false,
				message: 'Người dùng không có yêu cầu nâng cấp đang chờ.',
			},
		}
	}

	// Upgrade user to Seller and set expiry
	targetUser.role = ROLE.Seller
	targetUser.upgradeRequestStatus = UPGRADE_REQUEST_STATUS.Approved
	targetUser.sellerRoleExpires = new Date(
		Date.now() + ms(Keys.sellerRoleLife)
	)
	await targetUser.save()

	return {
		status: 200,
		data: {
			success: true,
			message: 'Đã duyệt yêu cầu nâng cấp thành Seller.',
		},
	}
}

/**
 * Get list of all users.
 *
 * @param page - The page number for pagination
 * @param limit - The number of users per page
 * @return The status and result data containing the list of users
 */
export const ListUsers = async (
	page: number,
	limit: number
): Promise<{ status: number; data: UserListingResponseData }> => {
	const skip = (page - 1) * limit
	const [users, total] = await Promise.all([
		FindVerifiedUsers(skip, limit),
		CountVerifiedUsers(),
	])

	const userDtos = await Promise.all(users.map((u) => User.toDto(u)))

	return {
		status: 200,
		data: {
			success: true,
			message: 'Lấy danh sách người dùng thành công.',
			data: {
				users: userDtos,
				pagination: {
					page,
					limit,
					total,
					totalPages: Math.ceil(total / limit),
				},
			},
		},
	}
}

export const ListUsersRequestingSellerUpgrade = async (
	page: number,
	limit: number
): Promise<{ status: number; data: UserListingResponseData }> => {
	const skip = (page - 1) * limit
	const filter = { upgradeRequestStatus: UPGRADE_REQUEST_STATUS.Pending }
	const [users, total] = await Promise.all([
		FindVerifiedUsers(skip, limit, filter),
		CountVerifiedUsers(filter),
	])

	const userDtos = await Promise.all(users.map((u) => User.toDto(u)))

	return {
		status: 200,
		data: {
			success: true,
			message: 'Lấy danh sách người dùng yêu cầu nâng cấp thành công.',
			data: {
				users: userDtos,
				pagination: {
					page,
					limit,
					total,
					totalPages: Math.ceil(total / limit),
				},
			},
		},
	}
}

/**
 * Admin: Delete a user.
 */
export const DeleteUser = async (
	user: UserDocument,
	userId: string
): Promise<{ status: number; data: ApiResponseData }> => {
	// Preven self-deleting
	if (user.id == userId) {
		return {
			status: 400,
			data: { success: false, message: 'Bạn không thể xóa chính mình.' },
		}
	}

	// Verify target user exists
	const targetUser = await FindVerifiedUserById(userId)
	if (!targetUser) {
		return {
			status: 404,
			data: { success: false, message: 'Người dùng không tồn tại.' },
		}
	}

	await DeleteUserById(userId)

	return {
		status: 200,
		data: {
			success: true,
			message: 'Xóa người dùng thành công.',
		},
	}
}
