import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

// Providers
import { PageProvider } from 'Client/Contexts/Page/index.js'
import { AuthProvider } from 'Client/Contexts/Auth/index.js'
import { SocketProvider } from 'Client/Contexts/Socket/index.js'

// Layouts
import MainLayout from 'Client/Layouts/MainLayout.js'
import AdminLayout from 'Client/Layouts/AdminLayout.js' // Assumed created in Phase 7 steps

// Components
import ProtectedRoute from 'Client/Components/Common/ProtectedRoute.js'

// --- Containers ---

// Auth
import LoginContainer from 'Client/Containers/Auth/Login.js'
import RegisterContainer from 'Client/Containers/Auth/Register.js'
import VerifyOtpContainer from 'Client/Containers/Auth/VerifyOtp.js'
import ForgotPasswordContainer from 'Client/Containers/Auth/ForgotPassword.js'
import ResetPasswordContainer from 'Client/Containers/Auth/ResetPassword.js'

// Public
import HomeContainer from 'Client/Containers/Home/index.js'
import ProductListContainer from 'Client/Containers/Product/List.js'
import ProductDetailContainer from 'Client/Containers/Product/Detail.js'

// User
import ProfileContainer from 'Client/Containers/User/Profile.js'
import OrderCompletion from 'Client/Containers/Order/Checkout/index.js'

// Seller
import SellerProductsContainer from 'Client/Containers/Seller/Products/index.js'
import CreateProductContainer from 'Client/Containers/Seller/Product/CreateProduct.js'
import EditProductDescriptionContainer from 'Client/Containers/Seller/Product/EditProductDescription.js'

// Admin
import AdminUsersContainer from 'Client/Containers/Admin/Users/index.js'
import AdminProductsContainer from 'Client/Containers/Admin/Products/index.js'

const App: React.FC = () => {
	return (
		<BrowserRouter>
			<PageProvider>
				<AuthenticationProvider>
					<SocketProvider>
						<Routes>
							{/* Public Routes (Wrapped in MainLayout) */}
							<Route element={<MainLayout />}>
								<Route path="/" element={<HomeContainer />} />
								<Route
									path="/products"
									element={<ProductListContainer />}
								/>
								<Route
									path="/products/:slug"
									element={<ProductDetailContainer />}
								/>

								{/* Protected User Routes */}
								<Route element={<ProtectedRoute />}>
									<Route
										path="/profile"
										element={<ProfileContainer />}
									/>
									<Route
										path="/checkout/:id"
										element={<OrderCompletion />}
									/>

									{/* Seller Routes */}
									<Route
										path="/seller/products"
										element={<SellerProductsContainer />}
									/>
									<Route
										path="/seller/products/create"
										element={<CreateProductContainer />}
									/>
									<Route
										path="/seller/products/:id/edit"
										element={
											<EditProductDescriptionContainer />
										}
									/>
								</Route>
							</Route>

							{/* Auth Routes (Standalone) */}
							<Route
								path="/auth/login"
								element={<LoginContainer />}
							/>
							<Route
								path="/auth/register"
								element={<RegisterContainer />}
							/>
							<Route
								path="/auth/verify-otp"
								element={<VerifyOtpContainer />}
							/>
							<Route
								path="/auth/forgot-password"
								element={<ForgotPasswordContainer />}
							/>
							<Route
								path="/auth/reset-password"
								element={<ResetPasswordContainer />}
							/>

							{/* Admin Routes */}
							<Route path="/admin" element={<AdminLayout />}>
								<Route
									index
									element={
										<Navigate to="/admin/users" replace />
									}
								/>
								<Route
									path="users"
									element={<AdminUsersContainer />}
								/>
								<Route
									path="products"
									element={<AdminProductsContainer />}
								/>
							</Route>

							{/* Fallback */}
							<Route
								path="*"
								element={<Navigate to="/" replace />}
							/>
						</Routes>
					</SocketProvider>
				</AuthenticationProvider>
			</PageProvider>
		</BrowserRouter>
	)
}

export default App
