// import AWS from 'aws-sdk'

// import Keys from 'Server/Config/Keys.js'

// /**
//  * Uploads an image to AWS S3 and returns the image URL and key.
//  *
//  * @param image - The image file to be uploaded.
//  * @returns An object containing the image URL and key.
//  */
// const Upload = async function (image: Express.Multer.File): Promise<{
// 	imageUrl: string
// 	imageKey: string
// }> {
// 	try {
// 		let imageUrl = ''
// 		let imageKey = ''

// 		if (image) {
// 			// Check for all required AWS configuration values before proceeding
// 			if (
// 				!Keys.aws.accessKeyId ||
// 				!Keys.aws.secretAccessKey ||
// 				!Keys.aws.region ||
// 				!Keys.aws.bucketName
// 			) {
// 				console.error(
// 					'AWS configuration is incomplete. Cannot upload file.'
// 				)
// 				return { imageUrl: '', imageKey: '' }
// 			}

// 			const s3bucket = new AWS.S3({
// 				accessKeyId: Keys.aws.accessKeyId,
// 				secretAccessKey: Keys.aws.secretAccessKey,
// 				region: Keys.aws.region,
// 			})

// 			const params = {
// 				Bucket: Keys.aws.bucketName,
// 				Key: image.originalname,
// 				Body: image.buffer,
// 				ContentType: image.mimetype,
// 			}

// 			// Upload the image to AWS
// 			const s3Upload = await s3bucket.upload(params).promise()

// 			// Get the url and key for the uploaded image
// 			imageUrl = s3Upload.Location
// 			imageKey = s3Upload.Key
// 		}

// 		return { imageUrl, imageKey }
// 	} catch (error) {
// 		console.error('Error uploading to S3:', error)
// 		return { imageUrl: '', imageKey: '' }
// 	}
// }

// export default Upload
