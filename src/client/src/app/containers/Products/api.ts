import axios from 'axios'

export type ProductDTO = {
	_id: string
	name: string
	description: string
	images: string[]
	currentPrice: number
	buyNowPrice?: number
	endTime: string
	bidCount?: number
	categoryName?: string
	highestBidderName?: string
	isNew?: boolean
}

export type HomeProductsResponse = {
	endingSoon: ProductDTO[]
	mostBids: ProductDTO[]
	highestPrice: ProductDTO[]
}

const api = axios.create({
	baseURL: 'http://localhost:4000/api',
})

export async function fetchHomeProducts(): Promise<HomeProductsResponse> {
	const res = await api.get<HomeProductsResponse>('/products/home')
	return res.data
}
