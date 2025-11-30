import { apiClient, apiClientMultipart } from '../config/axios.config'
import { API_ENDPOINTS } from '../config/endpoints'
import { ApiResponse, PaginatedResponse, QueryParams } from '../types/api.types'
import { Product, CreateProductDto } from '../types/product.types'

export const productsApi = {
	// Get products with filters
	getProducts: async (
		params?: QueryParams
	): Promise<ApiResponse<PaginatedResponse<Product>>> => {
		const response = await apiClient.get(API_ENDPOINTS.PRODUCTS.BASE, {
			params,
		})
		return response.data
	},

	// Get product detail
	getProductById: async (id: string): Promise<ApiResponse<Product>> => {
		const response = await apiClient.get(API_ENDPOINTS.PRODUCTS.DETAIL(id))
		return response.data
	},

	// Search products
	searchProducts: async (
		params: QueryParams
	): Promise<ApiResponse<PaginatedResponse<Product>>> => {
		const response = await apiClient.get(API_ENDPOINTS.PRODUCTS.SEARCH, {
			params,
		})
		return response.data
	},

	// Get ending soon products
	getEndingSoon: async (limit = 5): Promise<ApiResponse<Product[]>> => {
		const response = await apiClient.get(
			API_ENDPOINTS.PRODUCTS.ENDING_SOON,
			{
				params: { limit },
			}
		)
		return response.data
	},

	// Get most bids products
	getMostBids: async (limit = 5): Promise<ApiResponse<Product[]>> => {
		const response = await apiClient.get(API_ENDPOINTS.PRODUCTS.MOST_BIDS, {
			params: { limit },
		})
		return response.data
	},

	// Get highest price products
	getHighestPrice: async (limit = 5): Promise<ApiResponse<Product[]>> => {
		const response = await apiClient.get(
			API_ENDPOINTS.PRODUCTS.HIGHEST_PRICE,
			{
				params: { limit },
			}
		)
		return response.data
	},

	// Get related products
	getRelatedProducts: async (
		id: string,
		limit = 5
	): Promise<ApiResponse<Product[]>> => {
		const response = await apiClient.get(
			API_ENDPOINTS.PRODUCTS.RELATED(id),
			{
				params: { limit },
			}
		)
		return response.data
	},

	// Create product (for seller)
	createProduct: async (
		data: CreateProductDto
	): Promise<ApiResponse<Product>> => {
		const formData = new FormData()
		formData.append('title', data.title)
		formData.append('description', data.description)
		formData.append('startPrice', data.startPrice.toString())
		formData.append('stepPrice', data.stepPrice.toString())
		formData.append('categoryId', data.categoryId)
		formData.append('autoExtend', data.autoExtend.toString())
		formData.append('endTime', data.endTime.toISOString())

		if (data.buyNowPrice) {
			formData.append('buyNowPrice', data.buyNowPrice.toString())
		}

		data.images.forEach((image) => {
			formData.append('images', image)
		})

		const response = await apiClientMultipart.post(
			API_ENDPOINTS.PRODUCTS.BASE,
			formData
		)
		return response.data
	},

	// Append description
	appendDescription: async (
		id: string,
		description: string
	): Promise<ApiResponse<Product>> => {
		const response = await apiClient.post(
			API_ENDPOINTS.PRODUCTS.APPEND_DESCRIPTION(id),
			{
				additionalDescription: description,
			}
		)
		return response.data
	},

	// Get bid history
	getBidHistory: async (id: string): Promise<ApiResponse<any[]>> => {
		const response = await apiClient.get(
			API_ENDPOINTS.PRODUCTS.BID_HISTORY(id)
		)
		return response.data
	},

	// Get questions
	getQuestions: async (id: string): Promise<ApiResponse<any[]>> => {
		const response = await apiClient.get(
			API_ENDPOINTS.PRODUCTS.QUESTIONS(id)
		)
		return response.data
	},

	// Ask question
	askQuestion: async (
		id: string,
		question: string
	): Promise<ApiResponse<any>> => {
		const response = await apiClient.post(
			API_ENDPOINTS.PRODUCTS.QUESTIONS(id),
			{ question }
		)
		return response.data
	},
}
