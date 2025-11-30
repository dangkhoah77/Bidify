import { Navigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'

interface PublicRouteProps {
	children: React.ReactNode
	redirectIfAuthenticated?: boolean
	redirectTo?: string
}

export const PublicRoute = ({
	children,
	redirectIfAuthenticated = true,
	redirectTo = '/',
}: PublicRouteProps) => {
	const { isAuthenticated, isLoading } = useAuth()

	// Don't redirect while checking auth
	if (isLoading) {
		return <>{children}</>
	}

	// Redirect to home if already authenticated
	if (redirectIfAuthenticated && isAuthenticated) {
		console.log('✅ Already authenticated, redirecting to:', redirectTo)
		return <Navigate to={redirectTo} replace />
	}

	return <>{children}</>
}
