import { getPool, sql } from '@/config/database'
import { CreateCustomerType, FilterCustomerQueryType, UpdateCustomerType } from './customer.schema'

export class CustomerRepo {
    async getCustomers(filter: FilterCustomerQueryType) {
        const pool = await getPool()
        const request = pool.request()

        const { search, membershipTier, page = 1, limit = 20 } = filter
        const offset = (page - 1) * limit
        const conditions: string[] = ['deletedAt IS NULL']

        if (membershipTier) {
            request.input('membershipTier', sql.NVarChar(50), membershipTier)
            conditions.push('membershipTier = @membershipTier')
        }

        if (search) {
            request.input('search', sql.NVarChar(150), `%${search}%`)
            conditions.push('(fullName LIKE @search OR phoneNumber LIKE @search)')
        }

        const whereClause = `WHERE ${conditions.join(' AND ')}`

        // Đếm tổng số bản ghi
        const countQuery = `SELECT COUNT(1) AS total FROM Customer ${whereClause}`
        const countResult = await request.query(countQuery)
        const totalItems = countResult.recordset[0]?.total || 0

        // Truy vấn danh sách có phân trang chuẩn SQL Server
        request.input('offset', sql.Int, offset)
        request.input('limit', sql.Int, limit)

        const listQuery = `
      SELECT 
        id, 
        phoneNumber, 
        fullName, 
        rewardPoints, 
        membershipTier, 
        createdAt, 
        updatedAt
      FROM Customer
      ${whereClause}
      ORDER BY createdAt DESC
      OFFSET @offset ROWS
      FETCH NEXT @limit ROWS ONLY
    `
        const listResult = await request.query(listQuery)

        return {
            items: listResult.recordset,
            meta: {
                page,
                limit,
                totalItems,
                totalPages: Math.ceil(totalItems / limit),
            },
        }
    }

    async getCustomerById(id: number) {
        const pool = await getPool()
        const request = pool.request()

        request.input('id', sql.Int, id)
        const query = `
      SELECT 
        id, 
        phoneNumber, 
        fullName, 
        rewardPoints, 
        membershipTier, 
        createdAt, 
        updatedAt
      FROM Customer 
      WHERE id = @id AND deletedAt IS NULL
    `
        const result = await request.query(query)
        return result.recordset[0] || null
    }

    async getCustomerByPhone(phoneNumber: string) {
        const pool = await getPool()
        const request = pool.request()

        request.input('phoneNumber', sql.VarChar(20), phoneNumber)
        const query = `
      SELECT id, fullName, phoneNumber 
      FROM Customer 
      WHERE phoneNumber = @phoneNumber AND deletedAt IS NULL
    `
        const result = await request.query(query)
        return result.recordset[0] || null
    }

    async createCustomer(data: CreateCustomerType) {
        const pool = await getPool()
        const request = pool.request()

        request.input('fullName', sql.NVarChar(150), data.fullName)
        request.input('phoneNumber', sql.VarChar(20), data.phoneNumber)
        request.input('password', sql.VarChar(255), data.password || null)

        const query = `
      INSERT INTO Customer (fullName, phoneNumber, password, rewardPoints, membershipTier, createdAt)
      OUTPUT 
        INSERTED.id, 
        INSERTED.fullName, 
        INSERTED.phoneNumber, 
        INSERTED.rewardPoints, 
        INSERTED.membershipTier, 
        INSERTED.createdAt
      VALUES (@fullName, @phoneNumber, @password, 0, 'STANDARD', SYSDATETIME())
    `
        try {
            const result = await request.query(query)
            return result.recordset[0]
        } catch (error: any) {
            if (error.number === 2627 || error.number === 2601) {
                const err = new Error('Số điện thoại khách hàng đã tồn tại trên hệ thống')
                ;(err as any).status = 409
                throw err
            }
            throw error
        }
    }

    async updateCustomer(id: number, data: UpdateCustomerType) {
        const pool = await getPool()
        const request = pool.request()

        const updateFields: string[] = []

        request.input('id', sql.Int, id)

        if (data.fullName !== undefined) {
            request.input('fullName', sql.NVarChar(150), data.fullName)
            updateFields.push('fullName = @fullName')
        }

        if (data.phoneNumber !== undefined) {
            request.input('phoneNumber', sql.VarChar(20), data.phoneNumber)
            updateFields.push('phoneNumber = @phoneNumber')
        }

        if (data.password !== undefined) {
            request.input('password', sql.VarChar(255), data.password)
            updateFields.push('password = @password')
        }

        if (updateFields.length === 0) return null

        updateFields.push('updatedAt = SYSDATETIME()')

        const query = `
      UPDATE Customer 
      SET ${updateFields.join(', ')}
      OUTPUT 
        INSERTED.id, 
        INSERTED.fullName, 
        INSERTED.phoneNumber, 
        INSERTED.rewardPoints, 
        INSERTED.membershipTier, 
        INSERTED.updatedAt
      WHERE id = @id AND deletedAt IS NULL
    `
        try {
            const result = await request.query(query)
            return result.recordset[0] || null
        } catch (error: any) {
            if (error.number === 2627 || error.number === 2601) {
                const err = new Error('Số điện thoại này đã được sử dụng bởi khách hàng khác')
                ;(err as any).status = 409
                throw err
            }
            throw error
        }
    }

    async softDeleteCustomer(id: number) {
        const pool = await getPool()
        const request = pool.request()

        request.input('id', sql.Int, id)
        const query = `
      UPDATE Customer
      SET deletedAt = SYSDATETIME()
      WHERE id = @id AND deletedAt IS NULL
    `
        const result = await request.query(query)
        return result.rowsAffected[0] > 0
    }
}
