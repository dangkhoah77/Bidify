/**
 * Defines the possible states of a bid.
 *
 * @enum {string} BID_STATE
 * @property {string} Active - The bid is active
 * @property {string} Denied - The bid has been denied
 * @property {string} Removed - The bid has been removed
 */
export enum BID_STATE {
	Active = 'ACTIVE',
	Denied = 'DENIED',
	Removed = 'REMOVED',
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
