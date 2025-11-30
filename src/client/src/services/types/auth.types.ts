// ============================================
// Auth DTOs (Data Transfer Objects)
// ============================================

export interface LoginDto {
	email: string
	password: string
	recaptchaToken?: string
}

export interface RegisterDto {
	email: string
	firstName: string
	lastName: string
	password: string
	recaptchaToken?: string
}

export interface VerifyOtpDto {
	email: string
	otpCode: string
}

export interface ResendOtpDto {
	email: string
}

export interface ForgotPasswordDto {
	email: string
}

export interface ResetPasswordDto {
	email: string
	otpCode: string
	newPassword: string
}

export interface ChangePasswordDto {
	oldPassword: string
	newPassword: string
}

export interface GoogleAuthDto {
	credential: string // Google OAuth token
}

// ============================================
// Auth Response Types
// ============================================

export interface AuthResponse {
	success: boolean
	token: string // Backend trả "token", không phải "accessToken"
	user: User
}

export interface User {
	id: string
	email: string
	fullName: string
	address?: string
	dateOfBirth?: Date | string
	avatar?: string
	roles: UserRole[]
	isEmailVerified: boolean
	rating: UserRating
	upgradeRequest?: UpgradeRequest
	createdAt: Date | string
	updatedAt: Date | string
}

export interface UserRating {
	positive: number
	negative: number
	total: number
	percentage: number // Calculated: (positive / total) * 100
}

export interface UpgradeRequest {
	status: UpgradeStatus
	requestedAt?: Date | string
	reviewedAt?: Date | string
	reviewedBy?: string
	rejectionReason?: string
}

// ============================================
// Enums
// ============================================

export enum UserRole {
	GUEST = 'guest',
	BIDDER = 'bidder',
	SELLER = 'seller',
	ADMIN = 'admin',
}

export enum UpgradeStatus {
	NONE = 'none',
	PENDING = 'pending',
	APPROVED = 'approved',
	REJECTED = 'rejected',
}

// ============================================
// Auth Context Types
// ============================================

export interface AuthContextType {
	user: User | null
	isAuthenticated: boolean
	isLoading: boolean
	login: (data: LoginDto) => Promise<void>
	register: (data: RegisterDto) => Promise<void>
	logout: () => Promise<void>
	verifyOtp: (data: VerifyOtpDto) => Promise<void>
	resendOtp: (email: string) => Promise<void>
	forgotPassword: (email: string) => Promise<void>
	resetPassword: (data: ResetPasswordDto) => Promise<void>
	updateProfile: (data: Partial<User>) => Promise<void>
	refreshUser: () => Promise<void>
}

// ============================================
// Token Types
// ============================================

export interface TokenPayload {
	userId: string
	email: string
	roles: UserRole[]
	iat: number
	exp: number
}

export interface RefreshTokenResponse {
	accessToken: string
	refreshToken: string
}

// ============================================
// Permission Types
// ============================================

export interface Permission {
	resource: string
	actions: PermissionAction[]
}

export enum PermissionAction {
	CREATE = 'create',
	READ = 'read',
	UPDATE = 'update',
	DELETE = 'delete',
}

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
	[UserRole.GUEST]: [
		{
			resource: 'products',
			actions: [PermissionAction.READ],
		},
		{
			resource: 'categories',
			actions: [PermissionAction.READ],
		},
	],
	[UserRole.BIDDER]: [
		{
			resource: 'products',
			actions: [PermissionAction.READ],
		},
		{
			resource: 'bids',
			actions: [PermissionAction.CREATE, PermissionAction.READ],
		},
		{
			resource: 'watchlist',
			actions: [
				PermissionAction.CREATE,
				PermissionAction.READ,
				PermissionAction.DELETE,
			],
		},
		{
			resource: 'questions',
			actions: [PermissionAction.CREATE, PermissionAction.READ],
		},
		{
			resource: 'profile',
			actions: [PermissionAction.READ, PermissionAction.UPDATE],
		},
	],
	[UserRole.SELLER]: [
		{
			resource: 'products',
			actions: [
				PermissionAction.CREATE,
				PermissionAction.READ,
				PermissionAction.UPDATE,
			],
		},
		{
			resource: 'bids',
			actions: [PermissionAction.READ, PermissionAction.DELETE], // Delete = reject
		},
		{
			resource: 'questions',
			actions: [PermissionAction.READ, PermissionAction.UPDATE], // Update = answer
		},
	],
	[UserRole.ADMIN]: [
		{
			resource: '*',
			actions: [
				PermissionAction.CREATE,
				PermissionAction.READ,
				PermissionAction.UPDATE,
				PermissionAction.DELETE,
			],
		},
	],
}

// ============================================
// Validation Types
// ============================================

export interface ValidationError {
	field: string
	message: string
}

export interface AuthError {
	message: string
	statusCode: number
	errors?: ValidationError[]
}

// ============================================
// Storage Keys
// ============================================

export const AUTH_STORAGE_KEYS = {
	ACCESS_TOKEN: 'token',
	REFRESH_TOKEN: 'refreshToken',
	USER: 'user',
	REMEMBER_ME: 'rememberMe',
} as const

// ============================================
// Helper Types
// ============================================

export type LoginResponse = AuthResponse
export type RegisterResponse = { userId: string; message: string }
export type OtpResponse = { message: string }
export type LogoutResponse = { message: string }
