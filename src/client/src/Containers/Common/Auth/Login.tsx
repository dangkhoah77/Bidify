import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

import { LoginRequestData } from 'Shared/Data/Types/index.js'

import { useAuth } from 'Client/Contexts/Auth/index.js'
import { usePage } from 'Client/Contexts/Page/index.js'
import LoginForm from 'Client/Components/Auth/LoginForm.js'

/**
 * Manages the login logic, API calls, and redirection.
 */
const LoginContainer: React.FC = () => {
	const navigate = useNavigate()
	const location = useLocation()

	const { login } = useAuth()
	const { pageState, setPageLoading, addNotification } = usePage()

	// Helper to get the redirect path
	const from = location.state?.from?.pathname || '/'

	/**
	 * Handles the form submission logic.
	 *
	 * @param {LoginRequestData} data - The login credentials.
	 */
	const handleLogin = async (data: LoginRequestData) => {
		setPageLoading(true)

		try {
			await login(data)

			// Signal success and redirect to the intended page
			addNotification('Đăng nhập thành công!', 'success')
			navigate(from, { replace: true })
		} catch (error: any) {
			addNotification(
				error.message || 'Đăng nhập thất bại. Vui lòng thử lại.',
				'error'
			)
		} finally {
			setPageLoading(false)
		}
	}

	return (
		<div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
			<LoginForm onSubmit={handleLogin} isLoading={pageState.loading} />
		</div>
	)
}

export default LoginContainer
