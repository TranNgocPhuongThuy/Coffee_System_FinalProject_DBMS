import { Router } from 'express'
import { ImportController } from './import.controller'
import { authGuard, roleGuard, validatePipe } from '@/middlewares'
import {
  CreateImportTicketSchema,
  ImportTicketParamsSchema,
  QueryImportTicketSchema,
} from './import.schema'

export const importRouter = Router()
const controller = new ImportController()

importRouter.use(authGuard, roleGuard('STOREKEEPER', 'MANAGER'))

// GET /api/v1/inventory/imports - Lấy danh sách phiếu nhập
importRouter.get(
  '/',
  validatePipe(QueryImportTicketSchema, 'query'),
  controller.getImportTickets
)

// GET /api/v1/inventory/imports/:importId - Xem chi tiết phiếu nhập
importRouter.get(
  '/:importId',
  validatePipe(ImportTicketParamsSchema, 'params'),
  controller.getImportDetailById
)

// POST /api/v1/inventory/imports - Tạo phiếu nhập kho mới
importRouter.post(
  '/',
  validatePipe(CreateImportTicketSchema, 'body'),
  controller.createImportTicket
)