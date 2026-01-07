import { model } from 'mongoose'

import { UserModel } from './Types.js'
import UserSchema from './Schema.js'

export * from './Types.js'

/**
 * Mongoose model for User.
 */
const UserModel = model('User', UserSchema as any) as any as UserModel

export default UserModel
