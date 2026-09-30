import { getPool, sql } from '@/config/database'
import { DateRangeReportType, TopProductsQueryType } from './report.schema'

export class ReportRepo {
  // Thống kê tổng quan: Doanh thu, số đơn, số tiền giảm giá
  // Sử dụng View v_DailyRevenue và Function fn_GetTotalRevenue
  async getOverviewRevenue(filter: DateRangeReportType) {
    const pool = await getPool()
    const request = pool.request()

    const conditions: string[] = ['1=1']

    if (filter.fromDate) {
      request.input('fromDate', sql.DateTime2, filter.fromDate)
      conditions.push('revenueDate >= CAST(@fromDate AS DATE)')
    }

    if (filter.toDate) {
      request.input('toDate', sql.DateTime2, filter.toDate)
      conditions.push('revenueDate <= CAST(@toDate AS DATE)')
    }

    const whereClause = `WHERE ${conditions.join(' AND ')}`

    let netRevenueExpr = 'ISNULL(SUM(totalNetRevenue), 0)'
    if (filter.fromDate && filter.toDate) {
      netRevenueExpr = 'ISNULL(dbo.fn_GetTotalRevenue(@fromDate, @toDate), 0)'
    }

    const query = `
      SELECT
        ISNULL(SUM(totalOrders), 0) AS totalOrders,
        ISNULL(SUM(totalOriginalAmount), 0) AS totalSubTotal,
        ISNULL(SUM(totalDiscountAmount), 0) AS totalDiscount,
        ${netRevenueExpr} AS netRevenue
      FROM v_DailyRevenue
      ${whereClause}
    `

    const result = await request.query(query)

    return result.recordset[0]
  }

  // Top sản phẩm bán chạy nhất
  // Sử dụng Function fn_GetTopSellingProducts (nếu có từ ngày/đến ngày) hoặc View v_TopSellingProducts
  async getTopSellingProducts(filter: TopProductsQueryType) {
    const pool = await getPool()
    const request = pool.request()

    request.input('topLimit', sql.Int, filter.limit)

    let query: string

    if (filter.fromDate && filter.toDate) {
      request.input('fromDate', sql.DateTime2, filter.fromDate)
      request.input('toDate', sql.DateTime2, filter.toDate)

      query = `
        SELECT
          productName,
          totalQuantitySold,
          totalRevenue
        FROM dbo.fn_GetTopSellingProducts(@topLimit, @fromDate, @toDate)
        ORDER BY totalQuantitySold DESC, totalRevenue DESC
      `
    } else {
      query = `
        SELECT TOP (@topLimit)
          productName,
          totalQuantitySold,
          totalRevenue
        FROM v_TopSellingProducts
        ORDER BY totalQuantitySold DESC, totalRevenue DESC
      `
    }

    const result = await request.query(query)

    return result.recordset
  }

  // Cảnh báo nguyên vật liệu sắp chạm hoặc dưới ngưỡng tối thiểu
  // Sử dụng View v_LowStockIngredients
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
        ABS(chenhLech) AS shortageAmount
      FROM v_LowStockIngredients
      ORDER BY stockQuantity ASC
    `

    const result = await request.query(query)

    return result.recordset
  }
}