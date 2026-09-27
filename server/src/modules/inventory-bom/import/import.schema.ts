import { z } from 'zod'

export const ImportDetailItemSchema = z.object({
  ingredientId: z.coerce.number().int().positive('Mã nguyên liệu không hợp lệ'),
  quantity: z.coerce.number().positive('Số lượng nhập phải lớn hơn 0'),
  unitPrice: z.coerce.number().min(0, 'Đơn giá nhập phải >= 0'),
})

export const CreateImportTicketSchema = z.object({
  supplierName: z.string().min(2, 'Tên nhà cung cấp tối thiểu 2 ký tự').max(150),
  employeeId: z.coerce.number().int().positive('Mã nhân viên thủ kho không hợp lệ'),
  note: z.string().max(255).optional(),
  details: z
    .array(ImportDetailItemSchema)
    .min(1, 'Phiếu nhập kho phải chứa ít nhất một mặt hàng nguyên liệu'),
})

export const ImportTicketParamsSchema = z.object({
  importId: z.coerce.number().int().positive('Mã phiếu nhập không hợp lệ'),
})

export const QueryImportTicketSchema = z.object({
  supplierName: z.string().optional(),
  fromDate: z.string().optional(),
  toDate: z.string().optional(),
})

export type ImportDetailItemType = z.infer<typeof ImportDetailItemSchema>
export type CreateImportTicketType = z.infer<typeof CreateImportTicketSchema>
export type ImportTicketParamsType = z.infer<typeof ImportTicketParamsSchema>
export type QueryImportTicketType = z.infer<typeof QueryImportTicketSchema>