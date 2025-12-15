import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, Filter } from 'lucide-react'

import { ProductType, GetProductsRequestData } from 'Shared/Data/Types/index.js'
import { PageAction } from 'Client/Data/Constants/index.js'

import ProductController from 'Client/Controllers/ProductController.js'
import { usePage } from 'Client/Contexts/Page/index.js'
import ProductCard from 'Client/Components/Product/ProductCard.js'
import { Button } from 'Client/Components/UI/input/button.js'
import { Input } from 'Client/Components/UI/input/input.js'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from 'Client/Components/UI/input/select.js'

/**
 * Product List Container.
 * Handles searching, filtering, sorting, and pagination of products.
 */
const ProductListContainer: React.FC = () => {
	const { setPageLoading, addNotification } = usePage()
	const [searchParams, setSearchParams] = useSearchParams()

	// Local state for products and pagination
	const [products, setProducts] = useState<ProductType[]>([])
	const [totalPages, setTotalPages] = useState(1)
	const [totalItems, setTotalItems] = useState(0)

	// Extract query params
	const page = parseInt(searchParams.get('page') || '1')
	const search = searchParams.get('search') || ''
	const category = searchParams.get('category') || ''
	const sort = searchParams.get('sort') || 'time_desc'

	/**
	 * Fetches products based on current filters.
	 */
	const fetchProducts = async () => {
		setPageLoading(true)

		try {
			// Prepare request data
			const requestData: GetProductsRequestData = {
				params: {
					page,
					limit: 12, // 12 items per page grid
					search,
					category,
					sort,
				},
			}

			// Fetch products from the controller
			const response = await ProductController.getAll(requestData)
			const responseData = response.data

			// Update state with fetched products
			if (responseData.success && responseData.data) {
				setProducts(responseData.data.products)
				setTotalPages(responseData.data.totalPages)
				setTotalItems(responseData.data.total)
			} else {
				throw new Error(responseData.error)
			}
		} catch (error: any) {
			console.error('Failed to fetch products:', error)
			addNotification(
				error.message || 'Không thể tải danh sách sản phẩm.',
				'error'
			)
		} finally {
			setPageLoading(false)
		}
	}

	// Refetch when any filter changes
	useEffect(() => {
		fetchProducts()
		window.scrollTo(0, 0)
	}, [page, search, category, sort])

	/**
	 * Updates URL search params.
	 *
	 * @param key - Param key
	 * @param value - Param value
	 */
	const updateFilter = (key: string, value: string) => {
		const newParams = new URLSearchParams(searchParams)
		if (value) {
			newParams.set(key, value)
		} else {
			newParams.delete(key)
		}
		// Reset to page 1 on filter change
		if (key !== 'page') newParams.set('page', '1')
		setSearchParams(newParams)
	}

	return (
		<div className="container py-8">
			{/* Header and Filter Bar */}
			<div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
				{/* Title and Result Count */}
				<div>
					<h1 className="text-3xl font-bold tracking-tight">
						{category ? `Danh mục: ${category}` : 'Tất cả sản phẩm'}
					</h1>
					<p className="text-muted-foreground">
						Hiển thị {products.length} trên tổng số {totalItems} kết
						quả
					</p>
				</div>

				{/* Search and Sort Controls */}
				<div className="flex flex-1 items-center gap-2 md:max-w-md">
					<div className="relative flex-1">
						<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
						<Input
							placeholder="Tìm kiếm..."
							className="pl-8"
							defaultValue={search}
							onKeyDown={(e) => {
								if (e.key === 'Enter') {
									updateFilter(
										'search',
										e.currentTarget.value
									)
								}
							}}
						/>
					</div>
					<Select
						value={sort}
						onValueChange={(val) => updateFilter('sort', val)}
					>
						<SelectTrigger className="w-[180px]">
							<Filter className="mr-2 h-4 w-4" />
							<SelectValue placeholder="Sắp xếp" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="time_desc">
								Sắp kết thúc
							</SelectItem>
							<SelectItem value="price_asc">
								Giá tăng dần
							</SelectItem>
							<SelectItem value="price_desc">
								Giá giảm dần
							</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</div>

			{/* Product Grid */}
			{products.length > 0 ? (
				<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
					{products.map((product) => (
						<ProductCard key={product.slug} product={product} />
					))}
				</div>
			) : (
				<div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed text-center">
					<h3 className="mt-4 text-lg font-semibold">
						Không tìm thấy sản phẩm
					</h3>
					<p className="mb-4 text-muted-foreground">
						Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc của bạn.
					</p>
					<Button
						onClick={() => {
							setSearchParams(new URLSearchParams())
						}}
					>
						Xóa bộ lọc
					</Button>
				</div>
			)}

			{/* Pagination */}
			{totalPages > 1 && (
				<div className="mt-8 flex justify-center gap-2">
					<Button
						variant="outline"
						disabled={page <= 1}
						onClick={() => updateFilter('page', String(page - 1))}
					>
						Trước
					</Button>
					<div className="flex items-center gap-1">
						{Array.from(
							{ length: totalPages },
							(_, i) => i + 1
						).map((p) => (
							<Button
								key={p}
								variant={p === page ? 'default' : 'ghost'}
								size="sm"
								onClick={() => updateFilter('page', String(p))}
							>
								{p}
							</Button>
						))}
					</div>
					<Button
						variant="outline"
						disabled={page >= totalPages}
						onClick={() => updateFilter('page', String(page + 1))}
					>
						Sau
					</Button>
				</div>
			)}
		</div>
	)
}

export default ProductListContainer
