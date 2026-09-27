import { z } from 'zod'

// Schema cho RecipeBOM (Biến thể sản phẩm)
export const RecipeBOMSchema = z.object({
  variantId: z.coerce.number().int().positive('variantId phải là số nguyên dương'),
  ingredientId: z.coerce.number().int().positive('ingredientId phải là số nguyên dương'),
  consumedQuantity: z.coerce.number().positive('Định mức tiêu hao phải > 0'),
})

// Schema cho ToppingBOM (Topping)
export const ToppingBOMSchema = z.object({
  toppingId: z.coerce.number().int().positive('toppingId phải là số nguyên dương'),
  ingredientId: z.coerce.number().int().positive('ingredientId phải là số nguyên dương'),
  consumedQuantity: z.coerce.number().positive('Định mức tiêu hao phải > 0'),
})

// Query lấy BOM theo variantId
export const GetVariantBOMQuerySchema = z.object({
  variantId: z.coerce.number().int().positive().optional(),
})

export type RecipeBOMType = z.infer<typeof RecipeBOMSchema>
export type ToppingBOMType = z.infer<typeof ToppingBOMSchema>