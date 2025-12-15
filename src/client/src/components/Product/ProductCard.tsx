import React from 'react'
import { Link } from 'react-router-dom'
import { Clock, TrendingUp, User, Heart } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { vi } from 'date-fns/locale'
import chalk from 'chalk'

import { ProductType } from 'Shared/Data/Types/index.js'
import { PageAction } from 'Client/Data/Constants/index.js'
import { Card, CardContent } from 'Client/Components/UI/display/card.js'
import { Badge } from 'Client/Components/UI/display/badge.js'
import { Button } from 'Client/Components/UI/input/button.js'
import { useAuth } from 'Client/Contexts/Auth/index.js'
import { usePage } from 'Client/Contexts/Page/index.js'
import ProductController from 'Client/Controllers/ProductController.js'

/**
 * Product Card component to display product information in a card format.
 *
 * @param props - The component props.
 * @return The Product Card component.
 */
const ProductCard: React.FC<{
	product: ProductType
}> = ({ product }) => {
	const { dispatch } = usePage()
	const { isAuthenticated } = useAuth()

	// Check if the product is ending soon (within 3 days) and calculate the remaining time
	const isEndingSoon =
		new Date(product.endTime).getTime() - Date.now() <
		3 * 24 * 60 * 60 * 1000 // Less than 3 days
	const timeLeft = formatDistanceToNow(new Date(product.endTime), {
		addSuffix: true,
		locale: vi,
	})

	/**
	 * Handle adding the product to the user's watchlist.
	 *
	 * @param e - The mouse event.
	 */
	const handleAddToWatchlist = async (e: React.MouseEvent) => {
		e.preventDefault() // Prevent navigation to detail page
		e.stopPropagation()

		if (!isAuthenticated) {
			dispatch({
				type: PageAction.AddNotification,
				payload: {
					message: 'Vui lòng đăng nhập để thêm vào yêu thích',
					type: 'error',
				},
			})
			return
		}

		// Call the API to add the product to the watchlist
		const response = await ProductController.addToWatchlist(product.slug)
		const responseData = response.data

		if (!responseData.success) {
			dispatch({
				type: PageAction.AddNotification,
				payload: {
					message: `Đã thêm "${product.name}" vào danh sách yêu thích`,
					type: 'success',
				},
			})
			console.error(chalk.green(`Added to watchlist: ${product.slug}`))
		} else {
			dispatch({
				type: PageAction.AddNotification,
				payload: {
					message: `Đã xảy ra lỗi khi thêm "${product.name}" vào danh sách yêu thích`,
					type: 'error',
				},
			})
			console.error(
				chalk.red(`Error adding to watchlist: ${responseData.error}`)
			)
		}
	}

	return (
		<Link to={`/product/${product.slug}`} className="block h-full">
			<Card className="group overflow-hidden transition-all hover:shadow-lg h-full flex flex-col">
				<div className="relative aspect-square overflow-hidden bg-muted">
					{/* Product Image */}
					<img
						src={product.images[0]}
						alt={product.name}
						className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
					/>

					{/* Add to Watchlist Button */}
					<Button
						variant="ghost"
						size="icon"
						className="absolute right-2 top-2 h-10 w-10 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white hover:text-red-500 hover:fill-red-500 shadow-sm transition-colors z-10"
						onClick={handleAddToWatchlist}
						title="Thêm vào yêu thích"
					>
						<Heart className="h-5 w-5" />
					</Button>

					{/* Ending Soon Badge */}
					{isEndingSoon && (
						<Badge className="absolute left-2 bottom-2 bg-destructive text-destructive-foreground">
							<Clock className="mr-1 h-3 w-3" />
							Sắp kết thúc
						</Badge>
					)}
				</div>

				{/* Content Section */}
				<CardContent className="p-4 flex flex-col flex-1">
					{/* Product Category and Name */}
					<div className="mb-2">
						<Badge variant="secondary" className="mb-2 text-xs">
							{product.category?.name}
						</Badge>
						<h3 className="line-clamp-2 font-semibold leading-tight group-hover:text-primary transition-colors min-h-[2.5rem]">
							{product.name}
						</h3>
					</div>

					{/* Price and Additional Info */}
					<div className="space-y-2">
						{/* Price Section */}
						<div className="flex items-baseline justify-between">
							<div>
								<p className="text-xs text-muted-foreground">
									Giá hiện tại
								</p>
								<p className="text-xl font-bold text-primary">
									{product.currentPrice.toLocaleString(
										'vi-VN'
									)}
									₫
								</p>
							</div>
							{product.buyNowPrice && (
								<div className="text-right">
									<p className="text-xs text-muted-foreground">
										Mua ngay
									</p>
									<p className="text-sm font-semibold text-accent-foreground">
										{product.buyNowPrice.toLocaleString(
											'vi-VN'
										)}
										₫
									</p>
								</div>
							)}
						</div>

						{/* Highest Bidder and Bid Count */}
						<div className="flex items-center justify-between text-xs text-muted-foreground border-t pt-2">
							<div className="flex items-center gap-1">
								<User className="h-3 w-3" />
								<span>
									{product.highestBidder?.lastName ||
										'Chưa có'}
								</span>
							</div>
							<div className="flex items-center gap-1">
								<TrendingUp className="h-3 w-3" />
								<span>{0} lượt</span>{' '}
								{/* Need bidCount in ProductType */}
							</div>
						</div>

						{/* Time Left */}
						<div className="flex items-center gap-1 text-xs text-muted-foreground pt-1 border-t">
							<Clock className="h-3 w-3" />
							<span>{timeLeft}</span>
						</div>
					</div>
				</CardContent>
			</Card>
		</Link>
	)
}

export default ProductCard
