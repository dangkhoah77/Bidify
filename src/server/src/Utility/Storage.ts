import { S3Client } from '@aws-sdk/client-s3'
import { Upload } from '@aws-sdk/lib-storage'

import Keys from 'Server/Config/Keys.js'

/**
 * AWS S3 v3 client
 */
const s3 = new S3Client({
	region: Keys.aws.region,
	credentials: {
		accessKeyId: Keys.aws.accessKeyId,
		secretAccessKey: Keys.aws.secretAccessKey,
	},
})

/**
 * Uploads an image to AWS S3 and returns the image URL and key.
 *
 * @param image - The image file to be uploaded.
 * @returns An object containing the image URL and key.
 */
const UploadImage = async function (image: Express.Multer.File): Promise<{
	imageUrl: string
	imageKey: string
}> {
	try {
		const key = image.originalname

		const uploader = new Upload({
			client: s3,
			params: {
				Bucket: Keys.aws.bucketName,
				Key: key,
				Body: image.buffer,
				ContentType: image.mimetype,
			},
		})

		const result = await uploader.done()
		const imageUrl = result.Location!

		return { imageUrl, imageKey: key }
	} catch (error) {
		console.error('Error uploading to S3 (v3):', error)
		return { imageUrl: '', imageKey: '' }
	}
}

export default UploadImage
