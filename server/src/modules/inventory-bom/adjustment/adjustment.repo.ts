import { getPool, sql } from '@/config/database'
import { CreateAdjustmentType, FilterAdjustmentQueryType } from './adjustment.schema'

export class AdjustmentRepo {
  async getAdjustments(filter: FilterAdjustmentQueryType) {
    const pool = await getPool()
    const req = pool.request()
    let query = `
      SELECT 
        ia.id, ia.ingredientId, i.name AS ingredientName, i.unit,
        ia.employeeId, e.fullName AS employeeName,
        ia.oldQuantity, ia.newQuantity, ia.difference, ia.reason, ia.adjustmentDate
      FROM InventoryAdjustment ia
      JOIN Ingredient i ON ia.ingredientId = i.id
      JOIN Employee e ON ia.employeeId = e.id
      WHERE 1=1
    `
    if (filter.ingredientId) {
      req.input('ingredientId', sql.Int, filter.ingredientId)
      query += ' AND ia.ingredientId = @ingredientId'
    }
    if (filter.fromDate) {
      req.input('fromDate', sql.Date, filter.fromDate)
      query += ' AND CAST(ia.adjustmentDate AS DATE) >= @fromDate'
    }
    if (filter.toDate) {
      req.input('toDate', sql.Date, filter.toDate)
      query += ' AND CAST(ia.adjustmentDate AS DATE) <= @toDate'
    }
    query += ' ORDER BY ia.adjustmentDate DESC'
    const result = await req.query(query)
    return result.recordset
  }

  async createAdjustmentWithTransaction(data: CreateAdjustmentType) {
    const pool = await getPool()
    const req = pool.request()
    req.input('ingredientId', sql.Int, data.ingredientId)
    req.input('employeeId', sql.Int, data.employeeId)
    req.input('newQuantity', sql.Decimal(18, 3), data.newQuantity)
    req.input('reason', sql.NVarChar(500), data.reason)

    const result = await req.execute('sp_DieuChinhTonKho')
    return result.recordset[0]
  }
}