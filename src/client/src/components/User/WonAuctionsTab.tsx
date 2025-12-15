import React from 'react'
import { Link } from 'react-router-dom'
import { Trophy, ShoppingBag } from 'lucide-react'

import { ProductType } from 'Shared/Data/Types/index.js'

import { Card, CardContent } from 'Client/Components/UI/display/card.js'
import { Badge } from 'Client/Components/UI/display/badge.js'
import { Button } from 'Client/Components/UI/input/button.js'

/**
 * Won Auctions Tab Component.
 * Displays a list of auctions won by the user.
 *
 * @param props - Component props.
 */
const WonAuctionsTab: React.FC<{
	products: ProductType[]
	isLoading: boolean
}> = ({ products, isLoading }) => {
	if (isLoading) {
		return (
			<div className="p-12 text-center text-muted-foreground">
				Đang tải danh sách chiến thắng...
			</div>
		)
	}

	// Check if there are no won auctions
	if (!products || products.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center text-muted-foreground">
				<Trophy className="h-10 w-10 mb-4 opacity-50 text-yellow-500" />
				<p>Bạn chưa thắng đấu giá sản phẩm nào.</p>
				<Link to="/products" className="mt-4">
					<Button variant="link">Tham gia đấu giá ngay</Button>
				</Link>
			</div>
		)
	}

	return (
		<div className="space-y-4">
			{products.map((product) => (
				<Card
					key={product.slug}
					className="transition-all hover:shadow-md border-l-4 border-l-yellow-500"
				>
					<CardContent className="p-4 flex items-center gap-4">
						{/* Product Image */}
						<div className="h-16 w-16 rounded-md bg-muted overflow-hidden flex-shrink-0 border">
							{product.images?.[0] && (
								<img
									src={product.images[0]}
									alt={product.name}
									className="h-full w-full object-cover"
								/>
							)}
						</div>

						{/* Info */}
						<div className="flex-1 min-w-0">
							<h4 className="font-semibold truncate text-lg">
								{product.name}
							</h4>
							<div className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
								<span>
									Giá thắng:{' '}
									<span className="font-bold text-primary">
										{product.currentPrice.toLocaleString()}₫
									</span>
								</span>
								{product.seller && (
									<>
										<span>•</span>
										<span>
											Người bán:{' '}
											{product.seller.firstName}{' '}
											{product.seller.lastName}
										</span>
									</>
								)}
							</div>
						</div>

						{/* Action */}
						<div className="flex flex-col items-end gap-2">
							<Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-yellow-200">
								<Trophy className="w-3 h-3 mr-1" />
								Chiến thắng
							</Badge>

							<Link to={`/checkout/${product.slug}`}>
								<Button size="sm" className="gap-2">
									<ShoppingBag className="w-4 h-4" />
									Thanh toán
								</Button>
							</Link>
						</div>
					</CardContent>
				</Card>
			))}
		</div>
	)
}

export default WonAuctionsTab
