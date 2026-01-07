import ms from 'ms'
import crypto from 'crypto'

import Keys from 'Server/Config/Keys.js'

import { DeleteUnverifiedUsersWithExpiredOtp } from './Query.js'

/**
 * Checks and deletes unverified users with expired OTPs.
 */
export const CheckExpiredOtp = async () => {
	try {
		const result = await DeleteUnverifiedUsersWithExpiredOtp()
		console.log(`[Scheduler] Deleted ${result.deletedCount} expired OTPs.`)
	} catch (error) {
		console.error('Error checking expired OTPs:', error)
	}
}

/**
 * Verifies the reCAPTCHA token with Google.
 *
 * @param token - The reCAPTCHA token from the client
 * @returns boolean indicating validity
 */
export async function VerifyRecaptcha(
	token: string
): Promise<{ valid: boolean; message: string }> {
	try {
		const response = await fetch(
			'https://www.google.com/recaptcha/api/siteverify',
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
				},
				body: `secret=${Keys.captcha.secret}&response=${token}`,
			}
		)

		const data = (await response.json()) as { success: boolean }
		return { valid: data.success, message: '' }
	} catch (error) {
		console.error('reCAPTCHA verification error:', error)
		return {
			valid: false,
			message: 'Xác thực reCAPTCHA không thành công. Vui lòng thử lại.',
		}
	}
}

/**
 * Generate 6-digit OTP with expiry time
 *
 * @return Generated OTP and its expiry date
 */
export function GenerateOtpWithExpiry(): { otp: string; otpExpires: Date } {
	const otp = crypto.randomInt(100000, 999999).toString()
	const otpExpires = new Date(Date.now() + ms(Keys.optLife))
	return { otp, otpExpires }
}

/**
 * Verify the provided OTP against the stored OTP and its expiry time
 *
 * @param inputOtp - The OTP provided by the user
 * @param storedOtp - The OTP stored in the database
 * @param expiresAt - The expiry date of the stored OTP
 * @return Object indicating whether the OTP is valid and a message
 */
export function VerifyOtp(
	inputOtp: string,
	storedOtp?: string,
	expiresAt?: Date
): { valid: boolean; message: string } {
	if (!storedOtp || !expiresAt) {
		return {
			valid: false,
			message: 'Không tìm thấy OTP. Vui lòng yêu cầu mã mới.',
		}
	}

	if (new Date() > expiresAt) {
		return {
			valid: false,
			message: 'Mã OTP đã hết hạn. Vui lòng yêu cầu mã mới.',
		}
	}

	if (storedOtp !== inputOtp) {
		return { valid: false, message: 'Mã OTP không hợp lệ.' }
	}

	return { valid: true, message: 'Mã OTP hợp lệ.' }
}
