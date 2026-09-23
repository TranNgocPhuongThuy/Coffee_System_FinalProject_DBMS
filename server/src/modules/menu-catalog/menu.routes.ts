import { Router } from 'express'
import { categoryRouter } from './category/category.routes'
import { productRouter } from './product/product.routes'
import { toppingRouter } from './topping/topping.routes'

export const menuRouter = Router()
menuRouter.use('/categories', categoryRouter)
menuRouter.use('/products', productRouter)
menuRouter.use('/toppings', toppingRouter)