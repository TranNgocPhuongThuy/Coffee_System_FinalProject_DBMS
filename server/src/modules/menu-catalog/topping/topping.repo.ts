import { getPool, sql } from '@/config/database'
import {
  CreateToppingType,
  FilterToppingQueryType,
  UpdateToppingType,
} from './topping.schema'

export interface Topping {
  id: number
  name: string
  price: number
  status: 'AVAILABLE' | 'UNAVAILABLE' | 'ACTIVE'
  createdAt?: Date
  updatedAt?: Date | null
  deletedAt?: Date | null
}

export class ToppingRepository {
  /**
   * Lấy danh sách topping (có lọc status và tìm kiếm name)
   */
  async findAll(filters?: FilterToppingQueryType): Promise<Topping[]> {
    const pool = await getPool()
    const req = pool.request()
    const conditions: string[] = ['deletedAt IS NULL']

    // Ép kiểu an toàn: Chỉ lấy khi đúng là chuỗi (string)
    const status = typeof filters?.status === 'string' ? filters.status : undefined
    const search = typeof filters?.search === 'string' ? filters.search : undefined

    if (status) {
      req.input('status', sql.NVarChar(50), status)
      conditions.push('status = @status')
    }

    if (search) {
      req.input('search', sql.NVarChar(150), `%${search}%`)
      conditions.push('name LIKE @search')
    }

    const whereClause = `WHERE ${conditions.join(' AND ')}`
    const query = `
    SELECT id, name, price, status, createdAt, updatedAt 
    FROM Topping 
    ${whereClause} 
    ORDER BY name ASC
  `
    const result = await req.query<Topping>(query)
    return result.recordset
  }

  /**
   * Lấy chi tiết topping theo ID
   */
  async findById(id: number): Promise<Topping | null> {
    const pool = await getPool()
    const req = pool.request()
    req.input('id', sql.Int, id)
    const result = await req.query<Topping>(`
      SELECT id, name, price, status, createdAt, updatedAt 
      FROM Topping 
      WHERE id = @id AND deletedAt IS NULL
    `)
    return result.recordset[0] || null
  }

  /**
   * Tim topping theo tên (hỗ trợ loại trừ ID khi update)
   */
  async findByName(name: string, excludeId?: number): Promise<Topping | null> {
    const pool = await getPool()
    const req = pool.request()
    req.input('name', sql.NVarChar(150), name)

    let query = `
      SELECT id, name, price, status, createdAt, updatedAt 
      FROM Topping 
      WHERE name = @name AND deletedAt IS NULL
    `

    if (excludeId) {
      req.input('excludeId', sql.Int, excludeId)
      query += ` AND id <> @excludeId`
    }

    const result = await req.query<Topping>(query)
    return result.recordset[0] || null
  }

  /**
   * Tạo topping mới
   */
  async create(data: CreateToppingType): Promise<Topping> {
    const pool = await getPool()
    const req = pool.request()
    req.input('name', sql.NVarChar(150), data.name)
    req.input('price', sql.Decimal(18, 2), data.price)
    req.input('status', sql.NVarChar(50), data.status || 'AVAILABLE')

    const result = await req.query<Topping>(`
      INSERT INTO Topping (name, price, status, createdAt)
      OUTPUT INSERTED.id, INSERTED.name, INSERTED.price, INSERTED.status, INSERTED.createdAt, INSERTED.updatedAt
      VALUES (@name, @price, @status, SYSDATETIME())
    `)
    return result.recordset[0]
  }

  /**
   * Cập nhật thông tin topping
   */
  async update(id: number, data: UpdateToppingType): Promise<Topping | null> {
    const pool = await getPool()
    const req = pool.request()
    req.input('id', sql.Int, id)

    const setClauses: string[] = ['updatedAt = SYSDATETIME()']

    if (data.name !== undefined) {
      req.input('name', sql.NVarChar(150), data.name)
      setClauses.push('name = @name')
    }
    if (data.price !== undefined) {
      req.input('price', sql.Decimal(18, 2), data.price)
      setClauses.push('price = @price')
    }
    if (data.status !== undefined) {
      req.input('status', sql.NVarChar(50), data.status)
      setClauses.push('status = @status')
    }

    const query = `
      UPDATE Topping
      SET ${setClauses.join(', ')}
      OUTPUT INSERTED.id, INSERTED.name, INSERTED.price, INSERTED.status, INSERTED.createdAt, INSERTED.updatedAt
      WHERE id = @id AND deletedAt IS NULL
    `
    const result = await req.query<Topping>(query)
    return result.recordset[0] || null
  }

  /**
   * Xóa mềm topping
   */
  async delete(id: number): Promise<boolean> {
    const pool = await getPool()
    const req = pool.request()
    req.input('id', sql.Int, id)
    const result = await req.query(`
      UPDATE Topping 
      SET deletedAt = SYSDATETIME() 
      WHERE id = @id AND deletedAt IS NULL
    `)
    return (result.rowsAffected[0] ?? 0) > 0
  }
}