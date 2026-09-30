import { getPool, sql } from '@/config/database'

export class AuthRepo {
  async findEmployeeByUsername(username: string) {
    const pool = await getPool()
    const result = await pool
      .request()
      .input('username', sql.VarChar(100), username)
      .query(`
        SELECT id, fullName, username, password, role, status
        FROM Employee
        WHERE username = @username AND deletedAt IS NULL
      `)
    return result.recordset[0] || null
  }

  async findCustomerByPhone(phoneNumber: string) {
    const pool = await getPool()
    const result = await pool
      .request()
      .input('phoneNumber', sql.VarChar(20), phoneNumber)
      .query(`
        SELECT id, fullName, phoneNumber, password, rewardPoints, membershipTier
        FROM Customer
        WHERE phoneNumber = @phoneNumber AND deletedAt IS NULL
      `)
    return result.recordset[0] || null
  }

  async findEmployeeById(id: number) {
    const pool = await getPool()
    const result = await pool
      .request()
      .input('id', sql.Int, id)
      .query(`
        SELECT id, fullName, username, role, phoneNumber, status, createdAt
        FROM Employee
        WHERE id = @id AND deletedAt IS NULL
      `)
    return result.recordset[0] || null
  }

  async findCustomerById(id: number) {
    const pool = await getPool()
    const result = await pool
      .request()
      .input('id', sql.Int, id)
      .query(`
        SELECT id, fullName, phoneNumber, rewardPoints, membershipTier, createdAt
        FROM Customer
        WHERE id = @id AND deletedAt IS NULL
      `)
    return result.recordset[0] || null
  }

  async updateCustomerPassword(customerId: number, passwordHash: string) {
    const pool = await getPool()
    await pool
      .request()
      .input('id', sql.Int, customerId)
      .input('password', sql.VarChar(255), passwordHash)
      .query(`
        UPDATE Customer 
        SET password = @password, updatedAt = SYSDATETIME() 
        WHERE id = @id AND deletedAt IS NULL
      `)
  }

  async updateEmployeePassword(employeeId: number, passwordHash: string) {
    const pool = await getPool()
    await pool
      .request()
      .input('id', sql.Int, employeeId)
      .input('password', sql.VarChar(255), passwordHash)
      .query(`
        UPDATE Employee 
        SET password = @password, updatedAt = SYSDATETIME() 
        WHERE id = @id AND deletedAt IS NULL
      `)
  }
}