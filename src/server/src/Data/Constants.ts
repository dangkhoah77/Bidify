/**
 * Interval (in milliseconds) to check for ended auctions.
 * Default: 5000 ms (5 seconds)
 */
export const INTERVAL_AUCTION_CHECK_MS = 5000

/**
 * Interval (in milliseconds) to check for expired OTPs.
 * Default: 10 minutes
 */
export const INTERVAL_OTP_EXPIRY_CHECK_MS = 10 * 60 * 1000

/**
 * Interval (in milliseconds) to check for expired Seller roles.
 * Default: 24 hours
 */
export const INTERVAL_SELLER_ROLE_EXPIRY_CHECK_MS = 24 * 60 * 60 * 1000
