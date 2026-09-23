import { Router } from 'express'
import { orderRouter } from './order/order.routes'
import { pagerRouter } from './pager/pager.routes'

export const posRouter = Router()
posRouter.use('/orders', orderRouter)
posRouter.use('/pagers', pagerRouter)