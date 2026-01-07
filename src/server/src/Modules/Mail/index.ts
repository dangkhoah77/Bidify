import chalk from 'chalk'
import nodemailer from 'nodemailer'

import Keys from 'Server/Config/Keys.js'

import GetTemplate from './Template.js'

/**
 * Nodemailer transporter using Gmail service
 *
 * @prop transporter
 */
const transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: Keys.email.user,
		pass: Keys.email.pass,
	},
})

/**
 * Send an email using Mailgun
 *
 * @param email - Recipient email address
 * @param type - Type of email to send
 * @param data - Data for the email template
 * @returns Promise resolving to Mailgun response or error
 */
const SendMail = async (
	email: string,
	type: string,
	data?: any
): Promise<any> => {
	try {
		// Prepare email template
		const config = GetTemplate(type, data)
		if (!config) {
			throw new Error('Failed to prepare email template')
		}

		// Add sender and recipient to the email config
		config.from = `Bidify! <no-reply@<${Keys.email.user}>>`
		config.to = email

		// Send email
		await transporter.sendMail(config)
		console.log(chalk.green('✓ Mail sent successfully'))
	} catch (error) {
		console.log(
			`${chalk.red('✗ Error while attempting to send mail:')} `,
			error
		)
	}
}

export default SendMail
