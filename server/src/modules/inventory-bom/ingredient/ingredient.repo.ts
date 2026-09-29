import { getPool, sql } from '@/config/database'
import { CreateIngredientType, UpdateIngredientType } from './ingredient.schema'

export class IngredientRepo {
  async findAll(name?: string) {
    const pool = await getPool()
    const req = pool.request()
    let query = 'SELECT id, name, unit, stockQuantity, minimumThreshold, createdAt, updatedAt FROM Ingredient WHERE deletedAt IS NULL'
    if (name) {
      req.input('name', sql.NVarChar(150), `%${name}%`)
      query += ' AND name LIKE @name'
    }
    query += ' ORDER BY name ASC'
    const result = await req.query(query)
    return result.recordset
  }

  async findById(id: number) {
    const pool = await getPool()
    const req = pool.request()
    req.input('id', sql.Int, id)
    const result = await req.query('SELECT * FROM Ingredient WHERE id = @id AND deletedAt IS NULL')
    return result.recordset[0] || null
  }

  async findByName(name: string) {
    const pool = await getPool()
    const req = pool.request()
    req.input('name', sql.NVarChar(150), name)
    const result = await req.query('SELECT id FROM Ingredient WHERE name = @name AND deletedAt IS NULL')
    return result.recordset[0] || null
  }

  async getLowStockIngredients() {
    const pool = await getPool()
    const result = await pool.request().query('SELECT * FROM v_LowStockIngredients')
    return result.recordset
  }

  async create(data: CreateIngredientType) {
    const pool = await getPool()
    const req = pool.request()
    req.input('name', sql.NVarChar(150), data.name)
    req.input('unit', sql.NVarChar(50), data.unit)
    req.input('stockQuantity', sql.Decimal(18, 3), data.stockQuantity)
    req.input('minimumThreshold', sql.Decimal(18, 3), data.minimumThreshold)

    const query = `
      INSERT INTO Ingredient (name, unit, stockQuantity, minimumThreshold, createdAt)
      OUTPUT INSERTED.*
      VALUES (@name, @unit, @stockQuantity, @minimumThreshold, SYSDATETIME())
    `
    const result = await req.query(query)
    return result.recordset[0]
  }

  async update(id: number, data: UpdateIngredientType) {
    const pool = await getPool()
    const req = pool.request()
    req.input('id', sql.Int, id)

    const sets: string[] = ['updatedAt = SYSDATETIME()']
    if (data.name !== undefined) {
      req.input('name', sql.NVarChar(150), data.name)
      sets.push('name = @name')
    }
    if (data.unit !== undefined) {
      req.input('unit', sql.NVarChar(50), data.unit)
      sets.push('unit = @unit')
    }
    if (data.stockQuantity !== undefined) {
      req.input('stockQuantity', sql.Decimal(18, 3), data.stockQuantity)
      sets.push('stockQuantity = @stockQuantity')
    }
    if (data.minimumThreshold !== undefined) {
      req.input('minimumThreshold', sql.Decimal(18, 3), data.minimumThreshold)
      sets.push('minimumThreshold = @minimumThreshold')
    }

    const query = `UPDATE Ingredient SET ${sets.join(', ')} OUTPUT INSERTED.* WHERE id = @id AND deletedAt IS NULL`
    const result = await req.query(query)
    return result.recordset[0] || null
  }

  async softDelete(id: number) {
    const pool = await getPool()
    const req = pool.request()
    req.input('id', sql.Int, id)
    const result = await req.query('UPDATE Ingredient SET deletedAt = SYSDATETIME() WHERE id = @id AND deletedAt IS NULL')
    return result.rowsAffected[0] > 0
  }
}