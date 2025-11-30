import crypto from 'crypto'

/**
 * Generate 6-digit OTP
 */
export function generateOTP(): string {
	return crypto.randomInt(100000, 999999).toString()
}

/**
 * Generate OTP with expiry (10 minutes)
 */
export function generateOTPWithExpiry(): { otp: string; expires: Date } {
	const otp = generateOTP()
	const expires = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
	return { otp, expires }
}

/**
 * Verify OTP
 */
export function verifyOTP(
	storedOtp: string | null | undefined,
	inputOtp: string,
	expiresAt: Date | null | undefined
): { valid: boolean; reason?: string } {
	if (!storedOtp || !expiresAt) {
		return {
			valid: false,
			reason: 'No OTP found. Please request a new one.',
		}
	}

	if (new Date() > expiresAt) {
		return {
			valid: false,
			reason: 'OTP has expired. Please request a new one.',
		}
	}

	if (storedOtp !== inputOtp) {
		return { valid: false, reason: 'Invalid OTP. Please try again.' }
	}

	return { valid: true }
}
