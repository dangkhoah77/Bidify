import assert from 'assert'
import Mailgun from 'mailgun.js'
import FormData from 'form-data'

import type { Email } from '../../Data/Types/index.js'
import Keys from '../../Config/Keys.js'
import Template from './Template.js'

// Extract api key and domain for mailgun
const { key, domain, sender } = Keys.mailgun

/**
 * Prepare email template based on type
 *
 * @private
 * @param type - type of email
 * @param data - Data for the email
 * @returns The prepared email template or null if type is unknown
 */
function prepareTemplate(type: string, data: any): Email | null {
	let message: Email | null = null

	switch (type) {
		case 'signup':
			assert(
				data.name &&
					typeof data.name == 'object' &&
					typeof data.name.firstName == 'string' &&
					typeof data.name.lastName == 'string',
				'Name data is required for signup email'
			)
			message = Template.signupEmail(data.name)
			break

		case 'reset':
			assert(
				data.resetToken && typeof data.resetToken == 'string',
				'Reset token is required for reset password email'
			)
			message = Template.resetPasswordEmail(data.resetToken)
			break

		case 'reset-confirmation':
			message = Template.confirmResetPasswordEmail()
			break

		case 'contact':
			message = Template.contactEmail()
			break

		default:
			console.warn(`Unknown email type: ${type}`)
	}

	return message
}

/**
 * Handle mail sending via Mailgun
 *
 * @server
 * @class MailService
 */
const MailService = {
	mailgun: new Mailgun(FormData).client({
		username: 'api',
		key: key || 'API_KEY',
	}), // Mailgun client instance for sending emails

	/**
	 *
	 * @param email - Recipient email address
	 * @param type - Type of email to send
	 * @param data - Data for the email template
	 * @returns Promise resolving to Mailgun response or error
	 */
	async sendMail(email: string, type: string, data: any): Promise<any> {
		try {
			// Prepare email template
			const message = prepareTemplate(type, data)
			if (!message) {
				throw new Error('Failed to prepare email template')
			}

			// Configure email parameters
			const config = {
				from: `Online Auction! <no-reply@<${sender}>>`,
				to: email,
				subject: message.subject,
				text: message.text,
			}

			// Send email via Mailgun
			return await MailService.mailgun.messages.create(
				domain || 'DOMAIN_NAME',
				config
			)
		} catch (error) {
			return error
		}
	},
}

export default MailService
