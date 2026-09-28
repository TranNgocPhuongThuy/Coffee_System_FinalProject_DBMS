import { z } from 'zod'

export const DateRangeReportSchema = z.object({
    fromDate: z.string().optional(),
    toDate: z.string().optional(),
})

export const TopProductsQuerySchema = DateRangeReportSchema.extend({
    limit: z.coerce.number().int().positive().default(5),
})

export type DateRangeReportType = z.infer<typeof DateRangeReportSchema>
export type TopProductsQueryType = z.infer<typeof TopProductsQuerySchema>