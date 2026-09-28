import { z } from 'zod';

export const createToppingSchema = z.object({
  name: z.string().min(1, 'Tên topping không được để trống'),
  price: z.number().nonnegative('Giá topping không được âm'),
  isAvailable: z.boolean().optional().default(true),
});

export const updateToppingSchema = createToppingSchema.partial();

export type CreateToppingDto = z.infer<typeof createToppingSchema>;
export type UpdateToppingDto = z.infer<typeof updateToppingSchema>;