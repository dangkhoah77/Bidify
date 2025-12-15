import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Search, MoreVertical, Edit, Eye } from 'lucide-react'

import { ProductType } from 'Shared/Data/Types/index.js'

import ProductController from 'Client/Controllers/ProductController.js'
import { usePage } from 'Client/Contexts/Page/index.js'
import { Button } from 'Client/Components/UI/input/button.js'
import { Input } from 'Client/Components/UI/input/input.js'
import { Badge } from 'Client/Components/UI/display/badge.js'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from 'Client/Components/UI/display/table.js'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from 'Client/Components/UI/navigation/dropdown-menu.js'

/**
 * Selling Products Container.
 * Manages the display and fetching of products listed by the seller.
 */
const SellingProductsContainer: React.FC = () => {
	const { pageState, setPageLoading, addNotification } = usePage()

	const [products, setProducts] = useState<ProductType[]>([])
	const [search, setSearch] = useState('')

	const fetchProducts = async () => {
		setPageLoading(true)

		try {
			const res = await ProductController.getSellerProducts({
				params: { search: search },
			})
			const resData = res.data

			if (resData.success && resData.data) {
				setProducts(resData.data.products)
			} else {
				throw new Error(resData.error)
			}
		} catch (error) {
			addNotification('Không thể tải sản phẩm của bạn.', 'error')
		} finally {
			setPageLoading(false)
		}
	}

	// Fetch products on component mount and when search changes
	useEffect(() => {
		const timer = setTimeout(() => {
			fetchProducts()
		}, 500)
		return () => clearTimeout(timer)
	}, [search])

	return (
		<div className="container py-8 space-y-6">
			<div className="flex justify-between items-center">
				<div>
					<h1 className="text-2xl font-bold tracking-tight">
						Kênh người bán
					</h1>
					<p className="text-muted-foreground">
						Quản lý các sản phẩm đấu giá của bạn
					</p>
				</div>
				<Link to="/products/create">
					<Button>
						<Plus className="mr-2 h-4 w-4" /> Đăng sản phẩm mới
					</Button>
				</Link>
			</div>

			<div className="flex items-center gap-2">
				<div className="relative flex-1 max-w-sm">
					<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
					<Input
						placeholder="Tìm kiếm sản phẩm..."
						className="pl-8"
						value={search}
						onChange={(e) => setSearch(e.target.value)}
					/>
				</div>
			</div>

			<div className="rounded-md border bg-white">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Ảnh</TableHead>
							<TableHead>Tên sản phẩm</TableHead>
							<TableHead>Giá hiện tại</TableHead>
							<TableHead>Trạng thái</TableHead>
							<TableHead>Người giữ giá</TableHead>
							<TableHead className="text-right">
								Hành động
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{pageState.loading ? (
							<TableRow>
								<TableCell
									colSpan={6}
									className="text-center py-8"
								>
									Đang tải...
								</TableCell>
							</TableRow>
						) : products.length === 0 ? (
							<TableRow>
								<TableCell
									colSpan={6}
									className="text-center py-8"
								>
									Chưa có sản phẩm nào
								</TableCell>
							</TableRow>
						) : (
							products.map((product) => (
								<TableRow key={product.slug}>
									<TableCell>
										<div className="h-12 w-12 rounded bg-muted overflow-hidden">
											{product.images?.[0] && (
												<img
													src={product.images[0]}
													alt=""
													className="h-full w-full object-cover"
												/>
											)}
										</div>
									</TableCell>
									<TableCell
										className="font-medium max-w-[200px] truncate"
										title={product.name}
									>
										{product.name}
									</TableCell>
									<TableCell>
										{product.currentPrice.toLocaleString()}₫
									</TableCell>
									<TableCell>
										{new Date(product.endTime) <
										new Date() ? (
											<Badge variant="secondary">
												Đã kết thúc
											</Badge>
										) : (
											<Badge className="bg-green-500">
												Đang diễn ra
											</Badge>
										)}
									</TableCell>
									<TableCell>
										{product.highestBidder ? (
											<span>
												{
													product.highestBidder
														.firstName
												}{' '}
												{product.highestBidder.lastName}
											</span>
										) : (
											<span className="text-muted-foreground italic">
												Chưa có bid
											</span>
										)}
									</TableCell>
									<TableCell className="text-right">
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button
													variant="ghost"
													size="icon"
												>
													<MoreVertical className="h-4 w-4" />
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent align="end">
												<Link
													to={`/products/${product.slug}`}
												>
													<DropdownMenuItem>
														<Eye className="mr-2 h-4 w-4" />{' '}
														Xem chi tiết
													</DropdownMenuItem>
												</Link>
												<Link
													to={`/products/${product.slug}/edit`}
												>
													<DropdownMenuItem>
														<Edit className="mr-2 h-4 w-4" />{' '}
														Bổ sung mô tả
													</DropdownMenuItem>
												</Link>
											</DropdownMenuContent>
										</DropdownMenu>
									</TableCell>
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			</div>
		</div>
	)
}

export default SellingProductsContainer
