import { useState, useEffect } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
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
import { Loader2, ArrowLeft, Mail, KeyRound } from 'lucide-react'
import { toast } from 'sonner'
import { useAuth } from '@/contexts/AuthContext'

export default function VerifyOTP() {
	const navigate = useNavigate()
	const location = useLocation()
	const { verifyOtp, resendOtp } = useAuth()

	// Get email from navigation state
	const email = location.state?.email || ''

	const [otp, setOtp] = useState('')
	const [loading, setLoading] = useState(false)
	const [resending, setResending] = useState(false)

	// Redirect if no email
	useEffect(() => {
		if (!email) {
			toast.error('No email provided. Please register again.')
			navigate('/auth')
		}
	}, [email, navigate])

	const handleVerifyOtp = async (e: React.FormEvent) => {
		e.preventDefault()
		setLoading(true)

		try {
			await verifyOtp({ email, otpCode: otp })
			// Auth context will handle navigation to home
		} catch (error: any) {
			toast.error(error.response?.data?.error || 'Invalid or expired OTP')
		} finally {
			setLoading(false)
		}
	}

	const handleResendOtp = async () => {
		setResending(true)

		try {
			await resendOtp(email)
			setOtp('') // Clear input
		} catch (error: any) {
			toast.error(error.response?.data?.error || 'Failed to resend OTP')
		} finally {
			setResending(false)
		}
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
								Xác thực Email
							</CardTitle>
							<CardDescription className="mt-1">
								Nhập mã OTP đã được gửi đến email của bạn
							</CardDescription>
						</div>
					</div>
				</CardHeader>

				<CardContent>
					<form onSubmit={handleVerifyOtp} className="space-y-4">
						<div className="flex items-center justify-center p-4 bg-blue-50 rounded-lg">
							<Mail className="h-5 w-5 text-blue-600 mr-2" />
							<span className="text-sm text-blue-900 font-medium">
								{email}
							</span>
						</div>

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
								Mã OTP gồm 6 chữ số, có hiệu lực trong 10 phút
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
							Xác nhận
						</Button>

						<Button
							type="button"
							variant="outline"
							className="w-full"
							onClick={handleResendOtp}
							disabled={resending}
						>
							{resending && (
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							)}
							Gửi lại mã OTP
						</Button>

						<div className="text-center text-sm text-gray-600">
							Chưa nhận được email?{' '}
							<span className="text-gray-500">
								Kiểm tra thư mục spam hoặc
							</span>
							<button
								type="button"
								onClick={handleResendOtp}
								className="text-primary hover:underline font-medium ml-1"
								disabled={resending}
							>
								gửi lại
							</button>
						</div>
					</form>
				</CardContent>
			</Card>
		</div>
	)
}
