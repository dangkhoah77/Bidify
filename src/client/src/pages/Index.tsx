import { Header } from '../components/Header'
import { ProductCard } from '../components/ProductCard'
import { Button } from '../components/ui/input/button'
import { Badge } from '../components/ui/data-display/badge'
import { TrendingUp, Clock, DollarSign, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useHomeProducts } from '../services/utils/products.hooks'

const Index = () => {
	const { data, isLoading, isError } = useHomeProducts()

	const endingSoon = data?.endingSoon ?? []
	const mostBids = data?.mostBids ?? []
	const highestPrice = data?.highestPrice ?? []

	if (isLoading) {
		return (
			<div className="min-h-screen bg-background">
				<Header />
				<main className="container py-12">
					<p>Đang tải sản phẩm...</p>
				</main>
			</div>
		)
	}

	if (isError) {
		return (
			<div className="min-h-screen bg-background">
				<Header />
				<main className="container py-12 text-destructive">
					<p>Có lỗi khi tải danh sách sản phẩm. Vui lòng thử lại.</p>
				</main>
			</div>
		)
	}

	const mapToCardProps = (p: (typeof endingSoon)[number]) => ({
		id: p._id,
		image: p.images?.[0] ?? '/images/placeholder.jpg',
		title: p.name,
		currentPrice: p.currentPrice,
		buyNowPrice: p.buyNowPrice,
		highestBidder: p.highestBidderName ?? 'Chưa có',
		bidCount: p.bidCount ?? 0,
		endTime: new Date(p.endTime),
		isNew: p.isNew ?? false,
		category: p.categoryName ?? 'Khác',
	})

	return (
		<div className="min-h-screen bg-background">
			<Header />

			{/* Hero Section */}
			<section className="border-b bg-gradient-auction py-16 text-white">
				<div className="container">
					<div className="mx-auto max-w-3xl text-center space-y-6">
						<Badge className="bg-white/20 text-white border-white/30 mb-4">
							<Sparkles className="mr-1 h-3 w-3" />
							Sàn đấu giá trực tuyến uy tín #1 Việt Nam
						</Badge>
						<h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
							Đấu Giá & Sở Hữu
							<br />
							<span className="text-accent">Sản Phẩm Mơ Ước</span>
						</h1>
						<p className="text-lg text-white/90">
							Khám phá hàng ngàn sản phẩm chính hãng được đấu giá
							mỗi ngày. Từ công nghệ, thời trang đến đồ sưu tầm
							độc đáo.
						</p>
						<div className="flex flex-wrap justify-center gap-4">
							<Button
								size="lg"
								variant="secondary"
								className="bg-white text-blue-600 hover:bg-gray-100 font-semibold"
							>
								Khám phá ngay
							</Button>
							<Button
								size="lg"
								variant="outline"
								className="border-2 border-white bg-transparent text-white hover:bg-white/10 font-semibold"
							>
								Cách thức hoạt động
							</Button>
						</div>
					</div>
				</div>
			</section>

			<main className="container py-12 space-y-16">
				{/* Ending Soon Section */}
				<section>
					<div className="mb-6 flex items-center justify-between">
						<div className="flex items-center gap-3">
							<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10">
								<Clock className="h-5 w-5 text-destructive" />
							</div>
							<div>
								<h2 className="text-2xl font-bold">
									Sắp Kết Thúc
								</h2>
								<p className="text-sm text-muted-foreground">
									Nhanh tay đặt giá trước khi hết thời gian!
								</p>
							</div>
						</div>
						{/* ✅ CHỈ GIỮ 1 NÚT "XEM TẤT CẢ" */}
						<Link to="/products/ending-soon">
							<Button variant="ghost">Xem tất cả →</Button>
						</Link>
					</div>

					<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
						{endingSoon.map((p) => (
							<ProductCard key={p._id} {...mapToCardProps(p)} />
						))}
					</div>
				</section>

				{/* Most Bids Section */}
				<section>
					<div className="mb-6 flex items-center justify-between">
						<div className="flex items-center gap-3">
							<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
								<TrendingUp className="h-5 w-5 text-primary" />
							</div>
							<div>
								<h2 className="text-2xl font-bold">
									Nhiều Lượt Đấu Giá Nhất
								</h2>
								<p className="text-sm text-muted-foreground">
									Các sản phẩm được quan tâm nhất hiện nay
								</p>
							</div>
						</div>
						{/* ✅ CHỈ GIỮ 1 NÚT "XEM TẤT CẢ" */}
						<Link to="/products/most-bids">
							<Button variant="ghost">Xem tất cả →</Button>
						</Link>
					</div>

					<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
						{mostBids.map((p) => (
							<ProductCard key={p._id} {...mapToCardProps(p)} />
						))}
					</div>
				</section>

				{/* Highest Price Section */}
				<section>
					<div className="mb-6 flex items-center justify-between">
						<div className="flex items-center gap-3">
							<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
								<DollarSign className="h-5 w-5 text-accent" />
							</div>
							<div>
								<h2 className="text-2xl font-bold">
									Giá Cao Nhất
								</h2>
								<p className="text-sm text-muted-foreground">
									Những sản phẩm cao cấp và giá trị nhất
								</p>
							</div>
						</div>
						{/* ✅ CHỈ GIỮ 1 NÚT "XEM TẤT CẢ" */}
						<Link to="/products/highest-price">
							<Button variant="ghost">Xem tất cả →</Button>
						</Link>
					</div>

					<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
						{highestPrice.map((p) => (
							<ProductCard key={p._id} {...mapToCardProps(p)} />
						))}
					</div>
				</section>

				{/* CTA Section */}
				<section className="rounded-2xl bg-gradient-auction p-12 text-center text-white">
					<div className="mx-auto max-w-2xl space-y-6">
						<h2 className="text-3xl font-bold">
							Sẵn sàng bắt đầu đấu giá?
						</h2>
						<p className="text-lg text-white/90">
							Đăng ký ngay hôm nay và nhận ưu đãi đặc biệt cho
							người dùng mới
						</p>
						<div className="flex flex-wrap justify-center gap-4">
							<Button
								size="lg"
								variant="secondary"
								className="bg-white text-blue-600 hover:bg-gray-100 font-semibold"
							>
								Đăng ký miễn phí
							</Button>
							<Button
								size="lg"
								variant="outline"
								className="border-2 border-white bg-transparent text-white hover:bg-white/10 font-semibold"
							>
								Tìm hiểu thêm
							</Button>
						</div>
					</div>
				</section>
			</main>

			{/* Footer */}
			<footer className="border-t bg-muted/50 py-12">
				<div className="container">
					<div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
						<div>
							<h3 className="mb-4 font-bold">Về AuctionHub</h3>
							<ul className="space-y-2 text-sm text-muted-foreground">
								<li>Giới thiệu</li>
								<li>Liên hệ</li>
								<li>Tuyển dụng</li>
							</ul>
						</div>
						<div>
							<h3 className="mb-4 font-bold">Hỗ trợ</h3>
							<ul className="space-y-2 text-sm text-muted-foreground">
								<li>Trung tâm trợ giúp</li>
								<li>Điều khoản sử dụng</li>
								<li>Chính sách bảo mật</li>
							</ul>
						</div>
						<div>
							<h3 className="mb-4 font-bold">Danh mục</h3>
							<ul className="space-y-2 text-sm text-muted-foreground">
								<li>Điện tử</li>
								<li>Thời trang</li>
								<li>Gia dụng</li>
								<li>Sưu tầm</li>
							</ul>
						</div>
						<div>
							<h3 className="mb-4 font-bold">Kết nối</h3>
							<ul className="space-y-2 text-sm text-muted-foreground">
								<li>Facebook</li>
								<li>Instagram</li>
								<li>Twitter</li>
							</ul>
						</div>
					</div>
					<div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
						© 2025 AuctionHub. All rights reserved.
					</div>
				</div>
			</footer>
		</div>
	)
}

export default Index
