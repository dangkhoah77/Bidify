import { User, UserProfile } from 'Shared/Data/Types/index.js'
import { DocumentType, ModelType } from 'Server/Data/Types.js'

import { ServerProduct, ProductDocument } from 'Server/Models/Product/index.js'
import { ServerReview, ReviewDocument } from 'Server/Models/Review/index.js'

/**
 * Server-side User interface representing a user in the system.
 *
 * @interface ServerUser
 * @property {string} id - The unique identifier of the user.
 * @property {string} firstName - The user's first name.
 * @property {string} lastName - The user's last name.
 * @property {string} email - The user's email address.
 * @property {string} password - The user's hashed password.
 * @property {ROLE} role - The user's role in the system.
 * @property {boolean} isVerified - Indicates if the user's account is verified.
 * @property {number} balance - The user's account balance.
 * @property {ServerProduct[]} watchlist - List of product IDs in the user's watchlist.
 * @property {ServerReview[]} reviewsWritten - List of reviews the user has written.
 * @property {ServerReview[]} reviewsReceived - List of reviews the user has received.
 * @property {string} [otp] - One-time password for verification.
 * @property {Date} [otpExpires] - Expiration date of the OTP.
 * @property {string} [resetPasswordToken] - Token for password reset.
 * @property {Date} [resetPasswordExpires] - Expiration date of the reset password token.
 * @property {UPGRADE_REQUEST_STATUS} upgradeRequestStatus - Status of the user's upgrade request to Seller.
 * @property {Date} [sellerRoleExpires] - Expiration date of the seller status, if applicable.
 */
export interface ServerUser
	extends Omit<
		UserProfile,
		'watchlist' | 'reviewsWritten' | 'reviewsReceived'
	> {
	password: string
	isVerified: boolean
	watchlist: ServerProduct[]
	reviewsWritten: ServerReview[]
	reviewsReceived: ServerReview[]
	otp?: string
	otpExpires?: Date
	resetPasswordToken?: string
	resetPasswordExpires?: Date
}

/**
 * Interface representing a raw User document type.
 *
 * @interface IUser
 * @property {string} id - Unique identifier for the user.
 * @property {string} firstName - The user's first name.
 * @property {string} lastName - The user's last name.
 * @property {string} email - The user's email address.
 * @property {string} [password] - The user's hashed password.
 * @property {ROLE} role - The user's role in the system.
 * @property {boolean} isVerified - Indicates if the user's account is verified.
 * @property {number} balance - The user's account balance.
 * @property {(ProductDocument | string)[]} watchlist - List of products or product IDs in the user's watchlist.
 * @property {(ReviewDocument | string)[]} reviewsWritten - List of reviews or review IDs the user has written.
 * @property {(ReviewDocument | string)[]} reviewsReceived - List of reviews or review IDs the user has received.
 * @property {string} [otp] - One-time password for verification.
 * @property {Date} [otpExpires] - Expiration date of the OTP.
 * @property {string} [resetPasswordToken] - Token for password reset.
 * @property {Date} [resetPasswordExpires] - Expiration date of the reset password token.
 * @property {UPGRADE_REQUEST_STATUS} upgradeRequestStatus - Status of the user's upgrade request to Seller.
 * @property {Date} [sellerRoleExpires] - Expiration date of the seller status, if applicable.
 */
export interface IUser
	extends Omit<
		ServerUser,
		'watchlist' | 'reviewsWritten' | 'reviewsReceived'
	> {
	watchlist: (ProductDocument | string)[]
	reviewsWritten: (ReviewDocument | string)[]
	reviewsReceived: (ReviewDocument | string)[]
}

/**
 * Mongoose Document interface for User.
 *
 * @interface UserDocument
 * @property {ObjectId} _id - The MongoDB ObjectId.
 * @property {number} __v - The version key.
 * @property {string} id - Unique identifier for the user.
 * @property {string} firstName - The user's first name.
 * @property {string} lastName - The user's last name.
 * @property {string} email - The user's email address.
 * @property {string} password - The user's hashed password.
 * @property {ROLE} role - The user's role in the system.
 * @property {boolean} isVerified - Indicates if the user's account is verified.
 * @property {number} balance - The user's account balance.
 * @property {(ProductDocument | string)[]} watchlist - List of products or product IDs in the user's watchlist.
 * @property {(ReviewDocument | string)[]} reviewsWritten - List of reviews or review IDs the user has written.
 * @property {(ReviewDocument | string)[]} reviewsReceived - List of reviews or review IDs the user has received.
 * @property {string} [otp] - One-time password for verification.
 * @property {Date} [otpExpires] - Expiration date of the OTP.
 * @property {string} [resetPasswordToken] - Token for password reset.
 * @property {Date} [resetPasswordExpires] - Expiration date of the reset password token.
 * @property {UPGRADE_REQUEST_STATUS} upgradeRequestStatus - Status of the user's upgrade request to Seller.
 * @property {Date} [sellerRoleExpires] - Expiration date of the seller status, if applicable.
 */
export interface UserDocument extends DocumentType<IUser> {}

/**
 * Mongoose Model interface for User.
 *
 * @interface UserModel
 * @extends Model<IUser>
 * @property {(doc: UserDocument): Promise<UserDocument>} populateDocument - Static method to populate referenced fields in a UserDocument.
 * @property {(doc: UserDocument): Promise<ServerUser>} toObject - Static method to transform a UserDocument to a ServerUser object.
 * @property {(doc: UserDocument): Promise<User>} toDto - Static method to transform a UserDocument to a User DTO.
 * @property {(doc: UserDocument): Promise<UserProfile>} toUserProfile - Static method to transform a UserDocument to a UserProfile object.
 */
export interface UserModel
	extends ModelType<User, ServerUser, IUser, UserDocument> {
	toUserProfile(doc: UserDocument): Promise<UserProfile>
}
