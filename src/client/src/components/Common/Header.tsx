import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
	Search,
	Heart,
	User as UserIcon,
	Menu,
	LogOut,
	ChevronDown,
} from 'lucide-react'

import { useAuth } from 'Client/Contexts/Auth/index.js'
import { Input } from 'Client/Components/UI/input/input.js'
import { Button } from 'Client/Components/UI/input/button.js'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from 'Client/Components/UI/navigation/dropdown-menu.js'

/**
 * Global Header Component.
 * Contains navigation, search bar, and user profile actions.
 */
export const Header: React.FC = () => {
	const { user, isAuthenticated, logout } = useAuth()
	const navigate = useNavigate()

	/**
	 * Handles user logout and redirects to the login page.
	 */
	const handleLogout = () => {
		logout()
		navigate('/auth')
	}

	// Static categories for the navigation bar
	const categories = [
		{ name: 'Electronics', label: 'Điện tử' },
		{ name: 'Fashion', label: 'Thời trang' },
		{ name: 'Home', label: 'Gia dụng' },
		{ name: 'Collectibles', label: 'Sưu tầm' },
	]

	return (
		<header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div className="container flex h-16 items-center justify-between">
				{/* Logo and Main Nav */}
				<div className="flex items-center gap-6">
					<Link to="/" className="flex items-center space-x-2">
						<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
							<span className="text-lg font-bold text-primary-foreground">
								A
							</span>
						</div>
						<span className="hidden font-bold sm:inline-block">
							AuctionHub
						</span>
					</Link>

					{/* Main Navigation Links */}
					<nav className="hidden md:flex items-center space-x-1">
						{categories.map((cat) => (
							<Link
								key={cat.name}
								to={`/category/${cat.name.toLowerCase()}`}
							>
								<Button
									variant="ghost"
									className="text-sm font-medium"
								>
									{cat.label}
								</Button>
							</Link>
						))}
					</nav>
				</div>

				{/* Right Side Actions */}
				<div className="flex flex-1 items-center justify-end space-x-4">
					{/* Search Bar */}
					<div className="hidden w-full max-w-sm md:flex items-center space-x-2">
						<Input
							type="search"
							placeholder="Tìm kiếm sản phẩm..."
							className="h-9"
						/>
						<Button type="submit" size="sm" className="h-9 px-3">
							<Search className="h-4 w-4" />
						</Button>
					</div>

					<div className="flex items-center gap-2">
						{isAuthenticated ? (
							<>
								{/* Watchlist Link */}
								<Link to="/profile?tab=watchlist">
									<Button
										variant="ghost"
										size="icon"
										className="h-9 w-9"
									>
										<Heart className="h-4 w-4" />
									</Button>
								</Link>

								{/* User Dropdown */}
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button
											variant="ghost"
											className="flex items-center gap-2"
										>
											<UserIcon className="h-4 w-4" />
											<span className="hidden sm:inline-block">
												{user?.firstName || 'User'}
											</span>
											<ChevronDown className="h-3 w-3 opacity-50" />
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent align="end">
										<DropdownMenuItem
											onClick={() => navigate('/profile')}
										>
											Hồ sơ cá nhân
										</DropdownMenuItem>
										<DropdownMenuItem
											onClick={() =>
												navigate('/profile?tab=bidding')
											}
										>
											Đang đấu giá
										</DropdownMenuItem>
										{user?.role === 'ROLE SELLER' && (
											<DropdownMenuItem
												onClick={() =>
													navigate('/seller/products')
												}
											>
												Kênh người bán
											</DropdownMenuItem>
										)}
										<DropdownMenuItem
											onClick={handleLogout}
											className="text-destructive"
										>
											<LogOut className="mr-2 h-4 w-4" />
											Đăng xuất
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
							</>
						) : (
							<Link to="/auth">
								<Button size="sm">Đăng nhập</Button>
							</Link>
						)}

						{/* Mobile Menu Trigger (Placeholder) */}
						<Button
							variant="ghost"
							size="icon"
							className="md:hidden"
						>
							<Menu className="h-4 w-4" />
						</Button>
					</div>
				</div>
			</div>
		</header>
	)
}

export default Header
