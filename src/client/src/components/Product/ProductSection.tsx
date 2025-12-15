import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

import type { ProductType } from 'Shared/Data/Types/types_Product.js'

import ProductCard from 'Client/Components/Product/ProductCard.js'
import { Button } from 'Client/Components/UI/input/button.js'
import { Skeleton } from 'Client/Components/UI/display/skeleton.js'

/**
 * Section Component to render a horizontal list of products.
 *
 * @param {Object} props - Component props
 */
const ProductSection: React.FC<{
	title: string
	icon: React.ReactNode
	products: ProductType[]
	loading: boolean
	viewMoreLink?: string
}> = ({ title, icon, products, loading, viewMoreLink }) => {
	if (!loading && products.length === 0) return null

	return (
		<section className="py-8">
			<div className="mb-6 flex items-center justify-between">
				<div className="flex items-center gap-2">
					<div className="rounded-full bg-primary/10 p-2 text-primary">
						{icon}
					</div>
					<h2 className="text-2xl font-bold tracking-tight">
						{title}
					</h2>
				</div>
				{viewMoreLink && (
					<Link to={viewMoreLink}>
						<Button variant="ghost" className="group">
							Xem tất cả
							<ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
						</Button>
					</Link>
				)}
			</div>

			<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
				{loading
					? Array.from({ length: 5 }).map((_, i) => (
							<div key={i} className="space-y-4">
								<Skeleton className="aspect-square rounded-xl" />
								<div className="space-y-2">
									<Skeleton className="h-4 w-3/4" />
									<Skeleton className="h-4 w-1/2" />
								</div>
							</div>
						))
					: products.map((product) => (
							<ProductCard key={product.slug} product={product} />
						))}
			</div>
		</section>
	)
}

export default ProductSection
