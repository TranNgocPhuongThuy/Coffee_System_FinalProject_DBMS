import { Router } from 'express'
import { ToppingController } from './topping.controller'
import { authGuard, roleGuard, validatePipe } from '@/middlewares'
import {
  CreateToppingSchema,
  FilterToppingQuerySchema,
  ToppingParamSchema,
  UpdateToppingSchema,
} from './topping.schema'

export const toppingRouter = Router()
const controller = new ToppingController()

/**
 * @route   GET /api/v1/menu/toppings
 * @desc    Xem danh sách topping (Public - hỗ trợ search & filter status)
 */
toppingRouter.get(
  '/',
  validatePipe(FilterToppingQuerySchema, 'query'),
  controller.getAll
)

/**
 * @route   GET /api/v1/menu/toppings/:id
 * @desc    Xem chi tiết 1 topping theo ID (Public)
 */
toppingRouter.get(
    '/:id',
    validatePipe(ToppingParamSchema, 'params'),
    controller.getById
)

/**
 * @route   POST /api/v1/menu/toppings
 * @desc    Tạo topping mới (Yêu cầu Đăng nhập & Quyền MANAGER)
 */
toppingRouter.post(
    '/',
    authGuard,
    roleGuard('MANAGER'),
    validatePipe(CreateToppingSchema, 'body'),
    controller.create
)

/**
 * @route   PUT /api/v1/menu/toppings/:id
 * @desc    Cập nhật topping (Yêu cầu Đăng nhập & Quyền MANAGER)
 */
toppingRouter.put(
    '/:id',
    authGuard,
    roleGuard('MANAGER'),
    validatePipe(ToppingParamSchema, 'params'),
    validatePipe(UpdateToppingSchema, 'body'),
    controller.update
)

/**
 * @route   DELETE /api/v1/menu/toppings/:id
 * @desc    Xóa mềm topping (Yêu cầu Đăng nhập & Quyền MANAGER)
 */
toppingRouter.delete(
    '/:id',
    authGuard,
    roleGuard('MANAGER'),
    validatePipe(ToppingParamSchema, 'params'),
    controller.delete
)