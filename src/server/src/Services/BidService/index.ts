/**
 * Service to handle bidding operations including placing bids,
 * unregistering bids, denying bidders, and listing bids for products.
 *
 * @service BidService
 */

import { INTERVAL_AUCTION_CHECK_MS } from 'Server/Data/Constants.js'

import { CheckAuctionsEnd } from './Helper.js'

export * from './Query.js'
export * from './Validation.js'
export * from './Handler.js'

/**
 * Configuration for bidding behavior.
 *
 * @prop BidConfig
 * @property {number} AutoExtendThreshold - Duration to trigger auction auto-extend
 * @property {number} AutoExtendIncrement - Duration to extend auction by on auto-extend
 */
export const BidConfig = {
	AutoExtendThreshold: 5 * 60 * 1000,
	AutoExtendIncrement: 10 * 60 * 1000,
}

/* Initialize periodic auction end check */
CheckAuctionsEnd()
setInterval(CheckAuctionsEnd, INTERVAL_AUCTION_CHECK_MS)
