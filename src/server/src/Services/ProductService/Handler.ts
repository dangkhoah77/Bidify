import { FilterQuery } from 'mongoose'

import {
	Image,
	ApiResponseData,
	ProductDetailResponseData,
	ProductListingResponseData,
} from 'Shared/Data/Types/index.js'

import Product, { ProductDocument } from 'Server/Models/Product/index.js'
import { UserDocument } from 'Server/Models/User/index.js'

import {
	CreateProduct,
	DeleteProduct,
	FindProductById,
	FindRelatedProducts,
} from './Query.js'
import {
	DeleteBidsByProduct,
	FindValidBidsByProduct,
} from 'Server/Services/BidService/Query.js'

/**
 * Create a new product.
 *
 * @param user - The user creating the product
 * @param productName - Name of the product
 * @param productDescription - Description of the product
 * @param categoryId - ID of the product category
 * @param startPrice - Starting price of the product
 * @param priceStep - Minimum bid increment
 * @param buyNowPrice - Buy Now price of the product
 * @param endTime - Auction end time (ISO string)
 * @param images - Array of product images
 * @param autoExtend - Whether to auto-extend auction end time on last-minute bids
 * @param allowUnreviewedBidders - Whether to allow unreviewed bidders
 * @return Status and result data of the creation operation
 */
export const CreateNewProduct = async (
	user: UserDocument,
	productName: string,
	productDescription: string,
	categoryId: string,
	startPrice: number,
	priceStep: number,
	buyNowPrice: number,
	endTime: string,
	images: Image[],
	autoExtend?: boolean,
	allowUnreviewedBidders?: boolean
): Promise<{ status: number; data: ProductDetailResponseData }> => {
	// Create a new product
	const newProduct = await CreateProduct({
		name: productName,
		description: productDescription,
		category: categoryId,
		seller: user.id,
		startPrice,
		priceStep,
		currentPrice: startPrice,
		buyNowPrice,
		endTime: new Date(endTime),
		images,
		autoExtend: autoExtend ?? false,
		allowUnreviewedBidders: allowUnreviewedBidders ?? false,
		active: true,
	})

	return {
		status: 201,
		data: {
			success: true,
			message: 'Đăng sản phẩm thành công.',
			data: { product: await Product.toDto(newProduct) },
		},
	}
}

/**
 * Append description to a product.
 * Format: <Old Desc> \n\n Updated on <dd/mm/yyyy> \n <New Desc>
 *
 * @param user - The user appending the description
 * @param productId - ID of the product to append description to
 * @param additionalDesc - The additional description text to append
 * @return Status and result data of the append operation
 */
export const AppendDescription = async (
	user: UserDocument,
	productId: string,
	additionalDesc: string
): Promise<{ status: number; data: ApiResponseData }> => {
	// Find product for appending description
	const product = await FindProductById(productId)
	if (!product) {
		return {
			status: 404,
			data: { success: false, message: 'Sản phẩm không tồn tại.' },
		}
	}

	// Check ownership
	if (product.seller?.toString() != user.id) {
		return {
			status: 403,
			data: {
				success: false,
				message: 'Bạn không có quyền chỉnh sửa sản phẩm này.',
			},
		}
	}

	// Create timestamp dd/mm/yyyy
	const now = new Date()
	const dateString = `${now.getDate()}/${
		now.getMonth() + 1
	}/${now.getFullYear()}`

	// Append new description
	const appendText = `\n\nUpdated on ${dateString}\n${additionalDesc}`
	product.description = (product.description || '') + appendText
	await product.save()

	return {
		status: 200,
		data: {
			success: true,
			message: 'Bổ sung mô tả thành công.',
			data: { product: await Product.toDto(product) },
		},
	}
}

/**
 * Delete an existing product.
 *
 * @param productId - ID of the product to delete
 * @return Status and result data of the deletion operation
 */
export const DeleteExistingProduct = async (
	productId: string
): Promise<{ status: number; data: ApiResponseData }> => {
	// Find product to delete
	const product = await FindProductById(productId)
	if (!product) {
		return {
			status: 404,
			data: { success: false, message: 'Sản phẩm không tồn tại.' },
		}
	}

	// Delete associated bids and the product
	await DeleteBidsByProduct(productId)
	await DeleteProduct(productId)

	return {
		status: 200,
		data: {
			success: true,
			message: 'Xóa sản phẩm thành công.',
		},
	}
}

