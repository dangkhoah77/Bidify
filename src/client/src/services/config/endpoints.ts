export const API_ENDPOINTS = {
	// Auth
	AUTH: {
		LOGIN: '/auth/login',
		REGISTER: '/auth/register',
		LOGOUT: '/auth/logout',
		VERIFY_OTP: '/auth/verify-otp',
		RESEND_OTP: '/auth/resend-otp',
		FORGOT_PASSWORD: '/auth/forgot-password',
		VERIFY_RESET_OTP: '/auth/verify-reset-otp',
		RESET_PASSWORD: '/auth/reset-password',
		GET_CURRENT_USER: '/auth/me',
		GOOGLE: '/auth/google',
	},

	// Products
	PRODUCTS: {
		BASE: '/products',
		DETAIL: (id: string) => `/products/${id}`,
		HOME: '/products/home', // ✅ THÊM
		BY_CATEGORY_NAME: (categoryName: string) =>
			`/products/by-category/${encodeURIComponent(categoryName)}`, // ✅ THÊM
		SEARCH: '/products/search',
		ENDING_SOON: '/products/ending-soon',
		MOST_BIDS: '/products/most-bids',
		HIGHEST_PRICE: '/products/highest-price',
		RELATED: (id: string) => `/products/${id}/related`,
		BID_HISTORY: (id: string) => `/products/${id}/bid-history`,
		QUESTIONS: (id: string) => `/products/${id}/questions`,
		APPEND_DESCRIPTION: (id: string) =>
			`/products/${id}/append-description`,
		REJECT_BID: (id: string) => `/products/${id}/reject-bid`,
	},
	// Categories
	CATEGORIES: {
		BASE: '/categories',
		DETAIL: (id: string) => `/categories/${id}`,
	},

	// Bids
	BIDS: {
		BASE: '/bids',
		VALIDATE: '/bids/validate',
	},

	// Users
	USERS: {
		PROFILE: '/users/profile',
		RATINGS: '/users/ratings',
		WATCHLIST: '/users/watchlist',
		BIDDING: '/users/bidding',
		WON: '/users/won',
		CHANGE_PASSWORD: '/users/change-password',
		UPGRADE_REQUEST: '/users/upgrade-request',
	},

	// Watchlist
	WATCHLIST: {
		BASE: '/watchlist',
		ITEM: (productId: string) => `/watchlist/${productId}`,
	},

	// Ratings
	RATINGS: {
		BASE: '/ratings',
		UPDATE: (id: string) => `/ratings/${id}`,
	},

	// Transactions
	TRANSACTIONS: {
		BASE: '/transactions',
		DETAIL: (id: string) => `/transactions/${id}`,
		PAYMENT_PROOF: (id: string) => `/transactions/${id}/payment-proof`,
		CONFIRM_PAYMENT: (id: string) => `/transactions/${id}/confirm-payment`,
		CONFIRM_DELIVERY: (id: string) =>
			`/transactions/${id}/confirm-delivery`,
		CANCEL: (id: string) => `/transactions/${id}/cancel`,
		MESSAGES: (id: string) => `/transactions/${id}/messages`,
	},

	// Admin
	ADMIN: {
		CATEGORIES: '/admin/categories',
		CATEGORY_DETAIL: (id: string) => `/admin/categories/${id}`,
		PRODUCTS: '/admin/products',
		PRODUCT_DETAIL: (id: string) => `/admin/products/${id}`,
		USERS: '/admin/users',
		USER_DETAIL: (id: string) => `/admin/users/${id}`,
		UPGRADE_REQUESTS: '/admin/upgrade-requests',
		APPROVE_UPGRADE: (id: string) =>
			`/admin/upgrade-requests/${id}/approve`,
		REJECT_UPGRADE: (id: string) => `/admin/upgrade-requests/${id}/reject`,
		SETTINGS: '/admin/settings',
	},
} as const
