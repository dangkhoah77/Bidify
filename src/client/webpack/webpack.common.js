import path from 'path';
import { fileURLToPath } from 'url';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import DotenvWebpackPlugin from 'dotenv-webpack';

// This is needed to get __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  // 1. Entry Point
  entry: path.resolve(__dirname, '..', 'src/main.tsx'), // Points to your main.tsx
  
  // 2. Output
  output: {
    path: path.resolve(__dirname, '..', 'dist'),
    filename: '[name].[contenthash].js', // Cache-busting filename
    publicPath: '/',
    clean: true, // Cleans the /dist folder before each build
  },
  
  // 3. Resolvers (for imports)
  resolve: {
    extensions: ['.tsx', '.ts', '.js'], // Allows omitting extensions
    alias: {
      // This MUST match your tsconfig.json "paths"
      '@': path.resolve(__dirname, '..', 'src'), 
    },
  },
  
  // 4. Loaders (How to handle different files)
  module: {
    rules: [
      // TypeScript & React
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: 'ts-loader',
      },
      // CSS & Tailwind
      {
        test: /\.css$/,
        use: [
          'style-loader', // 3. Injects styles into DOM
          'css-loader',   // 2. Translates CSS into CommonJS
          'postcss-loader', // 1. Processes CSS with PostCSS (for Tailwind)
        ],
      },
      // Images & Assets
      {
        test: /\.(png|svg|jpg|jpeg|gif|ico)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'static/assets/[hash][ext][query]',
        },
      },
    ],
  },
  
  // 5. Plugins
  plugins: [
    new HtmlWebpackPlugin({
      // Uses your public/index.html as a template
      template: path.resolve(__dirname, '..', 'index.html'),
    }),
    new DotenvWebpackPlugin(), // Loads .env files
  ],
};