import { Router } from 'express'
import { CustomerController } from './customer.controller'
import { authGuard, roleGuard, validatePipe } from '@/middlewares'
import {
  CreateCustomerSchema,
  CustomerParamSchema,
  FilterCustomerQuerySchema,
  UpdateCustomerSchema,
} from './customer.schema'

export const customerRouter = Router()
const controller = new CustomerController()

// Đăng ký hội viên mới: Cho phép khách tự đăng ký (Public) hoặc Thu ngân tạo hộ tại quầy
customerRouter.post(
  '/',
  validatePipe(CreateCustomerSchema, 'body'),
  controller.create
)

// Các thao tác quản lý yêu cầu đăng nhập
customerRouter.use(authGuard)

// Tra cứu danh sách và chi tiết: CASHIER, MANAGER hoặc chính CUSTOMER xem thông tin
customerRouter.get(
  '/',
  roleGuard('CASHIER', 'MANAGER'),
  validatePipe(FilterCustomerQuerySchema, 'query'),
  controller.list
)

customerRouter.get(
  '/:id',
  roleGuard('CASHIER', 'MANAGER', 'CUSTOMER'),
  validatePipe(CustomerParamSchema, 'params'),
  controller.detail
)

// Cập nhật thông tin hội viên
customerRouter.put(
  '/:id',
  roleGuard('CASHIER', 'MANAGER', 'CUSTOMER'),
  validatePipe(CustomerParamSchema, 'params'),
  validatePipe(UpdateCustomerSchema, 'body'),
  controller.update
)