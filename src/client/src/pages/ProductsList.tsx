import { useParams, useSearchParams } from 'react-router-dom'
import {
	useEndingSoonProducts,
	useMostBidsProducts,
	useHighestPriceProducts,
} from '../services/utils/products.hooks'
import { ProductCard } from '../components/ProductCard'

type ProductListType = 'ending-soon' | 'most-bids' | 'highest-price'

const TITLES: Record<ProductListType, string> = {
	'ending-soon': 'Sản phẩm sắp kết thúc',
	'most-bids': 'Sản phẩm nhiều lượt đấu giá nhất',
	'highest-price': 'Sản phẩm giá cao nhất',
}

export function ProductsList() {
	const { type } = useParams<{ type: ProductListType }>()
	const [searchParams, setSearchParams] = useSearchParams()
	const page = Number(searchParams.get('page') || '1')

	// Gọi tất cả hooks
	const endingSoonQuery = useEndingSoonProducts(page, 20)
	const mostBidsQuery = useMostBidsProducts(page, 20)
	const highestPriceQuery = useHighestPriceProducts(page, 20)

	// Chọn query
	const { data, isLoading, error } =
		type === 'ending-soon'
			? endingSoonQuery
			: type === 'most-bids'
				? mostBidsQuery
				: highestPriceQuery

	if (isLoading) return <div className="container py-8">Đang tải...</div>
	if (error) return <div className="container py-8">Lỗi: {error.message}</div>

	const title = type ? TITLES[type] : 'Danh sách sản phẩm'

	return (
		<div className="container py-8">
			<div className="mb-8">
				<h1 className="text-3xl font-bold mb-2">{title}</h1>
				<p className="text-gray-600">
					Tổng {data?.total || 0} sản phẩm
				</p>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
				{data?.products.map((product) => (
					<ProductCard
						key={product._id}
						id={product._id}
						image={product.images[0]}
						title={product.name}
						currentPrice={product.currentPrice}
						buyNowPrice={product.buyNowPrice}
						endTime={new Date(product.endTime)}
						bidCount={product.bidCount}
						highestBidder={product.highestBidderName || 'Chưa có'}
						category={product.categoryName || 'Chưa phân loại'}
					/>
				))}
			</div>

			{data && data.totalPages > 1 && (
				<div className="flex justify-center gap-2">
					<button
						onClick={() =>
							setSearchParams({ page: String(page - 1) })
						}
						disabled={page === 1}
						className="px-4 py-2 border rounded disabled:opacity-50"
					>
						Trang trước
					</button>
					<span className="px-4 py-2">
						Trang {page} / {data.totalPages}
					</span>
					<button
						onClick={() =>
							setSearchParams({ page: String(page + 1) })
						}
						disabled={page === data.totalPages}
						className="px-4 py-2 border rounded disabled:opacity-50"
					>
						Trang sau
					</button>
				</div>
			)}
		</div>
	)
}
