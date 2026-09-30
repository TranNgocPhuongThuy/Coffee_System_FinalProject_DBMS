import { getPool, sql } from '@/config/database'
import { CreateCategoryType, UpdateCategoryType } from './category.schema'

export interface Category {
  id: number
  name: string
  displayStatus: 'SHOW' | 'HIDE'
  createdAt: Date
  updatedAt?: Date | null
}

export class CategoryRepository {
  async findAll(): Promise<Category[]> {
    const pool = await getPool()
    const result = await pool.request().query<Category>(`
      SELECT id, name, displayStatus, createdAt, updatedAt
      FROM Category
      ORDER BY id ASC
    `)
    return result.recordset
  }

  async findById(id: number): Promise<Category | null> {
    const pool = await getPool()
    const req = pool.request()
    req.input('id', sql.Int, id)
    const result = await req.query<Category>(`
      SELECT id, name, displayStatus, createdAt, updatedAt
      FROM Category
      WHERE id = @id
    `)
    return result.recordset[0] || null
  }

  async findByName(name: string): Promise<Category | null> {
    const pool = await getPool()
    const req = pool.request()
    req.input('name', sql.NVarChar(150), name)
    const result = await req.query<Category>(`
      SELECT id, name, displayStatus, createdAt, updatedAt
      FROM Category
      WHERE name = @name
    `)
    return result.recordset[0] || null
  }

  async create(data: CreateCategoryType): Promise<Category> {
    const pool = await getPool()
    const req = pool.request()
    req.input('name', sql.NVarChar(150), data.name)
    req.input('displayStatus', sql.NVarChar(50), data.displayStatus || 'SHOW')

    const result = await req.query<Category>(`
      INSERT INTO Category (name, displayStatus, createdAt)
      OUTPUT INSERTED.id, INSERTED.name, INSERTED.displayStatus, INSERTED.createdAt, INSERTED.updatedAt
      VALUES (@name, @displayStatus, SYSDATETIME())
    `)
    return result.recordset[0]
  }

  async update(id: number, data: UpdateCategoryType): Promise<Category | null> {
    const pool = await getPool()
    const req = pool.request()
    req.input('id', sql.Int, id)

    const setClauses: string[] = ['updatedAt = SYSDATETIME()']

    if (data.name !== undefined) {
      req.input('name', sql.NVarChar(150), data.name)
      setClauses.push('name = @name')
    }
    if (data.displayStatus !== undefined) {
      req.input('displayStatus', sql.NVarChar(50), data.displayStatus)
      setClauses.push('displayStatus = @displayStatus')
    }

    const query = `
      UPDATE Category
      SET ${setClauses.join(', ')}
      OUTPUT INSERTED.id, INSERTED.name, INSERTED.displayStatus, INSERTED.createdAt, INSERTED.updatedAt
      WHERE id = @id
    `
    const result = await req.query<Category>(query)
    return result.recordset[0] || null
  }

  async delete(id: number): Promise<boolean> {
    const pool = await getPool()
    const req = pool.request()
    req.input('id', sql.Int, id)
    const result = await req.query(`DELETE FROM Category WHERE id = @id`)
    return (result.rowsAffected[0] ?? 0) > 0
  }
}