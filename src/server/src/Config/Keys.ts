export default {
	app: {
		name: process.env.APP_NAME, // Application name
		apiURL: process.env.BASE_API_URL, // Base API URL
		clientURL: process.env.CLIENT_URL, // Client URL
	},
	port: process.env.PORT || 3000, // Server port
	database: {
		url: process.env.MONGO_URL, // MongoDB connection URL
	},
	jwt: {
		secret: process.env.JWT_SECRET, // JWT secret key
		tokenLife: process.env.JWT_LIFE, // JWT token life
	},
	mailgun: {
		key: process.env.MAILGUN_API_KEY, // Mailgun API key
		domain: process.env.MAILGUN_DOMAIN, // Mailgun domain
		sender: process.env.MAILGUN_SENDER, // Mailgun sender email
	},
	aws: {
		accessKeyId: process.env.AWS_ACCESS_KEY_ID, // AWS access key ID
		secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY, // AWS secret access key
		region: process.env.AWS_REGION, // AWS region
		bucketName: process.env.AWS_BUCKET_NAME, // AWS S3 bucket name
	},
}
