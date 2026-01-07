/**
 * Defines the roles for users in the system.
 *
 * @enum {string} ROLE
 * @property {string} Admin - Administrator with full access
 * @property {string} Bidder - User who can bid on items
 * @property {string} Seller - User who can list items for sale
 * @property {string} Guest - Non-logged-in user
 */
export enum ROLE {
	Admin = 'ROLE ADMIN',
	Bidder = 'ROLE BIDDER',
	Seller = 'ROLE SELLER',
	Guest = 'ROLE GUEST',
}

/**
 * Defines the status of a user's request to upgrade to a Seller account.
 *
 * @enum {string} UPGRADE_REQUEST_STATUS
 * @property {string} None - No upgrade request made
 * @property {string} Pending - Upgrade request is pending review
 * @property {string} Approved - Upgrade request has been approved
 * @property {string} Rejected - Upgrade request has been rejected
 */
export enum UPGRADE_REQUEST_STATUS {
	None = 'NONE',
	Pending = 'PENDING',
	Approved = 'APPROVED',
	Rejected = 'REJECTED',
}

/**
 * Name of the JWT cookie used for authentication.
 *
 * @constant {string} JWT_COOKIE
 */
export const JWT_COOKIE = 'x-jwt-cookie'
