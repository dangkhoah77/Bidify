import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

import {
	CategoryType,
	CreateProductRequestData,
} from 'Shared/Data/Types/index.js'
import { PageAction } from 'Client/Data/Constants/index.js'

import { usePage } from 'Client/Contexts/Page/index.js'
import ProductController from 'Client/Controllers/ProductController.js'
import CreateProductForm from 'Client/Components/Seller/CreateProductForm.js'

/**
 * Container for the Create Product Feature.
 * Manages category fetching and product submission logic.
 */
const CreateProductContainer: React.FC = () => {
	const navigate = useNavigate()

	const { pageState, setPageLoading, addNotification } = usePage()

	const [categories, setCategories] = useState<CategoryType[]>([])

	/**
	 * Fetches the list of product categories from the server.
	 */
	const fetchCategories = useCallback(async () => {
		try {
			const res = await ProductController.getCategories()
			const redData = res.data

			if (redData.success && redData.data) {
				setCategories(redData.data.categories)
			} else {
				throw new Error(redData.error)
			}
		} catch (error: any) {
			addNotification(
				error.message || 'Không thể tải danh sách danh mục',
				'error'
			)
		}
	}, [])

	// Fetch Categories on mount
	useEffect(() => {
		fetchCategories()
	}, [])

	/**
	 * Handles the form submission.
	 * Converts the structured data into FormData for file upload.
	 *
	 * @param data - The product data from the form
	 */
	const handleCreateProduct = async (data: CreateProductRequestData) => {
		setPageLoading(true)

		try {
			const res = await ProductController.create(data)
			const resData = res.data

			if (resData.success && resData.data) {
				addNotification('Đăng sản phẩm thành công!', 'success')
				navigate(`/products/${resData.data.product.slug}/edit`)
			} else {
				throw new Error(resData.error)
			}
		} catch (error: any) {
			addNotification(error.message || 'Đăng sản phẩm thất bại', 'error')
		} finally {
			setPageLoading(false)
		}
	}

	return (
		<div className="container min-h-screen bg-slate-50/50">
			<CreateProductForm
				categories={categories}
				onSubmit={handleCreateProduct}
				isLoading={pageState.loading}
			/>
		</div>
	)
}

export default CreateProductContainer
