import { z } from 'zod'

export const CreateCategorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Tên danh mục không được để trống')
    .max(150, 'Tên danh mục tối đa 150 ký tự'),
  displayStatus: z.enum(['SHOW', 'HIDE']).default('SHOW'),
})

export const UpdateCategorySchema = CreateCategorySchema.partial()

export const CategoryParamSchema = z.object({
  id: z.coerce.number().int().positive('ID danh mục không hợp lệ'),
})

export const FilterCategoryQuerySchema = z.object({
  displayStatus: z.enum(['SHOW', 'HIDE']).optional(),
  search: z.string().trim().optional(),
})

export type CreateCategoryType = z.infer<typeof CreateCategorySchema>
export type UpdateCategoryType = z.infer<typeof UpdateCategorySchema>
export type CategoryParamType = z.infer<typeof CategoryParamSchema>
export type FilterCategoryQueryType = z.infer<typeof FilterCategoryQuerySchema>

// DTO aliases for compatibility
export type CreateCategoryDto = CreateCategoryType
export type UpdateCategoryDto = UpdateCategoryType