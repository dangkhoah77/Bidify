export interface Product {
	id: string
	title: string
	description: string
	image: string
	additionalImages: string[]
	currentPrice: number
	buyNowPrice?: number
	startPrice: number
	stepPrice: number
	categoryId: string
	category: string
	sellerId: string
	seller: {
		id: string
		name: string
		avatar?: string
		rating: number
		totalReviews: number
	}
	highestBidder?: string
	bidCount: number
	endTime: Date
	autoExtend: boolean
	isNew?: boolean
	createdAt: Date
	updatedAt: Date
}

export interface CreateProductDto {
	title: string
	description: string
	images: File[]
	startPrice: number
	stepPrice: number
	buyNowPrice?: number
	categoryId: string
	autoExtend: boolean
	endTime: Date
}
