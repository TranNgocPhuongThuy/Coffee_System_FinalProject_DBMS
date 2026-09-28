import { Router } from 'express'
import { ReportController } from './report.controller'

export const reportRouter = Router()
const controller = new ReportController()

// GET /api/v1/report/revenue (Thống kê doanh thu theo mốc ngày)
reportRouter.get('/revenue', controller.getRevenue)

// GET /api/v1/report/top-products (Món bán chạy nhất)
reportRouter.get('/top-products', controller.getTopProducts)

// GET /api/v1/report/low-stock (Cảnh báo hết nguyên liệu kho)
reportRouter.get('/low-stock', controller.getLowStock)