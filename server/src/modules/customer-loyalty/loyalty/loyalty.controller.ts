import { Request, Response, NextFunction } from 'express'
import { LoyaltyService } from './loyalty.service'
import { AdjustPointsSchema, FilterLoyaltyHistoryQuerySchema } from './loyalty.schema'

export class LoyaltyController {
    private loyaltyService = new LoyaltyService()

    getHistory = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const query = FilterLoyaltyHistoryQuerySchema.parse(req.query)
            const data = await this.loyaltyService.getLoyaltyHistory(query)
            res.status(200).json({ success: true, ...data })
        } catch (error) {
            next(error)
        }
    }

    adjustPoints = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const body = AdjustPointsSchema.parse(req.body)
            const result = await this.loyaltyService.adjustPoints(body)
            res.status(200).json({ success: true, ...result })
        } catch (error) {
            next(error)
        }
    }
}