import axios, {
	InternalAxiosRequestConfig,
	AxiosResponse,
	AxiosError,
} from 'axios'
import Keys from './Keys.js'

/**
 * Axios instance configured for API calls.
 * Base URL is loaded from the centralized Keys configuration.
 *
 * @prop Api
 */
const Api = axios.create({
	baseURL: Keys.API_URL,
	headers: { 'Content-Type': 'application/json' },
	withCredentials: true, // Important for cookies/session handling
})

/**
 * Request Interceptor.
 * Automatically attaches the JWT token from localStorage to every outgoing request.
 *
 * @param {InternalAxiosRequestConfig} config - The axios request configuration.
 * @returns {InternalAxiosRequestConfig} The modified configuration with Authorization header.
 */
Api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
	const token = localStorage.getItem('token')
	if (token && config.headers) {
		config.headers.Authorization = `Bearer ${token}`
	}
	return config
})

/**
 * Response Interceptor.
 * Handles global responses and errors.
 * Currently passes through successful responses and rejects errors.
 *
 * @param {AxiosResponse} response - The successful response.
 * @returns {AxiosResponse | Promise<never>} The response or a rejected promise.
 */
Api.interceptors.response.use(
	(response: AxiosResponse) => response,
	async (error: AxiosError) => {
		// Future implementation: Handle global 401 (Unauthorized) here if needed
		return Promise.reject(error)
	}
)

export default Api
