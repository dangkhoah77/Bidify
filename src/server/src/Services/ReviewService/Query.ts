import Review, { IReview } from 'Server/Models/Review/index.js'

/**
 * Creates a new review in the database.
 *
 * @param reviewData - The data for the new review
 * @returns The created review document
 */
export const CreateReview = (reviewData: Partial<IReview>) => {
	return Review.create(reviewData)
}

/**
 * Finds a review by the reviewer for a specific product.
 * Used to check if a user has already reviewed a transaction.
 *
 * @param reviewerId - ID of the user writing the review
 * @param productId - ID of the product being reviewed
 * @returns The review document if found, null otherwise
 */
export const FindReviewByReviewerAndProduct = (
	reviewerId: string,
	productId: string
) => {
	return Review.where('reviewer', reviewerId)
		.where('product', productId)
		.findOne()
}

/**
 * Finds all reviews received by a specific user.
 *
 * @param userId - ID of the user whose reviews we want to fetch
 * @returns Array of review documents populated with reviewer info
 */
export const FindReviewsReceivedByUser = (userId: string) => {
	return Review.where('reviewedUser', userId).sort({ createdAt: -1 })
}
