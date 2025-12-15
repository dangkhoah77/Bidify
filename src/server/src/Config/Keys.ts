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
	jwt: {
		secret: process.env.JWT_SECRET as string, // JWT secret key
		tokenLife: process.env.JWT_LIFE as StringValue, // JWT token life
	},
	mailgun: {
		key: process.env.MAILGUN_API_KEY as string, // Mailgun API key
		domain: process.env.MAILGUN_DOMAIN as string, // Mailgun domain
		sender: process.env.MAILGUN_SENDER as string, // Mailgun sender email
	},
	// aws: {
	// 	accessKeyId: process.env.AWS_ACCESS_KEY_ID as string, // AWS access key ID
	// 	secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string, // AWS secret access key
	// 	region: process.env.AWS_REGION as string, // AWS region
	// 	bucketName: process.env.AWS_BUCKET_NAME as string, // AWS S3 bucket name
	// },
}
