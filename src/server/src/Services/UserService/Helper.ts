import { RemoveSellerRoleFromExpiredUsers } from './Query.js'

/**
 * Checks and downgrades users with expired Seller roles.
 */
export const CheckExpiredSeller = async () => {
	try {
		const result = await RemoveSellerRoleFromExpiredUsers()
		console.log(
			`[Scheduler] Downgraded ${result.modifiedCount} expired Seller roles.`
		)
	} catch (error) {
		console.error('Error checking expired Seller roles:', error)
	}
}
