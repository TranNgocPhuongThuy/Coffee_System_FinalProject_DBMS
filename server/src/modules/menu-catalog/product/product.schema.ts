import { z } from 'zod';

export const variantSchema = z.object({
  sizeName: z.string().min(1, 'Tên size không được để trống'),
  priceAdjustment: z.number().default(0),
  isDefault: z.boolean().optional().default(false),
});

export const createProductSchema = z.object({
  categoryId: z.string().uuid('ID danh mục không hợp lệ'),
  code: z.string().min(1, 'Mã sản phẩm không để trống'),
  name: z.string().min(1, 'Tên sản phẩm không để trống'),
  basePrice: z.number().positive('Giá gốc phải lớn hơn 0'),
  imageUrl: z.string().url().optional(),
  description: z.string().optional(),
  isAvailable: z.boolean().optional().default(true),
  variants: z.array(variantSchema).min(1, 'Sản phẩm phải có ít nhất 1 size'),
  toppingIds: z.array(z.string().uuid()).optional().default([]),
});

export const updateProductSchema = createProductSchema.partial();

export type CreateProductDto = z.infer<typeof createProductSchema>;
export type UpdateProductDto = z.infer<typeof updateProductSchema>;