import { z } from 'zod'

export const AdjustPointsSchema = z.object({
    customerId: z.coerce.number().int().positive('customerId không hợp lệ'),
    orderId: z.coerce.number().int().positive('orderId không hợp lệ').optional().nullable(),
    transactionType: z.enum(['EARN', 'REDEEM'], {
        errorMap: () => ({ message: 'transactionType phải là EARN hoặc REDEEM' }),
    }),
    points: z.coerce.number().int().positive('Số điểm thay đổi phải lớn hơn 0'),
    description: z.string().max(500).optional().nullable(),
})

export const FilterLoyaltyHistoryQuerySchema = z.object({
    customerId: z.coerce.number().int().positive().optional(),
    orderId: z.coerce.number().int().positive().optional(),
    transactionType: z.enum(['EARN', 'REDEEM']).optional(),
    fromDate: z.string().optional(),
    toDate: z.string().optional(),
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().default(20),
})

export type AdjustPointsType = z.infer<typeof AdjustPointsSchema>
export type FilterLoyaltyHistoryQueryType = z.infer<typeof FilterLoyaltyHistoryQuerySchema>