import { getPool, sql } from "@/config/database";
import {
  AdjustPointsType,
  FilterLoyaltyHistoryQueryType,
} from "./loyalty.schema";

export class LoyaltyRepo {
  async getLoyaltyHistory(filter: FilterLoyaltyHistoryQueryType) {
    const pool = await getPool();
    const request = pool.request();

    const {
      customerId,
      orderId,
      transactionType,
      fromDate,
      toDate,
      page = 1,
      limit = 20,
    } = filter;
    const offset = (page - 1) * limit;

    // Nếu có customerId, fromDate, toDate và không có orderId / transactionType: tận dụng Function fn_GetMemberLoyaltyHistory
    if (customerId && fromDate && toDate && !orderId && !transactionType) {
      request.input("customerId", sql.Int, customerId);
      request.input("fromDate", sql.DateTime2, fromDate);
      const endDate = new Date(toDate);
      endDate.setDate(endDate.getDate() + 1);
      request.input("toDate", sql.DateTime2, endDate);
      request.input("offset", sql.Int, offset);
      request.input("limit", sql.Int, limit);

      const countRes = await request.query(`
                SELECT COUNT(1) AS total
                FROM dbo.fn_GetMemberLoyaltyHistory(@customerId, @fromDate, @toDate)
            `);
      const totalItems = countRes.recordset[0]?.total || 0;

      const listQuery = `
                SELECT 
                    h.transactionId AS id,
                    h.customerId,
                    c.fullName AS customerName,
                    c.phoneNumber AS customerPhone,
                    h.orderId,
                    h.transactionType,
                    h.points,
                    h.balanceAfter,
                    h.description,
                    h.transactionTime AS createdAt
                FROM dbo.fn_GetMemberLoyaltyHistory(@customerId, @fromDate, @toDate) h
                JOIN Customer c ON h.customerId = c.id
                ORDER BY h.transactionTime DESC, h.transactionId DESC
                OFFSET @offset ROWS
                FETCH NEXT @limit ROWS ONLY
            `;
      const listRes = await request.query(listQuery);

      return {
        items: listRes.recordset,
        meta: {
          page,
          limit,
          totalItems,
          totalPages: Math.ceil(totalItems / limit),
        },
      };
    }

    const conditions: string[] = ["1=1"];

    if (customerId) {
      request.input("customerId", sql.Int, customerId);
      conditions.push("lt.customerId = @customerId");
    }

    if (orderId) {
      request.input("orderId", sql.Int, orderId);
      conditions.push("lt.orderId = @orderId");
    }

    if (transactionType) {
      request.input("transactionType", sql.NVarChar(50), transactionType);
      conditions.push("lt.transactionType = @transactionType");
    }

    if (fromDate) {
      request.input("fromDate", sql.DateTime2, fromDate);
      conditions.push("lt.createdAt >= @fromDate");
    }

    if (toDate) {
      const endDate = new Date(toDate);
      endDate.setDate(endDate.getDate() + 1);
      request.input("toDate", sql.DateTime2, endDate);
      conditions.push("lt.createdAt < @toDate");
    }

    const whereClause = `WHERE ${conditions.join(" AND ")}`;

    const countRes = await request.query(
      `SELECT COUNT(1) AS total FROM LoyaltyTransaction lt ${whereClause}`,
    );
    const totalItems = countRes.recordset[0]?.total || 0;

    request.input("offset", sql.Int, offset);
    request.input("limit", sql.Int, limit);

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
    `;
    const listRes = await request.query(listQuery);

    return {
      items: listRes.recordset,
      meta: {
        page,
        limit,
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
      },
    };
  }

  // Thực hiện giao dịch điểm dùng TRANSACTION & khóa bản ghi (UPDLOCK) để chống Race Condition
  async processPointsTransaction(data: AdjustPointsType) {
    const pool = await getPool();
    const transaction = new sql.Transaction(pool);

    await transaction.begin();

    try {
      const lockReq = new sql.Request(transaction);
      lockReq.input("customerId", sql.Int, data.customerId);

      // 1. Khóa và lấy thông tin điểm hiện tại của Customer
      const customerRes = await lockReq.query(`
                SELECT rewardPoints, membershipTier 
                FROM Customer WITH (UPDLOCK, ROWLOCK)
                WHERE id = @customerId AND deletedAt IS NULL
            `);

      if (customerRes.recordset.length === 0) {
        throw new Error("Khách hàng không tồn tại hoặc đã bị xóa");
      }

      // 2. Validate Order nếu có truyền orderId
      if (data.orderId) {
        const orderReq = new sql.Request(transaction);
        orderReq.input("orderId", sql.Int, data.orderId);
        const orderRes = await orderReq.query(`
                    SELECT id, customerId 
                    FROM [Order] 
                    WHERE id = @orderId AND deletedAt IS NULL
                `);

        if (orderRes.recordset.length === 0) {
          throw new Error("Đơn hàng không tồn tại");
        }

        const order = orderRes.recordset[0];
        if (order.customerId && order.customerId !== data.customerId) {
          throw new Error("Đơn hàng không thuộc về khách hàng này");
        }

        if (data.transactionType === "EARN") {
          const dupReq = new sql.Request(transaction);
          dupReq.input("orderId", sql.Int, data.orderId);
          const dupRes = await dupReq.query(`
                        SELECT TOP 1 id FROM LoyaltyTransaction 
                        WHERE orderId = @orderId AND transactionType = 'EARN'
                    `);

          if (dupRes.recordset.length > 0) {
            throw new Error("Đơn hàng này đã được cộng điểm thưởng trước đó");
          }
        }
      }

      const currentPoints: number = customerRes.recordset[0].rewardPoints;

      // Xác định số điểm chèn vào sổ cái: EARN là số dương, REDEEM là số âm
      let pointsToRecord = data.points;
      if (data.transactionType === "REDEEM") {
        if (currentPoints < data.points) {
          throw new Error(
            `Điểm thưởng không đủ (Hiện có: ${currentPoints}, cần đổi: ${data.points})`,
          );
        }
        pointsToRecord = -Math.abs(data.points);
      } else {
        pointsToRecord = Math.abs(data.points);
      }

      const newBalance = currentPoints + pointsToRecord;

      // 3. Tính điểm Lifetime Earned để xét thăng hạng
      const lifetimeReq = new sql.Request(transaction);
      lifetimeReq.input("customerId", sql.Int, data.customerId);
      const lifetimeRes = await lifetimeReq.query(`
                SELECT ISNULL(SUM(points), 0) AS totalEarned
                FROM LoyaltyTransaction
                WHERE customerId = @customerId AND transactionType = 'EARN'
            `);

      let lifetimePoints = Number(lifetimeRes.recordset[0]?.totalEarned || 0);
      if (data.transactionType === "EARN") {
        lifetimePoints += data.points;
      }

      let newTier = "STANDARD";
      if (lifetimePoints >= 1000) newTier = "DIAMOND";
      else if (lifetimePoints >= 500) newTier = "GOLD";
      else if (lifetimePoints >= 200) newTier = "SILVER";

      // Cập nhật hạng thành viên (chỉ cập nhật membershipTier, không can thiệp rewardPoints vì trigger DB sẽ làm)
      const updateTierReq = new sql.Request(transaction);
      updateTierReq.input("customerId", sql.Int, data.customerId);
      updateTierReq.input("newTier", sql.NVarChar(50), newTier);
      await updateTierReq.query(`
                UPDATE Customer 
                SET membershipTier = @newTier, 
                    updatedAt = SYSDATETIME()
                WHERE id = @customerId
            `);

      // 4. Ghi log vào LoyaltyTransaction.
      // Trigger trg_LoyaltyTransaction_SyncPoints trong DB sẽ tự động tính lại Customer.rewardPoints chuẩn xác!
      const logReq = new sql.Request(transaction);
      logReq.input("customerId", sql.Int, data.customerId);
      logReq.input("orderId", sql.Int, data.orderId || null);
      logReq.input("transactionType", sql.NVarChar(50), data.transactionType);
      logReq.input("points", sql.Int, pointsToRecord);
      logReq.input("balanceAfter", sql.Int, newBalance);
      logReq.input("description", sql.NVarChar(500), data.description || null);

      const logRes = await logReq.query(`
    -- 1. Khai báo bảng biến tạm hứng dữ liệu OUTPUT
    DECLARE @tempLog TABLE (
      id INT, 
      customerId INT, 
      orderId INT, 
      transactionType NVARCHAR(50), 
      points INT, 
      balanceAfter INT, 
      description NVARCHAR(500), 
      createdAt DATETIME2(7)
    );

        -- 2. Thêm mệnh đề INTO @tempLog để thỏa mãn quy tắc SQL Server khi bảng có Trigger
        INSERT INTO LoyaltyTransaction (customerId, orderId, transactionType, points, balanceAfter, description, createdAt)
        OUTPUT 
        INSERTED.id, 
        INSERTED.customerId, 
        INSERTED.orderId, 
        INSERTED.transactionType, 
        INSERTED.points, 
        INSERTED.balanceAfter, 
        INSERTED.description, 
        INSERTED.createdAt
        INTO @tempLog
        VALUES (@customerId, @orderId, @transactionType, @points, @balanceAfter, @description, SYSDATETIME());

        -- 3. Trả kết quả về cho ứng dụng
        SELECT * FROM @tempLog;
    `);

      await transaction.commit();
      return {
        transaction: logRes.recordset[0],
        newTier,
        balanceAfter: newBalance,
      };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}
