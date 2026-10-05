import { getPool, sql } from '@/config/database'
import {
  CreateCategoryType,
  FilterCategoryQueryType,
  UpdateCategoryType,
} from './category.schema'

export interface Category {
  id: number
  name: string
  displayStatus: 'SHOW' | 'HIDE'
  createdAt: Date
  updatedAt?: Date | null
  deletedAt?: Date | null
}

export class CategoryRepository {
  /**
   * Lấy danh sách danh mục (hỗ trợ lọc displayStatus & tìm kiếm name)
   */
  async findAll(filters?: FilterCategoryQueryType): Promise<any[]> {
    const pool = await getPool()
    const req = pool.request()
    const conditions: string[] = ['c.deletedAt IS NULL']

    const displayStatus =
      typeof filters?.displayStatus === 'string' && filters.displayStatus.trim() !== ''
        ? filters.displayStatus
        : undefined
    const search =
      typeof filters?.search === 'string' && filters.search.trim() !== ''
        ? filters.search.trim()
        : undefined

    if (displayStatus) {
      req.input('displayStatus', sql.NVarChar(50), displayStatus)
      conditions.push('c.displayStatus = @displayStatus')
    }

    if (search) {
      req.input('search', sql.NVarChar(150), `%${search}%`)
      conditions.push('c.name LIKE @search')
    }

    const whereClause = `WHERE ${conditions.join(' AND ')}`
    const query = `
      SELECT c.id, c.name, c.displayStatus, c.createdAt, c.updatedAt,
             COUNT(p.id) AS productCount
      FROM Category c
      LEFT JOIN Product p ON c.id = p.categoryId AND p.deletedAt IS NULL
      ${whereClause}
      GROUP BY c.id, c.name, c.displayStatus, c.createdAt, c.updatedAt
      ORDER BY c.id ASC
    `
    const result = await req.query<any>(query)
    return result.recordset
  }

  /**
   * Lấy chi tiết danh mục theo ID
   */
  async findById(id: number): Promise<Category | null> {
    const pool = await getPool()
    const req = pool.request()
    req.input('id', sql.Int, id)
    const result = await req.query<Category>(`
      SELECT id, name, displayStatus, createdAt, updatedAt
      FROM Category
      WHERE id = @id AND deletedAt IS NULL
    `)
    return result.recordset[0] || null
  }

  /**
   * Tìm danh mục theo tên (hỗ trợ loại trừ ID khi update)
   */
  async findByName(name: string, excludeId?: number): Promise<Category | null> {
    const pool = await getPool()
    const req = pool.request()
    req.input('name', sql.NVarChar(150), name)

    let query = `
      SELECT id, name, displayStatus, createdAt, updatedAt
      FROM Category
      WHERE name = @name AND deletedAt IS NULL
    `

    if (excludeId) {
      req.input('excludeId', sql.Int, excludeId)
      query += ` AND id <> @excludeId`
    }

    const result = await req.query<Category>(query)
    return result.recordset[0] || null
  }

  /**
   * Đếm số lượng sản phẩm thuộc danh mục
   */
  async countProductsByCategoryId(categoryId: number): Promise<number> {
    const pool = await getPool()
    const req = pool.request()
    req.input('categoryId', sql.Int, categoryId)
    const result = await req.query<{ count: number }>(`
      SELECT COUNT(1) AS count 
      FROM Product 
      WHERE categoryId = @categoryId AND deletedAt IS NULL
    `)
    return result.recordset[0]?.count || 0
  }

  /**
   * Tạo danh mục mới
   */
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

  /**
   * Cập nhật thông tin danh mục
   */
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
      WHERE id = @id AND deletedAt IS NULL
    `
    const result = await req.query<Category>(query)
    return result.recordset[0] || null
  }

  /**
   * Xóa mềm danh mục
   */
  async delete(id: number): Promise<boolean> {
    const pool = await getPool()
    const req = pool.request()
    req.input('id', sql.Int, id)
    const result = await req.query(`
      UPDATE Category 
      SET deletedAt = SYSDATETIME() 
      WHERE id = @id AND deletedAt IS NULL
    `)
    return (result.rowsAffected[0] ?? 0) > 0
  }
}