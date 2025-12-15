import { GetProductsRequestData } from 'Shared/Data/Types/index.js'
import {
	CreateProductRequestData,
	AppendDescriptionRequestData,
	ApiResponseData,
	ProductListResponseData,
	ProductDetailResponseData,
	CategoryListResponseData,
} from 'Shared/Data/Types/index.js'
import Api from 'Client/Config/Api.js'

/**
 * Controller for Product related API calls.
 * Handles fetching, creating, and filtering products.
 *
 * @class ProductController
 */
const ProductController = {
	/**
	 * Fetches a list of products with optional filtering.
	 *
	 * @param data - Query parameters for filtering products.
	 * @return The API response containing a list of products.
	 */
	getAll: (data: GetProductsRequestData) =>
		Api.get<ProductListResponseData>('/products/get', data),

	/**
	 * Fetches a single product by ID.
	 *
	 * @param slug - The unique identifier of the product.
	 * @return The API response containing the product details.
	 */
	getOne: (slug: string) =>
		Api.get<ProductDetailResponseData>(`/products/get/${slug}`),

	/**
	 * Creates a new product.
	 * Note: Uses FormData for image uploads.
	 *
	 * @param data - The product data including files.
	 * @return The API response containing the created product details.
	 */
	create: (data: CreateProductRequestData) =>
		Api.post<ProductDetailResponseData>('/products/add', data),

	/**
	 * Fetches all available categories.
	 *
	 * @return The API response containing a list of categories.
	 */
	getCategories: () => Api.get<CategoryListResponseData>('/categories'),

	/**
	 * Adds a product to the user's watchlist.
	 *
	 * @param slug - The slug of the product to add to the watchlist.
	 * @return The API response indicating success or failure.
	 */
	addToWatchlist: (slug: string) =>
		Api.post<ApiResponseData>(`/products/watchlist/add/${slug}`),

	/**
	 * Removes a product from the user's watchlist.
	 *
	 * @param slug - The slug of the product to remove from the watchlist.
	 * @return The API response indicating success or failure.
	 */
	removeFromWatchlist: (slug: string) =>
		Api.post<ApiResponseData>(`/products/watchlist/remove/${slug}`),

	/**
	 * Fetches products created by the current seller.
	 */
	getSellerProducts: (data: GetProductsRequestData) =>
		Api.get<ProductListResponseData>('/products/selling', data),

	/**
	 * Appends a new section to the product description.
	 *
	 * @param slug - The slug of the product to update
	 * @param data - The description data to append
	 */
	appendDescription: (slug: string, data: AppendDescriptionRequestData) =>
		Api.patch<ApiResponseData>(`/products/${slug}/description`, data),
}

export default ProductController
