import {
	Search,
	Heart,
	User,
	Menu,
	ChevronDown,
	LogOut,
	Settings,
	BookmarkIcon,
	Bell,
} from 'lucide-react'
import { Button } from '@/components/ui/input/button'
import { Input } from '@/components/ui/input/input'
import { Link, useNavigate } from 'react-router-dom'
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

export const Header = () => {
	const { user, isAuthenticated, logout } = useAuth()
	const navigate = useNavigate()
	const categories = [
		{
			name: 'Điện tử',
			subcategories: [
				'Điện thoại di động',
				'Máy tính xách tay',
				'Máy tính bảng',
				'Phụ kiện',
			],
		},
		{
			name: 'Thời trang',
			subcategories: ['Giày', 'Đồng hồ', 'Túi xách', 'Trang sức'],
		},
		{
			name: 'Gia dụng',
			subcategories: [
				'Nội thất',
				'Đồ điện tử gia dụng',
				'Nhà bếp',
				'Trang trí',
			],
		},
		{
			name: 'Sưu tầm',
			subcategories: ['Nghệ thuật', 'Đồ cổ', 'Tiền xu', 'Tem'],
		},
	]

	// Get user initials for avatar
	const getUserInitials = () => {
		if (!user?.fullName) return 'U'

		const names = user.fullName.trim().split(' ')
		if (names.length === 1) {
			return names[0].substring(0, 2).toUpperCase()
		}

		return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase()
	}

	const getUserDisplayName = () => {
		return user?.fullName || 'User'
	}

	return (
		<header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div className="container flex h-16 items-center justify-between">
				{/* Logo & Navigation */}
				<div className="flex items-center gap-6">
					<Link to="/" className="flex items-center space-x-2">
						<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-auction">
							<span className="text-lg font-bold text-white">
								A
							</span>
						</div>
						<span className="hidden font-bold sm:inline-block text-gradient-auction">
							AuctionHub
						</span>
					</Link>

					<nav className="hidden md:flex items-center space-x-1">
						{categories.map((category) => (
							<DropdownMenu key={category.name}>
								<DropdownMenuTrigger asChild>
									<Button
										variant="ghost"
										className="h-10 px-4 py-2 text-sm font-medium focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none"
									>
										{category.name}
										<ChevronDown className="ml-1 h-3 w-3" />
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent
									align="start"
									className="w-[200px]"
									sideOffset={8}
								>
									{category.subcategories.map((sub) => (
										<DropdownMenuItem key={sub} asChild>
											<Link
												to={`/category/${encodeURIComponent(sub)}`}
												className="cursor-pointer"
											>
												{sub}
											</Link>
										</DropdownMenuItem>
									))}
								</DropdownMenuContent>
							</DropdownMenu>
						))}
					</nav>
				</div>

				{/* Search & User Actions */}
				<div className="flex flex-1 items-center justify-end space-x-4">
					{/* Search Bar */}
					<form className="hidden w-full max-w-sm md:flex items-center space-x-2">
						<Input
							type="search"
							placeholder="Tìm kiếm sản phẩm đấu giá..."
							className="h-9"
						/>
						<Button type="submit" size="sm" className="h-9">
							<Search className="h-4 w-4" />
						</Button>
					</form>

					<div className="flex items-center gap-2">
						{isAuthenticated ? (
							<>
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

								{/* Watchlist */}
								<Link to="/watch-list">
									<Button
										variant="ghost"
										size="icon"
										className="h-9 w-9"
									>
										<Heart className="h-4 w-4" />
										<span className="sr-only">
											Yêu thích
										</span>
									</Button>
								</Link>

								{/* User Menu */}
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button
											variant="ghost"
											className="h-9 gap-2 px-2"
										>
											<Avatar className="h-7 w-7">
												<AvatarFallback className="bg-gradient-auction text-white text-xs">
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
												<AvatarFallback className="bg-gradient-auction text-white">
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
										<DropdownMenuItem asChild>
											<Link
												to="/profile"
												className="cursor-pointer"
											>
												<User className="mr-2 h-4 w-4" />
												<span>Hồ sơ của tôi</span>
											</Link>
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
							</>
						) : (
							<>
								{/* Guest Actions */}
								<Link to="/auth">
									<Button
										size="sm"
										className="hidden md:inline-flex"
									>
										Đăng nhập
									</Button>
								</Link>
							</>
						)}

						{/* Mobile Menu */}
						<Button
							variant="ghost"
							size="icon"
							className="h-9 w-9 md:hidden"
						>
							<Menu className="h-4 w-4" />
							<span className="sr-only">Menu</span>
						</Button>
					</div>
				</div>
			</div>
		</header>
	)
}
