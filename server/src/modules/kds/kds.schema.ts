import { z } from 'zod'

// Query lọc màn hình KDS
export const QueryKdsQueueSchema = z.object({
  status: z.enum(['ALL', 'PENDING', 'PREPARING']).default('ALL'),
})

// Cập nhật trạng thái từng ly nước
export const UpdateItemStatusSchema = z.object({
  itemStatus: z.enum(['PREPARING', 'DONE', 'CANCELLED'], {
    errorMap: () => ({ message: 'Trạng thái món phải là PREPARING, DONE hoặc CANCELLED' }),
  }),
})

export const KdsParamSchema = z.object({
  orderDetailId: z.coerce.number().int().positive('orderDetailId không hợp lệ'),
})

export const NotifyOrderReadySchema = z.object({
  orderId: z.coerce.number().int().positive('orderId không hợp lệ'),
})

export type QueryKdsQueueType = z.infer<typeof QueryKdsQueueSchema>
export type UpdateItemStatusType = z.infer<typeof UpdateItemStatusSchema>