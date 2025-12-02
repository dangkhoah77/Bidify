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

// export async function fetchProductsByCategory(
// 	categoryId: string
// ): Promise<ProductsByCategoryResponse> {
// 	const res = await api.get<ProductsByCategoryResponse>(
// 		`/products/by-category/${categoryId}`
// 	)
// 	return res.data
// }
export type ProductsByCategoryResponse = {
	products: ProductDTO[]
}
export type ProductsByCategoryNameResponse = {
	products: ProductDTO[]
	categoryName: string
}

export async function fetchProductsByCategoryName(
	categoryName: string
): Promise<ProductsByCategoryNameResponse> {
	const res = await api.get<ProductsByCategoryNameResponse>(
		`/products/by-category/${encodeURIComponent(categoryName)}`
	)
	return res.data
}
