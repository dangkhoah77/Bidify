import type { Name, Email } from '../../Data/Types/index.js'

/**
 * Reset Password Email Template
 *
 * @param resetToken - The reset token for the user
 * @returns The reset password email template
 */
export function resetPasswordEmail(resetToken: string): Email {
	return {
		subject: 'Reset Password',
		text:
			'You are receiving this because you have requested to reset your password for your account.\n\n' +
			'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
			`https://reset-password/${resetToken}\n\n` +
			'If you did not request this, please ignore this email and your password will remain unchanged.\n',
	}
}

/**
 * Confirmation Email Template after Password Reset
 *
 * @returns The confirmation email template after password reset
 */
export function confirmResetPasswordEmail(): Email {
	return {
		subject: 'Password Changed',
		text:
			'You are receiving this email because you changed your password. \n\n' +
			'If you did not request this change, please contact us immediately.',
	}
}

/**
 * Signup Email Template
 *
 * @param name - The name of the user
 * @returns The signup email template
 */
export function signupEmail(name: Name): Email {
	return {
		subject: 'Account Registration',
		text: `Hi ${name.firstName} ${name.lastName}! Thank you for creating an account with us!.`,
	}
}

/**
 * Contact Email Template
 *
 * @returns The contact email template
 */
export function contactEmail(): Email {
	return {
		subject: 'Contact Us',
		text: 'We received your message! Our team will contact you soon. \n\n',
	}
}

export default {
	signupEmail,
	resetPasswordEmail,
	confirmResetPasswordEmail,
	contactEmail,
}
