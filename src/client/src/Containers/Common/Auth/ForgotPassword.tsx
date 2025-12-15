import React from 'react'

import { ForgotPasswordRequestData } from 'Shared/Data/Types/index.js'

import AuthController from 'Client/Controllers/AuthController.js'
import { usePage } from 'Client/Contexts/Page/index.js'
import ForgotPasswordForm from 'Client/Components/Auth/ForgotPasswordForm.js'

/**
 * Forgot Password Container.
 * Manages the forgot password logic and API calls.
 */
const ForgotPasswordContainer: React.FC = () => {
	const { setPageLoading, addNotification } = usePage()

	/**
	 * Handles the forgot password form submission.
	 *
	 * @param {ForgotPasswordRequestData} data - The forgot password data.
	 */
	const handleSubmit = async (data: ForgotPasswordRequestData) => {
		setPageLoading(true)

		try {
			const res = await AuthController.forgotPassword(data)
			const resData = res.data

			if (resData.success) {
				addNotification(
					'Đã gửi email khôi phục. Vui lòng kiểm tra hộp thư.',
					'success'
				)
			} else {
				throw new Error(resData.error)
			}
		} catch (error: any) {
			addNotification(error.message || 'Có lỗi xảy ra', 'error')
		} finally {
			setPageLoading(false)
		}
	}

	return (
		<div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
			<ForgotPasswordForm onSubmit={handleSubmit} isLoading={false} />
		</div>
	)
}

export default ForgotPasswordContainer
