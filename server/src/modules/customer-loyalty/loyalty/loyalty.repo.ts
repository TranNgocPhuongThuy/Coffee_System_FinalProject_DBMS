import { getPool, sql } from '@/config/database'
import { AdjustPointsType, FilterLoyaltyHistoryQueryType } from './loyalty.schema'

export class LoyaltyRepo {
    async getLoyaltyHistory(filter: FilterLoyaltyHistoryQueryType) {
        const pool = await getPool()
        const request = pool.request()

        const { customerId, orderId, transactionType, fromDate, toDate, page = 1, limit = 20 } = filter
        const offset = (page - 1) * limit
        const conditions: string[] = ['1=1']

        if (customerId) {
            request.input('customerId', sql.Int, customerId)
            conditions.push('lt.customerId = @customerId')
        }

        if (orderId) {
            request.input('orderId', sql.Int, orderId)
            conditions.push('lt.orderId = @orderId')
        }

        if (transactionType) {
            request.input('transactionType', sql.NVarChar(50), transactionType)
            conditions.push('lt.transactionType = @transactionType')
        }

        if (fromDate) {
            request.input('fromDate', sql.DateTime2, fromDate)
            conditions.push('lt.createdAt >= @fromDate')
        }

        if (toDate) {
            const endDate = new Date(toDate)
            endDate.setDate(endDate.getDate() + 1)
            request.input('toDate', sql.DateTime2, endDate)
            conditions.push('lt.createdAt < @toDate')
        }

        const whereClause = `WHERE ${conditions.join(' AND ')}`

        const countRes = await request.query(`SELECT COUNT(1) AS total FROM LoyaltyTransaction lt ${whereClause}`)
        const totalItems = countRes.recordset[0]?.total || 0

        request.input('offset', sql.Int, offset)
        request.input('limit', sql.Int, limit)

        const listQuery = `
      SELECT 
        lt.id,
        lt.customerId,
        c.fullName AS customerName,
        c.phoneNumber AS customerPhone,
        lt.orderId,
        lt.transactionType,
        lt.points,
        lt.balanceAfter,
        lt.description,
        lt.createdAt
      FROM LoyaltyTransaction lt
      JOIN Customer c ON lt.customerId = c.id
      ${whereClause}
      ORDER BY lt.createdAt DESC, lt.id DESC
      OFFSET @offset ROWS
      FETCH NEXT @limit ROWS ONLY
    `
        const listRes = await request.query(listQuery)

        return {
            items: listRes.recordset,
            meta: {
                page,
                limit,
                totalItems,
                totalPages: Math.ceil(totalItems / limit),
            },
        }
    }

