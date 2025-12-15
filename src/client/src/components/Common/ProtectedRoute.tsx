import React from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'

import { useAuth } from 'Client/Contexts/Auth/index.js'

/**
 * A wrapper for routes that require authentication.
 */
const ProtectedRoute: React.FC = () => {
	const { isAuthenticated, isLoading } = useAuth()
	const location = useLocation()

	// Show a loading state while checking the session to prevent premature redirects
	if (isLoading) {
		return (
			<div className="flex h-screen w-full items-center justify-center">
				<div className="text-lg font-semibold text-primary animate-pulse">
					Đang tải...
				</div>
			</div>
		)
	}

	// If authenticated, render the child route.
	// Otherwise, redirect to /auth and save the current location to redirect back later.
	return isAuthenticated ? (
		<Outlet />
	) : (
		<Navigate to="/auth" state={{ from: location }} replace />
	)
}

export default ProtectedRoute
