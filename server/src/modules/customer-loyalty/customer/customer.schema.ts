import { z } from 'zod'

export const CreateCustomerSchema = z.object({
    fullName: z.string().min(2, 'Tên khách hàng tối thiểu 2 ký tự').max(150),
    phoneNumber: z
        .string()
        .regex(/^(0|\+84)(3|5|7|8|9)[0-9]{8}$/, 'Số điện thoại không hợp lệ'),
    password: z.string().min(6, 'Mật khẩu tối thiểu 6 ký tự').optional().nullable(),
})

export const UpdateCustomerSchema = CreateCustomerSchema.partial()

export const CustomerParamSchema = z.object({
    id: z.coerce.number().int().positive('ID khách hàng không hợp lệ'),
})

export const FilterCustomerQuerySchema = z.object({
    search: z.string().optional(), // Tìm theo fullName hoặc phoneNumber
    membershipTier: z.enum(['STANDARD', 'SILVER', 'GOLD', 'DIAMOND']).optional(),
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(20),
})

export type CreateCustomerType = z.infer<typeof CreateCustomerSchema>
export type UpdateCustomerType = z.infer<typeof UpdateCustomerSchema>
export type FilterCustomerQueryType = z.infer<typeof FilterCustomerQuerySchema>
