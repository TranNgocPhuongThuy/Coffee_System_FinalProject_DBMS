import { z } from 'zod'

export const CreateCategorySchema = z.object({
  name: z.string().min(1, 'Tên danh mục không được để trống').max(150),
  displayStatus: z.enum(['SHOW', 'HIDE']).default('SHOW'),
})

export const UpdateCategorySchema = CreateCategorySchema.partial()

export const CategoryParamSchema = z.object({
  id: z.coerce.number().int().positive('ID danh mục không hợp lệ'),
})

export type CreateCategoryType = z.infer<typeof CreateCategorySchema>
export type UpdateCategoryType = z.infer<typeof UpdateCategorySchema>
export type CategoryParamType = z.infer<typeof CategoryParamSchema>

// DTO aliases for compatibility
export type CreateCategoryDto = CreateCategoryType
export type UpdateCategoryDto = UpdateCategoryType