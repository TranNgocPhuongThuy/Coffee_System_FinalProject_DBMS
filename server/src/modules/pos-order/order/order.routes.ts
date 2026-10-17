import { Router } from 'express'
import { OrderController } from './order.controller'
import { authGuard, optionalAuthGuard, roleGuard } from '@/middlewares'

export const orderRouter = Router()
const controller = new OrderController()

// Tạo đơn hàng: Hỗ trợ cả nhân viên quầy POS, khách hàng đã đăng nhập và khách đặt online
orderRouter.post('/', optionalAuthGuard, controller.create)

// Các thao tác quản lý đơn hàng yêu cầu xác thực
orderRouter.get('/', authGuard, roleGuard('CASHIER', 'MANAGER', 'CUSTOMER', 'ADMIN'), controller.list)
orderRouter.delete('/items/:detailId', authGuard, roleGuard('CASHIER', 'MANAGER', 'ADMIN'), controller.removeItem)
orderRouter.get('/:id', authGuard, roleGuard('CASHIER', 'MANAGER', 'BARISTA', 'CUSTOMER', 'ADMIN'), controller.detail)
orderRouter.get('/:id/invoice', authGuard, roleGuard('CASHIER', 'MANAGER'), controller.invoice)
orderRouter.patch('/:id/pay', authGuard, roleGuard('CASHIER', 'MANAGER'), controller.completePayment)
orderRouter.patch('/:id/cancel', authGuard, roleGuard('CASHIER', 'MANAGER'), controller.cancel)
orderRouter.post('/:id/apply-points', authGuard, roleGuard('CASHIER', 'MANAGER'), controller.applyPoints)