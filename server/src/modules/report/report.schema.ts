import { z } from 'zod'

const BaseDateRangeSchema = z.object({
    fromDate: z.coerce.date().optional(),
    toDate: z.coerce.date().optional(),
})

export const DateRangeReportSchema = BaseDateRangeSchema.refine(
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

export const TopProductsQuerySchema = BaseDateRangeSchema.extend({
    limit: z.coerce
        .number()
        .int()
        .positive()
        .max(100)
        .default(5),
}).refine(
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

export type DateRangeReportType = z.infer<typeof DateRangeReportSchema>

export type TopProductsQueryType = z.infer<typeof TopProductsQuerySchema>
