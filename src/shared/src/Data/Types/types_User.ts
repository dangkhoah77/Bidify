import {
	ROLE,
	EMAIL_PROVIDER,
	UPGRADE_REQUEST_STATUS,
} from 'Shared/Data/Constants/index.js'

/**
 * Name Type Definition
 *
 * @type Name
 * @property {string} firstName - The first name of the user
 * @property {string} lastName - The last name of the user
 */
export type Name = {
	firstName: string
	lastName: string
}

/**
 * Mail Type Definition
 *
 * @type Mail
 * @property {string} [from] - The sender's email address
 * @property {string} [to] - The recipient's email address
 * @property {string} subject - The subject of the email
 * @property {string} text - The body text of the email
 */
export type Mail = {
	from?: string
	to?: string
	subject: string
	text: string
}

/**
 * Represents a user's address.
 *
 * @type Address
 * @property {string} street - The street address
 * @property {string} city - The city
 * @property {string} state - The state or province
 * @property {string} zipCode - The postal code
 * @property {string} country - The country
 */
export type Address = {
	street: string
	city: string
	state: string
	zipCode: string
	country: string
}

/**
 * User Type Definition
 *
 * @type User
 * @property {string} id - The unique identifier of the user.
 * @property {string} firstName - The user's first name.
 * @property {string} lastName - The user's last name.
 * @property {ROLE} role - The user's role in the system.
 */
export type User = {
	id: string
	firstName: string
	lastName: string
	role: ROLE
}

/**
 * Server-side User Type Definition
 *
 * @type ServerUser
 * @property {string} firstName - The user's first name.
 * @property {string} lastName - The user's last name.
 * @property {string} email - The user's email address.
 * @property {EMAIL_PROVIDER} provider - The email provider used for authentication.
 * @property {string} [password] - The user's hashed password.
 * @property {string} [address] - The user's address.
 * @property {ROLE} role - The user's role in the system.
 * @property {boolean} isActive - Indicates if the user's account is active.
 * @property {string} [otp] - One-time password for verification.
 * @property {Date} [otpExpires] - Expiration date of the OTP.
 * @property {string} [resetPasswordToken] - Token for password reset.
 * @property {Date} [resetPasswordExpires] - Expiration date of the reset password token.
 * @property {UPGRADE_REQUEST_STATUS} upgradeRequestStatus - Status of the user's upgrade request to Seller.
 */
export type ServerUser = User & {
	email: string
	password?: string | null
	provider: EMAIL_PROVIDER
	address?: string | null
	isActive: boolean
	otp?: string | null
	otpExpires?: Date | null
	resetPasswordToken?: string | null
	resetPasswordExpires?: Date | null
	upgradeRequestStatus: UPGRADE_REQUEST_STATUS
    watchlist: string[]
}
