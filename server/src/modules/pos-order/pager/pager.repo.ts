import { getPool, sql } from '@/config/database';
import {
  CreatePagerType,
  FilterPagerQueryType,
  UpdatePagerType,
} from './pager.schema';

export class PagerRepo {
  /**
   * Lấy danh sách thẻ rung có phân trang và bộ lọc
   */
  async getPagers(filter: FilterPagerQueryType) {
    const pool = await getPool();
    const request = pool.request();

    const { search, status, minBattery, page = 1, limit = 20 } = filter;
    const offset = (page - 1) * limit;
    const conditions: string[] = ['deletedAt IS NULL'];

    if (search) {
      request.input('search', sql.NVarChar(50), `%${search}%`);
      conditions.push('pagerCode LIKE @search');
    }

    if (status) {
      request.input('status', sql.NVarChar(50), status);
      conditions.push('status = @status');
    }

    if (minBattery !== undefined) {
      request.input('minBattery', sql.Int, minBattery);
      conditions.push('batteryLevel >= @minBattery');
    }

    const whereClause = `WHERE ${conditions.join(' AND ')}`;

    // Đếm tổng số bản ghi
    const countRes = await request.query(
      `SELECT COUNT(1) AS total FROM PagerDevice ${whereClause}`
    );
    const totalItems = countRes.recordset[0]?.total || 0;

    // Lấy dữ liệu phân trang
    request.input('offset', sql.Int, offset);
    request.input('limit', sql.Int, limit);

    const listQuery = `
      SELECT 
        id,
        pagerCode,
        status,
        batteryLevel,
        createdAt,
        updatedAt
      FROM PagerDevice
      ${whereClause}
      ORDER BY 
        CASE status 
          WHEN 'AVAILABLE' THEN 1 
          WHEN 'IN_USE' THEN 2 
          WHEN 'CHARGING' THEN 3 
          ELSE 4 
        END,
        pagerCode ASC
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

  /**
   * Lấy thông tin chi tiết thẻ rung theo ID
   */
  async getPagerById(id: number) {
    const pool = await getPool();
    const request = pool.request();

    request.input('id', sql.Int, id);
    const query = `
      SELECT 
        id,
        pagerCode,
        status,
        batteryLevel,
        createdAt,
        updatedAt
      FROM PagerDevice
      WHERE id = @id AND deletedAt IS NULL
    `;
    const result = await request.query(query);
    return result.recordset[0] || null;
  }

  /**
   * Tìm thẻ rung theo mã pagerCode (kể cả bản ghi xóa mềm để kiểm tra trùng mã)
   */
  async getPagerByCode(pagerCode: string) {
    const pool = await getPool();
    const request = pool.request();

    request.input('pagerCode', sql.VarChar(50), pagerCode);
    const query = `
      SELECT 
        id,
        pagerCode,
        status,
        batteryLevel,
        createdAt,
        updatedAt,
        deletedAt
      FROM PagerDevice
      WHERE pagerCode = @pagerCode
    `;
    const result = await request.query(query);
    return result.recordset[0] || null;
  }

  /**
   * Lấy danh sách thẻ rung sẵn sàng cấp cho khách (AVAILABLE và pin >= 15%)
   */
  async getAvailablePagers() {
    const pool = await getPool();
    const query = `
      SELECT 
        id,
        pagerCode,
        status,
        batteryLevel,
        createdAt
      FROM PagerDevice
      WHERE status = 'AVAILABLE' 
        AND batteryLevel >= 15 
        AND deletedAt IS NULL
      ORDER BY batteryLevel DESC, pagerCode ASC
    `;
    const result = await pool.request().query(query);
    return result.recordset;
  }

  /**
   * Kiểm tra thẻ rung có khả dụng không qua Function fn_IsPagerAvailable
   */
  async isPagerAvailable(pagerId: number): Promise<boolean> {
    const pool = await getPool();
    const result = await pool
      .request()
      .input('pagerId', sql.Int, pagerId)
      .query(`SELECT dbo.fn_IsPagerAvailable(@pagerId) AS isAvailable`);

    return result.recordset[0]?.isAvailable === true || result.recordset[0]?.isAvailable === 1;
  }

  /**
   * Tự động sinh mã thẻ rung tiếp theo (ví dụ: P01, P02, ..., P06, ...)
   */
  async getNextPagerCode(): Promise<string> {
    const pool = await getPool();
    const result = await pool
      .request()
      .query(`SELECT pagerCode FROM PagerDevice WHERE deletedAt IS NULL`);

    const existingCodes: string[] = result.recordset.map(
      (r: { pagerCode: string }) => r.pagerCode?.trim().toUpperCase()
    );

    let maxNum = 0;
    for (const code of existingCodes) {
      if (!code) continue;
      const match = code.match(/(\d+)$/);
      if (match) {
        const num = parseInt(match[1], 10);
        if (!isNaN(num) && num > maxNum) {
          maxNum = num;
        }
      }
    }

    let nextNum = maxNum + 1;
    let generatedCode = `P${String(nextNum).padStart(2, '0')}`;

    while (existingCodes.includes(generatedCode)) {
      nextNum++;
      generatedCode = `P${String(nextNum).padStart(2, '0')}`;
    }

    return generatedCode;
  }

  /**
   * Tạo mới hoặc tái kích hoạt thẻ nếu mã cũ từng bị xóa mềm
   */
  async createPager(data: CreatePagerType) {
    const pool = await getPool();
    const request = pool.request();

    const status = data.status || 'AVAILABLE';
    const battery = Math.min(100, Math.max(0, Math.floor(Number(data.batteryLevel) || 100)));

    request.input('pagerCode', sql.VarChar(50), data.pagerCode);
    request.input('status', sql.NVarChar(50), status);
    request.input('batteryLevel', sql.Int, battery);

    const query = `
      IF EXISTS (SELECT 1 FROM PagerDevice WHERE pagerCode = @pagerCode AND deletedAt IS NOT NULL)
      BEGIN
        UPDATE PagerDevice
        SET deletedAt = NULL,
            status = @status,
            batteryLevel = @batteryLevel,
            updatedAt = SYSDATETIME()
        OUTPUT 
          INSERTED.id,
          INSERTED.pagerCode,
          INSERTED.status,
          INSERTED.batteryLevel,
          INSERTED.createdAt
        WHERE pagerCode = @pagerCode;
      END
      ELSE
      BEGIN
        INSERT INTO PagerDevice (pagerCode, status, batteryLevel, createdAt)
        OUTPUT 
          INSERTED.id,
          INSERTED.pagerCode,
          INSERTED.status,
          INSERTED.batteryLevel,
          INSERTED.createdAt
        VALUES (@pagerCode, @status, @batteryLevel, SYSDATETIME());
      END
    `;
    const result = await request.query(query);
    return result.recordset[0];
  }

  /**
   * Cập nhật thông tin thẻ rung
   */
  async updatePager(id: number, data: UpdatePagerType) {
    const pool = await getPool();
    const request = pool.request();
    const updateFields: string[] = [];

    request.input('id', sql.Int, id);

    if (data.pagerCode !== undefined) {
      request.input('pagerCode', sql.VarChar(50), data.pagerCode);
      updateFields.push('pagerCode = @pagerCode');
    }

    if (data.status !== undefined) {
      request.input('status', sql.NVarChar(50), data.status);
      updateFields.push('status = @status');
    }

    if (data.batteryLevel !== undefined) {
      request.input('batteryLevel', sql.Int, data.batteryLevel);
      updateFields.push('batteryLevel = @batteryLevel');
    }

    if (updateFields.length === 0) return null;

    updateFields.push('updatedAt = SYSDATETIME()');

    const query = `
      UPDATE PagerDevice
      SET ${updateFields.join(', ')}
      OUTPUT 
        INSERTED.id,
        INSERTED.pagerCode,
        INSERTED.status,
        INSERTED.batteryLevel,
        INSERTED.updatedAt
      WHERE id = @id AND deletedAt IS NULL
    `;
    const result = await request.query(query);
    return result.recordset[0] || null;
  }

  /**
   * Cập nhật trạng thái thẻ rung
   */
  async updateStatus(id: number, status: string) {
    const pool = await getPool();
    const request = pool.request();

    request.input('id', sql.Int, id);
    request.input('status', sql.NVarChar(50), status);

    const query = `
      UPDATE PagerDevice
      SET status = @status, updatedAt = SYSDATETIME()
      OUTPUT 
        INSERTED.id,
        INSERTED.pagerCode,
        INSERTED.status,
        INSERTED.batteryLevel,
        INSERTED.updatedAt
      WHERE id = @id AND deletedAt IS NULL
    `;
    const result = await request.query(query);
    return result.recordset[0] || null;
  }

  /**
   * Cập nhật mức pin của thẻ rung
   */
  async updateBattery(id: number, batteryLevel: number) {
    const pool = await getPool();
    const request = pool.request();

    request.input('id', sql.Int, id);
    request.input('batteryLevel', sql.Int, batteryLevel);

    const query = `
      UPDATE PagerDevice
      SET batteryLevel = @batteryLevel, updatedAt = SYSDATETIME()
      OUTPUT 
        INSERTED.id,
        INSERTED.pagerCode,
        INSERTED.status,
        INSERTED.batteryLevel,
        INSERTED.updatedAt
      WHERE id = @id AND deletedAt IS NULL
    `;
    const result = await request.query(query);
    return result.recordset[0] || null;
  }

  /**
   * Gỡ liên kết thẻ rung khỏi các đơn hàng đang chờ pha chế hoặc chờ lấy món khi thu hồi thẻ
   */
  async detachPagerFromPendingOrders(pagerId: number): Promise<void> {
  const pool = await getPool();
  const request = pool.request();
  request.input('pagerId', sql.Int, pagerId);

  // Khi thu hồi thẻ: Hoàn tất đơn hàng, lưu giờ nhận món và giải phóng liên kết thẻ
  await request.query(`
    UPDATE [Order] 
    SET status = 'COMPLETED',
        pickupAt = ISNULL(pickupAt, SYSDATETIME()),
        pagerId = NULL,
        updatedAt = SYSDATETIME() 
    WHERE pagerId = @pagerId 
      AND status IN ('PENDING_PREP', 'PREPARING', 'READY_FOR_PICKUP') 
      AND deletedAt IS NULL;
  `);
}

  /**
   * Xóa mềm thiết bị thẻ rung
   */
  async softDeletePager(id: number): Promise<boolean> {
    const pool = await getPool();
    const request = pool.request();

    request.input('id', sql.Int, id);
    const query = `
      UPDATE PagerDevice
      SET deletedAt = SYSDATETIME()
      WHERE id = @id AND deletedAt IS NULL
    `;
    const result = await request.query(query);
    return result.rowsAffected[0] > 0;
  }

  /**
   * Bảng điều phối theo dõi thẻ rung đang cấp cho khách từ View v_ActivePagerDashboard
   */
  async getActivePagerDashboard() {
    const pool = await getPool();
    const query = `
      SELECT 
        pagerCode,
        pagerStatus,
        batteryLevel,
        orderId,
        orderCode,
        customerName,
        customerPhone,
        waitingMinutes
      FROM v_ActivePagerDashboard
      ORDER BY waitingMinutes DESC
    `;
    const result = await pool.request().query(query);
    return result.recordset;
  }
}