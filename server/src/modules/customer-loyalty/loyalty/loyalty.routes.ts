import { Router } from 'express'
import { LoyaltyController } from './loyalty.controller'

export const loyaltyRouter = Router()
const controller = new LoyaltyController()

// GET /api/v1/customer-loyalty/loyalty/history
loyaltyRouter.get('/history', controller.getHistory)

// POST /api/v1/customer-loyalty/loyalty/adjust (Tích / Tiêu điểm thưởng)
loyaltyRouter.post('/adjust', controller.adjustPoints)