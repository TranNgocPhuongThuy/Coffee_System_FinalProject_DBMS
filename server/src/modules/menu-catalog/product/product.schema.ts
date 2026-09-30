import { z } from 'zod'

export const VariantItemSchema = z.object({
  size: z.enum(['S', 'M', 'L', 'XL']),
  price: z.coerce.number().min(0, 'Giá biến thể phải lớn hơn hoặc bằng 0'),
})

export const CreateProductSchema = z.object({
  categoryId: z.coerce.number().int().positive('Mã danh mục không hợp lệ'),
  name: z.string().min(1, 'Tên món không được để trống').max(200),
  description: z.string().optional().nullable(),
  image: z.string().max(500).optional().nullable(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'OUT_OF_STOCK']).default('ACTIVE'),
  variants: z.array(VariantItemSchema).min(1, 'Sản phẩm phải có ít nhất 1 kích thước/biến thể'),
})

export const UpdateProductSchema = z.object({
  categoryId: z.coerce.number().int().positive('Mã danh mục không hợp lệ').optional(),
  name: z.string().min(1, 'Tên món không được để trống').max(200, 'Tên món tối đa 200 ký tự').optional(),
  description: z.string().optional().nullable(),
  image: z.string().max(500, 'Đường dẫn hình ảnh quá dài').optional().nullable(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'OUT_OF_STOCK']).optional(),
  variants: z
    .array(VariantItemSchema)
    .min(1, 'Nếu cập nhật biến thể, sản phẩm phải có ít nhất 1 kích thước/biến thể')
    .optional(),
})

export const ProductParamSchema = z.object({
  id: z.coerce.number().int().positive('ID sản phẩm không hợp lệ'),
})

export const FilterProductQuerySchema = z.object({
  categoryId: z.coerce.number().int().positive().optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'OUT_OF_STOCK']).optional(),
  search: z.string().optional(),
})

export type VariantItemType = z.infer<typeof VariantItemSchema>
export type CreateProductType = z.infer<typeof CreateProductSchema>
export type UpdateProductType = z.infer<typeof UpdateProductSchema>
export type ProductParamType = z.infer<typeof ProductParamSchema>
export type FilterProductQueryType = z.infer<typeof FilterProductQuerySchema>

// DTO aliases for backwards compatibility
export type CreateProductDto = CreateProductType
export type UpdateProductDto = UpdateProductType