import { ApiResponseData } from 'Shared/Data/Types/index.js'
import { RATING } from 'Shared/Data/Constants/index.js'

import User, { UserDocument } from 'Server/Models/User/index.js'
// import Product from 'Server/Models/Product/index.js'
// import Review from 'Server/Models/Review/index.js'

import {
	CreateReview,
	FindReviewByReviewerAndProduct,
	// FindReviewsReceivedByUser,
} from './Query.js'
import { FindProductById } from 'Server/Services/ProductService/Query.js'

/**
 * Post a review for a transaction (product).
 * Logic:
 * - If User is Winner -> Can review Seller.
 * - If User is Seller -> Can review Winner.
 * - Otherwise -> Error.
 *
 * @param user - The user posting the review
 * @param productId - ID of the product
 * @param rating - Rating (+1 or -1)
 * @param text - Review content
 */
export const PostReview = async (
	user: UserDocument,
	productId: string,
	rating: RATING,
	text: string
): Promise<{ status: number; data: ApiResponseData }> => {
	const product = await FindProductById(productId)
	if (!product) {
		return {
			status: 404,
			data: { success: false, message: 'Sản phẩm không tồn tại.' },
		}
	}

	// Ensure the product has a winner
	if (!product.winner) {
		return {
			status: 400,
			data: {
				success: false,
				message: 'Sản phẩm này chưa có người thắng cuộc.',
			},
		}
	}

	let reviewedUserId: string | undefined

	// Determine relationship
	if (user.id === product.winner.toString()) {
		// Winner reviewing Seller
		reviewedUserId = product.seller as string
	} else if (user.id === product.seller.toString()) {
		// Seller reviewing Winner
		reviewedUserId = product.winner as string
	} else {
		return {
			status: 403,
			data: {
				success: false,
				message:
					'Bạn không có quyền đánh giá giao dịch này (không phải người mua hoặc người bán).',
			},
		}
	}

	// Check if already reviewed
	const existingReview = await FindReviewByReviewerAndProduct(
		user.id,
		productId
	)
	if (existingReview) {
		// Update existing review
		existingReview.rating = rating
		existingReview.text = text
		await existingReview.save()

		return {
			status: 200,
			data: {
				success: true,
				message: 'Cập nhật đánh giá thành công.',
			},
		}
	}

	// Create new review
	const newReview = await CreateReview({
		product: productId,
		reviewer: user.id,
		reviewedUser: reviewedUserId,
		rating,
		text,
	})

	// Update users' review lists
	await User.findByIdAndUpdate(reviewedUserId, {
		$push: { reviewsReceived: newReview.id },
	})
	await User.findByIdAndUpdate(user.id, {
		$push: { reviewsWritten: newReview.id },
	})

	return {
		status: 201,
		data: {
			success: true,
			message: 'Đánh giá thành công.',
		},
	}
}
