import { Request, Response, NextFunction } from 'express'
import { ReportService } from './report.service'
import { DateRangeReportSchema, TopProductsQuerySchema } from './report.schema'

export class ReportController {
    private reportService = new ReportService()

    getRevenue = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const query = DateRangeReportSchema.parse(req.query)
            const data = await this.reportService.getRevenueOverview(query)
            res.status(200).json({ success: true, data })
        } catch (error) {
            next(error)
        }
    }

    getTopProducts = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const query = TopProductsQuerySchema.parse(req.query)
            const data = await this.reportService.getTopSellingProducts(query)
            res.status(200).json({ success: true, data })
        } catch (error) {
            next(error)
        }
    }

    getLowStock = async (_req: Request, res: Response, next: NextFunction) => {
        try {
            const data = await this.reportService.getLowStockAlert()
            res.status(200).json({ success: true, data })
        } catch (error) {
            next(error)
        }
    }
}