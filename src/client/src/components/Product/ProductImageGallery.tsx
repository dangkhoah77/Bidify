import React, { useState } from 'react'

import { cn } from 'Client/Utility/index.js'

/**
 * Product Image Gallery Component.
 * Displays a main image and a row of thumbnails.
 *
 * @param props - Component props.
 */
const ProductImageGallery: React.FC<{ images: string[]; alt: string }> = ({
	images,
	alt,
}) => {
	const [selectedImage, setSelectedImage] = useState(0)

	// Handle case with no images
	if (!images || images.length === 0) {
		return (
			<div className="aspect-square w-full rounded-lg bg-muted flex items-center justify-center text-muted-foreground">
				No Image
			</div>
		)
	}

	return (
		<div className="flex flex-col gap-4">
			{/* Main Image */}
			<div className="aspect-square w-full overflow-hidden rounded-lg border bg-white">
				<img
					src={images[selectedImage]}
					alt={alt}
					className="h-full w-full object-contain"
				/>
			</div>

			{/* Thumbnails */}
			{images.length > 1 && (
				<div className="flex gap-2 overflow-x-auto pb-2">
					{images.map((img, index) => (
						<button
							key={index}
							className={cn(
								'relative aspect-square w-20 flex-shrink-0 overflow-hidden rounded-md border-2 transition-all hover:opacity-100',
								selectedImage === index
									? 'border-primary ring-2 ring-primary ring-offset-2'
									: 'border-transparent opacity-70 hover:border-gray-300'
							)}
							onClick={() => setSelectedImage(index)}
						>
							<img
								src={img}
								alt={`${alt} ${index + 1}`}
								className="h-full w-full object-cover"
							/>
						</button>
					))}
				</div>
			)}
		</div>
	)
}

export default ProductImageGallery
