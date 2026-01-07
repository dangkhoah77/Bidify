import { Request, Response } from 'express'

/**
 * Higher-order function to handle async route handlers with error catching.
 *
 * @param handler - The async route handler function.
 * @returns A new function that wraps the handler with error handling.
 */
const Handle = (
	handler: (req: Request, res: Response) => Promise<Response>
) => {
	return async (req: Request, res: Response) => {
		try {
			return await handler(req, res)
		} catch (error) {
			console.error(`Error in handler: ${error}`)
			res.status(500).send({
				success: false,
				message:
					'Có lỗi xảy ra khi xử lý yêu cầu của bạn. Vui lòng thử lại sau.',
			})
		}
	}
}

export default Handle
