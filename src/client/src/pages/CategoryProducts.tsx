// import { useState } from 'react'
// import { useParams, Link } from 'react-router-dom'
// import { Header } from '@/components/Header'
// import { ProductCard } from '@/components/ProductCard'
// import { Button } from '@/components/ui/input/button'
// import {
// 	Select,
// 	SelectContent,
// 	SelectItem,
// 	SelectTrigger,
// 	SelectValue,
// } from '@/components/ui/input/select'
// import { ChevronLeft, ChevronRight } from 'lucide-react'
// import { mockProducts } from '@/lib/mockData'

// export default function CategoryProducts() {
// 	const { category } = useParams()
// 	const [sortBy, setSortBy] = useState('ending-soon')
// 	const [currentPage, setCurrentPage] = useState(1)
// 	const productsPerPage = 12

// 	// Filter products by category
// 	const filteredProducts = category
// 		? mockProducts.filter(
// 				(p) => p.category.toLowerCase() === category.toLowerCase()
// 			)
// 		: mockProducts

// 	// Sort products
// 	const sortedProducts = [...filteredProducts].sort((a, b) => {
// 		if (sortBy === 'ending-soon') {
// 			return a.endTime.getTime() - b.endTime.getTime()
// 		} else if (sortBy === 'price-asc') {
// 			return a.currentPrice - b.currentPrice
// 		} else if (sortBy === 'price-desc') {
// 			return b.currentPrice - a.currentPrice
// 		}
// 		return 0
// 	})

// 	// Pagination
// 	const totalPages = Math.ceil(sortedProducts.length / productsPerPage)
// 	const startIndex = (currentPage - 1) * productsPerPage
// 	const paginatedProducts = sortedProducts.slice(
// 		startIndex,
// 		startIndex + productsPerPage
// 	)

// 	return (
// 		<div className="min-h-screen bg-background">
// 			<Header />

// 			<main className="container py-8">
// 				<div className="mb-6">
// 					<div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
// 						<Link to="/" className="hover:text-primary">
// 							Trang chủ
// 						</Link>
// 						<span>/</span>
// 						<span className="text-foreground">
// 							{category || 'Tất cả sản phẩm'}
// 						</span>
// 					</div>

// 					<div className="flex items-center justify-between">
// 						<div>
// 							<h1 className="text-3xl font-bold mb-2">
// 								{category || 'Tất cả sản phẩm'}
// 							</h1>
// 							<p className="text-muted-foreground">
// 								{sortedProducts.length} sản phẩm
// 							</p>
// 						</div>

// 						<div className="flex items-center gap-2">
// 							<span className="text-sm text-muted-foreground">
// 								Sắp xếp:
// 							</span>
// 							<Select value={sortBy} onValueChange={setSortBy}>
// 								<SelectTrigger className="w-[200px]">
// 									<SelectValue />
// 								</SelectTrigger>
// 								<SelectContent>
// 									<SelectItem value="ending-soon">
// 										Sắp kết thúc
// 									</SelectItem>
// 									<SelectItem value="price-asc">
// 										Giá tăng dần
// 									</SelectItem>
// 									<SelectItem value="price-desc">
// 										Giá giảm dần
// 									</SelectItem>
// 								</SelectContent>
// 							</Select>
// 						</div>
// 					</div>
// 				</div>

// 				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
// 					{paginatedProducts.map((product) => (
// 						<ProductCard key={product.id} {...product} />
// 					))}
// 				</div>

// 				{totalPages > 1 && (
// 					<div className="flex items-center justify-center gap-2">
// 						<Button
// 							variant="outline"
// 							size="icon"
// 							onClick={() =>
// 								setCurrentPage((p) => Math.max(1, p - 1))
// 							}
// 							disabled={currentPage === 1}
// 						>
// 							<ChevronLeft className="h-4 w-4" />
// 						</Button>

// 						{Array.from(
// 							{ length: totalPages },
// 							(_, i) => i + 1
// 						).map((page) => (
// 							<Button
// 								key={page}
// 								variant={
// 									currentPage === page ? 'default' : 'outline'
// 								}
// 								onClick={() => setCurrentPage(page)}
// 								className="min-w-[40px]"
// 							>
// 								{page}
// 							</Button>
// 						))}

// 						<Button
// 							variant="outline"
// 							size="icon"
// 							onClick={() =>
// 								setCurrentPage((p) =>
// 									Math.min(totalPages, p + 1)
// 								)
// 							}
// 							disabled={currentPage === totalPages}
// 						>
// 							<ChevronRight className="h-4 w-4" />
// 						</Button>
// 					</div>
// 				)}
// 			</main>
// 		</div>
// 	)
// }
import { useParams } from 'react-router-dom'
import { Header } from '@/components/Header'
import { ProductCard } from '@/components/ProductCard'
// import { useProductsByCategoryName } from '@/app/containers/Products/useProductsByCategoryName'
import { useProductsByCategoryName } from '@/services'
import { Badge } from '@/components/ui/data-display/badge'

const CategoryProducts = () => {
	// ⚠️ QUAN TRỌNG: phải decode từ URL
	const { category } = useParams<{ category: string }>()
	const decodedCategory = decodeURIComponent(category || '')

	// Truyền tên đã decode vào hook
	const { data, isLoading, isError } =
		useProductsByCategoryName(decodedCategory)

	const products = data?.products ?? []
	const categoryName = data?.categoryName ?? decodedCategory

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
					<p>Có lỗi khi tải sản phẩm theo danh mục.</p>
					<p className="text-sm">Danh mục: {categoryName}</p>
				</main>
			</div>
		)
	}

	const mapToCardProps = (p: (typeof products)[number]) => ({
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

			<main className="container py-8 space-y-6">
				<div className="space-y-2">
					<Badge variant="secondary">Danh mục</Badge>
					<h1 className="text-3xl font-bold">{categoryName}</h1>
					<p className="text-muted-foreground">
						Tìm thấy {products.length} sản phẩm
					</p>
				</div>

				{products.length === 0 ? (
					<div className="text-center py-12 text-muted-foreground">
						Không có sản phẩm nào trong danh mục này.
					</div>
				) : (
					<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
						{products.map((p) => (
							<ProductCard key={p._id} {...mapToCardProps(p)} />
						))}
					</div>
				)}
			</main>
		</div>
	)
}

export default CategoryProducts
