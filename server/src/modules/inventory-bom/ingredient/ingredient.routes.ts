import { Router } from 'express'
import { IngredientController } from './ingredient.controller'
import { authGuard, roleGuard, validatePipe } from '@/middlewares'
import {
  CreateIngredientSchema,
  IngredientParamsSchema,
  QueryIngredientSchema,
  UpdateIngredientSchema,
} from './ingredient.schema'

export const ingredientRouter = Router()
const controller = new IngredientController()

ingredientRouter.use(authGuard)

// Xem nguyên liệu
ingredientRouter.get(
  '/',
  roleGuard('STOREKEEPER', 'MANAGER', 'BARISTA'),
  validatePipe(QueryIngredientSchema, 'query'),
  controller.getIngredients
)

ingredientRouter.get(
  '/:ingredientId',
  roleGuard('STOREKEEPER', 'MANAGER', 'BARISTA'),
  validatePipe(IngredientParamsSchema, 'params'),
  controller.getIngredientById
)

// Tạo mới & cập nhật nguyên liệu
ingredientRouter.post(
  '/',
  roleGuard('STOREKEEPER', 'MANAGER'),
  validatePipe(CreateIngredientSchema, 'body'),
  controller.createIngredient
)

ingredientRouter.put(
  '/:ingredientId',
  roleGuard('STOREKEEPER', 'MANAGER'),
  validatePipe(IngredientParamsSchema, 'params'),
  validatePipe(UpdateIngredientSchema, 'body'),
  controller.updateIngredient
)

// Xóa mềm nguyên liệu
ingredientRouter.delete(
  '/:ingredientId',
  roleGuard('MANAGER'),
  validatePipe(IngredientParamsSchema, 'params'),
  controller.deleteIngredient
)