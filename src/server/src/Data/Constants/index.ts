<<<<<<< Updated upstream:src/server/src/Data/Constants/index.ts
/**
 * Defines the roles for users in the system.
 *
 * @enum {string} ROLES
 * @property {string} Admin - Administrator with full access
 * @property {string} Bider - User who can bid on items
 * @property {string} Seller - User who can list items for sale
 * @property {string} Guest - Non-logged-in user
 */
export enum ROLES {
	Admin = 'ROLE ADMIN',
	Bider = 'ROLE BIDER',
	Seller = 'ROLE SELLER',
	Guest = 'ROLE GUEST',
}

/**
 * Defines the status of a user's request to upgrade to a Seller account.
 *
 * @enum {string} UPGRADE_REQUEST_STATUS
 * @property {string} None - No upgrade request made
 * @property {string} Pending - Upgrade request is pending review
 * @property {string} Approved - Upgrade request has been approved
 * @property {string} Rejected - Upgrade request has been rejected
 */
export enum UPGRADE_REQUEST_STATUS {
	None = 'NONE',
	Pending = 'PENDING',
	Approved = 'APPROVED',
	Rejected = 'REJECTED',
}

/**
 * Defines the status of a transaction after an auction ends.
 *
 * @enum {string} TRANSACTION_STEP
 * @property {string} AwaitingPayment - Waiting for buyer to make payment
 * @property {string} PaymentSubmitted - Buyer has submitted payment
 * @property {string} SellerConfirmed - Seller has confirmed receipt of payment
 * @property {string} BuyerConfirmed - Buyer has confirmed receipt of item
 * @property {string} Completed - Transaction is completed
 * @property {string} Cancelled - Transaction has been cancelled
 */
export enum TRANSACTION_STEP {
	AwaitingPayment = 'AWAITING_PAYMENT',
	PaymentSubmitted = 'PAYMENT_SUBMITTED',
	SellerConfirmed = 'SELLER_CONFIRMED',
	BuyerConfirmed = 'BUYER_CONFIRMED',
	Completed = 'COMPLETED',
	Cancelled = 'CANCELLED',
}

/**
 * Defines the rating values for reviews.
 *
 * @enum {number} RATING
 * @property {number} Positive - Positive rating value
 * @property {number} Negative - Negative rating value
 */
export enum RATING {
	Positive = 1,
	Negative = -1,
}

/**
 * Defines the email providers supported for user authentication.
 *
 * @enum {string} EMAIL_PROVIDER
 * @property {string} Email - Standard email provider
 * @property {string} Google - Google authentication provider
 */
export enum EMAIL_PROVIDER {
	Email = 'Email',
	Google = 'Google',
}

/**
 * Name of the JWT cookie used for authentication.
 *
 * @constant {string} JWT_COOKIE
 */
export const JWT_COOKIE = 'x-jwt-cookie'
=======
export * from './consts_User.js'
export * from './consts_Bid.js'
export * from './consts_Review.js'
>>>>>>> Stashed changes:src/shared/src/Data/Constants/index.ts
