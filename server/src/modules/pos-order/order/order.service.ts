import { OrderRepo } from './order.repo'
import {
  ApplyLoyaltyPointsType,
  CancelOrderType,
  CompletePaymentType,
  CreateOrderType,
  FilterOrderQueryType,
} from './order.schema'

export class OrderService {
  private orderRepo = new OrderRepo()

  /**
   * Sinh mã hóa đơn tự động chuẩn POS: ORD-YYYYMMDD-XXXX
   */
  private generateOrderCode(): string {
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')
    const dateStr = `${year}${month}${day}`
    const randomSuffix = Math.floor(1000 + Math.random() * 9000)
    return `ORD-${dateStr}-${randomSuffix}`
  }

  /**
   * Lấy danh sách đơn hàng có phân trang & lọc
   */
  async getOrders(filter: FilterOrderQueryType) {
    return await this.orderRepo.getOrders(filter)
  }

  /**
   * Lấy chi tiết đơn hàng theo ID
   */
  async getOrderById(id: number) {
    const order = await this.orderRepo.getOrderById(id)
    if (!order) {
      throw new Error(`Đơn hàng #${id} không tồn tại hoặc đã bị xóa`)
    }
    return order
  }

  /**
   * Lấy thông tin hóa đơn phục vụ in ấn từ View v_InvoiceDetails
   */
  async getInvoice(id: number) {
    const rows = await this.orderRepo.getInvoiceDetails(id)
    if (!rows || rows.length === 0) {
      throw new Error(`Không tìm thấy hóa đơn cho đơn hàng #${id}`)
    }

    const first = rows[0]
    return {
      orderId: first.orderId,
      orderCode: first.orderCode,
      orderChannel: first.orderChannel,
      orderStatus: first.orderStatus,
      paymentMethod: first.paymentMethod,
      subTotal: first.subTotal,
      discountAmount: first.discountAmount,
      totalAmount: first.totalAmount,
      paidAt: first.paidAt,
      orderCreatedAt: first.orderCreatedAt,
      employeeName: first.employeeName,
      customerName: first.customerName,
      customerPhone: first.customerPhone,
      items: rows.map((r: any) => ({
        orderDetailId: r.orderDetailId,
        itemSnapshotName: r.itemSnapshotName,
        sizeSnapshot: r.sizeSnapshot,
        quantity: r.quantity,
        unitPrice: r.unitPrice,
        totalToppingPriceSnapshot: r.totalToppingPriceSnapshot,
        lineTotalPrice: r.lineTotalPrice,
        itemStatus: r.itemStatus,
        itemNote: r.itemNote,
      })),
    }
  }

  /**
   * Tạo đơn hàng mới tại quầy POS
   */
  async createOrder(data: CreateOrderType) {
    if (!data.orderCode) data.orderCode = this.generateOrderCode()
    if (data.pagerId) {
      const isAvailable = await this.orderRepo.isPagerAvailable(data.pagerId)
      if (!isAvailable) throw new Error(`Thẻ rung #${data.pagerId} hiện không khả dụng hoặc pin < 15%`)
    }

    let newOrderId: number
    if (data.pagerCode && data.pagerCode.trim().length > 0) {
      newOrderId = await this.orderRepo.createOrderWithPager(data)
    } else {
      newOrderId = await this.orderRepo.createCounterOrder(data)
    }



    const createdOrder = await this.getOrderById(newOrderId)
    return {
      message: 'Tạo đơn hàng POS thành công',
      orderId: newOrderId,
      data: createdOrder,
    }
  }

  /**
   * Hoàn tất thanh toán đơn hàng & tự động tích điểm hội viên
   */
  async completePayment(orderId: number, body: CompletePaymentType) {
  const order = await this.getOrderById(orderId);
  if (order.status === 'CANCELLED') {
    throw new Error('Không thể hoàn tất đơn hàng đã bị hủy');
  }
  // CHỈ chặn khi đơn ĐÃ HOÀN TẤT (bỏ điều kiện || order.paidAt)
  if (order.status === 'COMPLETED') {
    throw new Error('Đơn hàng này đã hoàn tất trước đó');
  }

  await this.orderRepo.completeOrderPayment(orderId, body.paymentMethod);
  const updatedOrder = await this.getOrderById(orderId);

  return {
    message: 'Hoàn tất đơn hàng thành công',
    data: updatedOrder,
  };
}

  /**
   * Hủy đơn hàng và tự động giải phóng thẻ rung
   */
  async cancelOrder(orderId: number, body: CancelOrderType) {
    const order = await this.getOrderById(orderId)
    if (order.status === 'COMPLETED') {
      throw new Error('Không thể hủy đơn hàng đã hoàn tất!')
    }
    if (order.status === 'CANCELLED') {
      throw new Error('Đơn hàng này đã bị hủy trước đó!')
    }

    await this.orderRepo.cancelOrder(orderId, body.employeeId, body.cancelReason)
    const updatedOrder = await this.getOrderById(orderId)

    return {
      message: 'Hủy đơn hàng và giải phóng thẻ rung thành công',
      data: updatedOrder,
    }
  }

  /**
   * Áp dụng điểm thưởng hội viên để giảm giá đơn hàng
   */
  async applyLoyaltyPoints(orderId: number, body: ApplyLoyaltyPointsType) {
    const order = await this.getOrderById(orderId)
    if (order.status === 'COMPLETED' || order.status === 'CANCELLED') {
      throw new Error('Chỉ có thể áp dụng điểm thưởng cho đơn hàng đang xử lý')
    }

    await this.orderRepo.applyLoyaltyPoints(
      orderId,
      body.customerId,
      body.pointsToRedeem,
      body.conversionRate
    )

    const updatedOrder = await this.getOrderById(orderId)

    return {
      message: 'Áp dụng điểm thưởng đổi chiết khấu thành công',
      data: updatedOrder,
    }
  }

  /**
   * Xóa món khỏi đơn hàng chưa chế biến
   */
  async removeOrderItem(orderDetailId: number) {
    await this.orderRepo.removeOrderItem(orderDetailId)
    return {
      message: 'Xóa món khỏi đơn hàng thành công',
    }
  }
}
