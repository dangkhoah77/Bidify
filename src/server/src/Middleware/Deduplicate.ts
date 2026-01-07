import { Request, Response, NextFunction } from 'express'
import chalk from 'chalk'

import { UserDocument } from 'Server/Models/User/index.js'

/**
 * Map to track ongoing requests by key
 *
 * @prop ongoingRequests
 */
const ongoingRequests = new Map<string, Promise<void>>()

/**
 * Extract request key for deduplication
 * Uses user ID + request path + relevant body parameters
 *
 * @param req - Express request object
 * @returns Unique request key string
 */
const getRequestKey = (req: Request): string => {
	const user = req.user as UserDocument | undefined
	const userId = user?.id || 'anonymous'
	const path = req.route?.path || req.path
	const method = req.method

	// Include relevant body parameters for deduplication
	let bodyKey = ''
	if (req.body) {
		// For bid requests, include product ID
		if (req.body.productId) {
			bodyKey += `_product:${req.body.productId}`
		}
		// For product requests, include product ID from params or body
		if (req.params.id) {
			bodyKey += `_id:${req.params.id}`
		}
		// For auth requests, include email
		if (req.body.email) {
			bodyKey += `_email:${req.body.email}`
		}
	}

	return `${userId}_${method}_${path}${bodyKey}`
}

/**
 * Request deduplication middleware
 * Prevents concurrent requests with the same key from being processed
 *
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Next middleware function
 */
const RequestDeduplication = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const requestKey = getRequestKey(req)

	// Check if there's already an ongoing request with the same key
	const existingRequest = ongoingRequests.get(requestKey)
	if (existingRequest) {
		console.log(
			chalk.yellow(`[Dedup] Duplicate request detected: ${requestKey}`)
		)
		return res.status(429).json({
			success: false,
			error: 'Yêu cầu đang được xử lý. Vui lòng đợi một chút.',
		})
	}

	// Create a promise for this request
	let resolveRequest: () => void
	const requestPromise = new Promise<void>((resolve) => {
		resolveRequest = resolve
	})

	// Store the ongoing request
	ongoingRequests.set(requestKey, requestPromise)

	console.log(chalk.blue(`[Dedup] Processing request: ${requestKey}`))

	// Override res.end to clean up when request completes
	const originalEnd = res.end
	res.end = function (this: Response, ...args: any[]) {
		// Clean up the ongoing request
		ongoingRequests.delete(requestKey)
		resolveRequest()

		// Call the original end method
		return originalEnd.apply(this, args as any)
	}

	// Handle cases where response is sent without calling end
	const originalSend = res.send
	res.send = function (this: Response, body: any) {
		// Clean up if not already cleaned
		if (ongoingRequests.has(requestKey)) {
			ongoingRequests.delete(requestKey)
			resolveRequest()
		}
		return originalSend.call(this, body)
	}

	// Handle errors
	res.on('error', () => {
		ongoingRequests.delete(requestKey)
		resolveRequest()
	})

	next()
}

export default RequestDeduplication
