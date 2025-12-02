import { useQuery } from '@tanstack/react-query'
import { fetchProductsByCategoryName } from './api'

export function useProductsByCategoryName(categoryName: string) {
	return useQuery({
		queryKey: ['products-by-category-name', categoryName],
		queryFn: () => fetchProductsByCategoryName(categoryName),
		enabled: !!categoryName, // chỉ chạy khi có categoryName
	})
}
