import { StringValue } from 'ms'

export default {
	host: process.env.HOST as string, // Server host
	port: (process.env.PORT || 3000) as number, // Server port
	app: {
		name: process.env.APP_NAME as string, // Application name
		apiURL: process.env.BASE_API_URL as string, // Base API URL
		clientURL: process.env.CLIENT_URL as string, // Client URL
	},
	database: {
		url: process.env.MONGO_URL as string, // MongoDB connection URL
	},
	captcha: {
		secret: process.env.CAPTCHA_KEY as string, // reCaptcha secret key
	},
	optLife: process.env.OTP_LIFE as StringValue, // OTP expiry time
	resetTokenLife: process.env.RESET_TOKEN_LIFE as StringValue, // Reset token expiry time
	sellerRoleLife: process.env.SELLER_ROLE_LIFE as StringValue, // Seller role expiry time
	jwt: {
		secret: process.env.JWT_SECRET as string, // JWT secret key
		tokenLife: process.env.JWT_LIFE as StringValue, // JWT token life
	},
	email: {
		user: process.env.EMAIL_USER as string, // Email user for SMTP
		pass: process.env.EMAIL_PASS as string, // Email password for SMTP
	},
	aws: {
		accessKeyId: process.env.AWS_ACCESS_KEY_ID as string, // AWS access key ID
		secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string, // AWS secret access key
		region: process.env.AWS_REGION as string, // AWS region
		bucketName: process.env.AWS_BUCKET_NAME as string, // AWS S3 bucket name
	},
}
