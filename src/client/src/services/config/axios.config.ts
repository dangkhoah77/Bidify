import axios, { AxiosInstance } from 'axios'
// import { authInterceptor, errorInterceptor } from '../interceptors'

// ✅ SỬA: Dùng port 4000 thay vì 3000
const API_BASE_URL =
	process.env.REACT_APP_API_BASE_URL || 'http://localhost:4000/api'

console.log('API Base URL:', API_BASE_URL)

// Axios instance mặc định
export const apiClient: AxiosInstance = axios.create({
	baseURL: API_BASE_URL,
	timeout: 30000,
	headers: {
		'Content-Type': 'application/json',
	},
})

// Axios instance cho upload file
export const apiClientMultipart: AxiosInstance = axios.create({
	baseURL: API_BASE_URL,
	timeout: 60000,
	headers: {
		'Content-Type': 'multipart/form-data',
	},
})

// // Apply interceptors
// authInterceptor(apiClient)
// errorInterceptor(apiClient)
// authInterceptor(apiClientMultipart)
// errorInterceptor(apiClientMultipart)

export default apiClient
