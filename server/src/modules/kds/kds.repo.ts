import { getPool, sql } from "@/config/database";
import { QueryKdsQueueType, UpdateItemStatusType } from "./kds.schema";

export class KDSRepo {
  // 1. Lấy danh sách hàng đợi các món cần pha chế trên KDS (UC17)
  async getKdsQueue(query: QueryKdsQueueType) {
    const pool = await getPool();
    const req = pool.request();

    const conditions: string[] = [
      "o.status IN ('PENDING_PREP', 'READY_FOR_PICKUP')",
      "od.itemStatus NOT IN ('DONE', 'CANCELLED')",
      "o.deletedAt IS NULL",
    ];

    if (query.status !== "ALL") {
      req.input("itemStatus", sql.NVarChar(50), query.status);
      conditions.push("od.itemStatus = @itemStatus");
    }

    const sqlStr = `
      SELECT 
        o.id AS orderId,
        o.orderCode,
        o.orderChannel,
        p.pagerCode,
        p.batteryLevel,
        od.id AS orderDetailId,
        od.itemSnapshotName,
        od.sizeSnapshot,
        od.quantity,
        od.note,
        od.itemStatus,
        od.createdAt AS itemCreatedAt,
        DATEDIFF(MINUTE, od.createdAt, SYSDATETIME()) AS waitingMinutes
      FROM OrderDetail od
      JOIN [Order] o ON od.orderId = o.id
      LEFT JOIN PagerDevice p ON o.pagerId = p.id
      WHERE ${conditions.join(" AND ")}
      ORDER BY od.createdAt ASC
    `;
    const itemsResult = await req.query(sqlStr);

    // Nếu không có món nào
    if (itemsResult.recordset.length === 0) {
      return [];
    }

    // Lấy kèm topping cho từng ly
    const detailIds = itemsResult.recordset.map((item) => item.orderDetailId);
    let toppingsByDetailId: Record<number, any[]> = {};

    if (detailIds.length > 0) {
      const topReq = pool.request();
      const paramNames = detailIds.map((id, index) => {
        topReq.input(`id${index}`, sql.Int, id);
        return `@id${index}`;
      });

      const toppingResult = await topReq.query(`
    SELECT orderDetailId, toppingSnapshotName, quantity 
    FROM OrderDetailTopping
    WHERE orderDetailId IN (${paramNames.join(",")})
  `);

      toppingsByDetailId = toppingResult.recordset.reduce(
        (acc: any, top: any) => {
          if (!acc[top.orderDetailId]) acc[top.orderDetailId] = [];
          acc[top.orderDetailId].push({
            name: top.toppingSnapshotName,
            quantity: top.quantity,
          });
          return acc;
        },
        {},
      );
    }

    // Ghép topping vào từng dòng ly nước
    return itemsResult.recordset.map((item) => ({
      ...item,
      toppings: toppingsByDetailId[item.orderDetailId] || [],
    }));
  }

  // 2. Barista cập nhật trạng thái món -> Nếu chuyển sang 'DONE',
  // Trigger trg_Ingredient_TruKho_KhiHoanThanhMon dưới CSDL sẽ tự động trừ kho BOM!
  async updateItemStatus(orderDetailId: number, data: UpdateItemStatusType) {
    const pool = await getPool();
    const req = pool.request();

    req.input("orderDetailId", sql.Int, orderDetailId);
    req.input("itemStatus", sql.NVarChar(50), data.itemStatus);

    const result = await req.query(`
      UPDATE OrderDetail
      SET itemStatus = @itemStatus,
          updatedAt = SYSDATETIME()
      OUTPUT 
        INSERTED.id,
        INSERTED.orderId,
        INSERTED.itemSnapshotName,
        INSERTED.sizeSnapshot,
        INSERTED.itemStatus,
        INSERTED.updatedAt
      WHERE id = @orderDetailId
    `);

    return result.recordset[0] || null;
  }

  // 3. Rung chuông thẻ rung & Chuyển trạng thái Order sang READY_FOR_PICKUP (UC18, UC19)
 // modules/kds/kds.repo.ts

  async triggerReadyAlarm(orderId: number) {
    const pool = await getPool();
    const req = pool.request();

    req.input("OrderId", sql.Int, orderId);
    req.output("PagerId", sql.Int);
    req.output("PendingCount", sql.Int);

    // Gọi Stored Procedure đóng gói trọn vẹn nghiệp vụ
    const result = await req.execute("sp_KDS_NotifyOrderReady");

    const pagerId = result.output.PagerId;
    const pendingCount = result.output.PendingCount;

    return {
      orderId,
      status: "READY_FOR_PICKUP",
      pagerId,
      itemsCompleted: pendingCount,
      alarmTriggered: true,
      message: "Đã kích hoạt thẻ rung và cập nhật đơn hàng sẵn sàng nhận đồ uống.",
    };
  }
}
