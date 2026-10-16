import { z } from 'zod'

// 1. Schema cho Topping của món
export const OrderItemToppingSchema = z.object({
  toppingId: z.number().int().positive().optional().nullable(),
  toppingSnapshotName: z.string().min(1, 'Tên topping không được để trống').max(150),
  toppingPrice: z.number().nonnegative('Giá topping phải >= 0'),
  quantity: z.number().int().positive('Số lượng topping phải >= 1').default(1),
})

// 2. Schema cho từng món trong đơn hàng
export const OrderItemSchema = z.object({
  variantId: z.number().int().positive('ID phân loại món không hợp lệ'),
  quantity: z.number().int().positive('Số lượng món phải >= 1'),
  note: z.string().max(255, 'Ghi chú tối đa 255 ký tự').optional().nullable(),
  itemSnapshotName: z.string().min(1, 'Tên món không được để trống').max(200),
  sizeSnapshot: z.string().min(1, 'Size không được để trống').max(50),
  unitPrice: z.number().nonnegative('Đơn giá phải >= 0'),
  totalToppingPriceSnapshot: z.number().nonnegative('Tổng tiền topping phải >= 0').default(0),
  totalPrice: z.number().nonnegative('Tổng tiền món phải >= 0'),
  toppings: z.array(OrderItemToppingSchema).optional().default([]),
})

// 3. Schema tạo đơn hàng tại quầy (POS Order)
export const CreateOrderSchema = z.object({
  orderCode: z.string().max(64).optional(),
  employeeId: z.number().int().positive('ID nhân viên không hợp lệ'),
  customerId: z.number().int().positive('ID khách hàng không hợp lệ').optional().nullable(),
  pagerId: z.number().int().positive('ID thẻ rung không hợp lệ').optional().nullable(),
  pagerCode: z.string().max(50).optional().nullable(), // Mã thẻ rung nếu gán bằng mã thẻ
  orderChannel: z.enum(['POS', 'APP', 'DELIVERY', 'ORDER_AT_COUNTER']).default('ORDER_AT_COUNTER'),
  subTotal: z.number().nonnegative('Tạm tính phải >= 0'),
  discountAmount: z.number().nonnegative('Tiền giảm giá phải >= 0').default(0),
  totalAmount: z.number().nonnegative('Tổng tiền thanh toán phải >= 0'),
  paymentMethod: z.enum(['CASH', 'BANK_TRANSFER', 'CARD', 'MOMO', 'VNPAY', 'POINT_EXCHANGE']).default('CASH'),
  items: z.array(OrderItemSchema).min(1, 'Đơn hàng phải có ít nhất 1 món'),
})

// 4. Schema hoàn tất thanh toán
export const CompletePaymentSchema = z.object({
  paymentMethod: z.enum(['CASH', 'BANK_TRANSFER', 'CARD', 'MOMO', 'VNPAY', 'POINT_EXCHANGE'], {
    required_error: 'Phương thức thanh toán là bắt buộc',
  }),
})

// 5. Schema hủy đơn hàng
export const CancelOrderSchema = z.object({
  employeeId: z.number().int().positive('ID nhân viên hủy đơn là bắt buộc'),
  cancelReason: z.string().min(1, 'Lý do hủy đơn không được để trống').max(500, 'Lý do tối đa 500 ký tự'),
})

// 6. Schema áp dụng điểm thưởng trừ tiền
export const ApplyLoyaltyPointsSchema = z.object({
  customerId: z.number().int().positive('ID khách hàng là bắt buộc'),
  pointsToRedeem: z.number().int().positive('Số điểm đổi phải lớn hơn 0'),
  conversionRate: z.number().positive().default(1000), // Mặc định 1 điểm = 1.000 VNĐ
})

// 7. Schema Params
export const OrderParamSchema = z.object({
  id: z.coerce.number().int().positive('ID đơn hàng không hợp lệ'),
})

export const OrderDetailParamSchema = z.object({
  detailId: z.coerce.number().int().positive('ID chi tiết đơn hàng không hợp lệ'),
})

// 8. Schema Filter Query
export const FilterOrderQuerySchema = z.object({
  search: z.string().optional(), // Tìm theo orderCode, customerName, customerPhone
  status: z.enum(['PENDING_PREP', 'PREPARING', 'READY_FOR_PICKUP', 'COMPLETED', 'CANCELLED']).optional(),
  paymentMethod: z.string().optional(),
  orderChannel: z.string().optional(),
  employeeId: z.coerce.number().int().positive().optional(),
  customerId: z.coerce.number().int().positive().optional(),
  fromDate: z.string().optional(),
  toDate: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().default(20),
})

export type OrderItemToppingType = z.infer<typeof OrderItemToppingSchema>
export type OrderItemType = z.infer<typeof OrderItemSchema>
export type CreateOrderType = z.infer<typeof CreateOrderSchema>
export type CompletePaymentType = z.infer<typeof CompletePaymentSchema>
export type CancelOrderType = z.infer<typeof CancelOrderSchema>
export type ApplyLoyaltyPointsType = z.infer<typeof ApplyLoyaltyPointsSchema>
export type FilterOrderQueryType = z.infer<typeof FilterOrderQuerySchema>
