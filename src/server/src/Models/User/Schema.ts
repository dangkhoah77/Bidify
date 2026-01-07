import { Schema } from 'mongoose'
import chalk from 'chalk'

import { ROLE, UPGRADE_REQUEST_STATUS } from 'Shared/Data/Constants/index.js'
import { User, UserProfile } from 'Shared/Data/Types/index.js'

import Product, { ProductDocument } from 'Server/Models/Product/index.js'
import Review, { ReviewDocument } from 'Server/Models/Review/index.js'

import { ServerUser, IUser, UserDocument, UserModel } from './Types.js'

/**
 * Mongoose schema for the User model.
 */
const UserSchema = new Schema(
	{
		firstName: { type: String, required: true },
		lastName: { type: String, required: true },
		email: { type: String, required: true, unique: true, trim: true },
		password: { type: String, required: true },
		role: {
			type: String,
			default: ROLE.Bidder,
			enum: Object.values(ROLE),
		},
		isVerified: { type: Boolean, default: false },
		balance: { type: Number, default: 0 },
		watchlist: [
			{
				type: String,
				ref: 'Product',
				default: [],
			},
		],
		reviewsWritten: [
			{
				type: String,
				ref: 'Review',
				default: [],
			},
		],
		reviewsReceived: [
			{
				type: String,
				ref: 'Review',
				default: [],
			},
		],
		otp: { type: String },
		otpExpires: { type: Date },
		resetPasswordToken: { type: String },
		resetPasswordExpires: { type: Date },
		upgradeRequestStatus: {
			type: String,
			default: UPGRADE_REQUEST_STATUS.None,
			enum: Object.values(UPGRADE_REQUEST_STATUS),
		},
		sellerRoleExpires: { type: Date },
	},
	{
		toObject: {
			transform: function (doc: UserDocument, ret: any): ServerUser {
				// Convert _id to string and assign to id
				ret.id = ret._id.toString()

				// Ensure necessary fields are populated
				if (
					!doc.populated('reviewsReceived') ||
					!doc.populated('reviewsWritten') ||
					!doc.populated('watchlist')
				) {
					throw new Error(
						'Chưa populate các trường cần thiết trong UserDocument khi chuyển đổi sang ServerUser'
					)
				}

				// Transform populated fields to objects
				ret.reviewsReceived = (
					doc.reviewsReceived as ReviewDocument[]
				).map((reviewDoc: ReviewDocument) => Review.toObject(reviewDoc))
				ret.reviewsWritten = (
					doc.reviewsWritten as ReviewDocument[]
				).map((reviewDoc: ReviewDocument) => Review.toObject(reviewDoc))
				ret.watchlist = (doc.watchlist as ProductDocument[]).map(
					(productDoc: ProductDocument) =>
						Product.toObject(productDoc)
				)

				// Remove redundant fields
				delete ret._id
				delete ret.__v

				return ret
			},
		},
		toJSON: {
			transform: function (doc: UserDocument, ret: any): UserProfile {
				// Convert _id to string and assign to id
				ret.id = ret._id.toString()

				// Ensure necessary fields are populated
				if (
					!doc.populated('reviewsReceived') ||
					!doc.populated('reviewsWritten') ||
					!doc.populated('watchlist')
				) {
					throw new Error(
						'Chưa populate các trường cần thiết trong UserDocument khi chuyển sang User DTO'
					)
				}

				// Transform populated fields to DTOs
				ret.reviewsReceived = (
					doc.reviewsReceived as ReviewDocument[]
				).map((reviewDoc: ReviewDocument) => Review.toDto(reviewDoc))
				ret.reviewsWritten = (
					doc.reviewsWritten as ReviewDocument[]
				).map((reviewDoc: ReviewDocument) => Review.toDto(reviewDoc))
				ret.watchlist = (doc.watchlist as ProductDocument[]).map(
					(productDoc: ProductDocument) => Product.toDto(productDoc)
				)

				// Remove redundant fields
				delete ret._id
				delete ret.__v
				delete ret.password
				delete ret.isVerified
				delete ret.otp
				delete ret.otpExpires
				delete ret.resetPasswordToken
				delete ret.resetPasswordExpires

				return ret
			},
		},
	}
) as Schema<IUser, UserModel>

/**
 * Static method to populate all referenced fields in a UserDocument.
 *
 * @param doc - The UserDocument to populate.
 * @returns The populated UserDocument.
 */
UserSchema.statics.populateDocument = async function (
	doc: UserDocument
): Promise<UserDocument> {
	try {
		return await doc.populate('watchlist reviewsWritten reviewsReceived')
	} catch (error) {
		console.log(chalk.red('Error populating fields in UserSchema:'), error)
		throw new Error(
			'Xảy ra lỗi trong quá trình populate các trường trong UserSchema'
		)
	}
}

/**
 * Static method to transform a UserDocument to a ServerUser object.
 *
 * @param doc - The UserDocument to transform.
 * @returns The ServerUser object.
 */
UserSchema.statics.toObject = async function (
	doc: UserDocument
): Promise<ServerUser> {
	return (await this.populateDocument(doc)).toObject() as any
}

/**
 * Static method to transform a UserDocument to a User DTO.
 *
 * @param doc - The UserDocument to transform.
 * @returns The User DTO.
 */
UserSchema.statics.toDto = async function (doc: UserDocument): Promise<User> {
	const userProfile = (await this.populateDocument(doc)).toJSON() as any
	return {
		id: userProfile.id,
		firstName: userProfile.firstName,
		lastName: userProfile.lastName,
		role: userProfile.role,
		reviewsReceived: userProfile.reviewsReceived,
	}
}

/**
 * Static method to transform a UserDocument to a UserProfile object.
 *
 * @param doc - The UserDocument to transform.
 * @returns The UserProfile object.
 */
UserSchema.statics.toUserProfile = async function (
	doc: UserDocument
): Promise<UserProfile> {
	return (await this.populateDocument(doc)).toJSON() as any
}

export default UserSchema
