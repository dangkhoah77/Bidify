import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Eye, EyeOff, Loader2 } from 'lucide-react'

import type { SignupRequestData } from 'Shared/Data/Types/index.js'

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
 * Register Form Component.
 * Handles new user registration fields.
 *
 * @param {RegisterFormProps} props - Component props
 */
const RegisterForm: React.FC<{
	onSubmit: (data: SignupRequestData) => void
	isLoading: boolean
}> = ({ onSubmit, isLoading }) => {
	const [showPassword, setShowPassword] = useState(false)
	const [formData, setFormData] = useState<SignupRequestData>({
		firstName: '',
		lastName: '',
		email: '',
		password: '',
		phoneNumber: '',
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
				<CardTitle className="text-2xl font-bold">
					Đăng ký tài khoản
				</CardTitle>
				<CardDescription>
					Tạo tài khoản để tham gia đấu giá ngay
				</CardDescription>
			</CardHeader>
			<form onSubmit={handleSubmit}>
				<CardContent className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="username">Họ</Label>
						<Input
							id="username"
							name="username"
							required
							disabled={isLoading}
							value={formData.firstName}
							onChange={handleChange}
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="username">Tên</Label>
						<Input
							id="username"
							name="username"
							required
							disabled={isLoading}
							value={formData.lastName}
							onChange={handleChange}
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="email">Email</Label>
						<Input
							id="email"
							name="email"
							type="email"
							required
							disabled={isLoading}
							value={formData.email}
							onChange={handleChange}
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="phoneNumber">Số điện thoại</Label>
						<Input
							id="phoneNumber"
							name="phoneNumber"
							type="tel"
							disabled={isLoading}
							value={formData.phoneNumber}
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
						Đăng ký
					</Button>
					<div className="text-center text-sm">
						Đã có tài khoản?{' '}
						<Link
							to="/auth/login"
							className="text-primary hover:underline"
						>
							Đăng nhập
						</Link>
					</div>
				</CardFooter>
			</form>
		</Card>
	)
}

export default RegisterForm
