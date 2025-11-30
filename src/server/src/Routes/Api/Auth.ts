import express, { Request, Response } from 'express'
import assert from 'assert'
import crypto from 'crypto'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import passport from 'passport'
import axios from 'axios'
import { EMAIL_PROVIDER } from '../../Data/Constants/index.js'
import Keys from '../../Config/Keys.js'
import User from '../../Models/User.js'
import Auth from '../../Middleware/Auth.js'
import MailService from '../../Services/MailService/index.js'
import rateLimit from 'express-rate-limit'
const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY

const authLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 5, // 5 attempts per window
	message: 'Too many attempts. Please try again later.',
	standardHeaders: true,
	legacyHeaders: false,
	// Optional: Store in Redis for distributed systems
	// store: new RedisStore({ client: redisClient })
})

// Helper function to verify reCAPTCHA
async function verifyRecaptcha(
	token: string,
	expectedAction: string
): Promise<{
	success: boolean
	score: number
	action: string
}> {
	try {
		const response = await axios.post(
			`https://www.google.com/recaptcha/api/siteverify`,
			null,
			{
				params: {
					secret: RECAPTCHA_SECRET_KEY,
					response: token,
				},
				timeout: 5000,
			}
		)

		const { success, score, action, hostname } = response.data

		// ✅ Validate action matches
		if (action !== expectedAction) {
			console.error(
				`Action mismatch: expected ${expectedAction}, got ${action}`
			)
			return { success: false, score: 0, action }
		}

		// ✅ Optional: Validate hostname
		// if (hostname !== 'yourdomain.com') {
		//     console.error('Hostname mismatch')
		//     return { success: false, score: 0, action }
		// }

		return { success, score: score || 0, action }
	} catch (error) {
		console.error('reCAPTCHA verification error:', error)
		return { success: false, score: 0, action: '' }
	}
}

/** Router for authentication-related routes */
const router = express.Router()

// Extract JWT secret and token life from config
const { secret, tokenLife } = Keys.jwt
assert(secret, 'JWT secret is not configured.')
assert(tokenLife, 'JWT token life is not configured.')

/**
 * Login route.
 * Authenticates user with email and password.
 *
 * @route POST /login
 */
router.post('/login', authLimiter, async (req: Request, res: Response) => {
	try {
		const { email, password, recaptchaToken } = req.body
		// Verify reCAPTCHA
		if (!recaptchaToken) {
			return res.status(400).json({
				error: 'reCAPTCHA token is required.',
			})
		}

		const recaptchaResult = await verifyRecaptcha(recaptchaToken, 'login')
		console.log('reCAPTCHA verification:', {
			action: recaptchaResult.action,
			score: recaptchaResult.score,
			success: recaptchaResult.success,
			email: email,
			timestamp: new Date().toISOString(),
		})
		if (recaptchaResult.score < 0.3) {
			console.warn('🚨 SUSPICIOUS ACTIVITY:', {
				score: recaptchaResult.score,
				email,
				ip: req.ip,
			})
			// Optional: Send to monitoring service (Datadog, Sentry, etc.)
		}
		if (!recaptchaResult.success || recaptchaResult.score < 0.5) {
			return res.status(400).json({
				error: 'reCAPTCHA verification failed. Please try again.',
			})
		}

		// Validate input
		if (!email) {
			return res
				.status(400)
				.json({ error: 'You must enter an email address.' })
		}
		if (!password) {
			return res.status(400).json({ error: 'You must enter a password.' })
		}

		// Find user by email
		const user = await User.findOne({ email })
		if (!user) {
			return res
				.status(400)
				.send({ error: 'No user found for this email address.' })
		}

		// Ensure user registered via email, not social provider
		if (user.provider !== EMAIL_PROVIDER.Email) {
			return res.status(400).send({
				error: `That email address is already in use using ${user.provider} provider.`,
			})
		}

		// Ensure user has a password set
		if (!user.password) {
			return res
				.status(400)
				.json({ error: 'Password not set for this user.' })
		}

		// Check password
		const isMatch = await bcrypt.compare(password, user.password)
		if (!isMatch) {
			return res.status(400).json({
				success: false,
				error: 'Password Incorrect',
			})
		}

		// Create JWT token
		const payload = { id: user.id as string }
		const token = jwt.sign(payload, secret as jwt.Secret, {
			expiresIn: tokenLife as any,
		})

		// Respond with user info and token
		res.status(200).json({
			success: true,
			token: `Bearer ${token}`,
			user: {
				id: user.id,
				firstName: user.firstName,
				lastName: user.lastName,
				email: user.email,
				role: user.role,
			},
		})
	} catch (error: any) {
		// Handle errors
		res.status(400).json({
			error:
				error.message ||
				'Your request could not be processed. Please try again.',
		})
	}
})

