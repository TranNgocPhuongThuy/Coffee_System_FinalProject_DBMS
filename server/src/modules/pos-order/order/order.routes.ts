import { Router } from 'express'
import { OrderController } from './order.controller'
import { authGuard, roleGuard } from '@/middlewares'

export const orderRouter = Router()
const controller = new OrderController()

// Bắt buộc đăng nhập cho các thao tác POS bán hàng
orderRouter.use(authGuard)

orderRouter.get('/', roleGuard('CASHIER', 'MANAGER'), controller.list)
orderRouter.post('/', roleGuard('CASHIER', 'MANAGER'), controller.create)
orderRouter.delete('/items/:detailId', roleGuard('CASHIER', 'MANAGER'), controller.removeItem)
orderRouter.get('/:id', roleGuard('CASHIER', 'MANAGER', 'BARISTA'), controller.detail)
orderRouter.get('/:id/invoice', roleGuard('CASHIER', 'MANAGER'), controller.invoice)
orderRouter.patch('/:id/pay', roleGuard('CASHIER', 'MANAGER'), controller.completePayment)
orderRouter.patch('/:id/cancel', roleGuard('CASHIER', 'MANAGER'), controller.cancel)
orderRouter.post('/:id/apply-points', roleGuard('CASHIER', 'MANAGER'), controller.applyPoints)