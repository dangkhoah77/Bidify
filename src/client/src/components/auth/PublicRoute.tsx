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

	// ✅ FIXED: Show loading instead of children while checking auth
	if (isLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-background">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
					<p className="text-muted-foreground">Đang tải...</p>
				</div>
			</div>
		)
	}

	// Redirect to home if already authenticated
	if (redirectIfAuthenticated && isAuthenticated) {
		console.log('✅ Already authenticated, redirecting to:', redirectTo)
		return <Navigate to={redirectTo} replace />
	}

	return <>{children}</>
}
