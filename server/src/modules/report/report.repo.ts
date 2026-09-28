import { getPool, sql } from '@/config/database'
import { DateRangeReportType, TopProductsQueryType } from './report.schema'

export class ReportRepo {
    // Thống kê tổng quan: Doanh thu, số đơn, số tiền giảm giá
    async getOverviewRevenue(filter: DateRangeReportType) {
        const pool = await getPool()
        const request = pool.request()

        const conditions: string[] = ["status IN ('PAID', 'COMPLETED')", 'deletedAt IS NULL']

        if (filter.fromDate) {
            request.input('fromDate', sql.DateTime2, new Date(filter.fromDate))
            conditions.push('createdAt >= @fromDate')
        }
        if (filter.toDate) {
            request.input('toDate', sql.DateTime2, new Date(filter.toDate))
            conditions.push('createdAt <= @toDate')
        }

        const whereClause = `WHERE ${conditions.join(' AND ')}`
        const query = `
      SELECT 
        COUNT(id) AS totalOrders,
        ISNULL(SUM(subTotal), 0) AS totalSubTotal,
        ISNULL(SUM(discountAmount), 0) AS totalDiscount,
        ISNULL(SUM(totalAmount), 0) AS netRevenue
      FROM [Order]
      ${whereClause}
    `
        const result = await request.query(query)
        return result.recordset[0]
    }

    // Top sản phẩm bán chạy nhất
    async getTopSellingProducts(filter: TopProductsQueryType) {
        const pool = await getPool()
        const request = pool.request()

        const conditions: string[] = [
            "o.status IN ('PAID', 'COMPLETED')",
            'o.deletedAt IS NULL',
            "od.itemStatus NOT IN ('CANCELLED')",
        ]

        if (filter.fromDate) {
            request.input('fromDate', sql.DateTime2, new Date(filter.fromDate))
            conditions.push('o.createdAt >= @fromDate')
        }
        if (filter.toDate) {
            request.input('toDate', sql.DateTime2, new Date(filter.toDate))
            conditions.push('o.createdAt <= @toDate')
        }

        request.input('topLimit', sql.Int, filter.limit || 5)

        const whereClause = `WHERE ${conditions.join(' AND ')}`
        const query = `
      SELECT TOP (@topLimit)
        od.itemSnapshotName AS productName,
        od.sizeSnapshot AS size,
        SUM(od.quantity) AS totalQuantitySold,
        SUM(od.totalPrice) AS totalRevenue
      FROM OrderDetail od
      JOIN [Order] o ON od.orderId = o.id
      ${whereClause}
      GROUP BY od.itemSnapshotName, od.sizeSnapshot
      ORDER BY totalQuantitySold DESC
    `
        const result = await request.query(query)
        return result.recordset
    }

    // Cảnh báo nguyên vật liệu sắp chạm hoặc dưới ngưỡng tối thiểu
    async getLowStockIngredients() {
        const pool = await getPool()
        const request = pool.request()

        const query = `
      SELECT 
        id, 
        name, 
        unit, 
        stockQuantity, 
        minimumThreshold,
        (minimumThreshold - stockQuantity) AS shortageAmount
      FROM Ingredient
      WHERE stockQuantity <= minimumThreshold AND deletedAt IS NULL
      ORDER BY stockQuantity ASC
    `
        const result = await request.query(query)
        return result.recordset
    }
}