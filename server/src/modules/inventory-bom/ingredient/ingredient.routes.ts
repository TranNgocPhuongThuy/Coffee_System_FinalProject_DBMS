import { Router } from 'express'
import { IngredientController } from './ingredient.controller'

export const ingredientRouter = Router()
const controller = new IngredientController()

// GET /api/v1/inventory/ingredients?isLowStock=true
ingredientRouter.get('/', controller.getIngredients)

// GET /api/v1/inventory/ingredients/:ingredientId
ingredientRouter.get('/:ingredientId', controller.getIngredientById)

// POST /api/v1/inventory/ingredients
ingredientRouter.post('/', controller.createIngredient)

// PUT /api/v1/inventory/ingredients/:ingredientId
ingredientRouter.put('/:ingredientId', controller.updateIngredient)

// DELETE /api/v1/inventory/ingredients/:ingredientId
ingredientRouter.delete('/:ingredientId', controller.deleteIngredient)