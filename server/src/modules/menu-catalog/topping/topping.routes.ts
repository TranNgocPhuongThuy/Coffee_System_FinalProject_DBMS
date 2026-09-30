import { Router } from 'express'
import { ToppingController } from './topping.controller'
import { authGuard, roleGuard, validatePipe } from '@/middlewares'
import {
  CreateToppingSchema,
  ToppingParamSchema,
  UpdateToppingSchema,
} from './topping.schema'

export const toppingRouter = Router()
const controller = new ToppingController()

// Xem danh sách topping: Public
toppingRouter.get('/', controller.getAll)
toppingRouter.get(
  '/:id',
  validatePipe(ToppingParamSchema, 'params'),
  controller.getById
)

// Cấu hình topping: Chỉ MANAGER
toppingRouter.post(
  '/',
  authGuard,
  roleGuard('MANAGER'),
  validatePipe(CreateToppingSchema, 'body'),
  controller.create
)

toppingRouter.put(
  '/:id',
  authGuard,
  roleGuard('MANAGER'),
  validatePipe(ToppingParamSchema, 'params'),
  validatePipe(UpdateToppingSchema, 'body'),
  controller.update
)

toppingRouter.delete(
  '/:id',
  authGuard,
  roleGuard('MANAGER'),
  validatePipe(ToppingParamSchema, 'params'),
  controller.delete
)