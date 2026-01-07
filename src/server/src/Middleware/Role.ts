import { Request, Response, NextFunction } from 'express'

import { ROLE } from 'Shared/Data/Constants/index.js'

import { UserDocument } from 'Server/Models/User/index.js'

/**
 * Middleware generator to check if the user has one of the specified roles.
 *
 * @param roles - Allowed roles
 * @returns Express middleware function
 */
const check = (...roles: ROLE[]) => {
	return (req: Request, res: Response, next: NextFunction) => {
		// If the user is not authenticated, return a 401 Unauthorized response
		if (!req.user) {
			return res
				.status(401)
				.send({ success: false, message: 'Chưa xác thực người dùng.' })
		}

		// Type assertion for user object
		const user = req.user as UserDocument

		// Return a 403 Forbidden response if the user's role is not valid
		if (roles.length != 0 && !roles.includes(user.role)) {
			return res
				.status(403)
				.send({ success: false, message: 'Không có quyền truy cập.' })
		}

		// Proceed to the next middleware or route handler otherwise
		return next()
	}
}

export default check
