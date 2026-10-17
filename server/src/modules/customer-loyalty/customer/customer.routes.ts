import { Router } from 'express'
import { CustomerController } from './customer.controller'
import { authGuard, roleGuard } from '@/middlewares'

export const customerRouter = Router()
const controller = new CustomerController()

// Bắt buộc đăng nhập trước khi thao tác danh sách khách hàng
customerRouter.use(authGuard)

// Chỉ Cashier, Manager và Admin mới có quyền xem danh sách và chi tiết
customerRouter.get('/', roleGuard('CASHIER', 'MANAGER', 'ADMIN'), controller.list)
customerRouter.get('/:id', roleGuard('CASHIER', 'MANAGER', 'ADMIN'), controller.detail)

// Chỉ Manager và Admin được tạo mới, cập nhật hoặc xóa
customerRouter.post('/', roleGuard('CASHIER', 'MANAGER', 'ADMIN'), controller.create)
customerRouter.put('/:id', roleGuard('MANAGER', 'ADMIN'), controller.update)
customerRouter.delete('/:id', roleGuard('MANAGER', 'ADMIN'), controller.delete)