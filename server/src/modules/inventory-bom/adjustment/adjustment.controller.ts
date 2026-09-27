import { Request, Response, NextFunction } from 'express'
import { AdjustmentService } from './adjustment.service'
import { CreateAdjustmentSchema, FilterAdjustmentQuerySchema } from './adjustment.schema'

export class AdjustmentController {
  private adjustmentService = new AdjustmentService()

  list = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const query = FilterAdjustmentQuerySchema.parse(req.query)
      const data = await this.adjustmentService.getAdjustments(query)
      res.status(200).json({ success: true, data })
    } catch (error) {
      next(error)
    }
  }

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = CreateAdjustmentSchema.parse(req.body)
      const result = await this.adjustmentService.createAdjustment(body)
      res.status(201).json({ success: true, ...result })
    } catch (error) {
      next(error)
    }
  }
}