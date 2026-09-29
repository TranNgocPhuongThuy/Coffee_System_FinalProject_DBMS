import { Router } from 'express'
import { AdjustmentController } from './adjustment.controller'
import { authGuard, roleGuard, validatePipe } from '@/middlewares'
import {
  CreateAdjustmentSchema,
  FilterAdjustmentQuerySchema,
} from './adjustment.schema'

export const adjustmentRouter = Router()
const controller = new AdjustmentController()

adjustmentRouter.use(authGuard, roleGuard('STOREKEEPER', 'MANAGER'))

// GET /api/v1/inventory/adjustments - Xem lịch sử điều chỉnh cân kho
adjustmentRouter.get(
  '/',
  validatePipe(FilterAdjustmentQuerySchema, 'query'),
  controller.list
)

// POST /api/v1/inventory/adjustments - Lập phiếu cân kho hao hụt
adjustmentRouter.post(
  '/',
  validatePipe(CreateAdjustmentSchema, 'body'),
  controller.create
)