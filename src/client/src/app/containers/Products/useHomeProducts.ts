import { useQuery } from '@tanstack/react-query'
import { fetchHomeProducts } from './api'

export function useHomeProducts() {
	return useQuery({
		queryKey: ['home-products'],
		queryFn: fetchHomeProducts,
	})
}
