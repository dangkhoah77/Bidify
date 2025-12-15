import React, { useState, useRef } from 'react'
import { Upload, X, Loader2 } from 'lucide-react'

import {
	CategoryType,
	CreateProductRequestData,
} from 'Shared/Data/Types/index.js'

import { cn } from 'Client/Utility/index.js'
import { Button } from 'Client/Components/UI/input/button.js'
import { Input } from 'Client/Components/UI/input/input.js'
import { Label } from 'Client/Components/UI/input/label.js'
import { Textarea } from 'Client/Components/UI/input/textarea.js'
import { Switch } from 'Client/Components/UI/input/switch.js'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from 'Client/Components/UI/input/select.js'
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
} from 'Client/Components/UI/display/card.js'

/**
 * Form component for creating a new auction product.
 * Handles inputs for product details, pricing, and image upload.
 *
 * @param props - Component props
 */
const CreateProductForm: React.FC<{
	categories: CategoryType[]
	onSubmit: (data: CreateProductRequestData) => void
	isLoading: boolean
}> = ({ categories, onSubmit, isLoading }) => {
	// Form State
	const [formData, setFormData] = useState<Partial<CreateProductRequestData>>(
		{
			name: '',
			category: '',
			description: '',
			autoExtend: true,
		}
	)

	// Controlled inputs for numeric/date fields
	const [startPrice, setStartPrice] = useState('')
	const [priceStep, setPriceStep] = useState('')
	const [buyNowPrice, setBuyNowPrice] = useState('')
	const [endTime, setEndTime] = useState('')

	// Image State
	const [selectedFiles, setSelectedFiles] = useState<File[]>([])
	const [previews, setPreviews] = useState<string[]>([])
	const fileInputRef = useRef<HTMLInputElement>(null)

	// Validation State
	const [errors, setErrors] = useState<Record<string, string>>({})

	/**
	 * Handles file selection and preview generation.
	 */
	const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files.length > 0) {
			const newFiles = Array.from(e.target.files)
			const newPreviews = newFiles.map((file) =>
				URL.createObjectURL(file)
			)

			setSelectedFiles((prev) => [...prev, ...newFiles])
			setPreviews((prev) => [...prev, ...newPreviews])
		}
	}

	/**
	 * Removes an image from the selection.
	 */
	const removeImage = (index: number) => {
		const newFiles = [...selectedFiles]
		const newPreviews = [...previews]

		URL.revokeObjectURL(newPreviews[index])

		newFiles.splice(index, 1)
		newPreviews.splice(index, 1)

		setSelectedFiles(newFiles)
		setPreviews(newPreviews)
	}

	/**
	 * Validates form data before submission.
	 */
	const validate = (): boolean => {
		const newErrors: Record<string, string> = {}

		if (!formData.name) newErrors.name = 'Tên sản phẩm là bắt buộc'
		if (!formData.category) newErrors.category = 'Vui lòng chọn danh mục'
		if (!startPrice) newErrors.startPrice = 'Giá khởi điểm là bắt buộc'
		if (!priceStep) newErrors.priceStep = 'Bước giá là bắt buộc'
		if (!endTime) newErrors.endTime = 'Thời gian kết thúc là bắt buộc'
		if (!formData.description) newErrors.description = 'Mô tả là bắt buộc'
		if (selectedFiles.length < 3)
			newErrors.images = 'Cần tối thiểu 3 ảnh sản phẩm'

		setErrors(newErrors)
		return Object.keys(newErrors).length == 0
	}

	/**
	 * Handles form submission.
	 */
	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		if (!validate()) return

		// Submit the form data
		onSubmit({
			name: formData.name!,
			category: formData.category!,
			description: formData.description!,
			autoExtend: !!formData.autoExtend,
			startPrice: Number(startPrice),
			priceStep: Number(priceStep),
			buyNowPrice: buyNowPrice ? Number(buyNowPrice) : undefined,
			endTime: endTime,
			images: selectedFiles,
		})
	}

	return (
		<form
			onSubmit={handleSubmit}
			className="space-y-8 max-w-3xl mx-auto py-8"
		>
			<Card>
				<CardHeader>
					<CardTitle>Đăng sản phẩm đấu giá</CardTitle>
					<CardDescription>
						Điền thông tin chi tiết về sản phẩm bạn muốn bán
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-6">
					{/* Basic Info */}
					<div className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="name">Tên sản phẩm</Label>
							<Input
								id="name"
								placeholder="Ví dụ: iPhone 15 Pro Max 256GB"
								value={formData.name}
								onChange={(e) =>
									setFormData({
										...formData,
										name: e.target.value,
									})
								}
								className={cn(
									errors.name && 'border-destructive'
								)}
							/>
							{errors.name && (
								<p className="text-xs text-destructive">
									{errors.name}
								</p>
							)}
						</div>

						{/* Category Select */}
						<div className="space-y-2">
							<Label>Danh mục</Label>
							<Select
								onValueChange={(val) =>
									setFormData({ ...formData, category: val })
								}
							>
								<SelectTrigger
									className={cn(
										errors.category && 'border-destructive'
									)}
								>
									<SelectValue placeholder="Chọn danh mục" />
								</SelectTrigger>
								<SelectContent>
									{categories.map((cat) => (
										<SelectItem
											key={cat.name}
											value={cat.name}
										>
											{cat.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							{errors.category && (
								<p className="text-xs text-destructive">
									{errors.category}
								</p>
							)}
						</div>
					</div>

					{/* Pricing */}
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						{/* Start Price */}
						<div className="space-y-2">
							<Label htmlFor="startPrice">Giá khởi điểm</Label>
							<div className="relative">
								<span className="absolute left-3 top-2.5 text-muted-foreground">
									₫
								</span>
								<Input
									id="startPrice"
									type="number"
									className="pl-7"
									value={startPrice}
									onChange={(e) =>
										setStartPrice(e.target.value)
									}
								/>
							</div>
							{errors.startPrice && (
								<p className="text-xs text-destructive">
									{errors.startPrice}
								</p>
							)}
						</div>

						{/* Price Step */}
						<div className="space-y-2">
							<Label htmlFor="priceStep">Bước giá</Label>
							<div className="relative">
								<span className="absolute left-3 top-2.5 text-muted-foreground">
									₫
								</span>
								<Input
									id="priceStep"
									type="number"
									className="pl-7"
									value={priceStep}
									onChange={(e) =>
										setPriceStep(e.target.value)
									}
								/>
							</div>
							{errors.priceStep && (
								<p className="text-xs text-destructive">
									{errors.priceStep}
								</p>
							)}
						</div>

						{/* Buy Now Price */}
						<div className="space-y-2">
							<Label htmlFor="buyNowPrice">
								Giá mua ngay (Tùy chọn)
							</Label>
							<div className="relative">
								<span className="absolute left-3 top-2.5 text-muted-foreground">
									₫
								</span>
								<Input
									id="buyNowPrice"
									type="number"
									className="pl-7"
									value={buyNowPrice}
									onChange={(e) =>
										setBuyNowPrice(e.target.value)
									}
								/>
							</div>
						</div>
					</div>

					{/* Images */}
					<div className="space-y-4">
						<Label>Hình ảnh sản phẩm (Tối thiểu 3 ảnh)</Label>
						<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
							{previews.map((src, index) => (
								<div
									key={index}
									className="relative aspect-square rounded-lg border overflow-hidden group"
								>
									<img
										src={src}
										alt="Preview"
										className="w-full h-full object-cover"
									/>
									<button
										type="button"
										onClick={() => removeImage(index)}
										className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
									>
										<X className="h-4 w-4" />
									</button>
								</div>
							))}

							<div
								className={cn(
									'aspect-square rounded-lg border-2 border-dashed flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors',
									errors.images
										? 'border-destructive/50 bg-destructive/5'
										: 'border-muted-foreground/25'
								)}
								onClick={() => fileInputRef.current?.click()}
							>
								<Upload className="h-6 w-6 text-muted-foreground mb-2" />
								<span className="text-xs text-muted-foreground">
									Thêm ảnh
								</span>
							</div>
						</div>
						<input
							type="file"
							ref={fileInputRef}
							className="hidden"
							multiple
							accept="image/*"
							onChange={handleFileSelect}
						/>
						{errors.images && (
							<p className="text-xs text-destructive">
								{errors.images}
							</p>
						)}
					</div>

					{/* Description */}
					<div className="space-y-2">
						<Label htmlFor="description">Mô tả chi tiết</Label>
						<Textarea
							id="description"
							placeholder="Mô tả tình trạng, xuất xứ, tính năng..."
							className="min-h-[150px]"
							value={formData.description}
							onChange={(e) =>
								setFormData({
									...formData,
									description: e.target.value,
								})
							}
						/>
						{errors.description && (
							<p className="text-xs text-destructive">
								{errors.description}
							</p>
						)}
					</div>

					{/* Settings */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
						<div className="space-y-2">
							<Label htmlFor="endTime">Thời gian kết thúc</Label>
							<Input
								id="endTime"
								type="datetime-local"
								value={endTime}
								onChange={(e) => setEndTime(e.target.value)}
							/>
							{errors.endTime && (
								<p className="text-xs text-destructive">
									{errors.endTime}
								</p>
							)}
						</div>

						<div className="flex items-center justify-between space-x-2 border rounded-lg p-4">
							<div className="space-y-0.5">
								<Label className="text-base">
									Tự động gia hạn
								</Label>
								<p className="text-xs text-muted-foreground">
									Gia hạn thêm 10 phút nếu có bid mới ở 5 phút
									cuối
								</p>
							</div>
							<Switch
								checked={formData.autoExtend}
								onCheckedChange={(checked) =>
									setFormData({
										...formData,
										autoExtend: checked,
									})
								}
							/>
						</div>
					</div>

					<Button
						type="submit"
						className="w-full"
						size="lg"
						disabled={isLoading}
					>
						{isLoading && (
							<Loader2 className="mr-2 h-4 w-4 animate-spin" />
						)}
						Đăng sản phẩm
					</Button>
				</CardContent>
			</Card>
		</form>
	)
}

export default CreateProductForm
