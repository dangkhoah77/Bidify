/**
 * Service for handling user authentication.
 *
 * @service AuthService
 */

import { INTERVAL_OTP_EXPIRY_CHECK_MS } from 'Server/Data/Constants.js'

import { CheckExpiredOtp } from './Helper.js'

export * from './Query.js'
export * from './Validation.js'
export * from './Handler.js'

/* Initialize periodic OTP expiry check */
CheckExpiredOtp()
setInterval(CheckExpiredOtp, INTERVAL_OTP_EXPIRY_CHECK_MS)
