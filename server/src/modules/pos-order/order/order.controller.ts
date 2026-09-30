import { NextFunction, Request, Response } from 'express'
import { OrderService } from './order.service'
import {
  ApplyLoyaltyPointsSchema,
  CancelOrderSchema,
  CompletePaymentSchema,
  CreateOrderSchema,
  FilterOrderQuerySchema,
  OrderDetailParamSchema,
  OrderParamSchema,
} from './order.schema'

export class OrderController {
  private orderService = new OrderService()

  /**
   * Lấy danh sách đơn hàng có phân trang & bộ lọc
   */
  list = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const query = FilterOrderQuerySchema.parse(req.query)
      const result = await this.orderService.getOrders(query)
      res.status(200).json({ success: true, ...result })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Lấy thông tin chi tiết đơn hàng
   */
  detail = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = OrderParamSchema.parse(req.params)
      const data = await this.orderService.getOrderById(id)
      res.status(200).json({ success: true, data })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Xuất hóa đơn chi tiết phục vụ in ấn từ View v_InvoiceDetails
   */
  invoice = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = OrderParamSchema.parse(req.params)
      const data = await this.orderService.getInvoice(id)
      res.status(200).json({ success: true, data })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Tạo đơn hàng mới tại quầy POS
   */
  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = CreateOrderSchema.parse(req.body)
      const result = await this.orderService.createOrder(body)
      res.status(201).json({ success: true, ...result })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Hoàn tất thanh toán đơn hàng & tích điểm
   */
  completePayment = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = OrderParamSchema.parse(req.params)
      const body = CompletePaymentSchema.parse(req.body)
      const result = await this.orderService.completePayment(id, body)
      res.status(200).json({ success: true, ...result })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Hủy đơn hàng & giải phóng thẻ rung
   */
  cancel = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = OrderParamSchema.parse(req.params)
      const body = CancelOrderSchema.parse(req.body)
      const result = await this.orderService.cancelOrder(id, body)
      res.status(200).json({ success: true, ...result })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Đổi điểm thưởng hội viên lấy chiết khấu giảm giá đơn hàng
   */
  applyPoints = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = OrderParamSchema.parse(req.params)
      const body = ApplyLoyaltyPointsSchema.parse(req.body)
      const result = await this.orderService.applyLoyaltyPoints(id, body)
      res.status(200).json({ success: true, ...result })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Xóa một món khỏi đơn hàng chưa chế biến
   */
  removeItem = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { detailId } = OrderDetailParamSchema.parse(req.params)
      const result = await this.orderService.removeOrderItem(detailId)
      res.status(200).json({ success: true, ...result })
    } catch (error) {
      next(error)
    }
  }
}
