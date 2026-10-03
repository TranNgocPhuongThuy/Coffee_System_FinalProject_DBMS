import { z } from 'zod'

// 1. Schema trạng thái thẻ rung
export const PagerStatusEnum = z.enum(['AVAILABLE', 'IN_USE', 'CHARGING', 'MAINTENANCE'])

// 2. Schema tạo mới thiết bị thẻ rung
export const CreatePagerSchema = z.object({
  pagerCode: z
    .string()
    .min(1, 'Mã thẻ rung không được để trống')
    .max(50, 'Mã thẻ rung tối đa 50 ký tự'),
  status: PagerStatusEnum.default('AVAILABLE'),
  batteryLevel: z
    .number()
    .int('Mức pin phải là số nguyên')
    .min(0, 'Mức pin tối thiểu 0%')
    .max(100, 'Mức pin tối đa 100%')
    .default(100),
})

// 3. Schema cập nhật thông tin thiết bị thẻ rung
export const UpdatePagerSchema = z.object({
  pagerCode: z.string().min(1, 'Mã thẻ rung không được để trống').max(50).optional(),
  status: PagerStatusEnum.optional(),
  batteryLevel: z
    .number()
    .int('Mức pin phải là số nguyên')
    .min(0, 'Mức pin tối thiểu 0%')
    .max(100, 'Mức pin tối đa 100%')
    .optional(),
})

// 4. Schema cập nhật nhanh trạng thái thẻ
export const UpdatePagerStatusSchema = z.object({
  status: PagerStatusEnum,
})

// 5. Schema cập nhật mức pin
export const UpdateBatterySchema = z.object({
  batteryLevel: z
    .number()
    .int('Mức pin phải là số nguyên')
    .min(0, 'Mức pin tối thiểu 0%')
    .max(100, 'Mức pin tối đa 100%'),
})

// 6. Schema Params
export const PagerParamSchema = z.object({
  id: z.coerce.number().int().positive('ID thẻ rung không hợp lệ'),
})

// 7. Schema Filter Query
export const FilterPagerQuerySchema = z.object({
  search: z.string().optional(), // Tìm theo pagerCode
  status: PagerStatusEnum.optional(),
  minBattery: z.coerce.number().int().min(0).max(100).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().default(20),
})

export type PagerStatusType = z.infer<typeof PagerStatusEnum>
export type CreatePagerType = z.infer<typeof CreatePagerSchema>
export type UpdatePagerType = z.infer<typeof UpdatePagerSchema>
export type UpdatePagerStatusType = z.infer<typeof UpdatePagerStatusSchema>
export type UpdateBatteryType = z.infer<typeof UpdateBatterySchema>
export type FilterPagerQueryType = z.infer<typeof FilterPagerQuerySchema>
