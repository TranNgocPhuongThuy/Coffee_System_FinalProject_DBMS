import { Router } from 'express'
import { KDSController } from './kds.controller'

export const kdsRouter = Router()
const controller = new KDSController()

// GET /api/v1/kds/queue?status=PENDING (Lấy hàng đợi KDS cho Barista)
kdsRouter.get('/queue', controller.getQueue)

// PATCH /api/v1/kds/items/:orderDetailId/status (Cập nhật hoàn thành món -> Kích hoạt Trigger trừ kho)
kdsRouter.patch('/items/:orderDetailId/status', controller.updateItemStatus)

// POST /api/v1/kds/orders/:orderId/notify-ready (Bấm chuông rung báo khách lấy nước)
kdsRouter.post('/orders/:orderId/notify-ready', controller.notifyReady)