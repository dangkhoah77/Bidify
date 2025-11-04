import prettierConfig from 'eslint-config-prettier'
import pluginReact from 'eslint-plugin-react'
import { defineConfig } from 'eslint/config'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default defineConfig(
	{
		ignores: ['dist', 'node_modules'],
	},

	// Base configuration for JavaScript and TypeScript files
	{
		files: ['**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node,
			},
		},
	},

	// TypeScript ESLint configurations
	tseslint.configs.base,
	...tseslint.configs.recommended,

	// React configurations
	{
		files: ['**/*.{ts,tsx,jsx}'],
		...pluginReact.configs.flat.recommended,
		settings: {
			react: {
				version: 'detect',
			},
		},
	},

	// Prettier configuration
	prettierConfig
)
