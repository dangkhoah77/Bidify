import { AxiosInstance, AxiosError } from 'axios'
import { toast } from 'sonner' // hoặc react-toastify

interface ApiErrorResponse {
	message: string
	statusCode: number
	error?: string
}

export const errorInterceptor = (axiosInstance: AxiosInstance) => {
	axiosInstance.interceptors.response.use(
		(response) => response,
		(error: AxiosError<ApiErrorResponse>) => {
			if (error.response) {
				const { status, data } = error.response

				switch (status) {
					case 401:
						// Unauthorized - redirect to login
						localStorage.removeItem('accessToken')
						window.location.href = '/auth'
						toast.error('Phiên đăng nhập đã hết hạn')
						break

					case 403:
						toast.error('Bạn không có quyền truy cập')
						break

					case 404:
						toast.error(data.message || 'Không tìm thấy dữ liệu')
						break

					case 422:
						toast.error(data.message || 'Dữ liệu không hợp lệ')
						break

					case 500:
						toast.error('Lỗi hệ thống. Vui lòng thử lại sau')
						break

					default:
						toast.error(data.message || 'Đã có lỗi xảy ra')
				}
			} else if (error.request) {
				toast.error('Không thể kết nối đến server')
			}

			return Promise.reject(error)
		}
	)
}
