import { ClientSession, FilterQuery } from 'mongoose'

import User, { IUser, UserDocument } from 'Server/Models/User/index.js'

/**
 * Finds all verified users in the database.
 *
 * @param {number} skip - The number of documents to skip.
 * @param {number} limit - The maximum number of documents to return.
 * @param {FilterQuery<UserDocument>} filter - Additional filter criteria.
 * @returns An array of UserDocuments that are verified.
 */
export const FindVerifiedUsers = async (
	skip: number,
	limit: number,
	filter?: FilterQuery<UserDocument>
) => {
	return User.where('isVerified', true)
		.find(filter ?? {})
		.skip(skip)
		.limit(limit)
		.sort({ createdAt: -1 })
}

/**
 * Counts the total number of verified users in the database.
 *
 * @param {FilterQuery<UserDocument>} filter - Additional filter criteria.
 * @returns The count of verified users.
 */
export const CountVerifiedUsers = async (
	filter?: FilterQuery<UserDocument>
) => {
	return User.find(filter ?? {}).countDocuments({ isVerified: true })
}

/**
 * Finds a verified user by their unique identifier.
 *
 * @param {string} id - The unique identifier of the user.
 * @returns The UserDocument if found, otherwise null.
 */
export const FindVerifiedUserById = async (id: string) => {
	return User.findOne({ _id: id, isVerified: true })
}

/**
 * Finds a user by their email address.
 *
 * @param {string} email - The email address of the user.
 * @returns The UserDocument if found, otherwise null.
 */
export const FindUserByEmail = async (email: string) => {
	return User.findOne({
		email: email,
	})
}

/**
 * Finds a verified user by their email address.
 *
 * @param {string} email - The email address of the user.
 * @returns The UserDocument if found, otherwise null.
 */
export const FindVerifiedUserByEmail = async (email: string) => {
	return User.findOne({
		email: email,
		isVerified: true,
	})
}

/**
 * Finds a verified user by their reset password token.
 *
 * @param {string} resetToken - The reset password token.
 * @returns The UserDocument if found, otherwise null.
 */
export const FindVerifiedUserByResetToken = async (resetToken: string) => {
	return User.findOne({
		resetPasswordToken: resetToken,
		resetPasswordExpires: { $gt: new Date() },
		isVerified: true,
	})
}

/**
 * Finds and updates a user by their email address.
 *
 * @param {string} email - The email address of the user.
 * @param {Partial<IUser>} update - The fields to update.
 * @returns The updated UserDocument if found, otherwise null.
 */
export const UpdateOrCreateUserByEmail = async (
	email: string,
	update: Partial<IUser>
) => {
	return User.findOneAndUpdate(
		{ email: email },
		{ $set: update },
		{
			new: true,
			upsert: true,
			setDefaultsOnInsert: true,
			runValidators: true,
		}
	)
}

/**
 * Creates a new user in the database.
 *
 * @param {Partial<IUser>} userData - The data for the new user.
 * @param {ClientSession} [session] - Optional mongoose session for transaction.
 * @returns The created UserDocument.
 */
export const CreateUser = async (
	userData: Partial<IUser>,
	session: ClientSession | null = null
) => {
	return User.create([userData], { session }).then((users) => users[0])
}

/**
 * Deletes a user by their ID.
 *
 * @param userId - The ID of the user to delete
 * @return The deleted UserDocument
 */
export const DeleteUserById = async (userId: string) => {
	return User.findByIdAndDelete(userId)
}

/**
 * Deletes unverified users whose OTPs have expired.
 *
 * @returns The result of the delete operation.
 */
export const DeleteUnverifiedUsersWithExpiredOtp = async () => {
	return User.deleteMany({
		isVerified: false,
		otpExpires: { $lt: new Date() },
	})
}
