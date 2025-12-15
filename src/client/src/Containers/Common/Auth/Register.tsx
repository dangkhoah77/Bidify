import React from 'react'
import { useNavigate } from 'react-router-dom'

import { SignupRequestData } from 'Shared/Data/Types/index.js'

import { useAuth } from 'Client/Contexts/Auth/index.js'
import { usePage } from 'Client/Contexts/Page/index.js'
import RegisterForm from 'Client/Components/Auth/RegisterForm.js'

/**
 * Register Container.
 * Manages the registration logic, API calls, and redirection.
 */
const RegisterContainer: React.FC = () => {
	const navigate = useNavigate()

	const { register } = useAuth()
	const { pageState, setPageLoading, addNotification } = usePage()

	/**
	 * Handles the form submission logic.
	 *
	 * @param {SignupRequestData} data - The registration data.
	 */
	const handleRegister = async (data: SignupRequestData) => {
		setPageLoading(true)

		try {
			await register(data)

			// Signal success and redirect to home page
			addNotification(
				'Đăng ký thành công! Chào mừng bạn đến với AuctionHub.',
				'success'
			)

			// Redirect to OTP Verification page with email pre-filled
			navigate(
				`/auth/verify-otp?email=${encodeURIComponent(data.email || '')}`
			)
		} catch (error: any) {
			addNotification(
				error.message ||
					'Đăng ký thất bại. Vui lòng kiểm tra lại thông tin.',
				'error'
			)
		} finally {
			setPageLoading(false)
		}
	}

	return (
		<div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
			<RegisterForm
				onSubmit={handleRegister}
				isLoading={pageState.loading}
			/>
		</div>
	)
}

export default RegisterContainer
