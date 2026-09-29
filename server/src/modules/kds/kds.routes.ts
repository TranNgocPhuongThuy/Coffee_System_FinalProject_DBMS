import { Router } from 'express'
import { KDSController } from './kds.controller'
import { authGuard, roleGuard, validatePipe } from '@/middlewares'
import {
  KdsParamSchema,
  NotifyOrderReadySchema,
  QueryKdsQueueSchema,
  UpdateItemStatusSchema,
} from './kds.schema'

export const kdsRouter = Router()
const controller = new KDSController()

// Chặn toàn bộ: Yêu cầu đăng nhập và chỉ cho phép BARISTA hoặc MANAGER
kdsRouter.use(authGuard, roleGuard('BARISTA', 'MANAGER'))

// GET /api/v1/kds/queue - Xem danh sách món đang chờ pha chế
kdsRouter.get(
  '/queue',
  validatePipe(QueryKdsQueueSchema, 'query'),
  controller.getQueue
)

// PATCH /api/v1/kds/items/:orderDetailId/status - Cập nhật trạng thái ly nước (DONE kích hoạt Trigger trừ kho)
kdsRouter.patch(
  '/items/:orderDetailId/status',
  validatePipe(KdsParamSchema, 'params'),
  validatePipe(UpdateItemStatusSchema, 'body'),
  controller.updateItemStatus
)

// POST /api/v1/kds/orders/:orderId/notify-ready - Kích hoạt rung chuông thẻ rung báo khách lấy nước
kdsRouter.post(
  '/orders/:orderId/notify-ready',
  validatePipe(NotifyOrderReadySchema, 'params'),
  controller.notifyReady
)