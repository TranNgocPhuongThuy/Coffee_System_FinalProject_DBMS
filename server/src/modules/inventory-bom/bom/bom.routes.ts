import { Router } from 'express'
import { BOMController } from './bom.controller'

export const bomRouter = Router()
const controller = new BOMController()

// GET /api/v1/inventory/boms/recipes?variantId=1
bomRouter.get('/recipes', controller.getRecipes)

// GET /api/v1/inventory/boms/toppings/:toppingId
bomRouter.get('/toppings/:toppingId', controller.getToppingBOM)

// POST /api/v1/inventory/boms/recipes (Cấu hình định lượng món)
bomRouter.post('/recipes', controller.upsertRecipe)

// POST /api/v1/inventory/boms/toppings (Cấu hình định lượng topping)
bomRouter.post('/toppings', controller.upsertTopping)

// DELETE /api/v1/inventory/boms/recipes/:variantId/:ingredientId
bomRouter.delete('/recipes/:variantId/:ingredientId', controller.deleteRecipe)