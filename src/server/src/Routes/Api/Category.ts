import express, { Request, Response } from 'express'
import Category from '../../Models/Category.js'

const router = express.Router()

// POST /api/categories
router.post('/', async (req: Request, res: Response) => {
	try {
		const { name, parent } = req.body

		if (!name) {
			return res.status(400).json({ error: 'Name is required' })
		}

		const category = await Category.create({
			name,
			parent: parent || null,
		})

		return res.status(201).json(category)
	} catch (error: any) {
		return res
			.status(500)
			.json({ error: error.message || 'Could not create category' })
	}
})

// GET /api/categories - xem nhanh tất cả category
router.get('/', async (_req: Request, res: Response) => {
	const categories = await Category.find().lean()
	res.json(categories)
})

export default router
