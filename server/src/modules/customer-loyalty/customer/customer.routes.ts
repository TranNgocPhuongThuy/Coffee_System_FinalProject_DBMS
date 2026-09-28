import { Router } from 'express'
export const customerRouter = Router()
import { CustomerController } from './customer.controller'

const controller = new CustomerController()

// GET /api/v1/customer-loyalty/customers
customerRouter.get('/', controller.list)

// GET /api/v1/customer-loyalty/customers/:id
customerRouter.get('/:id', controller.detail)

// POST /api/v1/customer-loyalty/customers
customerRouter.post('/', controller.create)

// PUT /api/v1/customer-loyalty/customers/:id
customerRouter.put('/:id', controller.update)