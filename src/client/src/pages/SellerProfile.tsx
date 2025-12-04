import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Header } from '@/components/Header'
import { Button } from '@/components/ui/input/button'
import { Input } from '@/components/ui/input/input'
import { Label } from '@/components/ui/input/label'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/data-display/card'
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from '@/components/ui/navigation/tabs'
import { Badge } from '@/components/ui/data-display/badge'
import { Textarea } from '@/components/ui/input/textarea'
import { ProductCard } from '@/components/ProductCard'
import {
	Star,
	ThumbsUp,
	ThumbsDown,
	Package,
	Award,
	ArrowLeft,
} from 'lucide-react'
import { mockProducts } from '@/lib/mockData'
import { useAuth } from '@/contexts/AuthContext'

export default function SellerProfile() {
	const [activeTab, setActiveTab] = useState('info')
	const navigate = useNavigate()
	const { user } = useAuth()

	// Mock user data
	const profileUser = {
		name: user?.firstName + ' ' + user?.lastName || 'Người dùng',
		email: user?.email || 'user@example.com',
		address: user?.address || 'Chưa cập nhật',
		rating: 4.8,
		totalReviews: 45,
		positiveReviews: 42,
		role: user?.role || 'seller',
	}

	const reviews = [
		{
			id: 1,
			from: 'Người mua XYZ',
			rating: 1,
			comment: 'Sản phẩm tốt, giao hàng nhanh!',
			date: '2025-11-20',
		},
		{
			id: 2,
			from: 'Người mua ABC',
			rating: 1,
			comment: 'Chất lượng như mô tả',
			date: '2025-11-18',
		},
	]

	const activeProducts = mockProducts.slice(0, 6)
	const soldProducts = mockProducts.slice(6, 10)

	const handleSwitchToBidder = () => {
		navigate('/profile')
	}

	return (
		<div className="min-h-screen bg-background">
			<Header />

			<main className="container py-8">
				<div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
					{/* Sidebar */}
					<div className="lg:col-span-1">
						<Card>
							<CardHeader>
								<div className="flex items-center justify-center mb-4">
									<div className="h-24 w-24 rounded-full bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center text-4xl font-bold text-white">
										{profileUser.name.charAt(0)}
									</div>
								</div>
								<CardTitle className="text-center">
									{profileUser.name}
								</CardTitle>
								<CardDescription className="text-center">
									{profileUser.email}
								</CardDescription>
								<div className="flex justify-center mt-2">
									<Badge className="bg-gradient-to-r from-amber-500 to-orange-600">
										Người bán
									</Badge>
								</div>
							</CardHeader>
							<CardContent>
								<div className="space-y-4">
									<div className="flex items-center justify-between p-3 bg-muted rounded-lg">
										<div className="flex items-center gap-2">
											<Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
											<span className="font-semibold">
												{profileUser.rating}
											</span>
										</div>
										<span className="text-sm text-muted-foreground">
											{profileUser.totalReviews} đánh giá
										</span>
									</div>

									<div className="flex items-center justify-between p-3 bg-muted rounded-lg">
										<div className="flex items-center gap-2">
											<ThumbsUp className="h-5 w-5 text-green-500" />
											<span className="font-semibold">
												{Math.round(
													(profileUser.positiveReviews /
														profileUser.totalReviews) *
														100
												)}
												%
											</span>
										</div>
										<span className="text-sm text-muted-foreground">
											Tích cực
										</span>
									</div>

									<Button
										variant="outline"
										className="w-full gap-2"
										onClick={handleSwitchToBidder}
									>
										<ArrowLeft className="h-4 w-4" />
										Chuyển sang hồ sơ Bidder
									</Button>
								</div>
							</CardContent>
						</Card>
					</div>

					{/* Main Content */}
					<div className="lg:col-span-3">
						<Tabs value={activeTab} onValueChange={setActiveTab}>
							<TabsList className="grid w-full grid-cols-4">
								<TabsTrigger value="info">
									Thông tin
								</TabsTrigger>
								<TabsTrigger value="selling">
									Đang bán
								</TabsTrigger>
								<TabsTrigger value="sold">Đã bán</TabsTrigger>
								<TabsTrigger value="reviews">
									Đánh giá
								</TabsTrigger>
							</TabsList>

							{/* Info Tab */}
							<TabsContent value="info">
								<Card>
									<CardHeader>
										<CardTitle>Thông tin cá nhân</CardTitle>
										<CardDescription>
											Cập nhật thông tin tài khoản của bạn
										</CardDescription>
									</CardHeader>
									<CardContent className="space-y-4">
										<div className="space-y-2">
											<Label htmlFor="name">
												Họ và tên
											</Label>
											<Input
												id="name"
												defaultValue={profileUser.name}
											/>
										</div>
										<div className="space-y-2">
											<Label htmlFor="email">Email</Label>
											<Input
												id="email"
												type="email"
												defaultValue={profileUser.email}
												disabled
											/>
										</div>
										<div className="space-y-2">
											<Label htmlFor="address">
												Địa chỉ
											</Label>
											<Textarea
												id="address"
												defaultValue={
													profileUser.address
												}
											/>
										</div>
										<div className="space-y-2">
											<Label htmlFor="current-password">
												Mật khẩu hiện tại
											</Label>
											<Input
												id="current-password"
												type="password"
											/>
										</div>
										<div className="space-y-2">
											<Label htmlFor="new-password">
												Mật khẩu mới
											</Label>
											<Input
												id="new-password"
												type="password"
											/>
										</div>
										<Button>Cập nhật thông tin</Button>
									</CardContent>
								</Card>
							</TabsContent>

							{/* Selling Tab */}
							<TabsContent value="selling">
								<Card>
									<CardHeader>
										<div className="flex items-center gap-2">
											<Package className="h-5 w-5" />
											<CardTitle>
												Sản phẩm đang bán
											</CardTitle>
										</div>
										<CardDescription>
											Các sản phẩm đang trong phiên đấu
											giá
										</CardDescription>
									</CardHeader>
									<CardContent>
										<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
											{activeProducts.map((product) => (
												<ProductCard
													key={product.id}
													{...product}
												/>
											))}
										</div>
									</CardContent>
								</Card>
							</TabsContent>

							{/* Sold Tab */}
							<TabsContent value="sold">
								<Card>
									<CardHeader>
										<div className="flex items-center gap-2">
											<Award className="h-5 w-5" />
											<CardTitle>
												Sản phẩm đã bán
											</CardTitle>
										</div>
										<CardDescription>
											Các sản phẩm đã kết thúc đấu giá
										</CardDescription>
									</CardHeader>
									<CardContent>
										<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
											{soldProducts.map((product) => (
												<ProductCard
													key={product.id}
													{...product}
												/>
											))}
										</div>
									</CardContent>
								</Card>
							</TabsContent>

							{/* Reviews Tab */}
							<TabsContent value="reviews">
								<Card>
									<CardHeader>
										<div className="flex items-center gap-2">
											<Star className="h-5 w-5" />
											<CardTitle>
												Đánh giá từ người mua
											</CardTitle>
										</div>
										<CardDescription>
											Lịch sử đánh giá của bạn
										</CardDescription>
									</CardHeader>
									<CardContent>
										<div className="space-y-4">
											{reviews.map((review) => (
												<div
													key={review.id}
													className="border rounded-lg p-4"
												>
													<div className="flex items-start justify-between mb-2">
														<div>
															<p className="font-semibold">
																{review.from}
															</p>
															<p className="text-sm text-muted-foreground">
																{review.date}
															</p>
														</div>
														<Badge
															variant={
																review.rating >
																0
																	? 'default'
																	: 'destructive'
															}
														>
															{review.rating >
															0 ? (
																<>
																	<ThumbsUp className="h-3 w-3 mr-1" />
																	+1
																</>
															) : (
																<>
																	<ThumbsDown className="h-3 w-3 mr-1" />
																	-1
																</>
															)}
														</Badge>
													</div>
													<p className="text-sm">
														{review.comment}
													</p>
												</div>
											))}
										</div>
									</CardContent>
								</Card>
							</TabsContent>
						</Tabs>
					</div>
				</div>
			</main>
		</div>
	)
}
