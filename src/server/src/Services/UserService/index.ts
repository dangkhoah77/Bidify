/**
 * Service for managing user-related operations.
 *
 * @service UserService
 */

import { INTERVAL_SELLER_ROLE_EXPIRY_CHECK_MS } from 'Server/Data/Constants.js'

import { CheckExpiredSeller } from './Helper.js'

export * from './Query.js'
export * from './Validation.js'
export * from './Handler.js'

/* Initialize periodic Seller role expiry check */
CheckExpiredSeller()
setInterval(CheckExpiredSeller, INTERVAL_SELLER_ROLE_EXPIRY_CHECK_MS)
