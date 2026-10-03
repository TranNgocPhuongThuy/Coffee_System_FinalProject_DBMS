import { getPool, sql } from '@/config/database'
import { CreateEmployeeBodyType, RegisterBodyType } from './auth.schema'

export class AuthRepo {

  
  // Tìm nhân viên bằng username hoặc số điện thoại
  async findEmployeeByIdentifier(identifier: string) {
    const pool = await getPool()
    const result = await pool
      .request()
      .input('identifier', sql.VarChar(100), identifier)
      .query(`
        SELECT id, fullName, username, password, role, phoneNumber, status
        FROM Employee
        WHERE (username = @identifier OR phoneNumber = @identifier)
          AND deletedAt IS NULL
      `)
    return result.recordset[0] || null
  }

  // Tìm khách hàng bằng số điện thoại
  async findCustomerByPhone(phoneNumber: string) {
    const pool = await getPool()
    const result = await pool
      .request()
      .input('phoneNumber', sql.VarChar(20), phoneNumber)
      .query(`
        SELECT id, fullName, phoneNumber, password, rewardPoints, membershipTier
        FROM Customer
        WHERE phoneNumber = @phoneNumber 
          AND deletedAt IS NULL
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

  // Tạo tài khoản khách hàng mới (mặc định role = CUSTOMER)
  async createCustomer(data: { fullName: string; phoneNumber: string; passwordHash: string; address?: string }) {
    const pool = await getPool()
    const result = await pool
      .request()
      .input('fullName', sql.NVarChar(100), data.fullName)
      .input('phoneNumber', sql.VarChar(20), data.phoneNumber)
      .input('password', sql.VarChar(255), data.passwordHash)
      .input('address', sql.NVarChar(255), data.address || null)
      .query(`
        INSERT INTO Customer (fullName, phoneNumber, password, address, rewardPoints, membershipTier, createdAt, updatedAt)
        OUTPUT INSERTED.id, INSERTED.fullName, INSERTED.phoneNumber, INSERTED.membershipTier, INSERTED.rewardPoints
        VALUES (@fullName, @phoneNumber, @password, @address, 0, 'STANDARD', SYSDATETIME(), SYSDATETIME())
      `)
    return result.recordset[0]
  }

  // Kích hoạt mật khẩu cho khách đã có thông tin tích điểm từ trước tại quầy
  async activateCustomerWithPassword(
    id: number,
    data: { fullName: string; passwordHash: string; address?: string }
  ) {
    const pool = await getPool();
    const result = await pool
      .request()
      .input('id', sql.Int, id)
      .input('fullName', sql.NVarChar(100), data.fullName)
      .input('password', sql.VarChar(255), data.passwordHash)
      .input('address', sql.NVarChar(255), data.address || null)
      .query(`
        UPDATE Customer 
        SET fullName = @fullName,
            password = @password,
            address = COALESCE(@address, address),
            updatedAt = SYSDATETIME()
        OUTPUT 
          INSERTED.id, 
          INSERTED.fullName, 
          INSERTED.phoneNumber, 
          INSERTED.membershipTier, 
          INSERTED.rewardPoints,
          INSERTED.address
        WHERE id = @id AND deletedAt IS NULL
      `);
    return result.recordset[0];
  }

  // Tạo nhân viên nội bộ (Dành riêng cho Admin/Manager)
  async createEmployee(data: { fullName: string; username: string; passwordHash: string; role: string; phoneNumber?: string }) {
    const pool = await getPool()
    const result = await pool
      .request()
      .input('fullName', sql.NVarChar(100), data.fullName)
      .input('username', sql.VarChar(100), data.username)
      .input('password', sql.VarChar(255), data.passwordHash)
      .input('role', sql.VarChar(50), data.role)
      .input('phoneNumber', sql.VarChar(20), data.phoneNumber || null)
      .query(`
        INSERT INTO Employee (fullName, username, password, role, phoneNumber, status, createdAt, updatedAt)
        OUTPUT INSERTED.id, INSERTED.fullName, INSERTED.username, INSERTED.role, INSERTED.status
        VALUES (@fullName, @username, @password, @role, @phoneNumber, 'ACTIVE', SYSDATETIME(), SYSDATETIME())
      `)
    return result.recordset[0]
  }

  // Cập nhật vai trò nhân viên
  async updateEmployeeRole(id: number, role: string) {
    const pool = await getPool()
    const result = await pool
      .request()
      .input('id', sql.Int, id)
      .input('role', sql.VarChar(50), role)
      .query(`
        UPDATE Employee 
        SET role = @role, updatedAt = SYSDATETIME()
        OUTPUT INSERTED.id, INSERTED.fullName, INSERTED.username, INSERTED.role, INSERTED.status
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