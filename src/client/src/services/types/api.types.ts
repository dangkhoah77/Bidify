export interface ApiResponse<T> {
	success: boolean
	data: T
	message?: string
}

export interface PaginatedResponse<T> {
	items: T[]
	total: number
	page: number
	limit: number
	totalPages: number
}

export interface ApiError {
	message: string
	statusCode: number
	error?: string
}

export interface QueryParams {
	page?: number
	limit?: number
	sortBy?: string
	order?: 'asc' | 'desc'
	[key: string]: any
}
