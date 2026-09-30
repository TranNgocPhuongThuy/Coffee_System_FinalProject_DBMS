import { getPool, sql } from '@/config/database'
import { CreateToppingType, UpdateToppingType } from './topping.schema'

export interface Topping {
  id: number
  name: string
  price: number
  status: 'AVAILABLE' | 'UNAVAILABLE' | 'ACTIVE'
  createdAt?: Date
  updatedAt?: Date | null
}

export class ToppingRepository {
  async findAll(status?: string): Promise<Topping[]> {
    const pool = await getPool()
    const req = pool.request()
    let query = `SELECT id, name, price, status, createdAt, updatedAt FROM Topping`

    if (status) {
      req.input('status', sql.NVarChar(50), status)
      query += ` WHERE status = @status`
    }

    query += ` ORDER BY name ASC`
    const result = await req.query<Topping>(query)
    return result.recordset
  }

  async findById(id: number): Promise<Topping | null> {
    const pool = await getPool()
    const req = pool.request()
    req.input('id', sql.Int, id)
    const result = await req.query<Topping>(`
      SELECT id, name, price, status, createdAt, updatedAt 
      FROM Topping 
      WHERE id = @id
    `)
    return result.recordset[0] || null
  }

  async findByName(name: string): Promise<Topping | null> {
    const pool = await getPool()
    const req = pool.request()
    req.input('name', sql.NVarChar(150), name)
    const result = await req.query<Topping>(`
      SELECT id, name, price, status, createdAt, updatedAt 
      FROM Topping 
      WHERE name = @name
    `)
    return result.recordset[0] || null
  }

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
      WHERE id = @id
    `
    const result = await req.query<Topping>(query)
    return result.recordset[0] || null
  }

  async delete(id: number): Promise<boolean> {
    const pool = await getPool()
    const req = pool.request()
    req.input('id', sql.Int, id)
    const result = await req.query(`DELETE FROM Topping WHERE id = @id`)
    return (result.rowsAffected[0] ?? 0) > 0
  }
}