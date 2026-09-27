import { Request, Response, NextFunction } from 'express'
import { IngredientService } from './ingredient.service'
import {
  CreateIngredientSchema,
  IngredientParamsSchema,
  QueryIngredientSchema,
  UpdateIngredientSchema,
} from './ingredient.schema'

export class IngredientController {
  private ingredientService = new IngredientService()

  getIngredients = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const query = QueryIngredientSchema.parse(req.query)
      const data = await this.ingredientService.getIngredients(query)
      res.status(200).json({ success: true, data })
    } catch (error) {
      next(error)
    }
  }

  getIngredientById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { ingredientId } = IngredientParamsSchema.parse(req.params)
      const data = await this.ingredientService.getIngredientById(ingredientId)
      res.status(200).json({ success: true, data })
    } catch (error) {
      next(error)
    }
  }

  createIngredient = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = CreateIngredientSchema.parse(req.body)
      const data = await this.ingredientService.createIngredient(body)
      res.status(201).json({
        success: true,
        message: 'Thêm mới nguyên liệu thành công',
        data,
      })
    } catch (error) {
      next(error)
    }
  }

  updateIngredient = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { ingredientId } = IngredientParamsSchema.parse(req.params)
      const body = UpdateIngredientSchema.parse(req.body)
      const data = await this.ingredientService.updateIngredient(ingredientId, body)
      res.status(200).json({
        success: true,
        message: 'Cập nhật thông tin nguyên liệu thành công',
        data,
      })
    } catch (error) {
      next(error)
    }
  }

  deleteIngredient = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { ingredientId } = IngredientParamsSchema.parse(req.params)
      await this.ingredientService.deleteIngredient(ingredientId)
      res.status(200).json({
        success: true,
        message: 'Đã xóa nguyên liệu thành công (Soft Delete)',
      })
    } catch (error) {
      next(error)
    }
  }
}