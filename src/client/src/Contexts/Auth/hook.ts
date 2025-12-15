import React from 'react'

import AuthContext from './context.js'

/**
 * Hook to access the Authentication context.
 *
 * @return The current authentication state and actions.
 */
export default function useAuth() {
	return React.useContext(AuthContext)
}
