import { Router } from 'express'
import { ProductController } from './product.controller'
import { authGuard, roleGuard, validatePipe } from '@/middlewares'
import {
    CreateProductSchema,
    FilterProductQuerySchema,
    ProductParamSchema,
    UpdateProductSchema,
} from './product.schema'

export const productRouter = Router()
const controller = new ProductController()

// Tra cứu thực đơn: Public cho Customer và Cashier
productRouter.get(
    '/',
    validatePipe(FilterProductQuerySchema, 'query'),
    controller.getAll
)

productRouter.get(
    '/:id',
    validatePipe(ProductParamSchema, 'params'),
    controller.getById
)

// Thêm, cập nhật và xóa món: Chỉ MANAGER
productRouter.post(
    '/',
    authGuard,
    roleGuard('MANAGER'),
    validatePipe(CreateProductSchema, 'body'),
    controller.create
)

productRouter.put(
    '/:id',
    authGuard,
    roleGuard('MANAGER'),
    validatePipe(ProductParamSchema, 'params'),
    validatePipe(UpdateProductSchema, 'body'),
    controller.update
)

productRouter.delete(
    '/:id',
    authGuard,
    roleGuard('MANAGER'),
    validatePipe(ProductParamSchema, 'params'),
    controller.delete
)