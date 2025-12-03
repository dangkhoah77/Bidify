import { Toaster } from '@/components/ui/feedback/toaster'
import { Toaster as Sonner } from '@/components/ui/feedback/sonner'
import { TooltipProvider } from '@/components/ui/overlay/tooltip'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from '@/contexts/AuthContext'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { PublicRoute } from '@/components/auth/PublicRoute'
import { UserRole } from '@/services/types/auth.types'
import { RecaptchaProvider } from '@/components/providers/RecaptchaProvider'

// Pages
import Index from './pages/Index'
import ProductDetail from './pages/ProductDetail'
import Auth from './pages/Auth'
import CategoryProducts from './pages/CategoryProducts'
import Search from './pages/Search'
import Profile from './pages/Profile'
import CreateProduct from './pages/CreateProduct'
import SellerProducts from './pages/SellerProducts'
import EditProductDescription from './pages/EditProductDescription'
import OrderCompletion from './pages/OrderCompletion'
import NotFound from './pages/NotFound'
import ForgotPassword from './pages/ForgotPassword'
import VerifyOTP from './pages/VerifyOTP'
import { ProductsList } from './pages/ProductsList'
// Admin pages
import AdminCategories from './pages/admin/AdminCategories'
import AdminProducts from './pages/admin/AdminProducts'
import AdminUsers from './pages/admin/AdminUsers'
import AdminAuctionSettings from './pages/admin/AdminAuctionSettings'

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false,
			retry: 1,
		},
	},
})

const App = () => (
	<QueryClientProvider client={queryClient}>
		<TooltipProvider>
			<RecaptchaProvider>
				<BrowserRouter>
					<AuthProvider>
						<Routes>
							{/* Public Routes - Anyone can access */}
							<Route path="/" element={<Index />} />
							<Route
								path="/product/:id"
								element={<ProductDetail />}
							/>
							<Route
								path="/category/:category"
								element={<CategoryProducts />}
							/>
							<Route
								path="/products/:type"
								element={<ProductsList />}
							/>
							<Route path="/search" element={<Search />} />

							{/* Auth Route - Redirect to home if already logged in */}
							<Route
								path="/auth"
								element={
									<PublicRoute redirectIfAuthenticated={true}>
										<Auth />
									</PublicRoute>
								}
							/>
							<Route path="/verify-otp" element={<VerifyOTP />} />
							{/* ✅ NEW: Forgot Password Route */}
							<Route
								path="/forgot-password"
								element={<ForgotPassword />}
							/>
							{/* Protected Routes - Require Authentication */}
							<Route
								path="/profile"
								element={
									<ProtectedRoute>
										<Profile />
									</ProtectedRoute>
								}
							/>
							<Route
								path="/order/:id"
								element={
									<ProtectedRoute>
										<OrderCompletion />
									</ProtectedRoute>
								}
							/>

							{/* Seller Routes - Require SELLER or ADMIN role */}
							<Route
								path="/seller/create-product"
								element={
									<ProtectedRoute
										allowedRoles={[
											UserRole.SELLER,
											UserRole.ADMIN,
										]}
									>
										<CreateProduct />
									</ProtectedRoute>
								}
							/>
							<Route
								path="/seller/products"
								element={
									<ProtectedRoute
										allowedRoles={[
											UserRole.SELLER,
											UserRole.ADMIN,
										]}
									>
										<SellerProducts />
									</ProtectedRoute>
								}
							/>
							<Route
								path="/seller/products/:id/edit-description"
								element={
									<ProtectedRoute
										allowedRoles={[
											UserRole.SELLER,
											UserRole.ADMIN,
										]}
									>
										<EditProductDescription />
									</ProtectedRoute>
								}
							/>

							{/* Admin Routes - Require ADMIN role */}
							<Route
								path="/admin/categories"
								element={
									<ProtectedRoute
										allowedRoles={[UserRole.ADMIN]}
									>
										<AdminCategories />
									</ProtectedRoute>
								}
							/>
							<Route
								path="/admin/products"
								element={
									<ProtectedRoute
										allowedRoles={[UserRole.ADMIN]}
									>
										<AdminProducts />
									</ProtectedRoute>
								}
							/>
							<Route
								path="/admin/users"
								element={
									<ProtectedRoute
										allowedRoles={[UserRole.ADMIN]}
									>
										<AdminUsers />
									</ProtectedRoute>
								}
							/>
							<Route
								path="/admin/auction-settings"
								element={
									<ProtectedRoute
										allowedRoles={[UserRole.ADMIN]}
									>
										<AdminAuctionSettings />
									</ProtectedRoute>
								}
							/>

							{/* 404 Route */}
							<Route path="*" element={<NotFound />} />
						</Routes>

						<Toaster />
						<Sonner />
					</AuthProvider>
				</BrowserRouter>
			</RecaptchaProvider>
		</TooltipProvider>
	</QueryClientProvider>
)

export default App
