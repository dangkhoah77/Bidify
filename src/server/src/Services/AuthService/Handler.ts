import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import ms from 'ms'

import {
	ApiResponseData,
	CurrentUserResponseData,
	AuthResponseData,
	RegistrationOtpResponseData,
} from 'Shared/Data/Types/index.js'
import Keys from 'Server/Config/Keys.js'

import User, { UserDocument } from 'Server/Models/User/index.js'

import {
	FindUserByEmail,
	FindVerifiedUserByEmail,
	FindVerifiedUserByResetToken,
	UpdateOrCreateUserByEmail,
} from './Query.js'

import SendMail from 'Server/Modules/Mail/index.js'
import { GenerateOtpWithExpiry, VerifyRecaptcha, VerifyOtp } from './Helper.js'

/**
 * Retrieves the currently authenticated user's profile.
 *
 * @param user - The authenticated user.
 * @returns The status and result data containing the user's profile.
 */
export const GetCurrentUser = async (
	user: UserDocument
): Promise<{ status: number; data: CurrentUserResponseData }> => {
	return {
		status: 200,
		data: {
			success: true,
			message: 'Lấy thông tin người dùng thành công.',
			data: { user: await User.toUserProfile(user) },
		},
	}
}

/**
 * Logs in a user with the provided email and password.
 *
 * @param email - The user's email address.
 * @param password - The user's password.
 * @returns The status and result data for the login attempt.
 */
export const Login = async (
	email: string,
	password: string
): Promise<{ status: number; data: AuthResponseData }> => {
	// Find user by email
	const user = await FindVerifiedUserByEmail(email)
	if (!user) {
		return {
			status: 400,
			data: {
				success: false,
				message: 'Không tìm thấy người dùng có địa chỉ email này.',
			},
		}
	}

	// Check password
	const isMatch = await bcrypt.compare(password, user.password)
	if (!isMatch) {
		return {
			status: 400,
			data: {
				success: false,
				message: 'Mật khẩu không đúng. Vui lòng thử lại.',
			},
		}
	}

	// Create JWT token
	const payload = { id: user.id }
	const token = jwt.sign(payload, Keys.jwt.secret, {
		expiresIn: Keys.jwt.tokenLife,
	})

	// Respond with user info and token
	return {
		status: 200,
		data: {
			success: true,
			message: 'Đăng nhập thành công.',
			data: { token, user: await User.toUserProfile(user) },
		},
	}
}

/**
 * Registers a new user with the provided details.
 *
 * @param email - The user's email address.
 * @param password - The user's password.
 * @param firstName - The user's first name.
 * @param lastName - The user's last name.
 * @param captchaToken - The captcha token for verification.
 * @returns The status and result data for the registration attempt.
 */
export const SendRegistrationOtp = async (
	email: string,
	password: string,
	firstName: string,
	lastName: string,
	captchaToken: string
): Promise<{ status: number; data: RegistrationOtpResponseData }> => {
	// Verify captcha
	const captchaVerification = await VerifyRecaptcha(captchaToken)
	if (!captchaVerification.valid) {
		return {
			status: 400,
			data: {
				success: false,
				message: captchaVerification.message,
			},
		}
	}

	// Check if user already exists
	const existingUser = await FindUserByEmail(email)
	if (existingUser && existingUser.isVerified) {
		return {
			status: 400,
			data: {
				success: false,
				message: 'Địa chỉ email này đã được sử dụng.',
			},
		}
	}

	// Generate OTP
	const { otp, otpExpires } = GenerateOtpWithExpiry()

	// Hash password
	const salt = await bcrypt.genSalt(10)
	const hash = await bcrypt.hash(password, salt)

	// Create or update user with temporary registration data
	await UpdateOrCreateUserByEmail(email, {
		email,
		password: hash,
		firstName,
		lastName,
		isVerified: false,
		otp,
		otpExpires,
	})

	// Send OTP email
	SendMail(email, 'RegistrationOtp', { otp, firstName, lastName })

	return {
		status: 201,
		data: {
			success: true,
			message: 'Mã OTP đã được gửi đến email của bạn.',
			data: {
				expiresIn: ms(Keys.optLife),
			},
		},
	}
}

/**
 * Resends the registration OTP to the user's email.
 *
 * @param email - The user's email address.
 * @returns The status and result data for the resend OTP attempt.
 */
export const ResendRegistrationOtp = async (
	email: string
): Promise<{ status: number; data: RegistrationOtpResponseData }> => {
	// Find unverified user by email
	const user = await FindUserByEmail(email)
	if (!user) {
		return {
			status: 404,
			data: {
				success: false,
				message: 'Không tìm thấy yêu cầu đăng ký.',
			},
		}
	}

	// Check if already verified
	if (user.isVerified) {
		return {
			status: 400,
			data: {
				success: false,
				message: 'Tài khoản đã được xác minh trước đó.',
			},
		}
	}

	// Generate new OTP
	const { otp, otpExpires } = GenerateOtpWithExpiry()

	// Update user with new OTP
	user.otp = otp
	user.otpExpires = otpExpires
	await user.save()

	// Send OTP email
	SendMail(email, 'RegistrationOtp', {
		otp,
		firstName: user.firstName,
		lastName: user.lastName,
	})

	return {
		status: 200,
		data: {
			success: true,
			message: 'Mã OTP mới đã được gửi mào mail của bạn.',
			data: {
				expiresIn: ms(Keys.optLife),
			},
		},
	}
}

