import { Router } from 'express'
import { customerRouter } from './customer/customer.routes'
import { loyaltyRouter } from './loyalty/loyalty.routes'

export const customerLoyaltyRouter = Router()
customerLoyaltyRouter.use('/customers', customerRouter)
customerLoyaltyRouter.use('/transactions', loyaltyRouter)