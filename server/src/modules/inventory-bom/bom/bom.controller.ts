import { Request, Response, NextFunction } from 'express'
import { BOMService } from './bom.service'
import { RecipeBOMSchema, ToppingBOMSchema, GetVariantBOMQuerySchema } from './bom.schema'

export class BOMController {
  private bomService = new BOMService()

  getRecipes = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const query = GetVariantBOMQuerySchema.parse(req.query)
      const data = await this.bomService.getRecipeDetails(query.variantId)
      res.status(200).json({ success: true, data })
    } catch (error) {
      next(error)
    }
  }

  getToppingBOM = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const toppingId = req.params.toppingId ? Number(req.params.toppingId) : undefined
      const data = await this.bomService.getToppingBOM(toppingId)
      res.status(200).json({ success: true, data })
    } catch (error) {
      next(error)
    }
  }

  upsertRecipe = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = RecipeBOMSchema.parse(req.body)
      const result = await this.bomService.upsertRecipeBOM(body)
      res.status(200).json({ success: true, ...result })
    } catch (error) {
      next(error)
    }
  }

  upsertTopping = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = ToppingBOMSchema.parse(req.body)
      const result = await this.bomService.upsertToppingBOM(body)
      res.status(200).json({ success: true, ...result })
    } catch (error) {
      next(error)
    }
  }

  deleteRecipe = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const variantId = Number(req.params.variantId)
      const ingredientId = Number(req.params.ingredientId)
      const result = await this.bomService.deleteRecipeBOM(variantId, ingredientId)
      res.status(200).json({ success: true, ...result })
    } catch (error) {
      next(error)
    }
  }
}