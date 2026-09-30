import { getPool, sql } from '@/config/database'
import { QueryImportTicketType } from './import.schema'

export class ImportRepo {
  async findAll(query: QueryImportTicketType) {
    const pool = await getPool()
    const req = pool.request()
    let sqlStr = `
      SELECT ii.*, e.fullName AS employeeName 
      FROM InventoryImport ii
      JOIN Employee e ON ii.employeeId = e.id
      WHERE 1=1
    `
    if (query.supplierName) {
      req.input('supplierName', sql.NVarChar(255), `%${query.supplierName}%`)
      sqlStr += ' AND ii.supplierName LIKE @supplierName'
    }
    sqlStr += ' ORDER BY ii.importDate DESC'
    const result = await req.query(sqlStr)
    return result.recordset
  }

  async findById(id: number) {
    const pool = await getPool()
    const req = pool.request()
    req.input('id', sql.Int, id)
    const result = await req.query('SELECT * FROM InventoryImport WHERE id = @id')
    return result.recordset[0] || null
  }

  async findDetailsByImportId(importId: number) {
    const pool = await getPool()
    const req = pool.request()
    req.input('importId', sql.Int, importId)
    const query = `
      SELECT iid.*, i.name AS ingredientName, i.unit
      FROM InventoryImportDetail iid
      JOIN Ingredient i ON iid.ingredientId = i.id
      WHERE iid.importId = @importId
    `
    const result = await req.query(query)
    return result.recordset
  }

  async createImportTicketWithProcedure(data: any) {
    const pool = await getPool()
    const transaction = new sql.Transaction(pool)
    await transaction.begin()
    try {
      const headerReq = new sql.Request(transaction)
      headerReq.input('employeeId', sql.Int, data.employeeId)
      headerReq.input('supplierName', sql.NVarChar(255), data.supplierName)
      headerReq.input('totalAmount', sql.Decimal(18, 2), data.totalAmount)
      headerReq.input('note', sql.NVarChar(sql.MAX), data.note || null)

      const headerRes = await headerReq.query(`
        INSERT INTO InventoryImport (employeeId, supplierName, totalAmount, importDate, note)
        OUTPUT INSERTED.id
        VALUES (@employeeId, @supplierName, @totalAmount, SYSDATETIME(), @note)
      `)
      const importId = headerRes.recordset[0].id

      for (const item of data.details) {
        const detailReq = new sql.Request(transaction)
        const lineTotal = item.quantity * item.unitPrice
        detailReq.input('importId', sql.Int, importId)
        detailReq.input('ingredientId', sql.Int, item.ingredientId)
        detailReq.input('quantity', sql.Decimal(18, 3), item.quantity)
        detailReq.input('unitPrice', sql.Decimal(18, 2), item.unitPrice)
        detailReq.input('totalLineAmount', sql.Decimal(18, 2), lineTotal)

        // Trigger trg_Ingredient_CongKho_KhiNhapHang sẽ tự động cộng dồn kho sau câu lệnh INSERT này
        await detailReq.query(`
          INSERT INTO InventoryImportDetail (importId, ingredientId, quantity, unitPrice, totalLineAmount)
          VALUES (@importId, @ingredientId, @quantity, @unitPrice, @totalLineAmount)
        `)
      }

      await transaction.commit()
      return { importId, ...data }
    } catch (err) {
      await transaction.rollback()
      throw err
    }
  }
}