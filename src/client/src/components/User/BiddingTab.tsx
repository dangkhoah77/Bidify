import React from 'react'
import { formatDistanceToNow } from 'date-fns'
import { vi } from 'date-fns/locale'
import { Link } from 'react-router-dom'
import { ArrowUpRight, Trophy, Clock } from 'lucide-react'

import { BidType } from 'Shared/Data/Types/index.js'

import { Card, CardContent } from 'Client/Components/UI/display/card.js'
import { Badge } from 'Client/Components/UI/display/badge.js'

/**
 * Component to display the user's bidding history.
 */
const BiddingTab: React.FC<{
	bids: BidType[]
	isLoading: boolean
}> = ({ bids, isLoading }) => {
	if (isLoading) {
		return (
			<div className="p-12 text-center text-muted-foreground">
				Đang tải lịch sử đấu giá...
			</div>
		)
	}

	// Check if the user has not placed any bids
	if (!bids || bids.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center text-muted-foreground">
				<GavelIcon className="h-10 w-10 mb-4 opacity-50" />
				<p>Bạn chưa tham gia đấu giá sản phẩm nào.</p>
				<Link to="/products" className="mt-4">
					<Button variant="link">Bắt đầu đấu giá ngay</Button>
				</Link>
			</div>
		)
	}

	return (
		<div className="space-y-4">
			{bids.map((bid) => {
				// Determine if user is currently winning (basic check)
				const isWinning =
					bid.product &&
					bid.product.highestBidder?.id === bid.bidder.id
				const productLink = bid.product
					? `/products/${bid.product.slug}`
					: '#'

				return (
					<Link key={bid.id} to={productLink} className="block group">
						<Card className="transition-all hover:shadow-md hover:border-primary/50">
							<CardContent className="p-4 flex items-center gap-4">
								{/* Product Image Thumbnail */}
								<div className="h-16 w-16 rounded-md bg-muted overflow-hidden flex-shrink-0 border">
									{bid.product?.images?.[0] ? (
										<img
											src={bid.product.images[0]}
											alt={bid.product.name}
											className="h-full w-full object-cover"
										/>
									) : (
										<div className="h-full w-full flex items-center justify-center text-xs text-muted-foreground">
											No img
										</div>
									)}
								</div>

								{/* Info */}
								<div className="flex-1 min-w-0">
									<div className="flex justify-between items-start">
										<h4 className="font-semibold truncate group-hover:text-primary pr-2">
											{bid.product?.name ||
												'Sản phẩm không tồn tại'}
										</h4>
										<span className="text-xs text-muted-foreground flex-shrink-0 flex items-center">
											<Clock className="w-3 h-3 mr-1" />
											{bid.createdAt
												? formatDistanceToNow(
														new Date(bid.createdAt),
														{
															addSuffix: true,
															locale: vi,
														}
													)
												: ''}
										</span>
									</div>

									<div className="text-sm mt-1 flex items-center gap-3">
										<div className="text-muted-foreground">
											Bạn đặt:{' '}
											<span className="font-medium text-foreground">
												{bid.price.toLocaleString()}₫
											</span>
										</div>

										{/* Status Badge */}
										{isWinning ? (
											<Badge className="bg-green-100 text-green-700 hover:bg-green-200 border-green-200 px-2 py-0.5 text-xs h-auto">
												<Trophy className="w-3 h-3 mr-1" />
												Đang dẫn đầu
											</Badge>
										) : (
											<Badge
												variant="secondary"
												className="px-2 py-0.5 text-xs h-auto"
											>
												<ArrowUpRight className="w-3 h-3 mr-1" />
												Đã bị vượt
											</Badge>
										)}
									</div>
								</div>
							</CardContent>
						</Card>
					</Link>
				)
			})}
		</div>
	)
}

// Simple Icon component for empty state
const GavelIcon = ({ className }: { className?: string }) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
		className={className}
	>
		<path d="m14.5 12.5-8 8a2.119 2.119 0 1 1-3-3l8-8" />
		<path d="m16 16 6-6" />
		<path d="m8 8 6-6" />
		<path d="m9 7 8 8" />
		<path d="m21 11-8-8" />
	</svg>
)

import { Button } from 'Client/Components/UI/input/button.js'

export default BiddingTab
