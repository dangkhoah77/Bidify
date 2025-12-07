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
	Gavel,
	Award,
	ArrowRight,
} from 'lucide-react'
import { mockProducts } from '@/lib/mockData'
import { useAuth } from '@/contexts/AuthContext'
import { toast } from 'sonner'
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '../components/ui/overlay/alert-dialog'

export default function BidderProfile() {
	const [activeTab, setActiveTab] = useState('info')
	const [showUpgradeDialog, setShowUpgradeDialog] = useState(false)
	const navigate = useNavigate()
	const { user, isLoading } = useAuth()
	if (isLoading) {
		return (
			<div className="min-h-screen bg-background">
				<Header />
				<main className="container py-8">
					<div className="flex items-center justify-center h-64">
						<p className="text-muted-foreground">Đang tải...</p>
					</div>
				</main>
			</div>
		)
	}

	// Mock user data (replace with real data from AuthContext)
	const profileUser = {
		name: user?.firstName + ' ' + user?.lastName || 'Người dùng',
		email: user?.email || 'user@example.com',
		address: user?.address || 'Chưa cập nhật',
		rating: 4.5,
		totalReviews: 24,
		positiveReviews: 22,
		role: user?.role || 'ROLE BIDER',
		isSeller: user?.role === 'ROLE SELLER',
	}

	const reviews = [
		{
			id: 1,
			from: 'Người bán XYZ',
			rating: 1,
			comment: 'Người mua thanh toán đúng hạn, rất tốt!',
			date: '2025-11-15',
		},
		{
			id: 2,
			from: 'Người bán ABC',
			rating: 1,
			comment: 'Giao dịch suôn sẻ',
			date: '2025-11-10',
		},
		{
			id: 3,
			from: 'Người bán DEF',
			rating: -1,
			comment: 'Không phản hồi',
			date: '2025-11-05',
		},
	]

	const biddingProducts = mockProducts.slice(0, 4)
	const wonProducts = mockProducts.slice(4, 8)

	const handleSwitchToSeller = () => {
		if (profileUser.isSeller) {
			// User is already a seller, navigate to seller profile
			navigate('/seller/profile')
		} else {
			// Show upgrade request dialog
			setShowUpgradeDialog(true)
		}
	}

	const handleUpgradeRequest = () => {
		// TODO: Call API to request upgrade
		toast.success('Yêu cầu nâng cấp đã được gửi. Vui lòng chờ admin duyệt.')
		setShowUpgradeDialog(false)
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
									<div className="h-24 w-24 rounded-full bg-gradient-auction flex items-center justify-center text-4xl font-bold text-white">
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
									<Badge variant="outline">
										Người đấu giá
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
										onClick={handleSwitchToSeller}
									>
										{profileUser.isSeller ? (
											<>
												Chuyển sang hồ sơ Seller
												<ArrowRight className="h-4 w-4" />
											</>
										) : (
											'Yêu cầu nâng cấp Seller'
										)}
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
								<TabsTrigger value="bidding">
									Đang đấu giá
								</TabsTrigger>
								<TabsTrigger value="won">Đã thắng</TabsTrigger>
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

							{/* Bidding Tab */}
							<TabsContent value="bidding">
								<Card>
									<CardHeader>
										<div className="flex items-center gap-2">
											<Gavel className="h-5 w-5" />
											<CardTitle>
												Đang tham gia đấu giá
											</CardTitle>
										</div>
										<CardDescription>
											Các sản phẩm bạn đang đặt giá
										</CardDescription>
									</CardHeader>
									<CardContent>
										<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
											{biddingProducts.map((product) => (
												<ProductCard
													key={product.id}
													{...product}
												/>
											))}
										</div>
									</CardContent>
								</Card>
							</TabsContent>

							{/* Won Tab */}
							<TabsContent value="won">
								<Card>
									<CardHeader>
										<div className="flex items-center gap-2">
											<Award className="h-5 w-5" />
											<CardTitle>Đấu giá thắng</CardTitle>
										</div>
										<CardDescription>
											Các sản phẩm bạn đã thắng đấu giá
										</CardDescription>
									</CardHeader>
									<CardContent>
										<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
											{wonProducts.map((product) => (
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
												Đánh giá từ người dùng
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

			{/* Upgrade Request Dialog */}
			<AlertDialog
				open={showUpgradeDialog}
				onOpenChange={setShowUpgradeDialog}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>
							Yêu cầu nâng cấp lên Seller
						</AlertDialogTitle>
						<AlertDialogDescription>
							Bạn chưa được nâng cấp lên Seller. Bạn có muốn gửi
							yêu cầu nâng cấp tài khoản không? Admin sẽ xem xét
							và phê duyệt trong thời gian sớm nhất.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Hủy</AlertDialogCancel>
						<AlertDialogAction onClick={handleUpgradeRequest}>
							Gửi yêu cầu
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	)
}
