import path from 'path'
import dotenv from 'dotenv'

// Force the compiler to process the .env file at the very start of the application
dotenv.config({
	path: [path.resolve(process.cwd(), 'server.env')],
})

export default null
