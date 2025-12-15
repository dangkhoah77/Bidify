import React from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

import { ResetPasswordRequestData } from 'Shared/Data/Types/index.js'

import AuthController from 'Client/Controllers/AuthController.js'
import { usePage } from 'Client/Contexts/Page/index.js'
import ResetPasswordForm from 'Client/Components/Auth/ResetPasswordForm.js'

/**
 * Reset Password Container.
 * Manages the reset password logic, API calls, and redirection.
 */
const ResetPasswordContainer: React.FC = () => {
	const [searchParams] = useSearchParams()
	const token = searchParams.get('token') || ''

	const navigate = useNavigate()
	const { setPageLoading, addNotification } = usePage()

	// Redirect if no token provided
	React.useEffect(() => {
		if (!token) {
			addNotification('Token không hợp lệ', 'error')
			navigate('/auth/login')
		}
	}, [token])

	/**
	 * Handles the reset password form submission.
	 *
	 * @param {ResetPasswordRequestData} data - The reset password data.
	 */
	const handleSubmit = async (data: ResetPasswordRequestData) => {
		setPageLoading(true)

		try {
			const res = await AuthController.resetPassword(data)
			const resData = res.data

			if (resData.success) {
				addNotification(
					'Đổi mật khẩu thành công. Vui lòng đăng nhập.',
					'success'
				)
				navigate('/auth/login')
			} else {
				throw new Error(resData.error)
			}
		} catch (error: any) {
			addNotification(
				error.message || 'Đổi mật khẩu thất bại. Vui lòng thử lại.',
				'error'
			)
		} finally {
			setPageLoading(false)
		}
	}

	if (!token) return null

	return (
		<div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
			<ResetPasswordForm
				token={token}
				onSubmit={handleSubmit}
				isLoading={false}
			/>
		</div>
	)
}

export default ResetPasswordContainer
