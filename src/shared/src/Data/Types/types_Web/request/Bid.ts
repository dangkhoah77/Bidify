/**
 * Bid register request payload definition
 *
 * @type BidRegisterRequestData
 * @property {string} productId - The unique identifier of the product being bid on
 * @property {number} maxPrice - The maximum price the bidder is willing to pay for the product
 */
export type BidRegisterRequestData = {
	productId: string
	maxPrice: number
}

/**
 * Bid unregister request payload definition
 *
 * @type BidUnregisterRequestData
 * @property {string} productId - The unique identifier of the product to unregister the bid from
 */
export type BidUnregisterRequestData = {
	productId: string
}

/**
 * Bid deny request payload definition
 *
 * @type BidDenyRequestData
 * @property {string} productId - The unique identifier of the product associated with the bid
 * @property {string} bidderId - The unique identifier of the bidder whose bid is to be denied
 */
export type BidDenyRequestData = {
	productId: string
	bidderId: string
}
