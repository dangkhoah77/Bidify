import express, { Request, Response } from 'express'
import assert from 'assert'
import jwt from 'jsonwebtoken'
import passport from 'passport'

import {
	LoginRequestData,
	RegisterRequestData,
	ResendOtpRequestData,
	ForgotPasswordRequestData,
	ResetPasswordWithTokenRequestData,
	ResetPasswordRequestData,
	OtpVerificationRequestData,
} from 'Shared/Data/Types/index.js'

import Keys from 'Server/Config/Keys.js'

import { UserDocument } from 'Server/Models/User/index.js'

import Auth from 'Server/Middleware/Auth.js'
import Validate from 'Server/Middleware/Validate.js'
import Deduplicate from 'Server/Middleware/Deduplicate.js'
import Handler from 'Server/Middleware/Handler.js'

import {
	// Validations
	ValidateEmail,
	ValidatePassword,
	ValidateCurrentPassword,
	ValidateNewPassword,
	ValidateFirstName,
	ValidateLastName,
	ValidateCaptchaToken,
	ValidateOptToken,
	ValidateResetToken,

	// Handlers
	GetCurrentUser,
	Login,
	SendRegistrationOtp,
	ResendRegistrationOtp,
	VerifyRegistrationOtp,
	ForgotPassword,
	ResetPassword,
	ResetPasswordWithToken,
} from 'Server/Services/AuthService/index.js'

/** Router for authentication-related routes */
const router = express.Router()

// Extract JWT secret and token life from config
const { secret, tokenLife } = Keys.jwt
assert(secret, 'JWT secret is not configured.')
assert(tokenLife, 'JWT token life is not configured.')

/**
 * Route to get the currently authenticated user.
 *
 * @route GET /api/auth/me
 */
router.get(
	'/me',
	Auth,
	Handler(async (req: Request, res: Response) => {
		const user = req.user as UserDocument

		const result = await GetCurrentUser(user)
		return res.status(result.status).json(result.data)
	})
)

/**
 * Login route.
 * Authenticates user with email and password.
 *
 * @route POST /api/auth/login
 */
router.post(
	'/login',
	Validate([ValidateEmail('email'), ValidatePassword('password')]),
	Deduplicate,
	Handler(async (req: Request, res: Response) => {
		const { email, password } = req.body as LoginRequestData

		const result = await Login(email, password)
		return res.status(result.status).json(result.data)
	})
)

/**
 * Registration route.
 * Sends an OTP to the user's email for verification.
 *
 * @route POST /api/auth/register
 */
router.post(
	'/register',
	Validate([
		ValidateEmail('email'),
		ValidatePassword('password'),
		ValidateFirstName('firstName'),
		ValidateLastName('lastName'),
		ValidateCaptchaToken('captchaToken'),
	]),
	Deduplicate,
	Handler(async (req: Request, res: Response) => {
		const { email, firstName, lastName, password, captchaToken } =
			req.body as RegisterRequestData

		const result = await SendRegistrationOtp(
			email,
			password,
			firstName,
			lastName,
			captchaToken
		)
		return res.status(result.status).json(result.data)
	})
)

/**
 * Resend OTP route.
 * Resends the OTP to the user's email during registration.
 *
 * @route POST /api/auth/register/resend-otp
 */
router.post(
	'/register/resend-otp',
	Validate([ValidateEmail('email')]),
	Deduplicate,
	Handler(async (req: Request, res: Response) => {
		const { email } = req.body as { email: string } as ResendOtpRequestData

		const result = await ResendRegistrationOtp(email)
		return res.status(result.status).json(result.data)
	})
)

/**
 * OTP verification route.
 * Verifies the OTP sent to the user's email during registration.
 *
 * @route POST /api/auth/register/verify-otp
 */
router.post(
	'/register/verify-otp',
	Validate([ValidateEmail('email'), ValidateOptToken('otp')]),
	Deduplicate,
	Handler(async (req: Request, res: Response) => {
		const { email, otp } = req.body as OtpVerificationRequestData

		const result = await VerifyRegistrationOtp(email, otp)
		return res.status(result.status).json(result.data)
	})
)

/**
 * Forgot password route.
 * Sends a password reset email to the user.
 *
 * @route POST /forgot
 */
router.post(
	'/forgot',
	Validate([ValidateEmail('email')]),
	Deduplicate,
	Handler(async (req: Request, res: Response) => {
		const { email } = req.body as ForgotPasswordRequestData

		const result = await ForgotPassword(email)
		return res.status(result.status).json(result.data)
	})
)

/**
 * Password reset route (with token).
 * Resets the user's password using a reset token.
 *
 * @route POST /api/reset/:token
 */
router.post(
	'/reset/:token',
	Validate([ValidateResetToken('token'), ValidatePassword('password')]),
	Deduplicate,
	Handler(async (req: Request, res: Response) => {
		const { token } = req.params
		const { newPassword } = req.body as ResetPasswordWithTokenRequestData

		const result = await ResetPasswordWithToken(token, newPassword)
		return res.status(result.status).json(result.data)
	})
)

/**
 * Authenticated password reset route.
 * Allows logged-in users to change their password.
 *
 * @route POST /api/auth/reset
 */
router.post(
	'/reset',
	Auth,
	Validate([
		ValidateCurrentPassword('currentPassword'),
		ValidateNewPassword('newPassword'),
	]),
	Deduplicate,
	Handler(async (req: Request, res: Response) => {
		const user = req.user as UserDocument
		const { currentPassword, newPassword } =
			req.body as ResetPasswordRequestData

		const result = await ResetPassword(user, currentPassword, newPassword)
		return res.status(result.status).json(result.data)
	})
)

export default router
