import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Eye, EyeOff, Loader2 } from 'lucide-react'

import type { LoginRequestData } from 'Shared/Data/Types/index.js'
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
 * Login Form Component.
 * Handles user input for email/username and password.
 *
 * @param {LoginFormProps} props - Component props
 */
const LoginForm: React.FC<{
	onSubmit: (data: LoginRequestData) => void
	isLoading: boolean
}> = ({ onSubmit, isLoading }) => {
	const [showPassword, setShowPassword] = useState(false)
	const [formData, setFormData] = useState<LoginRequestData>({
		credential: '',
		password: '',
	})

	/**
	 * Handles form submission.
	 *
	 * @param e - Form event
	 */
	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		onSubmit(formData)
	}

	/**
	 * Handles input field changes.
	 *
	 * @param e - Input change event
	 */
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target
		setFormData((prev) => ({ ...prev, [name]: value }))
	}

	return (
		<Card className="w-full max-w-md mx-auto">
			<CardHeader className="space-y-1">
				<CardTitle className="text-2xl font-bold">Đăng nhập</CardTitle>
				<CardDescription>
					Nhập email của bạn để tiếp tục
				</CardDescription>
			</CardHeader>
			<form onSubmit={handleSubmit}>
				<CardContent className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="credential">
							Email / Tên đăng nhập
						</Label>
						<Input
							id="credential"
							name="credential"
							placeholder="name@example.com"
							required
							disabled={isLoading}
							value={formData.credential}
							onChange={handleChange}
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="password">Mật khẩu</Label>
						<div className="relative">
							<Input
								id="password"
								name="password"
								type={showPassword ? 'text' : 'password'}
								required
								disabled={isLoading}
								value={formData.password}
								onChange={handleChange}
							/>
							<Button
								type="button"
								variant="ghost"
								size="sm"
								className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
								onClick={() => setShowPassword(!showPassword)}
							>
								{showPassword ? (
									<EyeOff className="h-4 w-4 text-muted-foreground" />
								) : (
									<Eye className="h-4 w-4 text-muted-foreground" />
								)}
							</Button>
						</div>
						<div className="flex justify-end">
							<Link
								to="/auth/forgot-password"
								className="text-sm text-primary hover:underline"
							>
								Quên mật khẩu?
							</Link>
						</div>
					</div>
				</CardContent>
				<CardFooter className="flex flex-col gap-4">
					<Button
						type="submit"
						className="w-full"
						disabled={isLoading}
					>
						{isLoading && (
							<Loader2 className="mr-2 h-4 w-4 animate-spin" />
						)}
						Đăng nhập
					</Button>
					<div className="text-center text-sm">
						Chưa có tài khoản?{' '}
						<Link
							to="/auth/register"
							className="text-primary hover:underline"
						>
							Đăng ký ngay
						</Link>
					</div>
				</CardFooter>
			</form>
		</Card>
	)
}

export default LoginForm
