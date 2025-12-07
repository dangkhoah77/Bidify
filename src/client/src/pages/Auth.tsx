import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/input/button'
import { Input } from '../components/ui/input/input'
import { Label } from '../components/ui/input/label'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '../components/ui/data-display/card'
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from '../components/ui/navigation/tabs'
import { Checkbox } from '../components/ui/input/checkbox'
import { useAuth } from '@/contexts/AuthContext'
import { Loader2, ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'
import { useRecaptcha } from '@/hooks/useRecaptcha'
const RECAPTCHA_SITE_KEY = process.env.REACT_APP_RECAPTCHA_SITE_KEY || ''
console.log('🔍 ENV check:')
console.log('Full process.env:', process.env)
console.log('Site Key value:', RECAPTCHA_SITE_KEY)
console.log('Site Key length:', RECAPTCHA_SITE_KEY.length)
console.log('Site Key type:', typeof RECAPTCHA_SITE_KEY)
export default function Auth() {
	const { login, register, verifyOtp, resendOtp } = useAuth()
	const { isReady, executeRecaptcha } = useRecaptcha(RECAPTCHA_SITE_KEY)
	// Login state
	const [loginEmail, setLoginEmail] = useState('')
	const [loginPassword, setLoginPassword] = useState('')
	const [loginLoading, setLoginLoading] = useState(false)
	const [rememberMe, setRememberMe] = useState(false)

	// Register state
	const [registerName, setRegisterName] = useState('')
	const [registerEmail, setRegisterEmail] = useState('')
	const [registerPassword, setRegisterPassword] = useState('')
	const [registerAddress, setRegisterAddress] = useState('')
	const [registerLoading, setRegisterLoading] = useState(false)

	// OTP state
	const [otp, setOtp] = useState('')
	const [showOtp, setShowOtp] = useState(false)
	const [otpLoading, setOtpLoading] = useState(false)
	const [otpEmail, setOtpEmail] = useState('')

	const navigate = useNavigate()

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault()
		setLoginLoading(true)

		try {
			const recaptchaToken = await executeRecaptcha('login')
			await login({
				email: loginEmail,
				password: loginPassword,
				recaptchaToken, // Gửi token lên backend
			})
		} catch (error) {
			console.error('Login error:', error)
		} finally {
			setLoginLoading(false)
		}
	}

	const handleRegister = async (e: React.FormEvent) => {
		e.preventDefault()
		setRegisterLoading(true)

		try {
			// Tách fullName thành firstName và lastName
			const nameParts = registerName.trim().split(' ')
			if (nameParts.length < 2) {
				toast.error(
					'Vui lòng nhập đầy đủ họ và tên (ví dụ: Nguyen Van A)'
				)
				return
			}
			if (!isReady) {
				toast.error('reCAPTCHA chưa sẵn sàng, vui lòng thử lại')
				return
			}
			const recaptchaToken = await executeRecaptcha('register')
			// firstName là phần tử đầu tiên
			const firstName = nameParts[0] || ''

			// lastName là phần còn lại (join lại nếu có nhiều từ)
			const lastName = nameParts.slice(1).join(' ') || ''

			const response = await register({
				firstName: firstName,
				lastName: lastName,
				email: registerEmail,
				password: registerPassword,
				address: registerAddress,
				recaptchaToken,
			})
			toast.success('Đăng ký thành công! Vui lòng kiểm tra email.')

			// ✅ Navigate to OTP verification page
			navigate('/verify-otp', {
				state: { email: response.email },
			})
			// Backend tự động login sau register, không cần OTP
			// Nếu backend của bạn CẦN OTP, uncomment dòng dưới:
			// setOtpEmail(registerEmail)
			// setShowOtp(true)
		} catch (error) {
			console.error('Register error:', error)
			toast.error(error.response?.data?.error || 'Đăng ký thất bại')
		} finally {
			setRegisterLoading(false)
		}
	}

	const handleVerifyOtp = async (e: React.FormEvent) => {
		e.preventDefault()
		setOtpLoading(true)

		try {
			await verifyOtp({
				email: otpEmail,
				otpCode: otp,
			})
		} catch (error) {
			console.error('OTP verification error:', error)
		} finally {
			setOtpLoading(false)
		}
	}

	const handleResendOtp = async () => {
		try {
			await resendOtp(otpEmail)
		} catch (error) {
			console.error('Resend OTP error:', error)
		}
	}

	// Show OTP verification form
	if (showOtp) {
		return (
			<div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-amber-50 p-4">
				<Card className="w-full max-w-md">
					<CardHeader>
						<CardTitle className="text-2xl">Xác thực OTP</CardTitle>
						<CardDescription>
							Nhập mã OTP đã được gửi đến email {otpEmail}
						</CardDescription>
					</CardHeader>
					<CardContent>
						<form onSubmit={handleVerifyOtp} className="space-y-4">
							<div className="space-y-2">
								<Label htmlFor="otp">Mã OTP</Label>
								<Input
									id="otp"
									type="text"
									placeholder="Nhập mã 6 số"
									value={otp}
									onChange={(e) => setOtp(e.target.value)}
									maxLength={6}
									required
								/>
							</div>

							<Button
								type="submit"
								className="w-full"
								disabled={otpLoading}
							>
								{otpLoading ? (
									<>
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
										Đang xác thực...
									</>
								) : (
									'Xác thực'
								)}
							</Button>

							<div className="text-center">
								<Button
									type="button"
									variant="link"
									onClick={handleResendOtp}
									className="text-sm"
								>
									Gửi lại mã OTP
								</Button>
							</div>

							<Button
								type="button"
								variant="outline"
								className="w-full"
								onClick={() => setShowOtp(false)}
							>
								Quay lại
							</Button>
						</form>
					</CardContent>
				</Card>
			</div>
		)
	}

	return (
		<div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-amber-50 p-4">
			{/* ✅ NEW: Back Button */}
			<div className="absolute top-4 left-4">
				<Button
					variant="ghost"
					size="sm"
					onClick={() => navigate('/')}
					className="gap-2"
				>
					<ArrowLeft className="h-4 w-4" />
					Quay lại trang chủ
				</Button>
			</div>
			<Card className="w-full max-w-md">
				<CardHeader className="text-center">
					<div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-amber-500">
						<span className="text-2xl font-bold text-white">A</span>
					</div>
					<CardTitle className="text-2xl">
						Chào mừng đến AuctionHub
					</CardTitle>
					<CardDescription>
						Đăng nhập hoặc tạo tài khoản để bắt đầu
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Tabs defaultValue="login" className="w-full">
						<TabsList className="grid w-full grid-cols-2">
							<TabsTrigger value="login">Đăng nhập</TabsTrigger>
							<TabsTrigger value="register">Đăng ký</TabsTrigger>
						</TabsList>

						{/* Login Tab */}
						<TabsContent value="login">
							<form onSubmit={handleLogin} className="space-y-4">
								<div className="space-y-2">
									<Label htmlFor="login-email">Email</Label>
									<Input
										id="login-email"
										type="email"
										placeholder="ten@example.com"
										value={loginEmail}
										onChange={(e) =>
											setLoginEmail(e.target.value)
										}
										required
									/>
								</div>

								<div className="space-y-2">
									<Label htmlFor="login-password">
										Mật khẩu
									</Label>
									<Input
										id="login-password"
										type="password"
										placeholder="••••••••"
										value={loginPassword}
										onChange={(e) =>
											setLoginPassword(e.target.value)
										}
										required
									/>
									{/* ✅ NEW: Forgot Password Link */}
									<div className="flex items-center justify-end mt-1">
										<Link
											to="/forgot-password"
											className="text-sm text-primary hover:underline"
										>
											Quên mật khẩu?
										</Link>
									</div>
								</div>

								<div className="flex items-center justify-between">
									<div className="flex items-center space-x-2">
										<Checkbox
											id="remember"
											checked={rememberMe}
											onCheckedChange={(checked) =>
												setRememberMe(
													checked as boolean
												)
											}
										/>
										<Label
											htmlFor="remember"
											className="text-sm font-normal"
										>
											Ghi nhớ đăng nhập
										</Label>
									</div>
								</div>

								<Button
									type="submit"
									className="w-full"
									disabled={loginLoading}
								>
									{loginLoading ? (
										<>
											<Loader2 className="mr-2 h-4 w-4 animate-spin" />
											Đang đăng nhập...
										</>
									) : (
										'Đăng nhập'
									)}
								</Button>
								{/* reCAPTCHA badge notice */}
								<p className="text-xs text-gray-500 text-center">
									Trang này được bảo vệ bởi reCAPTCHA và tuân
									thủ{' '}
									<a
										href="https://policies.google.com/privacy"
										target="_blank"
										rel="noopener noreferrer"
										className="underline"
									>
										Chính sách bảo mật
									</a>{' '}
									và{' '}
									<a
										href="https://policies.google.com/terms"
										target="_blank"
										rel="noopener noreferrer"
										className="underline"
									>
										Điều khoản dịch vụ
									</a>{' '}
									của Google.
								</p>
							</form>
						</TabsContent>

						{/* Register Tab */}
						<TabsContent value="register">
							<form
								onSubmit={handleRegister}
								className="space-y-4"
							>
								<div className="space-y-2">
									<Label htmlFor="register-name">
										Họ và tên
									</Label>
									<Input
										id="register-name"
										type="text"
										placeholder="Nguyễn Văn A"
										value={registerName}
										onChange={(e) =>
											setRegisterName(e.target.value)
										}
										required
									/>
								</div>
								<div className="space-y-2">
									<Label htmlFor="register-address">
										Địa chỉ
									</Label>
									<Input
										id="register-address"
										type="text"
										placeholder="227 Nguyễn Văn Cừ, phường Chợ Quán, TPHCM"
										value={registerAddress}
										onChange={(e) =>
											setRegisterAddress(e.target.value)
										}
										required
									/>
								</div>

								<div className="space-y-2">
									<Label htmlFor="register-email">
										Email
									</Label>
									<Input
										id="register-email"
										type="email"
										placeholder="ten@example.com"
										value={registerEmail}
										onChange={(e) =>
											setRegisterEmail(e.target.value)
										}
										required
									/>
								</div>

								<div className="space-y-2">
									<Label htmlFor="register-password">
										Mật khẩu
									</Label>
									<Input
										id="register-password"
										type="password"
										placeholder="••••••••"
										value={registerPassword}
										onChange={(e) =>
											setRegisterPassword(e.target.value)
										}
										required
									/>
								</div>

								{/* <div className="space-y-2">
									<Label htmlFor="register-address">
										Địa chỉ
									</Label>
									<Input
										id="register-address"
										type="text"
										placeholder="123 Đường ABC, Quận XYZ"
										value={registerAddress}
										onChange={(e) =>
											setRegisterAddress(e.target.value)
										}
										required
									/>
								</div> */}

								<Button
									type="submit"
									className="w-full"
									disabled={registerLoading}
								>
									{registerLoading ? (
										<>
											<Loader2 className="mr-2 h-4 w-4 animate-spin" />
											Đang đăng ký...
										</>
									) : (
										'Đăng ký'
									)}
								</Button>

								<p className="text-center text-sm text-gray-600">
									Bằng cách đăng ký, bạn đồng ý với{' '}
									<Link
										to="/terms"
										className="text-blue-600 hover:underline"
									>
										Điều khoản sử dụng
									</Link>
								</p>
								{/* reCAPTCHA badge notice */}
								<p className="text-xs text-gray-500 text-center">
									Trang này được bảo vệ bởi reCAPTCHA và tuân
									thủ{' '}
									<a
										href="https://policies.google.com/privacy"
										target="_blank"
										rel="noopener noreferrer"
										className="underline"
									>
										Chính sách bảo mật
									</a>{' '}
									và{' '}
									<a
										href="https://policies.google.com/terms"
										target="_blank"
										rel="noopener noreferrer"
										className="underline"
									>
										Điều khoản dịch vụ
									</a>{' '}
									của Google.
								</p>
							</form>
						</TabsContent>
					</Tabs>
				</CardContent>
			</Card>
		</div>
	)
}
