import React, { useState } from 'react'
import { Link } from 'react-router-dom'

import { ForgotPasswordRequestData } from 'Shared/Data/Types/index.js'

import { Button } from 'Client/Components/UI/input/button.js'
import { Input } from 'Client/Components/UI/input/input.js'
import { Label } from 'Client/Components/UI/input/label.js'
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from 'Client/Components/UI/display/card.js'

/**
 * Form for forgot password functionality.
 *
 * @param props - The component props.
 */
const ForgotPasswordForm: React.FC<{
	onSubmit: (data: ForgotPasswordRequestData) => void
	isLoading: boolean
}> = ({ onSubmit, isLoading }) => {
	const [email, setEmail] = useState('')

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		onSubmit({ email })
	}

	return (
		<Card className="w-full max-w-md mx-auto">
			<CardHeader>
				<CardTitle>Quên mật khẩu?</CardTitle>
				<CardDescription>
					Nhập email của bạn và chúng tôi sẽ gửi liên kết đặt lại mật
					khẩu.
				</CardDescription>
			</CardHeader>
			<form onSubmit={handleSubmit}>
				<CardContent className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="email">Email</Label>
						<Input
							id="email"
							type="email"
							placeholder="name@example.com"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
						/>
					</div>
				</CardContent>
				<CardFooter className="flex flex-col gap-4">
					<Button
						type="submit"
						className="w-full"
						disabled={isLoading}
					>
						Gửi liên kết xác nhận
					</Button>
					<Link
						to="/auth/login"
						className="text-sm text-center text-primary hover:underline"
					>
						Quay lại đăng nhập
					</Link>
				</CardFooter>
			</form>
		</Card>
	)
}

export default ForgotPasswordForm
