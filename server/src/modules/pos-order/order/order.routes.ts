import { Router } from 'express'
import { OrderController } from './order.controller'

export const orderRouter = Router()
const controller = new OrderController()

// 1. Lấy danh sách đơn hàng có phân trang & bộ lọc
orderRouter.get('/', controller.list)

// 2. Tạo đơn hàng mới tại quầy (hoặc kèm thẻ rung)
orderRouter.post('/', controller.create)

// 3. Xóa món khỏi đơn hàng
orderRouter.delete('/items/:detailId', controller.removeItem)

// 4. Lấy chi tiết đơn hàng
orderRouter.get('/:id', controller.detail)

// 5. Xuất hóa đơn chi tiết phục vụ in ấn từ View v_InvoiceDetails
orderRouter.get('/:id/invoice', controller.invoice)

// 6. Hoàn tất thanh toán đơn hàng & tích điểm
orderRouter.patch('/:id/pay', controller.completePayment)

// 7. Hủy đơn hàng & giải phóng thẻ rung
orderRouter.patch('/:id/cancel', controller.cancel)

// 8. Đổi điểm thưởng hội viên lấy chiết khấu giảm giá đơn hàng
orderRouter.post('/:id/apply-points', controller.applyPoints)
