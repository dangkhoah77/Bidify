import { merge } from 'webpack-merge'
import common from './webpack.common.js'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default merge(common, {
	mode: 'development',
	devtool: 'inline-source-map',
	devServer: {
		static: {
			directory: path.join(__dirname, '..', 'public'), // Serves files from /public
		},
		historyApiFallback: true, // For React Router
		port: 8080,
		open: true, // Opens browser
		hot: true, // Hot Module Replacement
	},
})
