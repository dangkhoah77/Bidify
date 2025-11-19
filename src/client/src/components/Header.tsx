import { Search, Heart, User, Menu, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Link } from 'react-router-dom'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export const Header = () => {
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

	return (
		<header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div className="container flex h-16 items-center justify-between">
				<div className="flex items-center gap-6">
					{/* Logo */}
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

					{/* Navigation Menu */}
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
												to={`/category/${sub}`}
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

				{/* Right Side - Search, Icons, Button */}
				<div className="flex flex-1 items-center justify-end space-x-4">
					{/* Search */}
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

					{/* Icons */}
					<div className="flex items-center gap-2">
						<Button variant="ghost" size="icon" className="h-9 w-9">
							<Heart className="h-4 w-4" />
							<span className="sr-only">Yêu thích</span>
						</Button>
						<Button variant="ghost" size="icon" className="h-9 w-9">
							<User className="h-4 w-4" />
							<span className="sr-only">Tài khoản</span>
						</Button>
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
