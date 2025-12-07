import { Bell, User, ChevronDown, LogOut, Shield } from 'lucide-react'
import { Button } from '@/components/ui/input/button'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/navigation/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/data-display/avatar'
import { Badge } from '@/components/ui/data-display/badge'
import { useAuth } from '@/contexts/AuthContext'
import { cn } from '@/lib/utils'

export const AdminHeader = () => {
	const { user, logout } = useAuth()
	const navigate = useNavigate()
	const location = useLocation()

	// Admin navigation items
	const adminNavItems = [
		{
			name: 'Danh mục',
			path: '/admin/categories',
		},
		{
			name: 'Sản phẩm',
			path: '/admin/products',
		},
		{
			name: 'Người dùng',
			path: '/admin/users',
		},
		{
			name: 'Cài đặt đấu giá',
			path: '/admin/auction-settings',
		},
	]

	// Get user initials for avatar
	const getUserInitials = () => {
		if (!user?.fullName) return 'A'

		const names = user.fullName.trim().split(' ')
		if (names.length === 1) {
			return names[0].substring(0, 2).toUpperCase()
		}

		return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase()
	}

	const getUserDisplayName = () => {
		return user?.fullName || 'Admin'
	}

	const handleProfileClick = () => {
		navigate('/admin/profile')
	}

	return (
		<header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div className="container flex h-16 items-center justify-between">
				{/* Logo & Admin Navigation */}
				<div className="flex items-center gap-6">
					<Link
						to="/admin/categories"
						className="flex items-center space-x-2"
					>
						<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600">
							<Shield className="h-5 w-5 text-white" />
						</div>
						<span className="hidden font-bold sm:inline-block bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
							Admin Panel
						</span>
					</Link>

					{/* Admin Navigation Menu */}
					<nav className="hidden md:flex items-center space-x-1">
						{adminNavItems.map((item) => (
							<Link key={item.path} to={item.path}>
								<Button
									variant="ghost"
									className={cn(
										'h-10 px-4 py-2 text-sm font-medium',
										location.pathname === item.path &&
											'bg-accent text-accent-foreground'
									)}
								>
									{item.name}
								</Button>
							</Link>
						))}
					</nav>
				</div>

				{/* User Actions */}
				<div className="flex items-center gap-2">
					{/* Notifications */}
					<Button
						variant="ghost"
						size="icon"
						className="h-9 w-9 relative"
					>
						<Bell className="h-4 w-4" />
						<Badge
							variant="destructive"
							className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
						>
							3
						</Badge>
						<span className="sr-only">Thông báo</span>
					</Button>

					{/* User Menu */}
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" className="h-9 gap-2 px-2">
								<Avatar className="h-7 w-7">
									<AvatarFallback className="bg-gradient-to-br from-purple-500 to-indigo-600 text-white text-xs">
										{getUserInitials()}
									</AvatarFallback>
								</Avatar>
								<span className="hidden md:inline-block text-sm font-medium">
									{getUserDisplayName()}
								</span>
								<ChevronDown className="h-3 w-3 opacity-50" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent
							align="end"
							className="w-56"
							sideOffset={8}
						>
							<div className="flex items-center justify-start gap-2 p-2">
								<Avatar className="h-8 w-8">
									<AvatarFallback className="bg-gradient-to-br from-purple-500 to-indigo-600 text-white">
										{getUserInitials()}
									</AvatarFallback>
								</Avatar>
								<div className="flex flex-col space-y-1">
									<p className="text-sm font-medium leading-none">
										{getUserDisplayName()}
									</p>
									<p className="text-xs leading-none text-muted-foreground">
										{user?.email}
									</p>
								</div>
							</div>
							<DropdownMenuSeparator />
							<DropdownMenuItem
								onClick={handleProfileClick}
								className="cursor-pointer"
							>
								<User className="mr-2 h-4 w-4" />
								<span>Hồ sơ của tôi</span>
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem
								onClick={logout}
								className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
							>
								<LogOut className="mr-2 h-4 w-4" />
								<span>Đăng xuất</span>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>
		</header>
	)
}
