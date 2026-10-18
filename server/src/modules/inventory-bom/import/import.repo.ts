import { getPool, sql } from '@/config/database'
import { QueryImportTicketType } from './import.schema'

export class ImportRepo {

   private buildImportDetailTVP(details: any[]): sql.Table {
    const tvp = new sql.Table('udt_InventoryImportDetailList')
    tvp.columns.add('ingredientId', sql.Int, { nullable: false })
    tvp.columns.add('quantity', sql.Decimal(18, 3), { nullable: false })
    tvp.columns.add('unitPrice', sql.Decimal(18, 2), { nullable: false })
    tvp.columns.add('totalLineAmount', sql.Decimal(18, 2), { nullable: false })

    for (const item of details) {
      const lineTotal = item.quantity * item.unitPrice
      tvp.rows.add(item.ingredientId, item.quantity, item.unitPrice, lineTotal)
    }
    return tvp
  }

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
    if (query.fromDate) {
      req.input('fromDate', sql.Date, query.fromDate)
      sqlStr += ' AND CAST(ii.importDate AS DATE) >= @fromDate'
    }
    if (query.toDate) {
      req.input('toDate', sql.Date, query.toDate)
      sqlStr += ' AND CAST(ii.importDate AS DATE) <= @toDate'
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
    const req = pool.request()

    const tvp = this.buildImportDetailTVP(data.details)

    req.input('SupplierName', sql.NVarChar(255), data.supplierName)
    req.input('EmployeeId', sql.Int, data.employeeId)
    req.input('Note', sql.NVarChar(sql.MAX), data.note || null)
    req.input('ImportDetails', tvp)
    req.output('NewImportId', sql.Int)

    // Gọi trực tiếp Stored Procedure đúng chuẩn
    const result = await req.execute('sp_CreateInventoryImport')
    const importId = result.output.NewImportId

    return { importId, ...data }
  }
}