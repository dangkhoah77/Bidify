import { useQuery, UseQueryResult } from '@tanstack/react-query'
import {
	fetchHomeProducts,
	fetchProductsByCategoryName,
	fetchEndingSoonProducts,
	fetchMostBidsProducts,
	fetchHighestPriceProducts,
} from '../api/products.api'
import type {
	HomeProductsResponse,
	ProductsByCategoryNameResponse,
	ProductsListResponse,
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

export function useEndingSoonProducts(
	page: number = 1,
	limit: number = 20
): UseQueryResult<ProductsListResponse> {
	return useQuery({
		queryKey: ['ending-soon-products', page, limit],
		queryFn: () => fetchEndingSoonProducts(page, limit),
	})
}

export function useMostBidsProducts(
	page: number = 1,
	limit: number = 20
): UseQueryResult<ProductsListResponse> {
	return useQuery({
		queryKey: ['most-bids-products', page, limit],
		queryFn: () => fetchMostBidsProducts(page, limit),
	})
}

export function useHighestPriceProducts(
	page: number = 1,
	limit: number = 20
): UseQueryResult<ProductsListResponse> {
	return useQuery({
		queryKey: ['highest-price-products', page, limit],
		queryFn: () => fetchHighestPriceProducts(page, limit),
	})
}