/**
 * Registration route.
 * Registers a new user and sends a signup email.
 *
 * @route POST /register
 */
router.post('/register', authLimiter, async (req: Request, res: Response) => {
	try {
		const { email, firstName, lastName, password, recaptchaToken } =
			req.body
		// Verify reCAPTCHA
		if (!recaptchaToken) {
			return res.status(400).json({
				error: 'reCAPTCHA token is required.',
			})
		}

		const recaptchaResult = await verifyRecaptcha(
			recaptchaToken,
			'register'
		)
		console.log('reCAPTCHA verification:', {
			action: recaptchaResult.action,
			score: recaptchaResult.score,
			success: recaptchaResult.success,
			email: email,
			timestamp: new Date().toISOString(),
		})
		if (recaptchaResult.score < 0.3) {
			console.warn('🚨 SUSPICIOUS ACTIVITY:', {
				score: recaptchaResult.score,
				email,
				ip: req.ip,
			})
			// Optional: Send to monitoring service (Datadog, Sentry, etc.)
		}
		if (!recaptchaResult.success || recaptchaResult.score < 0.6) {
			return res.status(400).json({
				error: 'reCAPTCHA verification failed. Please try again.',
			})
		}

		// Validate input
		if (!email) {
			return res
				.status(400)
				.json({ error: 'You must enter an email address.' })
		}
		if (!firstName || !lastName) {
			return res
				.status(400)
				.json({ error: 'You must enter your full name.' })
		}
		if (!password) {
			return res.status(400).json({ error: 'You must enter a password.' })
		}

		// Check if user already exists
		if (await User.findOne({ email })) {
			return res
				.status(400)
				.json({ error: 'That email address is already in use.' })
		}

		// Hash password
		const salt = await bcrypt.genSalt(10)
		const hash = await bcrypt.hash(password, salt)

		// Create new user
		const user = new User()
		user.email = email
		user.password = hash
		user.firstName = firstName
		user.lastName = lastName

		// Save user to database
		const registeredUser = await user.save()

		// Send signup email
		await MailService.sendMail(registeredUser.email, 'signup', {
			name: { firstName, lastName },
		})

		// Create JWT token
		const token = jwt.sign({ id: registeredUser.id }, secret, {
			expiresIn: tokenLife as any,
		})

		// Respond with user info and token
		res.status(200).json({
			success: true,
			token: `Bearer ${token}`,
			user: {
				id: registeredUser.id,
				firstName: registeredUser.firstName,
				lastName: registeredUser.lastName,
				email: registeredUser.email,
				role: registeredUser.role,
			},
		})
	} catch (error: any) {
		// Handle errors
		res.status(400).json({
			error:
				error.message ||
				'Your request could not be processed. Please try again.',
		})
	}
})

/**
 * Forgot password route.
 * Sends a password reset email to the user.
 *
 * @route POST /forgot
 */
router.post('/forgot', authLimiter, async (req: Request, res: Response) => {
	try {
		const { email, recaptchaToken } = req.body
		if (!recaptchaToken) {
			return res.status(400).json({
				error: 'reCAPTCHA token is required.',
			})
		}

		const recaptchaResult = await verifyRecaptcha(
			recaptchaToken,
			'forgot_password'
		)
		console.log('reCAPTCHA verification:', {
			action: recaptchaResult.action,
			score: recaptchaResult.score,
			success: recaptchaResult.success,
			email: email,
			timestamp: new Date().toISOString(),
		})
		if (recaptchaResult.score < 0.3) {
			console.warn('🚨 SUSPICIOUS ACTIVITY:', {
				score: recaptchaResult.score,
				email,
				ip: req.ip,
			})
			// Optional: Send to monitoring service (Datadog, Sentry, etc.)
		}
		if (!recaptchaResult.success || recaptchaResult.score < 0.4) {
			return res.status(400).json({
				error: 'reCAPTCHA verification failed.',
			})
		}
		// Validate input
		if (!email) {
			return res
				.status(400)
				.json({ error: 'You must enter an email address.' })
		}

		// Find user by email
		const existingUser = await User.findOne({ email })
		if (!existingUser) {
			return res
				.status(400)
				.send({ error: 'No user found for this email address.' })
		}

		// Generate reset token
		const buffer = crypto.randomBytes(48)
		const resetToken = buffer.toString('hex')

		// Set reset token and expiry on user
		existingUser.resetPasswordToken = resetToken
		existingUser.resetPasswordExpires = new Date(Date.now() + 3600000) // 1 hour
		await existingUser.save()

		// Send reset email
		await MailService.sendMail(existingUser.email, 'reset', { resetToken })

		res.status(200).json({
			success: true,
			message:
				'Please check your email for the link to reset your password.',
		})
	} catch (error: any) {
		// Handle errors
		res.status(400).json({
			error:
				error.message ||
				'Your request could not be processed. Please try again.',
		})
	}
})

