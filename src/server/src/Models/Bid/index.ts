import { model } from 'mongoose'

import { BidModel } from './Types.js'
import BidSchema from './Schema.js'

export * from './Types.js'

/**
 * Mongoose model for Bid.
 */
const BidModel = model('Bid', BidSchema as any) as any as BidModel

export default BidModel
