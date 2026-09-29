import { Router } from 'express'
import { LoyaltyController } from './loyalty.controller'
import { authGuard, roleGuard, validatePipe } from '@/middlewares'
import {
  AdjustPointsSchema,
  FilterLoyaltyHistoryQuerySchema,
} from './loyalty.schema'

export const loyaltyRouter = Router()
const controller = new LoyaltyController()

loyaltyRouter.use(authGuard)

// Tra cứu lịch sử biến động điểm
loyaltyRouter.get(
  '/history',
  roleGuard('CUSTOMER', 'CASHIER', 'MANAGER'),
  validatePipe(FilterLoyaltyHistoryQuerySchema, 'query'),
  controller.getHistory
)

// Điều chỉnh tăng/giảm điểm thủ công: Chỉ MANAGER
loyaltyRouter.post(
  '/adjust',
  roleGuard('MANAGER'),
  validatePipe(AdjustPointsSchema, 'body'),
  controller.adjustPoints
)