import { Router } from 'express'
import { AdjustmentController } from './adjustment.controller'

export const adjustmentRouter = Router()
const controller = new AdjustmentController()

// GET /api/v1/inventory/adjustments
adjustmentRouter.get('/', controller.list)

// POST /api/v1/inventory/adjustments (Cân kho, điều chỉnh hao hụt)
adjustmentRouter.post('/', controller.create)