/**
 * Verifies the registration OTP and completes user registration.
 *
 * @param email - The user's email address.
 * @param otp - The OTP provided by the user.
 * @returns The status and result data for the OTP verification attempt.
 */
export const VerifyRegistrationOtp = async (
	email: string,
	otp: string
): Promise<{ status: number; data: AuthResponseData }> => {
	// Find user with pending registration
	const user = await FindUserByEmail(email)
	if (!user) {
		return {
			status: 404,
			data: {
				success: false,
				message: 'Không tìm thấy yêu cầu đăng ký hoặc đã hết hạn.',
			},
		}
	}

	// Check if already verified
	if (user.isVerified) {
		return {
			status: 400,
			data: {
				success: false,
				message: 'Tài khoản đã được xác minh trước đó.',
			},
		}
	}

	// Verify OTP
	const otpVerification = VerifyOtp(otp, user.otp, user.otpExpires)
	if (!otpVerification.valid) {
		return {
			status: 400,
			data: {
				success: false,
				message: otpVerification.message,
			},
		}
	}

	// Mark user as verified and clear OTP fields
	user.isVerified = true
	user.otp = undefined
	user.otpExpires = undefined
	await user.save()

	// Send welcome email
	SendMail(user.email, 'Welcome', {
		firstName: user.firstName,
		lastName: user.lastName,
	})

	// Generate JWT token
	const payload = { id: user.id }
	const token = jwt.sign(payload, Keys.jwt.secret, {
		expiresIn: Keys.jwt.tokenLife,
	})

	return {
		status: 201,
		data: {
			success: true,
			message: 'Đăng ký thành công!',
			data: {
				user: await User.toUserProfile(user),
				token: token,
			},
		},
	}
}

/**
 * Initiates the forgot password process for a user by sending a reset email.
 *
 * @param email - The user's email address.
 * @returns The status and result data for the forgot password attempt.
 */
export const ForgotPassword = async (
	email: string
): Promise<{ status: number; data: ApiResponseData }> => {
	// Find user by email
	const existingUser = await FindVerifiedUserByEmail(email)
	if (!existingUser) {
		return {
			status: 404,
			data: {
				success: false,
				message: 'Không tìm thấy người dùng có địa chỉ email này.',
			},
		}
	}

	// Generate reset token
	const buffer = crypto.randomBytes(48)
	const resetToken = buffer.toString('hex')

	// Set reset token and expiry on user
	existingUser.resetPasswordToken = resetToken
	existingUser.resetPasswordExpires = new Date(
		Date.now() + ms(Keys.resetTokenLife)
	)
	await existingUser.save()

	// Send reset email
	SendMail(existingUser.email, 'ResetPassword', {
		resetToken,
	})

	return {
		status: 200,
		data: {
			success: true,
			message: 'Yêu cầu đặt lại mật khẩu đã được gửi thành công.',
		},
	}
}

/**
 * Resets a user's password using a reset token.
 *
 * @param token - The password reset token.
 * @param newPassword - The new password to set.
 * @returns The status and result data for the password reset attempt.
 */
export const ResetPasswordWithToken = async (
	token: string,
	newPassword: string
): Promise<{ status: number; data: ApiResponseData }> => {
	// Find user by reset token and check expiry
	const resetUser = await FindVerifiedUserByResetToken(token)
	if (!resetUser) {
		return {
			status: 400,
			data: {
				success: false,
				message:
					'Yêu cầu thay đổi mật khẩu không hợp lệ hoặc đã hết hạn.',
			},
		}
	}

	// Hash new password
	const salt = await bcrypt.genSalt(10)
	const hash = await bcrypt.hash(newPassword, salt)

	// Update user password and clear reset token
	resetUser.password = hash
	resetUser.resetPasswordToken = undefined
	resetUser.resetPasswordExpires = undefined
	await resetUser.save()

	// Send confirmation email
	SendMail(resetUser.email, 'ResetPasswordConfirmation')

	return {
		status: 200,
		data: {
			success: true,
			message: 'Mật khẩu của bạn đã được đặt lại thành công.',
		},
	}
}

/**
 * Resets a user's password while authenticated.
 *
 * @param user - The authenticated user.
 * @param currentPassword - The user's current password.
 * @param newPassword - The new password to set.
 * @returns The status and result data for the password reset attempt.
 */
export const ResetPassword = async (
	user: UserDocument,
	currentPassword: string,
	newPassword: string
): Promise<{ status: number; data: ApiResponseData }> => {
	// Check current password matches
	if (
		user.password &&
		!(await bcrypt.compare(currentPassword, user.password))
	) {
		return {
			status: 400,
			data: {
				success: false,
				message: 'Mật khẩu hiện tại không trùng khớp.',
			},
		}
	}

	// Hash new password
	const salt = await bcrypt.genSalt(10)
	const hash = await bcrypt.hash(newPassword, salt)

	// Update user password
	user.password = hash
	await user.save()

	// Send confirmation email
	SendMail(user.email, 'ResetPasswordConfirmation')
	return {
		status: 200,
		data: {
			success: true,
			message: 'Mật khẩu của bạn đã được đặt lại thành công.',
		},
	}
}
