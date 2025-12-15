import React from 'react'
import { HeartOff } from 'lucide-react'
import { Link } from 'react-router-dom'

import { ProductType } from 'Shared/Data/Types/index.js'

import ProductCard from 'Client/Components/Product/ProductCard.js'
import { Button } from 'Client/Components/UI/input/button.js'

/**
 * Component to display the user's watchlist.
 *
 * @param props - Component props.
 */
const WatchlistTab: React.FC<{
	products: ProductType[]
	isLoading: boolean
}> = ({ products, isLoading }) => {
	if (isLoading) {
		return (
			<div className="p-12 text-center text-muted-foreground">
				Đang tải danh sách yêu thích...
			</div>
		)
	}

	if (!products || products.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center animate-in fade-in-50">
				<div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
					<HeartOff className="h-6 w-6 text-muted-foreground" />
				</div>
				<h3 className="mt-4 text-lg font-semibold">Danh sách trống</h3>
				<p className="mb-4 mt-2 text-sm text-muted-foreground">
					Bạn chưa lưu sản phẩm nào vào danh sách yêu thích.
				</p>
				<Link to="/products">
					<Button variant="outline">Khám phá sản phẩm</Button>
				</Link>
			</div>
		)
	}

	return (
		<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
			{products.map((product) => (
				<ProductCard key={product.slug} product={product} />
			))}
		</div>
	)
}

export default WatchlistTab
