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

// //Static folder ảnh tạm (TS) trong src/index.ts (server entry):
// import path from 'path'
// import { fileURLToPath } from 'url'
// Lấy __dirname trong môi trường ES module
// const __filename = fileURLToPath(import.meta.url)
// const __dirname = path.dirname(__filename)

// Initialize Express application
const app = express()

// // Serve thư mục ảnh tạm: server/public/images
// app.use(
// 	'/images',
// 	express.static(path.join(__dirname, '..', 'public', 'images'))
// )

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
app.use(cors())

// Connect to the MongoDB database
setupDB()

// Initialize Passport for authentication
initializePassport(app)

// Mount all application routes
app.use(routes)

// Ảnh sản phẩm tạm thời
app.use('/images', express.static('public/images'))

// Start the server and listen on the specified port
const port = (Keys.port as number) || 3000
app.listen(port, '0.0.0.0', () => {
	console.log(
		`${chalk.green('✓')} ${chalk.blue(
			`Server is running on port ${port}! Visit http://${Keys.app.clientURL}:${port}/ in your browser.`
		)}`
	)
})
