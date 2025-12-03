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

export type ProductsByCategoryNameResponse = {
	products: ProductDTO[]
	categoryName: string
}

export type ProductsListResponse = {
	products: ProductDTO[]
	total: number
	page: number
	totalPages: number
}
