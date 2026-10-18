import { Router } from 'express'
import { BOMController } from './bom.controller'
import { authGuard, roleGuard, validatePipe } from '@/middlewares'
import {
  GetVariantBOMQuerySchema,
  RecipeBOMSchema,
  ToppingBOMSchema,
} from './bom.schema'

export const bomRouter = Router()
const controller = new BOMController()

bomRouter.use(authGuard)

// Xem định lượng món và topping
bomRouter.get(
  '/recipes',
  roleGuard('BARISTA', 'MANAGER', 'STOREKEEPER'),
  validatePipe(GetVariantBOMQuerySchema, 'query'),
  controller.getRecipes
)

bomRouter.get(
  '/toppings',
  roleGuard('BARISTA', 'MANAGER', 'STOREKEEPER'),
  controller.getToppingBOM
)

bomRouter.get(
  '/toppings/:toppingId',
  roleGuard('BARISTA', 'MANAGER', 'STOREKEEPER'),
  controller.getToppingBOM
)

// Cấu hình định mức tiêu hao
bomRouter.post(
  '/recipes',
  roleGuard('MANAGER'),
  validatePipe(RecipeBOMSchema, 'body'),
  controller.upsertRecipe
)

bomRouter.post(
  '/toppings',
  roleGuard('MANAGER'),
  validatePipe(ToppingBOMSchema, 'body'),
  controller.upsertTopping
)

bomRouter.delete(
  '/recipes/:variantId/:ingredientId',
  roleGuard('MANAGER'),
  controller.deleteRecipe
)