import React, { useState } from 'react'

import { OtpVerificationRequestData } from 'Shared/Data/Types/index.js'

import { Button } from 'Client/Components/UI/input/button.js'
import { Input } from 'Client/Components/UI/input/input.js'
import { Label } from 'Client/Components/UI/input/label.js'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from 'Client/Components/UI/display/card.js'

/**
 * VerifyOtpForm component props.
 *
 * @param props - The component props.
 */
const VerifyOtpForm: React.FC<{
	email: string
	onSubmit: (data: OtpVerificationRequestData) => void
	isLoading: boolean
}> = ({ email, onSubmit, isLoading }) => {
	const [otp, setOtp] = useState('')

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		onSubmit({ email, otp })
	}

	return (
		<Card className="w-full max-w-md mx-auto">
			<CardHeader>
				<CardTitle>Xác thực tài khoản</CardTitle>
				<CardDescription>
					Vui lòng nhập mã OTP đã được gửi đến{' '}
					<strong>{email}</strong>
				</CardDescription>
			</CardHeader>
			<CardContent>
				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="otp">Mã xác thực (OTP)</Label>
						<Input
							id="otp"
							value={otp}
							onChange={(e) => setOtp(e.target.value)}
							placeholder="Nhập 6 số..."
							className="text-center text-2xl tracking-widest"
							maxLength={6}
							required
						/>
					</div>
					<Button
						type="submit"
						className="w-full"
						disabled={isLoading || otp.length < 6}
					>
						Xác thực
					</Button>
				</form>
			</CardContent>
		</Card>
	)
}

export default VerifyOtpForm
