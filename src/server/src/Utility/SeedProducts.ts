import './Dotenv.js'
import setupDB from './Database.js'
import Product from '../Models/Product.js'
import mongoose from 'mongoose'

async function seed() {
	await setupDB()

	await Product.deleteMany({}) // xóa cũ nếu cần

	const now = new Date()
	const products = [
		{
			name: 'iPhone 11',
			description: 'Điện thoại iPhone 11...',
			category: new mongoose.Types.ObjectId(), // tạm, sau nối Category thật
			seller: new mongoose.Types.ObjectId(), // tạm, sau nối User thật
			images: ['/images/iphone11-1.jpg'],
			startPrice: 10000000,
			priceStep: 100000,
			currentPrice: 10500000,
			buyNowPrice: 12000000,
			startTime: now,
			endTime: new Date(now.getTime() + 2 * 60 * 60 * 1000), // +2h
			autoExtend: false,
			isSold: false,
		},
		// thêm vài sản phẩm nữa
	]

	await Product.insertMany(products)
	console.log('Seed products done')
	process.exit(0)
}

seed()