/**
 * List products with Pagination, Search, Filter, Sort.
 *
 * @param page - Page number (1-based)
 * @param limit - Number of products per page
 * @param keyword - Search keyword for product name/description
 * @param categoryId - Filter by category ID
 * @param sortBy - Sort option: 'time_desc', 'price_asc', 'price_desc', 'bids_desc'
 * @return Status and paginated list of products
 */
export const ListProducts = async (
	page: number,
	limit: number,
	keyword?: string,
	categoryId?: string,
	sortBy?: 'time_desc' | 'time_acs' | 'price_asc' | 'price_desc' | 'bids_desc'
): Promise<{ status: number; data: ProductListingResponseData }> => {
	const safePage = Math.max(1, page)
	const safeLimit = Math.max(1, limit)
	const skip = (safePage - 1) * safeLimit

	// Build query with chaining
	let base = Product.where('active', true).gt('endTime', new Date())
	if (categoryId) {
		base = base.where('category', categoryId)
	}
	if (keyword && keyword.trim() !== '') {
		const rx = new RegExp(keyword.trim(), 'i')
		base = base.or([{ name: rx }, { description: rx }])
	}

	let products: ProductDocument[]
	let total: number

	if (!sortBy || sortBy != 'bids_desc') {
		// Sort options
		let sortOption: any = {}
		switch (sortBy) {
			case 'price_asc':
				sortOption.currentPrice = 1 // Price increasing
				break
			case 'price_desc':
				sortOption.currentPrice = -1 // Price decreasing
				break
			case 'time_desc':
				sortOption.endTime = -1 // End time decreasing
				break
			case 'time_acs':
				sortOption.endTime = 1 // End time increasing
				break
		}

		// Execute query and count in parallel
		;[products, total] = await Promise.all([
			base.sort(sortOption).skip(skip).limit(limit),
			base.clone().countDocuments(),
		])
	} else {
		// Execute pure query
		;[products, total] = await Promise.all([
			base.exec(),
			base.clone().countDocuments(),
		])

		// Fetch bid counts for all products first
		const bidCounts = await Promise.all(
			products.map((p) => FindValidBidsByProduct(p.id).countDocuments())
		)

		// Attach bid counts to products
		const productsWithBids = products.map((product, idx) => ({
			product,
			bidCount: bidCounts[idx],
		}))
		// Sort synchronously by bid count descending
		productsWithBids.sort((a, b) => b.bidCount - a.bidCount)

		// Restore sorted products array
		products.length = 0

		// Add enough products for the current page
		const startIdx = skip
		const endIdx = Math.min(skip + safeLimit, productsWithBids.length)
		products =
			startIdx < productsWithBids.length
				? productsWithBids.slice(startIdx, endIdx).map((x) => x.product)
				: []
	}

	// Convert to DTO
	const productDtos = await Promise.all(products.map((p) => Product.toDto(p)))

	return {
		status: 200,
		data: {
			success: true,
			message: 'Lấy danh sách sản phẩm thành công.',
			data: {
				products: productDtos,
				pagination: {
					page: safePage,
					limit: safeLimit,
					total,
					totalPages: Math.ceil(total / safeLimit),
				},
			},
		},
	}
}

/**
 * Get product details and 5 related products.
 *
 * @param productId - ID of the product to retrieve
 * @return Status and product detail data
 */
export const GetProductDetails = async (
	productId: string
): Promise<{ status: number; data: ProductDetailResponseData }> => {
	// Find the product by ID
	const product = await FindProductById(productId)
	if (!product) {
		return {
			status: 404,
			data: { success: false, message: 'Sản phẩm không tồn tại.' },
		}
	}

	// Find related products
	const relatedProducts = await FindRelatedProducts(
		product.category as string,
		product.id,
		5
	)

	return {
		status: 200,
		data: {
			success: true,
			message: 'Lấy chi tiết sản phẩm thành công.',
			data: {
				product: await Product.toDto(product),
				relatedProducts: await Promise.all(
					relatedProducts.map((p) => Product.toDto(p))
				),
			},
		},
	}
}
