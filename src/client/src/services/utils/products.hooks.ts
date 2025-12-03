import { useQuery, UseQueryResult } from '@tanstack/react-query'
import {
	fetchHomeProducts,
	fetchProductsByCategoryName,
} from '../api/products.api'
import type {
	HomeProductsResponse,
	ProductsByCategoryNameResponse,
} from '../types/product.types'

/**
 * Hook to fetch home products
 */
export function useHomeProducts(): UseQueryResult<HomeProductsResponse> {
	return useQuery({
		queryKey: ['home-products'],
		queryFn: fetchHomeProducts,
	})
}

/**
 * Hook to fetch products by category name
 */
export function useProductsByCategoryName(
	categoryName: string
): UseQueryResult<ProductsByCategoryNameResponse> {
	return useQuery({
		queryKey: ['products-by-category-name', categoryName],
		queryFn: () => fetchProductsByCategoryName(categoryName),
		enabled: !!categoryName, // Chỉ chạy khi có categoryName
	})
}
