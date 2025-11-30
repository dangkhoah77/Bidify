import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Button } from '@/components/ui/input/button'
import { Input } from '@/components/ui/input/input'
import { Label } from '@/components/ui/input/label'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/data-display/card'
import { Loader2, ArrowLeft, Mail, Lock, KeyRound } from 'lucide-react'
import { toast } from 'sonner'
import { useRecaptcha } from '@/hooks/useRecaptcha'
import { authApi } from '@/services/api/auth.api'

const RECAPTCHA_SITE_KEY = process.env.REACT_APP_RECAPTCHA_SITE_KEY || ''

type Step = 'email' | 'otp' | 'password'

export default function ForgotPassword() {
	const navigate = useNavigate()
	const { isReady, executeRecaptcha } = useRecaptcha(RECAPTCHA_SITE_KEY)

	const [step, setStep] = useState<Step>('email')
	const [loading, setLoading] = useState(false)

	// Step 1: Email
	const [email, setEmail] = useState('')

	// Step 2: OTP
	const [otp, setOtp] = useState('')
	const [resetToken, setResetToken] = useState('')

	// Step 3: New Password
	const [newPassword, setNewPassword] = useState('')
	const [confirmPassword, setConfirmPassword] = useState('')

	// Step 1: Request OTP
	const handleRequestOtp = async (e: React.FormEvent) => {
		e.preventDefault()
		setLoading(true)

		try {
			if (!isReady) {
				toast.error('reCAPTCHA chưa sẵn sàng, vui lòng thử lại')
				return
			}

			const recaptchaToken = await executeRecaptcha('forgot_password')

			await authApi.forgotPassword({
				email,
				recaptchaToken,
			})

			toast.success('Mã OTP đã được gửi đến email của bạn!')
			setStep('otp')
		} catch (error: any) {
			toast.error(
				error.response?.data?.error || 'Có lỗi xảy ra, vui lòng thử lại'
			)
		} finally {
			setLoading(false)
		}
	}

	// Step 2: Verify OTP
	const handleVerifyOtp = async (e: React.FormEvent) => {
		e.preventDefault()
		setLoading(true)

		try {
			const response = await authApi.verifyResetOtp({
				email,
				otp,
			})

			setResetToken(response.resetToken)
			toast.success('Xác thực OTP thành công! Vui lòng đặt mật khẩu mới.')
			setStep('password')
		} catch (error: any) {
			toast.error(error.response?.data?.error || 'Mã OTP không hợp lệ')
		} finally {
			setLoading(false)
		}
	}

	// Step 3: Reset Password
	const handleResetPassword = async (e: React.FormEvent) => {
		e.preventDefault()

		if (newPassword !== confirmPassword) {
			toast.error('Mật khẩu xác nhận không khớp!')
			return
		}

		if (newPassword.length < 6) {
			toast.error('Mật khẩu phải có ít nhất 6 ký tự!')
			return
		}

		setLoading(true)

		try {
			await authApi.resetPassword({
				resetToken,
				newPassword,
			})

			toast.success(
				'Đặt lại mật khẩu thành công! Bạn có thể đăng nhập ngay.'
			)
			setTimeout(() => navigate('/auth'), 1500)
		} catch (error: any) {
			toast.error(
				error.response?.data?.error || 'Có lỗi xảy ra, vui lòng thử lại'
			)
		} finally {
			setLoading(false)
		}
	}

	const handleResendOtp = () => {
		setStep('email')
		setOtp('')
		toast.info('Vui lòng nhập email để nhận mã OTP mới')
	}

	return (
		<div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-indigo-100">
			<Card className="w-full max-w-md shadow-xl">
				<CardHeader>
					<div className="flex items-center gap-3">
						<Link to="/auth">
							<Button variant="ghost" size="icon">
								<ArrowLeft className="h-5 w-5" />
							</Button>
						</Link>
						<div>
							<CardTitle className="text-2xl">
								Quên mật khẩu
							</CardTitle>
							<CardDescription className="mt-1">
								{step === 'email' &&
									'Nhập email để nhận mã OTP'}
								{step === 'otp' && 'Nhập mã OTP từ email'}
								{step === 'password' && 'Đặt mật khẩu mới'}
							</CardDescription>
						</div>
					</div>
				</CardHeader>

				<CardContent>
					{/* Step 1: Email */}
					{step === 'email' && (
						<form onSubmit={handleRequestOtp} className="space-y-4">
							<div className="space-y-2">
								<Label htmlFor="email">Email đăng ký</Label>
								<div className="relative">
									<Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
									<Input
										id="email"
										type="email"
										placeholder="email@example.com"
										className="pl-10"
										value={email}
										onChange={(e) =>
											setEmail(e.target.value)
										}
										required
									/>
								</div>
								<p className="text-sm text-gray-500">
									Chúng tôi sẽ gửi mã OTP gồm 6 chữ số đến
									email này
								</p>
							</div>

							<Button
								type="submit"
								className="w-full"
								disabled={loading || !isReady}
							>
								{loading && (
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								)}
								Gửi mã OTP
							</Button>

							<div className="text-center text-sm text-gray-600">
								Đã nhớ mật khẩu?{' '}
								<Link
									to="/auth"
									className="text-primary hover:underline font-medium"
								>
									Đăng nhập
								</Link>
							</div>
						</form>
					)}

					{/* Step 2: OTP */}
					{step === 'otp' && (
						<form onSubmit={handleVerifyOtp} className="space-y-4">
							<div className="space-y-2">
								<Label htmlFor="otp">Mã OTP</Label>
								<div className="relative">
									<KeyRound className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
									<Input
										id="otp"
										type="text"
										placeholder="123456"
										className="pl-10 text-center text-2xl font-bold tracking-widest"
										value={otp}
										onChange={(e) =>
											setOtp(
												e.target.value
													.replace(/\D/g, '')
													.slice(0, 6)
											)
										}
										maxLength={6}
										required
										autoFocus
									/>
								</div>
								<p className="text-sm text-gray-500">
									Mã OTP đã được gửi đến{' '}
									<strong>{email}</strong>
								</p>
							</div>

							<Button
								type="submit"
								className="w-full"
								disabled={loading || otp.length !== 6}
							>
								{loading && (
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								)}
								Xác nhận OTP
							</Button>

							<Button
								type="button"
								variant="outline"
								className="w-full"
								onClick={handleResendOtp}
								disabled={loading}
							>
								Gửi lại mã OTP
							</Button>
						</form>
					)}

					{/* Step 3: New Password */}
					{step === 'password' && (
						<form
							onSubmit={handleResetPassword}
							className="space-y-4"
						>
							<div className="space-y-2">
								<Label htmlFor="newPassword">
									Mật khẩu mới
								</Label>
								<div className="relative">
									<Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
									<Input
										id="newPassword"
										type="password"
										placeholder="Ít nhất 6 ký tự"
										className="pl-10"
										value={newPassword}
										onChange={(e) =>
											setNewPassword(e.target.value)
										}
										required
										autoFocus
									/>
								</div>
							</div>

							<div className="space-y-2">
								<Label htmlFor="confirmPassword">
									Xác nhận mật khẩu
								</Label>
								<div className="relative">
									<Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
									<Input
										id="confirmPassword"
										type="password"
										placeholder="Nhập lại mật khẩu"
										className="pl-10"
										value={confirmPassword}
										onChange={(e) =>
											setConfirmPassword(e.target.value)
										}
										required
									/>
								</div>
							</div>

							<Button
								type="submit"
								className="w-full"
								disabled={loading}
							>
								{loading && (
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								)}
								Đặt lại mật khẩu
							</Button>
						</form>
					)}
				</CardContent>
			</Card>
		</div>
	)
}
