import { apiClient } from '../config/axios.config'
import { API_ENDPOINTS } from '../config/endpoints'
import { LoginDto, RegisterDto, AuthResponse, User } from '../types/auth.types'

export interface ForgotPasswordRequest {
	email: string
	recaptchaToken: string
}

export interface VerifyResetOtpRequest {
	email: string
	otp: string
}

export interface ResetPasswordRequest {
	resetToken: string
	newPassword: string
}

export const authApi = {
	// Return AuthResponse trực tiếp, không wrap ApiResponse
	login: async (data: LoginDto): Promise<AuthResponse> => {
		const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, data)
		return response.data
	},

	register: async (
		data: RegisterDto
	): Promise<{
		success: boolean
		message: string
		email: string
	}> => {
		const response = await apiClient.post(API_ENDPOINTS.AUTH.REGISTER, data)
		return response.data
	},

	verifyOTP: async (
		email: string,
		otpCode: string
	): Promise<AuthResponse> => {
		const response = await apiClient.post(API_ENDPOINTS.AUTH.VERIFY_OTP, {
			email,
			otpCode,
		})
		return response.data
	},

	resendOTP: async (
		email: string
	): Promise<{ success: boolean; message?: string }> => {
		const response = await apiClient.post(API_ENDPOINTS.AUTH.RESEND_OTP, {
			email,
		})
		return response.data
	},

	// ✅ UPDATED: Request OTP for password reset
	forgotPassword: async (
		data: ForgotPasswordRequest
	): Promise<{ success: boolean; message: string }> => {
		const response = await apiClient.post(
			API_ENDPOINTS.AUTH.FORGOT_PASSWORD,
			data
		)
		return response.data
	},

	// ✅ NEW: Verify reset OTP and get reset token
	verifyResetOtp: async (
		data: VerifyResetOtpRequest
	): Promise<{ success: boolean; message: string; resetToken: string }> => {
		const response = await apiClient.post(
			API_ENDPOINTS.AUTH.VERIFY_RESET_OTP,
			data
		)
		return response.data
	},

	// ✅ UPDATED: Reset password with token
	resetPassword: async (
		data: ResetPasswordRequest
	): Promise<{ success: boolean; message: string }> => {
		const response = await apiClient.post(
			API_ENDPOINTS.AUTH.RESET_PASSWORD,
			data
		)
		return response.data
	},

	logout: async (): Promise<void> => {
		await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT)
	},
	getCurrentUser: async (): Promise<{ success: boolean; user: User }> => {
		const response = await apiClient.get(
			API_ENDPOINTS.AUTH.GET_CURRENT_USER
		)
		return response.data
	},
}
