import React, { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom'
import {
	Gavel,
	Heart,
	Share2,
	AlertCircle,
	Zap,
	XCircle,
	Star,
	ShoppingBag,
	ArrowRight,
} from 'lucide-react'
import chalk from 'chalk'

import { ProductType, BidType } from 'Shared/Data/Types/index.js'

import ProductController from 'Client/Controllers/ProductController.js'
import AuctionController from 'Client/Controllers/AuctionController.js'
import { useAuth } from 'Client/Contexts/Auth/index.js'
import { usePage } from 'Client/Contexts/Page/index.js'
import { useSocket } from 'Client/Contexts/Socket/index.js'

import { Button } from 'Client/Components/UI/input/button.js'
import { Input } from 'Client/Components/UI/input/input.js'
import { Badge } from 'Client/Components/UI/display/badge.js'
import { Label } from 'Client/Components/UI/input/label.js'
import CountdownTimer from 'Client/Components/Product/CountdownTimer.js'
import ProductImageGallery from 'Client/Components/Product/ProductImageGallery.js'
import BidHistoryList from 'Client/Components/Product/BidHistoryList.js'
import ProductCard from 'Client/Components/Product/ProductCard.js' // For related products

/**
 * Product Detail Container.
 * Manages fetching product data, real-time socket updates, and bid submission (Manual & Auto).
 */
const ProductDetailContainer: React.FC = () => {
	const { slug } = useParams<{ slug: string }>()
	const navigate = useNavigate()
	const location = useLocation()

	const { user, isAuthenticated } = useAuth()
	const { pageState, setPageLoading, addNotification } = usePage()
	const { socket, connected } = useSocket()

	const [errors, setErrors] = useState<{
		initialBiddingPrice?: string
		maxBiddingPrice?: string
	}>({})

	const [product, setProduct] = useState<ProductType | null>(null)
	const [bids, setBids] = useState<BidType[]>([])
	const [relatedProducts, setRelatedProducts] = useState<ProductType[]>([])

	const [initialBiddingPrice, setInitialBiddingPrice] = useState('')
	const [maxBiddingPrice, setMaxBiddingPrice] = useState('')
	const [bidRegistered, setBidRegistered] = useState(false)

	/**
	 * Fetch Product Data and Bid History
	 */
	const fetchData = useCallback(async () => {
		if (!slug) return

		setPageLoading(true)

		try {
			const [productRes, historyRes] = await Promise.all([
				ProductController.getOne(slug),
				AuctionController.getHistory(slug),
			])
			const productResData = productRes.data
			const historyResData = historyRes.data

			// Set Product Details
			if (productResData.success && productResData.data) {
				const prod = productResData.data.product
				setProduct(prod)

				// Initialize Inputs
				if (initialBiddingPrice.length === 0) {
					setInitialBiddingPrice(
						String(prod.currentPrice + prod.priceStep)
					)
				}
				if (maxBiddingPrice.length === 0 && prod.buyNowPrice) {
					setMaxBiddingPrice(String(prod.buyNowPrice))
				}

				// Fetch Related Products (same category)
				if (prod.category) {
					const relatedRes = await ProductController.getAll({
						params: {
							category: prod.category.name,
							limit: 4,
						},
					})
					const relatedResData = relatedRes.data

					if (relatedResData.success && relatedResData.data) {
						// Filter out current product
						setRelatedProducts(
							relatedResData.data.products
								.filter((p) => p.slug !== prod.slug)
								.slice(0, 4)
						)
					} else {
						setRelatedProducts([])
						throw new Error(relatedResData.error)
					}
				}
			} else {
				throw new Error(productResData.error)
			}

			// Set Bid History
			if (historyResData.success && historyResData.data) {
				setBids(historyResData.data.bids)

				// Check if user has registered a bid
				setBidRegistered(
					isAuthenticated &&
						user != null &&
						historyResData.data.bids.some(
							(bid) => bid.latest && bid.bidder.id === user.id
						)
				)
			} else {
				throw new Error(historyResData.error)
			}
		} catch (error: any) {
			setProduct(null)
			setBids([])

			console.error(
				chalk.red('Error fetching product data:'),
				error.message
			)
			addNotification(error.message || 'Lỗi khi tải sản phẩm', 'error')

			// Navigate back to products page on error
			navigate('/products')
		} finally {
			setErrors({})
			setPageLoading(false)
		}
	}, [slug, navigate, isAuthenticated, user])

	// Fetch product data on mount
	useEffect(() => {
		fetchData()
	}, [fetchData])

	// Validate inputs on change
	useEffect(() => {
		if (!product) return

		const newErrors: {
			initialBiddingPrice?: string
			maxBiddingPrice?: string
		} = {}
		const minRequired = product.currentPrice + product.priceStep

		// Validate Initial Price
		if (!initialBiddingPrice || initialBiddingPrice.length === 0) {
			newErrors.initialBiddingPrice = 'Vui lòng nhập giá khởi điểm'
		} else {
			const price = parseInt(initialBiddingPrice)
			if (isNaN(price)) {
				newErrors.initialBiddingPrice = 'Giá không hợp lệ'
			} else if (price < minRequired) {
				newErrors.initialBiddingPrice = `Giá phải ≥ ${minRequired.toLocaleString()}₫`
			}
		}

		// Validate Max Price
		if (!maxBiddingPrice) {
			newErrors.maxBiddingPrice = 'Vui lòng nhập giá tối đa'
		} else {
			const max = parseInt(maxBiddingPrice)
			const price = parseInt(initialBiddingPrice)

			if (isNaN(max)) {
				newErrors.maxBiddingPrice = 'Giá không hợp lệ'
			} else if (!isNaN(price) && max <= price) {
				newErrors.maxBiddingPrice =
					'Giá tối đa phải lớn hơn giá khởi điểm'
			} else if (product.buyNowPrice && max > product.buyNowPrice) {
				setMaxBiddingPrice(String(product.buyNowPrice))
			}
		}

		setErrors(newErrors)
	}, [product, initialBiddingPrice, maxBiddingPrice])

	/**
	 * Real-time Socket Listener
	 */
	useEffect(() => {
		if (!socket || !connected || !slug) return

		socket.emit('join_product', slug)

		socket.on('new_bid', (newBid: BidType) => {
			setBids((prev) => [newBid, ...prev])
			setProduct((prev) => {
				if (!prev) return prev
				setInitialBiddingPrice(String(newBid.price + prev.priceStep))
				return {
					...prev,
					currentPrice: newBid.price,
					highestBidder: newBid.bidder,
				}
			})

			addNotification(
				`Có lượt đấu giá mới: ${newBid.price.toLocaleString()}₫`,
				'info'
			)
		})

		return () => {
			socket.emit('leave_product', slug)
			socket.off('new_bid')
		}
	}, [slug, socket, connected])

	/**
	 * Handle Bid Registering
	 */
	const handleBidRegistering = async () => {
		if (!isAuthenticated) {
			navigate('/auth/login', { state: { from: location.pathname } })
			return
		}
		if (!product || errors.initialBiddingPrice || errors.maxBiddingPrice)
			return

		const price = parseInt(initialBiddingPrice)
		const max = parseInt(maxBiddingPrice)

		try {
			const res = await AuctionController.registerBid(product.slug, {
				bidPrice: price,
				maxBidPrice: max,
			})
			const resData = res.data

			if (resData.success) {
				setBidRegistered(true)
				addNotification('Tham gia đặt giá thành công', 'success')
			} else {
				throw new Error(resData.error)
			}
		} catch (error: any) {
			addNotification(
				error.message || 'Đăng ký đặt giá thất bại',
				'error'
			)
		}
	}

	/**
	 * Handle Unregister (Cancel Bid)
	 */
	const handleBidUnregistering = async () => {
		if (!product) return

		try {
			const res = await AuctionController.unregisterBid(product.slug)
			const resData = res.data

			if (resData.success) {
				setBidRegistered(false)
				setInitialBiddingPrice(
					String(product.currentPrice + product.priceStep)
				)
				setMaxBiddingPrice(
					product.buyNowPrice ? String(product.buyNowPrice) : ''
				)

				addNotification('Hủy đăng ký thành công', 'success')
			} else {
				throw new Error(resData.error)
			}
		} catch (error: any) {
			addNotification(
				error.message || 'Hủy đăng ký đặt giá thất bại',
				'error'
			)
		}
	}

	if (pageState.loading || !product) return null

	return (
		<div className="container py-8">
			<div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
				{/* Left Column: Images */}
				<div>
					<ProductImageGallery
						images={product.images}
						alt={product.name}
					/>
				</div>

				{/* Right Column: Info & Bidding */}
				<div className="space-y-6">
					<div>
						<div className="mb-2 flex items-center justify-between">
							<Badge variant="secondary">
								{typeof product.category === 'string'
									? product.category
									: product.category.name}
							</Badge>
							<div className="flex gap-2">
								<Button
									variant="ghost"
									size="icon"
									title="Thêm vào yêu thích"
								>
									<Heart className="h-5 w-5" />
								</Button>
								<Button
									variant="ghost"
									size="icon"
									title="Chia sẻ"
								>
									<Share2 className="h-5 w-5" />
								</Button>
							</div>
						</div>
						<h1 className="text-3xl font-bold">{product.name}</h1>

						{/* Seller Info with Ratings */}
						<div className="mt-2 flex items-center gap-4 text-sm">
							<span className="text-muted-foreground">
								Người bán:{' '}
							</span>
							<div className="flex items-center gap-1 font-medium text-foreground">
								{product.seller.firstName}{' '}
								{product.seller.lastName}
								<div className="flex items-center text-yellow-500 ml-2">
									<Star className="h-3 w-3 fill-current" />
									<span className="ml-0.5 text-xs text-muted-foreground">
										(4.8)
									</span>{' '}
									{/* Placeholder Rating */}
								</div>
							</div>
						</div>
					</div>

					<div className="rounded-xl border bg-card p-6 shadow-sm">
						{/* Price & Timer */}
						<div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
							<div>
								<p className="text-sm text-muted-foreground">
									Giá hiện tại
								</p>
								<p className="text-4xl font-bold text-primary">
									{product.currentPrice.toLocaleString(
										'vi-VN'
									)}{' '}
									₫
								</p>
							</div>
							<div className="w-full sm:w-auto">
								<CountdownTimer endTime={product.endTime} />
							</div>
						</div>

						{/* Buy Now Section */}
						{product.buyNowPrice && (
							<div className="mb-6 p-4 bg-muted/30 rounded-lg border border-dashed flex items-center justify-between">
								<div>
									<p className="text-sm text-muted-foreground">
										Mua ngay với giá
									</p>
									<p className="text-xl font-bold text-green-600">
										{product.buyNowPrice.toLocaleString(
											'vi-VN'
										)}{' '}
										₫
									</p>
								</div>
								<Button
									className="bg-green-600 hover:bg-green-700 text-white"
									onClick={() =>
										navigate(`/checkout/${product.slug}`)
									}
								>
									<ShoppingBag className="mr-2 h-4 w-4" />
									Mua ngay
								</Button>
							</div>
						)}

						{/* Bidding Control */}
						<div className="space-y-4">
							<div className="rounded-lg border bg-primary/5 p-4 space-y-4">
								<div className="flex items-center gap-2 text-primary font-medium">
									<Zap className="h-4 w-4" />
									<span>Đấu giá tự động (Auto-Bid)</span>
								</div>
								<p className="text-sm text-muted-foreground">
									Nhập giá khởi điểm và giá trần. Hệ thống sẽ
									tự động đấu giá giúp bạn.
								</p>

								{/* Inputs */}
								<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
									<div className="space-y-2">
										<Label htmlFor="initial-price">
											Giá khởi điểm
										</Label>
										<div className="relative">
											<span className="absolute left-3 top-2.5 text-muted-foreground">
												₫
											</span>
											<Input
												id="initial-price"
												type="number"
												className="pl-7"
												placeholder={`${(product.currentPrice + product.priceStep).toLocaleString()}₫`}
												value={initialBiddingPrice}
												onChange={(e) =>
													setInitialBiddingPrice(
														e.target.value
													)
												}
												disabled={bidRegistered}
											/>
										</div>
										{errors.initialBiddingPrice && (
											<p className="text-xs font-medium text-destructive">
												{errors.initialBiddingPrice}
											</p>
										)}
									</div>

									{/* Max Bidding Price */}
									<div className="space-y-2">
										<Label htmlFor="max-price">
											Giá tối đa (Max)
										</Label>
										<div className="relative">
											<span className="absolute left-3 top-2.5 text-muted-foreground">
												₫
											</span>
											<Input
												id="max-price"
												type="number"
												className="pl-7"
												placeholder={
													product.buyNowPrice
														? `${product.buyNowPrice.toLocaleString()}₫`
														: 'Giá tối đa...'
												}
												value={maxBiddingPrice}
												onChange={(e) =>
													setMaxBiddingPrice(
														e.target.value
													)
												}
												disabled={bidRegistered}
											/>
										</div>
										{errors.maxBiddingPrice && (
											<p className="text-xs font-medium text-destructive">
												{errors.maxBiddingPrice}
											</p>
										)}
									</div>
								</div>

								{/* Register / Unregister Buttons */}
								<div className="pt-2">
									{!bidRegistered ? (
										<Button
											size="lg"
											className="w-full"
											onClick={handleBidRegistering}
										>
											<Gavel className="mr-2 h-4 w-4" />
											Đặt giá (Đăng ký)
										</Button>
									) : (
										<Button
											size="lg"
											variant="destructive"
											className="w-full"
											onClick={handleBidUnregistering}
										>
											<XCircle className="mr-2 h-4 w-4" />
											Hủy đăng ký (Unregister)
										</Button>
									)}
								</div>
							</div>

							<div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
								<AlertCircle className="h-3 w-3" />
								Bước giá tối thiểu:{' '}
								{product.priceStep.toLocaleString()} ₫
							</div>
						</div>
					</div>

					{/* Description Section */}
					<div className="prose max-w-none">
						<h3 className="text-lg font-semibold border-b pb-2 mb-4">
							Mô tả sản phẩm
						</h3>
						<p className="whitespace-pre-line text-muted-foreground">
							{product.description}
						</p>
					</div>

					{/* Bid History Section */}
					<div>
						<h3 className="text-lg font-semibold border-b pb-2 mb-4">
							Lịch sử đấu giá
						</h3>
						<BidHistoryList bids={bids} />
					</div>
				</div>
			</div>

			{/* Related Products Section */}
			{relatedProducts.length > 0 && (
				<div className="mt-16 border-t pt-8">
					<div className="flex items-center justify-between mb-6">
						<h2 className="text-2xl font-bold">
							Sản phẩm tương tự
						</h2>
						<Link
							to={`/products?category=${product.category.name}`}
						>
							<Button variant="ghost">
								Xem tất cả{' '}
								<ArrowRight className="ml-2 h-4 w-4" />
							</Button>
						</Link>
					</div>
					<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
						{relatedProducts.map((p) => (
							<ProductCard key={p.slug} product={p} />
						))}
					</div>
				</div>
			)}
		</div>
	)
}

export default ProductDetailContainer
