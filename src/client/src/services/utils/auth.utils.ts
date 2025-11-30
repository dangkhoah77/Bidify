import { jwtDecode } from 'jwt-decode'
import { TokenPayload, UserRole, AUTH_STORAGE_KEYS } from '../types/auth.types'

/**
 * Check if user has specific role
 */
export const hasRole = (
	userRoles: UserRole[],
	requiredRole: UserRole
): boolean => {
	return userRoles.includes(requiredRole)
}

/**
 * Check if user has any of the specified roles
 */
export const hasAnyRole = (
	userRoles: UserRole[],
	requiredRoles: UserRole[]
): boolean => {
	return requiredRoles.some((role) => userRoles.includes(role))
}

/**
 * Check if user has all specified roles
 */
export const hasAllRoles = (
	userRoles: UserRole[],
	requiredRoles: UserRole[]
): boolean => {
	return requiredRoles.every((role) => userRoles.includes(role))
}

/**
 * Decode JWT token
 */
export const decodeToken = (token: string): TokenPayload | null => {
	try {
		return jwtDecode<TokenPayload>(token)
	} catch (error) {
		console.error('Failed to decode token:', error)
		return null
	}
}

/**
 * Check if token is expired
 */
export const isTokenExpired = (token: string): boolean => {
	const decoded = decodeToken(token)
	if (!decoded) return true

	const currentTime = Date.now() / 1000
	return decoded.exp < currentTime
}

/**
 * Get access token from storage
 */
export const getAccessToken = (): string | null => {
	return localStorage.getItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN)
}

/**
 * Set access token to storage
 */
export const setAccessToken = (token: string): void => {
	localStorage.setItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN, token)
}

/**
 * Remove access token from storage
 */
export const removeAccessToken = (): void => {
	localStorage.removeItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN)
}

/**
 * Get refresh token from storage
 */
export const getRefreshToken = (): string | null => {
	return localStorage.getItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN)
}

/**
 * Set refresh token to storage
 */
export const setRefreshToken = (token: string): void => {
	localStorage.setItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN, token)
}

/**
 * Remove refresh token from storage
 */
export const removeRefreshToken = (): void => {
	localStorage.removeItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN)
}

/**
 * Clear all auth data from storage
 */
export const clearAuthStorage = (): void => {
	removeAccessToken()
	removeRefreshToken()
	localStorage.removeItem(AUTH_STORAGE_KEYS.USER)
}

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
	const token = getAccessToken()
	return !!token && !isTokenExpired(token)
}

/**
 * Calculate rating percentage
 */
export const calculateRatingPercentage = (
	positive: number,
	total: number
): number => {
	if (total === 0) return 0
	return Math.round((positive / total) * 100)
}

/**
 * Check if user can bid (rating >= 80% or no rating)
 */
export const canBid = (
	positive: number,
	total: number,
	allowUnrated: boolean = true
): boolean => {
	if (total === 0) return allowUnrated
	const percentage = calculateRatingPercentage(positive, total)
	return percentage >= 80
}

/**
 * Mask email for privacy
 */
export const maskEmail = (email: string): string => {
	const [username, domain] = email.split('@')
	if (username.length <= 2) return email

	const maskedUsername = username[0] + '****' + username[username.length - 1]
	return `${maskedUsername}@${domain}`
}

/**
 * Mask username for privacy (e.g., "Nguyen Van A" -> "****A")
 */
export const maskUsername = (name: string): string => {
	const parts = name.trim().split(' ')
	if (parts.length === 0) return '****'

	const lastName = parts[parts.length - 1]
	return `****${lastName}`
}

/**
 * Format user display name
 */
export const formatUserDisplayName = (user: {
	fullName: string
	email: string
}): string => {
	return user.fullName || user.email.split('@')[0]
}

/**
 * Check password strength
 */
export const checkPasswordStrength = (
	password: string
): {
	strength: 'weak' | 'medium' | 'strong'
	score: number
	feedback: string[]
} => {
	let score = 0
	const feedback: string[] = []

	// Length check
	if (password.length >= 8) score += 20
	else feedback.push('Mật khẩu phải có ít nhất 8 ký tự')

	// Uppercase check
	if (/[A-Z]/.test(password)) score += 20
	else feedback.push('Thêm chữ hoa')

	// Lowercase check
	if (/[a-z]/.test(password)) score += 20
	else feedback.push('Thêm chữ thường')

	// Number check
	if (/[0-9]/.test(password)) score += 20
	else feedback.push('Thêm số')

	// Special character check
	if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 20
	else feedback.push('Thêm ký tự đặc biệt')

	let strength: 'weak' | 'medium' | 'strong' = 'weak'
	if (score >= 80) strength = 'strong'
	else if (score >= 50) strength = 'medium'

	return { strength, score, feedback }
}

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
	return emailRegex.test(email)
}

/**
 * Generate OTP (for testing purposes only)
 */
export const generateOTP = (length: number = 6): string => {
	const digits = '0123456789'
	let otp = ''
	for (let i = 0; i < length; i++) {
		otp += digits[Math.floor(Math.random() * digits.length)]
	}
	return otp
}
