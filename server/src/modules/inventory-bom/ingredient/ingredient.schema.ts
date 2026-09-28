import { z } from 'zod'

export const CreateIngredientSchema = z.object({
  name: z.string().min(2, 'Tên nguyên liệu tối thiểu 2 ký tự').max(100),
  unit: z.string().min(1, 'Đơn vị tính không được để trống').max(20),
  stockQuantity: z.coerce.number().min(0, 'Số lượng tồn kho ban đầu phải >= 0').default(0),
  minimumThreshold: z.coerce.number().min(0, 'Ngưỡng cảnh báo tối thiểu phải >= 0').default(5),
})

export const UpdateIngredientSchema = CreateIngredientSchema.partial()

export const IngredientParamsSchema = z.object({
  ingredientId: z.coerce.number().int().positive('Mã nguyên liệu không hợp lệ'),
})

export const QueryIngredientSchema = z.object({
  name: z.string().optional(),
  isLowStock: z
    .preprocess((val) => val === 'true' || val === true, z.boolean())
    .optional(),
})

export type CreateIngredientType = z.infer<typeof CreateIngredientSchema>
export type UpdateIngredientType = z.infer<typeof UpdateIngredientSchema>
export type IngredientParamsType = z.infer<typeof IngredientParamsSchema>
export type QueryIngredientType = z.infer<typeof QueryIngredientSchema>