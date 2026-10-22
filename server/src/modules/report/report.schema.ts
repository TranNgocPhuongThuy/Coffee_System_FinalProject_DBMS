import { z } from 'zod'

const BaseDateRangeRawSchema = z.object({
    fromDate: z.coerce.date().optional(),
    toDate: z.coerce.date().optional(),
})

const validateNoFutureDate = (data: { fromDate?: Date; toDate?: Date }) => {
    const endOfToday = new Date()
    endOfToday.setHours(23, 59, 59, 999)
    if (data.fromDate && data.fromDate > endOfToday) return false
    if (data.toDate && data.toDate > endOfToday) return false
    return true
}

const validateFromBeforeTo = (data: { fromDate?: Date; toDate?: Date }) => {
    if (data.fromDate && data.toDate) {
        return data.fromDate <= data.toDate
    }
    return true
}

export const DateRangeReportSchema = BaseDateRangeRawSchema
    .refine(validateNoFutureDate, {
        message: 'Khoảng thời gian báo cáo không được vượt quá ngày hiện tại',
        path: ['toDate'],
    })
    .refine(validateFromBeforeTo, {
        message: 'fromDate must be less than or equal to toDate',
        path: ['toDate'],
    })

export const TopProductsQuerySchema = BaseDateRangeRawSchema
    .extend({
        limit: z.coerce
            .number()
            .int()
            .positive()
            .max(100)
            .default(5),
    })
    .refine(validateNoFutureDate, {
        message: 'Khoảng thời gian báo cáo không được vượt quá ngày hiện tại',
        path: ['toDate'],
    })
    .refine(validateFromBeforeTo, {
        message: 'fromDate must be less than or equal to toDate',
        path: ['toDate'],
    })

export type DateRangeReportType = z.infer<typeof DateRangeReportSchema>

export type TopProductsQueryType = z.infer<typeof TopProductsQuerySchema>
