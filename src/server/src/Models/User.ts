import { Schema, model } from 'mongoose'
import {
	ROLES,
	UPGRADE_REQUEST_STATUS,
	EMAIL_PROVIDER,
} from '../Data/Constants/index.js'

/**
 * Mongoose schema for the User model.
 */
const UserSchema = new Schema(
	{
		email: { type: String, required: true, unique: true, trim: true },
		password: { type: String },
		provider: {
			type: String,
			required: true,
			default: EMAIL_PROVIDER.Email,
		},
		firstName: { type: String, required: true },
		lastName: { type: String, required: true },
		address: { type: String },
		role: {
			type: String,
			default: ROLES.Bider,
			enum: Object.values(ROLES),
		},
		isActive: { type: Boolean, default: true },
		otp: { type: String },
		otpExpires: { type: Date },
		resetPasswordToken: { type: String },
		resetPasswordExpires: { type: Date },
		positiveReviews: { type: Number, default: 0 },
		negativeReviews: { type: Number, default: 0 },
		watchlist: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
		upgradeRequestStatus: {
			type: String,
			default: UPGRADE_REQUEST_STATUS.None,
			enum: Object.values(UPGRADE_REQUEST_STATUS),
		},
	},
	{ timestamps: true }
)

export default model('User', UserSchema)
