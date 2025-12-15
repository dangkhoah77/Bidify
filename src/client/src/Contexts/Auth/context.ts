import React from 'react'

import { AuthContextValueType } from './type.js'

/**
 * Default values for the Authentication context value.
 */
export const DEFAULT: AuthContextValueType = {
	user: null,
	isAuthenticated: false,
	isLoading: true,

	login: async () => {},
	register: async () => {},
	logout: () => {},
	refetchUser: async () => {},
}

/**
 * Context for managing authentication and token.
 */
const AuthContext = React.createContext(DEFAULT)

export default AuthContext
