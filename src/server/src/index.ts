// Load environment variables from .env file
import './Utility/Dotenv.js'

import express from 'express'
import chalk from 'chalk'
import cors from 'cors'
import helmet from 'helmet'

// Import application configurations and routes
import routes from './Routes/index.js'
import Keys from './Config/Keys.js'
import setupDB from './Utility/Database.js'
import initializePassport from './Config/Passport.js'

// Initialize Express application
const app = express()

// Middleware to parse URL-encoded data and JSON data
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// Middleware to enhance security by setting various HTTP headers
app.use(
	helmet({
		contentSecurityPolicy: false, // Disable CSP for compatibility reasons
		frameguard: true, // Enable frameguard to prevent clickjacking
	})
)

// Middleware to enable Cross-Origin Resource Sharing
app.use(
	cors({
		origin: 'http://localhost:8080', // Frontend URL
		credentials: true,
	})
)

// Connect to the MongoDB database
setupDB()

// Initialize Passport for authentication
initializePassport(app)

// Mount all application routes
app.use(routes)

// Start the server and listen on the specified port
const port = (Keys.port as number) || 3000
app.listen(port, '0.0.0.0', () => {
	console.log(
		`${chalk.green('✓')} ${chalk.blue(
			`Server is running on port ${port}! Visit http://${Keys.app.clientURL}:${port}/ in your browser.`
		)}`
	)
})
