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

export const FilterLoyaltyHistoryQuerySchema = z
    .object({
        customerId: z.coerce.number().int().positive().optional(),
        orderId: z.coerce.number().int().positive().optional(),
        transactionType: z.enum(['EARN', 'REDEEM']).optional(),
        fromDate: z.coerce.date().optional(),
        toDate: z.coerce.date().optional(),
        page: z.coerce.number().int().positive().default(1),
        limit: z.coerce
            .number()
            .int()
            .positive()
            .max(100)
            .default(20),
    })
    .refine(
        data => {
            if (data.fromDate && data.toDate) {
                return data.fromDate <= data.toDate
            }
            return true
        },
        {
            message: 'fromDate must be less than or equal to toDate',
            path: ['toDate'],
        },
    )

export type AdjustPointsType = z.infer<typeof AdjustPointsSchema>
export type FilterLoyaltyHistoryQueryType = z.infer<typeof FilterLoyaltyHistoryQuerySchema>