    // Thực hiện giao dịch điểm dùng TRANSACTION & khóa bản ghi (UPDLOCK) để chống Race Condition
    async processPointsTransaction(data: AdjustPointsType) {
        const pool = await getPool()
        const transaction = new sql.Transaction(pool)

        await transaction.begin()

        try {
            const lockReq = new sql.Request(transaction)
            lockReq.input('customerId', sql.Int, data.customerId)

            // Kiểm tra và khóa dòng dữ liệu của Customer
            const customerRes = await lockReq.query(`
        SELECT rewardPoints, membershipTier 
        FROM Customer WITH (UPDLOCK, ROWLOCK)
        WHERE id = @customerId AND deletedAt IS NULL
      `)

            if (customerRes.recordset.length === 0) {
                throw new Error('Khách hàng không tồn tại hoặc đã bị xóa')
            }

            // Nếu truyền orderId, validate đơn hàng & kiểm tra thuộc về customerId
            if (data.orderId) {
                const orderReq = new sql.Request(transaction)
                orderReq.input('orderId', sql.Int, data.orderId)
                const orderRes = await orderReq.query(`
          SELECT id, customerId 
          FROM [Order] 
          WHERE id = @orderId AND deletedAt IS NULL
        `)

                if (orderRes.recordset.length === 0) {
                    throw new Error('Đơn hàng không tồn tại')
                }

                const order = orderRes.recordset[0]
                if (order.customerId && order.customerId !== data.customerId) {
                    throw new Error('Đơn hàng không thuộc về khách hàng này')
                }

                // Chống EARN trùng order nếu mỗi order chỉ được cộng điểm một lần
                if (data.transactionType === 'EARN') {
                    const dupReq = new sql.Request(transaction)
                    dupReq.input('orderId', sql.Int, data.orderId)
                    const dupRes = await dupReq.query(`
            SELECT TOP 1 id FROM LoyaltyTransaction 
            WHERE orderId = @orderId AND transactionType = 'EARN'
          `)

                    if (dupRes.recordset.length > 0) {
                        throw new Error('Đơn hàng này đã được cộng điểm thưởng trước đó')
                    }
                }
            }

            const currentPoints: number = customerRes.recordset[0].rewardPoints
            let newBalance = currentPoints

            if (data.transactionType === 'EARN') {
                newBalance += data.points
            } else if (data.transactionType === 'REDEEM') {
                if (currentPoints < data.points) {
                    throw new Error(`Điểm thưởng không đủ (Hiện có: ${currentPoints}, cần đổi: ${data.points})`)
                }
                newBalance -= data.points
            }

            // Tính tổng điểm tích lũy lifetime (Lifetime Earned Points) để xét hạng membershipTier
            const lifetimeReq = new sql.Request(transaction)
            lifetimeReq.input('customerId', sql.Int, data.customerId)
            const lifetimeRes = await lifetimeReq.query(`
        SELECT ISNULL(SUM(points), 0) AS totalEarned
        FROM LoyaltyTransaction
        WHERE customerId = @customerId AND transactionType = 'EARN'
      `)

            let lifetimePoints = Number(lifetimeRes.recordset[0]?.totalEarned || 0)
            if (data.transactionType === 'EARN') {
                lifetimePoints += data.points
            }

            // Xác định hạng thành viên theo Lifetime Points để không bị tụt hạng khi đổi điểm (REDEEM)
            let newTier = 'STANDARD'
            if (lifetimePoints >= 1000) newTier = 'DIAMOND'
            else if (lifetimePoints >= 500) newTier = 'GOLD'
            else if (lifetimePoints >= 200) newTier = 'SILVER'

            // Cập nhật Customer
            const updateReq = new sql.Request(transaction)
            updateReq.input('customerId', sql.Int, data.customerId)
            updateReq.input('newBalance', sql.Int, newBalance)
            updateReq.input('newTier', sql.NVarChar(50), newTier)

            await updateReq.query(`
        UPDATE Customer 
        SET rewardPoints = @newBalance, 
            membershipTier = @newTier, 
            updatedAt = SYSDATETIME()
        WHERE id = @customerId
      `)

            // Ghi log vào bảng LoyaltyTransaction
            const logReq = new sql.Request(transaction)
            logReq.input('customerId', sql.Int, data.customerId)
            logReq.input('orderId', sql.Int, data.orderId || null)
            logReq.input('transactionType', sql.NVarChar(50), data.transactionType)
            logReq.input('points', sql.Int, data.points)
            logReq.input('balanceAfter', sql.Int, newBalance)
            logReq.input('description', sql.NVarChar(500), data.description || null)

            const logRes = await logReq.query(`
        INSERT INTO LoyaltyTransaction (customerId, orderId, transactionType, points, balanceAfter, description)
        OUTPUT 
          INSERTED.id, 
          INSERTED.customerId, 
          INSERTED.orderId, 
          INSERTED.transactionType, 
          INSERTED.points, 
          INSERTED.balanceAfter, 
          INSERTED.description, 
          INSERTED.createdAt
        VALUES (@customerId, @orderId, @transactionType, @points, @balanceAfter, @description)
      `)

            await transaction.commit()
            return {
                transaction: logRes.recordset[0],
                newTier,
                balanceAfter: newBalance,
            }
        } catch (error) {
            await transaction.rollback()
            throw error
        }
    }
}