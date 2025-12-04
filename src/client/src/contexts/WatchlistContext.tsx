import {
	createContext,
	useContext,
	useState,
	useEffect,
	ReactNode,
} from 'react'
import { toast } from 'sonner'
import { useAuth } from './AuthContext'
import * as watchlistApi from '@/services/api/watchlist.api'

interface WatchlistContextType {
	watchlistIds: string[]
	isInWatchlist: (productId: string) => boolean
	addToWatchlist: (productId: string) => Promise<void>
	removeFromWatchlist: (productId: string) => Promise<void>
	toggleWatchlist: (productId: string) => Promise<void>
	isLoading: boolean
	refetch: () => Promise<void>
}

const WatchlistContext = createContext<WatchlistContextType | undefined>(
	undefined
)

interface WatchlistProviderProps {
	children: ReactNode
}

export const WatchlistProvider = ({ children }: WatchlistProviderProps) => {
	const { user } = useAuth()
	const [watchlistIds, setWatchlistIds] = useState<string[]>([])
	const [isLoading, setIsLoading] = useState(false)

	// ✅ Load watchlist from backend when user logs in
	useEffect(() => {
		if (user) {
			fetchWatchlist()
		} else {
			setWatchlistIds([]) // Clear when logged out
		}
	}, [user])

	const fetchWatchlist = async () => {
		try {
			setIsLoading(true)
			const response = await watchlistApi.fetchWatchlist()
			const ids = response.watchlist.map((p) => p._id)
			setWatchlistIds(ids)
		} catch (error) {
			console.error('Failed to fetch watchlist:', error)
			setWatchlistIds([])
		} finally {
			setIsLoading(false)
		}
	}

	const isInWatchlist = (productId: string): boolean => {
		return watchlistIds.includes(productId)
	}

	const addToWatchlist = async (productId: string) => {
		if (!user) {
			toast.error('Vui lòng đăng nhập để thêm vào danh sách yêu thích')
			return
		}

		try {
			await watchlistApi.addToWatchlist(productId)
			setWatchlistIds((prev) => [...prev, productId])
			toast.success('Đã thêm vào danh sách yêu thích')
		} catch (error: any) {
			console.error('Add to watchlist error:', error)
			toast.error(
				error.response?.data?.error ||
					'Không thể thêm vào danh sách yêu thích'
			)
		}
	}

	const removeFromWatchlist = async (productId: string) => {
		if (!user) {
			return
		}

		try {
			await watchlistApi.removeFromWatchlist(productId)
			setWatchlistIds((prev) => prev.filter((id) => id !== productId))
			toast.success('Đã xóa khỏi danh sách yêu thích')
		} catch (error: any) {
			console.error('Remove from watchlist error:', error)
			toast.error(
				error.response?.data?.error ||
					'Không thể xóa khỏi danh sách yêu thích'
			)
		}
	}

	const toggleWatchlist = async (productId: string) => {
		if (!user) {
			toast.error('Vui lòng đăng nhập để sử dụng tính năng này')
			return
		}

		if (isInWatchlist(productId)) {
			await removeFromWatchlist(productId)
		} else {
			await addToWatchlist(productId)
		}
	}

	return (
		<WatchlistContext.Provider
			value={{
				watchlistIds,
				isInWatchlist,
				addToWatchlist,
				removeFromWatchlist,
				toggleWatchlist,
				isLoading,
				refetch: fetchWatchlist,
			}}
		>
			{children}
		</WatchlistContext.Provider>
	)
}

export const useWatchlist = () => {
	const context = useContext(WatchlistContext)
	if (!context) {
		throw new Error('useWatchlist must be used within WatchlistProvider')
	}
	return context
}
