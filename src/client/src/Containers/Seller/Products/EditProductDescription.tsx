import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Save, ArrowLeft } from 'lucide-react'

import ProductController from 'Client/Controllers/ProductController.js'
import { usePage } from 'Client/Contexts/Page/index.js'
import { Button } from 'Client/Components/UI/input/button.js'
import { Textarea } from 'Client/Components/UI/input/textarea.js'
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
} from 'Client/Components/UI/display/card.js'

/**
 * Container for editing and appending product description.
 */
const EditProductDescriptionContainer: React.FC = () => {
	const navigate = useNavigate()
	const { slug } = useParams<{ slug: string }>()

	const { pageState, setPageLoading, addNotification } = usePage()

	const [newDescription, setNewDescription] = useState('')

	/**
	 * Handles the form submission to append product description.
	 *
	 * @param e - Form event
	 */
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()

		if (!slug) return
		if (!newDescription.trim()) {
			addNotification('Mô tả mới không được để trống.', 'error')
			return
		}

		setPageLoading(true)

		try {
			const res = await ProductController.appendDescription(slug, {
				description: newDescription,
			})
			const resData = res.data

			if (resData.success) {
				addNotification('Đã bổ sung mô tả thành công', 'success')
				navigate('/seller/products')
			} else {
				throw new Error(resData.error)
			}
		} catch (error: any) {
			addNotification(
				error.message || 'Không thể bổ sung mô tả sản phẩm.',
				'error'
			)
		} finally {
			setPageLoading(false)
		}
	}

	return (
		<div className="container py-8 max-w-2xl">
			<Button
				variant="ghost"
				className="mb-4 pl-0"
				onClick={() => navigate(-1)}
			>
				<ArrowLeft className="mr-2 h-4 w-4" /> Quay lại
			</Button>

			<Card>
				<CardHeader>
					<CardTitle>Bổ sung mô tả sản phẩm</CardTitle>
					<CardDescription>
						Bạn không thể thay đổi mô tả cũ, nhưng có thể viết thêm
						thông tin mới (kèm thời gian cập nhật).
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit} className="space-y-4">
						<Textarea
							placeholder="Nhập thông tin bổ sung (ví dụ: cập nhật tình trạng, trả lời thắc mắc chung)..."
							rows={8}
							value={newDescription}
							onChange={(e) => setNewDescription(e.target.value)}
							required
						/>
						<div className="flex justify-end">
							<Button
								type="submit"
								disabled={
									pageState.loading || !newDescription.trim()
								}
							>
								{pageState.loading ? (
									'Đang lưu...'
								) : (
									<>
										<Save className="mr-2 h-4 w-4" /> Lưu
										thông tin bổ sung
									</>
								)}
							</Button>
						</div>
					</form>
				</CardContent>
			</Card>
		</div>
	)
}

export default EditProductDescriptionContainer
