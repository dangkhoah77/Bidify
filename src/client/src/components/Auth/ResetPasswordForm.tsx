import React, { useState } from 'react'

import { ResetPasswordRequestData } from 'Shared/Data/Types/index.js'

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
 * Form for resetting password.
 *
 * @param props - The component props.
 */
const ResetPasswordForm: React.FC<{
	token: string
	onSubmit: (data: ResetPasswordRequestData) => void
	isLoading: boolean
}> = ({ token, onSubmit, isLoading }) => {
	const [password, setPassword] = useState('')
	const [confirm, setConfirm] = useState('')
	const [error, setError] = useState('')

	/**
	 * Handles form submission.
	 *
	 * @param e - Form event
	 */
	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		if (password !== confirm) {
			setError('Mật khẩu nhập lại không khớp')
			return
		}
		onSubmit({ token, newPassword: password })
	}

	return (
		<Card className="w-full max-w-md mx-auto">
			<CardHeader>
				<CardTitle>Đặt lại mật khẩu</CardTitle>
				<CardDescription>
					Nhập mật khẩu mới cho tài khoản của bạn
				</CardDescription>
			</CardHeader>
			<CardContent>
				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="password">Mật khẩu mới</Label>
						<Input
							id="password"
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="confirm">Nhập lại mật khẩu</Label>
						<Input
							id="confirm"
							type="password"
							value={confirm}
							onChange={(e) => setConfirm(e.target.value)}
							required
						/>
					</div>
					{error && (
						<p className="text-sm text-destructive">{error}</p>
					)}
					<Button
						type="submit"
						className="w-full"
						disabled={isLoading}
					>
						Đặt lại mật khẩu
					</Button>
				</form>
			</CardContent>
		</Card>
	)
}

export default ResetPasswordForm
