import { Router } from 'express'
import { ReportController } from './report.controller'
import { authGuard, roleGuard, validatePipe } from '@/middlewares'
import { DateRangeReportSchema, TopProductsQuerySchema } from './report.schema'

export const reportRouter = Router()
const controller = new ReportController()

// Chặn toàn bộ: Chỉ MANAGER và ADMIN
reportRouter.use(authGuard, roleGuard('MANAGER'))

// GET /api/v1/reports/revenue - Thống kê doanh thu theo khoảng ngày
reportRouter.get(
  '/revenue',
  validatePipe(DateRangeReportSchema, 'query'),
  controller.getRevenue
)

// GET /api/v1/reports/top-products - Báo cáo top món bán chạy nhất
reportRouter.get(
  '/top-products',
  validatePipe(TopProductsQuerySchema, 'query'),
  controller.getTopProducts
)

// GET /api/v1/reports/low-stock - Cảnh báo nguyên liệu sắp hết trong kho
reportRouter.get(
  '/low-stock',
  controller.getLowStock
)