/**
 * Password reset route (with token).
 * Resets the user's password using a reset token.
 *
 * @route POST /reset/:token
 */
router.post('/reset/:token', async (req: Request, res: Response) => {
	try {
		const { password } = req.body

		// Validate input
		if (!password) {
			return res.status(400).json({ error: 'You must enter a password.' })
		}

		// Find user by reset token and check expiry
		const resetUser = await User.findOne({
			resetPasswordToken: req.params.token,
			resetPasswordExpires: { $gt: Date.now() },
		})
		if (!resetUser) {
			return res.status(400).json({
				error: 'Your token has expired. Please attempt to reset your password again.',
			})
		}

		// Hash new password
		const salt = await bcrypt.genSalt(10)
		const hash = await bcrypt.hash(password, salt)

		// Update user password and clear reset token
		resetUser.password = hash
		resetUser.resetPasswordToken = undefined
		resetUser.resetPasswordExpires = undefined
		await resetUser.save()

		// Send confirmation email
		await MailService.sendMail(resetUser.email, 'reset-confirmation', {})

		res.status(200).json({
			success: true,
			message:
				'Password changed successfully. Please login with your new password.',
		})
	} catch (error: any) {
		// Handle errors
		res.status(400).json({
			error:
				error.message ||
				'Your request could not be processed. Please try again.',
		})
	}
})

/**
 * Authenticated password reset route.
 * Allows logged-in users to change their password.
 *
 * @route POST /reset
 */
router.post('/reset', Auth, async (req: Request, res: Response) => {
	try {
		const { password, confirmPassword } = req.body
		const email = (req.user as any).email

		// Validate input and authentication
		if (!email) {
			return res.status(401).send('Unauthenticated')
		}
		if (!password) {
			return res.status(400).json({ error: 'You must enter a password.' })
		}

		// Find user by email
		const existingUser = await User.findOne({ email })
		if (!existingUser) {
			return res
				.status(400)
				.json({ error: 'That email address is already in use.' })
		}

		// Check old password
		const isMatch = await bcrypt.compare(
			password,
			existingUser.password as string
		)
		if (!isMatch) {
			return res
				.status(400)
				.json({ error: 'Please enter your correct old password.' })
		}

		// Hash new password
		const salt = await bcrypt.genSalt(10)
		const hash = await bcrypt.hash(confirmPassword, salt)
		existingUser.password = hash
		await existingUser.save()

		// Send confirmation email
		await MailService.sendMail(existingUser.email, 'reset-confirmation', {})

		res.status(200).json({
			success: true,
			message:
				'Password changed successfully. Please login with your new password.',
		})
	} catch (error: any) {
		// Handle errors
		res.status(400).json({
			error:
				error.message ||
				'Your request could not be processed. Please try again.',
		})
	}
})

/**
 * Get current user route.
 * Returns current authenticated user's information.
 *
 * @route GET /me
 */
router.get('/me', Auth, async (req: Request, res: Response) => {
	try {
		const userId = (req.user as any).id

		console.log('🔄 Fetching user info for ID:', userId)

		// Find user by ID
		const user = await User.findById(userId).select('-password') // Exclude password

		if (!user) {
			console.log('❌ User not found:', userId)
			return res.status(404).json({
				error: 'User not found.',
			})
		}

		console.log('✅ User found:', user.email)

		// Respond with user info
		res.status(200).json({
			success: true,
			user: {
				id: user.id,
				firstName: user.firstName,
				lastName: user.lastName,
				email: user.email,
				role: user.role,
				provider: user.provider,
				createdAt: user.createdAt,
			},
		})
	} catch (error: any) {
		console.error('❌ Get current user error:', error)
		res.status(400).json({
			error:
				error.message ||
				'Your request could not be processed. Please try again.',
		})
	}
})

/**
 * Google OAuth login route.
 * Redirects to Google for authentication.
 *
 * @route GET /google
 */
router.get(
	'/google',
	passport.authenticate('google', {
		session: false,
		scope: ['profile', 'email'],
		accessType: 'offline',
		approvalPrompt: 'force',
	} as any)
)

/**
 * Google OAuth callback route.
 * Handles Google authentication response and redirects to client.
 *
 * @route GET /google/callback
 */
router.get(
	'/google/callback',
	passport.authenticate('google', {
		failureRedirect: `${Keys.app.clientURL}/login`,
		session: false,
	}),
	(req: Request, res: Response) => {
		// Generate JWT token for authenticated user
		const payload = { id: (req.user as any).id }
		const token = jwt.sign(payload, secret, { expiresIn: tokenLife as any })
		const jwtToken = `Bearer ${token}`

		// Redirect to client with token
		res.redirect(`${Keys.app.clientURL}/Auth/success?token=${jwtToken}`)
	}
)

export default router
