import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Flame, Clock, Trophy } from 'lucide-react'

import { ProductType } from 'Shared/Data/Types/index.js'

import ProductController from 'Client/Controllers/ProductController.js'
import ProductSection from 'Client/Components/Product/ProductSection.js'
import { Button } from 'Client/Components/UI/input/button.js'

/**
 * Home Page Container.
 */
const HomeContainer: React.FC = () => {
	const [topEnding, setTopEnding] = useState<ProductType[]>([])
	const [topBids, setTopBids] = useState<ProductType[]>([])
	const [topPrice, setTopPrice] = useState<ProductType[]>([])
	const [loading, setLoading] = useState(true)

	// Fetch top products on mount
	useEffect(() => {
		const fetchData = async () => {
			setLoading(true)
			try {
				// Fetch 3 distinct lists in parallel
				const [endingRes, bidsRes, priceRes] = await Promise.all([
					ProductController.getAll({
						params: {
							limit: 5,
							sort: 'time_desc',
						},
					}),
					ProductController.getAll({
						params: {
							limit: 5,
							sort: 'bids_desc',
						},
					}),
					ProductController.getAll({
						params: {
							limit: 5,
							sort: 'price_desc',
						},
					}),
				])

				if (endingRes.data.success)
					setTopEnding(endingRes.data.data?.products || [])
				if (bidsRes.data.success)
					setTopBids(bidsRes.data.data?.products || [])
				if (priceRes.data.success)
					setTopPrice(priceRes.data.data?.products || [])
			} catch (error) {
				console.error('Failed to load home data', error)
			} finally {
				setLoading(false)
			}
		}

		fetchData()
	}, [])

	return (
		<div className="container min-h-screen py-8">
			{/* Hero Section */}
			<div className="mb-12 rounded-3xl bg-gradient-to-r from-primary to-primary/60 p-8 text-primary-foreground shadow-lg md:p-12">
				<div className="max-w-2xl space-y-4">
					<h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
						Sàn Đấu Giá Trực Tuyến Uy Tín #1 Việt Nam
					</h1>
					<p className="text-lg opacity-90">
						Săn ngay hàng hiệu, đồ sưu tầm và công nghệ với giá cực
						tốt. Đấu giá minh bạch, an toàn và nhanh chóng.
					</p>
					<div className="pt-4">
						<Link to="/products">
							<Button
								size="lg"
								variant="secondary"
								className="font-semibold"
							>
								Khám phá ngay
							</Button>
						</Link>
					</div>
				</div>
			</div>

			{/* Top 5 products ending soon */}
			<ProductSection
				title="Sắp kết thúc"
				icon={<Clock className="h-6 w-6" />}
				products={topEnding}
				loading={loading}
				viewMoreLink="/products?sort=time_desc"
			/>

			{/* Top 5 products with most bids */}
			<ProductSection
				title="Sôi động nhất"
				icon={<Flame className="h-6 w-6" />}
				products={topBids}
				loading={loading}
				viewMoreLink="/products?sort=bids_desc"
			/>

			{/* Top 5 products with highest price */}
			<ProductSection
				title="Giá cao nhất"
				icon={<Trophy className="h-6 w-6" />}
				products={topPrice}
				loading={loading}
				viewMoreLink="/products?sort=price_desc"
			/>
		</div>
	)
}

export default HomeContainer
