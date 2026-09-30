import { z } from 'zod'

export const CreateToppingSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Tên topping không được để trống')
    .max(150, 'Tên topping tối đa 150 ký tự'),
  price: z.coerce.number().min(0, 'Giá topping phải lớn hơn hoặc bằng 0'),
  status: z.enum(['AVAILABLE', 'UNAVAILABLE', 'ACTIVE']).default('AVAILABLE'),
})

export const UpdateToppingSchema = CreateToppingSchema.partial()

export const ToppingParamSchema = z.object({
  id: z.coerce.number().int().positive('ID topping không hợp lệ'),
})

export const FilterToppingQuerySchema = z.object({
  status: z.enum(['AVAILABLE', 'UNAVAILABLE', 'ACTIVE']).optional(),
  search: z.string().trim().optional(),
})

export type CreateToppingType = z.infer<typeof CreateToppingSchema>
export type UpdateToppingType = z.infer<typeof UpdateToppingSchema>
export type ToppingParamType = z.infer<typeof ToppingParamSchema>
export type FilterToppingQueryType = z.infer<typeof FilterToppingQuerySchema>