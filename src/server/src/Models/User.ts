import { Schema, Document, model } from 'mongoose'

import {
	ROLE,
	UPGRADE_REQUEST_STATUS,
	EMAIL_PROVIDER,
} from 'Shared/Data/Constants/index.js'
import { ServerUser } from 'Shared/Data/Types/index.js'

/**
 * Interface representing a User document in MongoDB.
 *
 * @interface IUser
 * @property {string} firstName - The user's first name.
 * @property {string} lastName - The user's last name.
 * @property {string} email - The user's email address.
 * @property {EMAIL_PROVIDER} provider - The email provider used for authentication.
 * @property {string} [password] - The user's hashed password.
 * @property {string} [address] - The user's address.
 * @property {ROLE} role - The user's role in the system.
 * @property {boolean} isActive - Indicates if the user's account is active.
 * @property {string} [otp] - One-time password for verification.
 * @property {Date} [otpExpires] - Expiration date of the OTP.
 * @property {string} [resetPasswordToken] - Token for password reset.
 * @property {Date} [resetPasswordExpires] - Expiration date of the reset password token.
 * @property {UPGRADE_REQUEST_STATUS} upgradeRequestStatus - Status of the user's upgrade request to Seller.
 */
export interface IUser extends Omit<ServerUser, 'id'>, Document {}

/**
 * Mongoose schema for the User model.
 */
const UserSchema = new Schema(
	{
		firstName: { type: String, required: true },
		lastName: { type: String, required: true },
		email: { type: String, required: true, unique: true, trim: true },
		provider: {
			type: String,
			required: true,
			default: EMAIL_PROVIDER.Email,
			enum: Object.values(EMAIL_PROVIDER),
		},
		password: { type: String },
		address: { type: String },
		role: {
			type: String,
			default: ROLE.Bider,
			enum: Object.values(ROLE),
		},
		isActive: { type: Boolean, default: true },
		otp: { type: String },
		otpExpires: { type: Date },
		resetPasswordToken: { type: String },
		resetPasswordExpires: { type: Date },
		upgradeRequestStatus: {
			type: String,
			default: UPGRADE_REQUEST_STATUS.None,
			enum: Object.values(UPGRADE_REQUEST_STATUS),
		},
        watchlist: [{
        type: Schema.Types.ObjectId,
        ref: 'Product',
        default: []
    }]
	},
	{ timestamps: true }
)

export default model('User', UserSchema)
