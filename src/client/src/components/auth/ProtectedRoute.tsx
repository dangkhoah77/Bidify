import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { UserRole } from '@/services/types/auth.types'
import { Loader2 } from 'lucide-react'

interface ProtectedRouteProps {
	children: React.ReactNode
	requireAuth?: boolean // Bắt buộc đăng nhập
	allowedRoles?: UserRole[] // Các role được phép
	redirectTo?: string // Redirect đến đâu nếu không đủ quyền
}

export const ProtectedRoute = ({
	children,
	requireAuth = true,
	allowedRoles,
	redirectTo = '/auth',
}: ProtectedRouteProps) => {
	const { user, isAuthenticated, isLoading } = useAuth()
	const location = useLocation()

	// Show loading spinner while checking auth
	if (isLoading) {
		return (
			<div className="flex min-h-screen items-center justify-center">
				<Loader2 className="h-8 w-8 animate-spin text-primary" />
			</div>
		)
	}

	// Check if authentication is required
	if (requireAuth && !isAuthenticated) {
		console.log('⚠️ Not authenticated, redirecting to:', redirectTo)
		// Redirect to login and save the attempted location
		return <Navigate to={redirectTo} state={{ from: location }} replace />
	}

	// Check if user has required roles
	if (allowedRoles && user) {
		const hasRequiredRole = allowedRoles.some((role) =>
			user.role.includes(role)
		)

		if (!hasRequiredRole) {
			console.log('⚠️ Insufficient permissions, user roles:', user.role)
			console.log('Required roles:', allowedRoles)
			// Redirect to home with error message
			return <Navigate to="/" replace />
		}
	}

	// User is authenticated and has required permissions
	return <>{children}</>
}
