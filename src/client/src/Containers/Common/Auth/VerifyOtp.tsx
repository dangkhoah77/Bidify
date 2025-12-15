import React from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

import { OtpVerificationRequestData } from 'Shared/Data/Types/index.js'

import AuthController from 'Client/Controllers/AuthController.js'
import { usePage } from 'Client/Contexts/Page/index.js'
import VerifyOtpForm from 'Client/Components/Auth/VerifyOtpForm.js'

const VerifyOtpContainer: React.FC = () => {
	const navigate = useNavigate()

	const { setPageLoading, addNotification } = usePage()

	const [searchParams] = useSearchParams()
	const email = searchParams.get('email') || ''

	// Redirect if no email provided
	React.useEffect(() => {
		if (!email) {
			addNotification('Email không hợp lệ', 'error')
			navigate('/auth/login')
		}
	}, [email, navigate])

	/**
	 * Handles the OTP verification form submission.
	 *
	 * @param {OtpVerificationRequestData} data - The OTP verification data.
	 */
	const handleVerify = async (data: OtpVerificationRequestData) => {
		setPageLoading(true)

		try {
			const res = await AuthController.verifyOtp(data)
			const resData = await res.data

			if (resData.success && resData.data) {
				addNotification('Xác thực thành công', 'success')
				navigate('/auth/login')
			} else {
				throw new Error(resData.error)
			}
		} catch (error: any) {
			addNotification(
				error.message || 'Xác thực thất bại. Vui lòng thử lại.',
				'error'
			)
		} finally {
			setPageLoading(false)
		}
	}

	if (!email) return null

	return (
		<div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
			<VerifyOtpForm
				email={email}
				onSubmit={handleVerify}
				isLoading={false}
			/>
		</div>
	)
}

export default VerifyOtpContainer
