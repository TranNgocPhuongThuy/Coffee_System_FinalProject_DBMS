import { z } from 'zod'

export const CreateAdjustmentSchema = z.object({
  ingredientId: z.coerce.number().int().positive('ingredientId không hợp lệ'),
  employeeId: z.coerce.number().int().positive('employeeId không hợp lệ'),
  newQuantity: z.coerce.number().min(0, 'Số lượng kiểm kê thực tế phải >= 0'),
  reason: z.string().min(3, 'Lý do điều chỉnh tối thiểu 3 ký tự').max(255),
})

export const FilterAdjustmentQuerySchema = z.object({
  ingredientId: z.coerce.number().int().positive().optional(),
  fromDate: z.string().optional(),
  toDate: z.string().optional(),
})

export type CreateAdjustmentType = z.infer<typeof CreateAdjustmentSchema>
export type FilterAdjustmentQueryType = z.infer<typeof FilterAdjustmentQuerySchema>