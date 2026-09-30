import { Router } from 'express'
import { CustomerController } from './customer.controller'

export const customerRouter = Router()
const controller = new CustomerController()

// GET /api/v1/customer-loyalty/customers
customerRouter.get('/', controller.list)

// GET /api/v1/customer-loyalty/customers/:id
customerRouter.get('/:id', controller.detail)

// POST /api/v1/customer-loyalty/customers
customerRouter.post('/', controller.create)

// PUT /api/v1/customer-loyalty/customers/:id
customerRouter.put('/:id', controller.update)

// DELETE /api/v1/customer-loyalty/customers/:id (Xóa mềm khách hàng)
customerRouter.delete('/:id', controller.delete)
