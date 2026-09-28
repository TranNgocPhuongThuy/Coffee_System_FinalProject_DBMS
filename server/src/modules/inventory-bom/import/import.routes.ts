import { Router } from 'express'
import { ImportController } from './import.controller'

export const importRouter = Router()
const controller = new ImportController()

// GET /api/v1/inventory/imports (Danh sách phiếu nhập)
importRouter.get('/', controller.getImportTickets)

// GET /api/v1/inventory/imports/:importId (Chi tiết phiếu nhập kèm danh sách hàng hóa)
importRouter.get('/:importId', controller.getImportDetailById)

// POST /api/v1/inventory/imports (Tạo phiếu nhập mới)
importRouter.post('/', controller.createImportTicket)