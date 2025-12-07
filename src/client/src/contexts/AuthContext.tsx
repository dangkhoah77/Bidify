import {
	createContext,
	useContext,
	useState,
	useEffect,
	ReactNode,
} from 'react'
import { useNavigate } from 'react-router-dom'
import { authApi } from '@/services'
import {
	User,
	LoginDto,
	RegisterDto,
	AuthContextType,
	VerifyOtpDto,
	ResetPasswordDto,
} from '@/services/types/auth.types'
import {
	setAccessToken,
	removeAccessToken,
	getAccessToken,
	isTokenExpired,
} from '@/services/utils/auth.utils'
import { toast } from 'sonner'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
	children: ReactNode
}
const getErrorMessage = (error: unknown): string => {
	if (error && typeof error === 'object' && 'response' in error) {
		const responseError = error as {
			response?: { data?: { message?: string } }
		}
		return responseError.response?.data?.message || 'Đã có lỗi xảy ra'
	}
	return 'Đã có lỗi xảy ra'
}
export const AuthProvider = ({ children }: AuthProviderProps) => {
	const [user, setUser] = useState<User | null>(null)
	const [isLoading, setIsLoading] = useState(true)
	const navigate = useNavigate()

	// Check if user is authenticated on mount
	useEffect(() => {
		const initAuth = async () => {
			const token = getAccessToken()
			console.log('Access token: ' + token)
			if (token && !isTokenExpired(token)) {
				try {
					console.log('🔄 Token exists, fetching user info...')
					await refreshUser()
				} catch (error) {
					console.error('❌ Failed to refresh user:', error)
					removeAccessToken()
					setUser(null)
				}
			} else {
				console.log('⚠️ No valid token found')
			}

			setIsLoading(false)
		}

		initAuth()
	}, [])

	const login = async (data: LoginDto) => {
		try {
			const response = await authApi.login(data)
			console.log('✅ Login response:', response)
			if (response.success) {
				let token = response.token
				console.log('📦 Raw token from backend:', token)
				if (token.startsWith('Bearer ')) {
					token = token.replace('Bearer ', '')
				}

				setAccessToken(token)
				setUser(response.user) // Sửa: response.user thay vì response.data.user
				console.log(response.user)
				toast.success('Đăng nhập thành công!')
				switch (response.user.role) {
					case 'ROLE ADMIN':
						navigate('/admin/categories')
						break
					case 'ROLE SELLER':
						navigate('/seller/products')
						break
					case 'ROLE BIDER': // Typo của backend
						navigate('/')
						break
					default:
						navigate('/')
				}
			}
		} catch (error: unknown) {
			toast.error(getErrorMessage(error))
			throw error
		}
	}

	const register = async (
		data: RegisterDto
	): Promise<{
		success: boolean
		message: string
		email: string
	}> => {
		try {
			const response = await authApi.register(data)
			console.log('✅ Register response:', response)

			// ✅ CHANGED: Don't auto-login anymore
			// User needs to verify OTP first

			if (response.success) {
				toast.success(
					response.message ||
						'Đăng ký thành công! Vui lòng kiểm tra email.'
				)

				// ✅ Return response so component can access email
				return {
					success: response.success,
					message: response.message,
					email: response.email,
				}
			}

			throw new Error('Registration failed')
		} catch (error: unknown) {
			toast.error(getErrorMessage(error))
			throw error
		}
	}

	const verifyOtp = async (data: VerifyOtpDto) => {
		try {
			const response = await authApi.verifyOTP(data.email, data.otpCode)

			if (response.success) {
				let token = response.token
				if (token.startsWith('Bearer ')) {
					token = token.replace('Bearer ', '')
				}

				setAccessToken(token)
				setUser(response.user) // Sửa: response.user
				toast.success('Xác thực OTP thành công!')
				navigate('/')
			}
		} catch (error: unknown) {
			toast.error(getErrorMessage(error))
			throw error
		}
	}

	const resendOtp = async (email: string) => {
		try {
			const response = await authApi.resendOTP(email)

			if (response.success) {
				toast.success('OTP mới đã được gửi đến email của bạn')
			}
		} catch (error: unknown) {
			toast.error(getErrorMessage(error))
			throw error
		}
	}

	const logout = async () => {
		try {
			await authApi.logout()
			removeAccessToken()
			setUser(null)
			toast.success('Đăng xuất thành công')
			navigate('/')
		} catch (error) {
			// Still logout even if API call fails
			removeAccessToken()
			setUser(null)
			navigate('/')
		}
	}

	const updateProfile = async (data: Partial<User>) => {
		try {
			// TODO: Implement update profile API
			setUser((prev) => (prev ? { ...prev, ...data } : null))
			toast.success('Cập nhật thông tin thành công')
		} catch (error: unknown) {
			toast.error('Cập nhật thông tin thất bại')
			throw error
		}
	}

	const refreshUser = async (): Promise<void> => {
		try {
			console.log('🔄 Calling getCurrentUser API...')
			const response = await authApi.getCurrentUser()

			if (response.success && response.user) {
				console.log('✅ User refreshed:', response.user.email)
				setUser(response.user)
			} else {
				console.log('⚠️ No user data in response')
				throw new Error('Failed to get user data')
			}
		} catch (error: any) {
			console.error('❌ Refresh user error:', error)
			console.error('Error status:', error.response?.status)

			// ✅ CHỈ xóa token nếu backend confirm token invalid
			if (
				error.response?.status === 401 ||
				error.response?.status === 403
			) {
				console.log('🔓 Token invalid (401/403), clearing...')
				removeAccessToken()
				setUser(null)
			} else {
				console.log('⚠️ Other error (network/server), keeping token')
				// Không xóa token - có thể là lỗi tạm thời
			}

			throw error
		}
	}

	const isAuthenticated = !!user

	return (
		<AuthContext.Provider
			value={{
				user,
				isAuthenticated,
				isLoading,
				login,
				register,
				logout,
				verifyOtp,
				resendOtp,
				updateProfile,
				refreshUser,
			}}
		>
			{children}
		</AuthContext.Provider>
	)
}

export const useAuth = () => {
	const context = useContext(AuthContext)

	if (!context) {
		throw new Error('useAuth must be used within AuthProvider')
	}

	return context
}
