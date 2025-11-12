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
 * Email Type Definition
 *
 * @type Email
 * @property {string} subject - The subject of the email
 * @property {string} text - The body text of the email
 */
export type Email = {
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

export default null
