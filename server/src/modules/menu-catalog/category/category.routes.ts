import { Router } from 'express'
import { CategoryController } from './category.controller'
import { authGuard, roleGuard, validatePipe } from '@/middlewares'
import {
  CategoryParamSchema,
  CreateCategorySchema,
  FilterCategoryQuerySchema,
  UpdateCategorySchema,
} from './category.schema'

export const categoryRouter = Router()
const controller = new CategoryController()

// Xem danh mục: Public cho Customer tra cứu menu và Cashier bán hàng
categoryRouter.get(
  '/',
  validatePipe(FilterCategoryQuerySchema, 'query'),
  controller.getAll
)

categoryRouter.get(
    '/:id',
    validatePipe(CategoryParamSchema, 'params'),
    controller.getById
)

// Quản lý danh mục: Yêu cầu quyền MANAGER
categoryRouter.post(
    '/',
    authGuard,
    roleGuard('MANAGER'),
    validatePipe(CreateCategorySchema, 'body'),
    controller.create
)

categoryRouter.put(
    '/:id',
    authGuard,
    roleGuard('MANAGER'),
    validatePipe(CategoryParamSchema, 'params'),
    validatePipe(UpdateCategorySchema, 'body'),
    controller.update
)

categoryRouter.delete(
    '/:id',
    authGuard,
    roleGuard('MANAGER'),
    validatePipe(CategoryParamSchema, 'params'),
    controller.delete
)