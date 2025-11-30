import { AxiosInstance, InternalAxiosRequestConfig } from 'axios'

export const authInterceptor = (axiosInstance: AxiosInstance) => {
	axiosInstance.interceptors.request.use(
		(config: InternalAxiosRequestConfig) => {
			const token = localStorage.getItem('token')

			if (token && config.headers) {
				config.headers.Authorization = `Bearer ${token}`
			}

			return config
		},
		(error) => {
			return Promise.reject(error)
		}
	)
}
