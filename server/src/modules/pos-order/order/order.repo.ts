// Path: src/modules/pos-order/order/order.repo.ts

import { getPool, sql } from "@/config/database";
import {
  CreateOrderType,
  FilterOrderQueryType,
  OrderItemType,
} from "./order.schema";

export class OrderRepo {
  /**
   * Khởi tạo Table-Valued Parameter (TVP) udt_OrderDetailList theo đúng 8 cột trong Database
   */
  private buildOrderDetailTVP(items: OrderItemType[]): sql.Table {
    const tvp = new sql.Table("udt_OrderDetailList");
    tvp.columns.add("itemIndex", sql.Int, { nullable: false });
    tvp.columns.add("variantId", sql.Int, { nullable: false });
    tvp.columns.add("quantity", sql.Int, { nullable: false });
    tvp.columns.add("note", sql.NVarChar(255), { nullable: true });
    tvp.columns.add("itemSnapshotName", sql.NVarChar(200), { nullable: false });
    tvp.columns.add("sizeSnapshot", sql.NVarChar(50), { nullable: false });
    tvp.columns.add("unitPrice", sql.Decimal(18, 2), { nullable: false });
    tvp.columns.add("totalToppingPriceSnapshot", sql.Decimal(18, 2), {
      nullable: false,
    });
    tvp.columns.add("totalPrice", sql.Decimal(18, 2), { nullable: false });

    items.forEach((item, index) => {
      tvp.rows.add(
        index,
        item.variantId,
        item.quantity,
        item.note || null,
        item.itemSnapshotName,
        item.sizeSnapshot,
        item.unitPrice,
        item.totalToppingPriceSnapshot ?? 0,
        item.totalPrice,
      );
    });
    return tvp;
  }

  // Hàm tạo TVP cho Topping
  private buildOrderDetailToppingTVP(items: OrderItemType[]): sql.Table {
    const tvp = new sql.Table("udt_OrderDetailToppingList");
    tvp.columns.add("itemIndex", sql.Int, { nullable: false });
    tvp.columns.add("toppingId", sql.Int, { nullable: true });
    tvp.columns.add("toppingSnapshotName", sql.NVarChar(150), {
      nullable: false,
    });
    tvp.columns.add("toppingPrice", sql.Decimal(18, 2), { nullable: false });
    tvp.columns.add("quantity", sql.Int, { nullable: false });

    items.forEach((item, index) => {
      if (item.toppings && item.toppings.length > 0) {
        item.toppings.forEach((topping) => {
          tvp.rows.add(
            index,
            topping.toppingId || null,
            topping.toppingSnapshotName,
            topping.toppingPrice,
            topping.quantity || 1,
          );
        });
      }
    });
    return tvp;
  }

  /**
   * Lưu danh sách Topping cho các món trong đơn hàng (nếu có)
   */
  private async insertToppingsForOrder(
    orderId: number,
    items: OrderItemType[],
  ) {
    const hasToppings = items.some(
      (it) => it.toppings && it.toppings.length > 0,
    );
    if (!hasToppings) return;

    const pool = await getPool();
    const detailRes = await pool
      .request()
      .input("orderId", sql.Int, orderId)
      .query(
        `SELECT id FROM OrderDetail WHERE orderId = @orderId ORDER BY id ASC`,
      );

    const detailIds = detailRes.recordset.map((r: any) => r.id);

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const detailId = detailIds[i];
      if (detailId && item.toppings && item.toppings.length > 0) {
        for (const topping of item.toppings) {
          await pool
            .request()
            .input("orderDetailId", sql.Int, detailId)
            .input("toppingId", sql.Int, topping.toppingId || null)
            .input(
              "toppingSnapshotName",
              sql.NVarChar(150),
              topping.toppingSnapshotName,
            )
            .input("toppingPrice", sql.Decimal(18, 2), topping.toppingPrice)
            .input("quantity", sql.Int, topping.quantity || 1).query(`
              IF NOT EXISTS (
                SELECT 1 FROM OrderDetailTopping 
                WHERE orderDetailId = @orderDetailId AND toppingSnapshotName = @toppingSnapshotName
              )
              BEGIN
                INSERT INTO OrderDetailTopping (orderDetailId, toppingId, toppingSnapshotName, toppingPrice, quantity)
                VALUES (@orderDetailId, @toppingId, @toppingSnapshotName, @toppingPrice, @quantity)
              END
            `);
        }
      }
    }
  }

  /**
   * Tạo đơn hàng tại quầy thông qua Stored Procedure sp_CreateCounterOrder
   */
  async createCounterOrder(data: CreateOrderType): Promise<number> {
    const pool = await getPool();
    const request = pool.request();

    const detailsTVP = this.buildOrderDetailTVP(data.items);
    const toppingsTVP = this.buildOrderDetailToppingTVP(data.items);

    request.input("OrderCode", sql.VarChar(64), data.orderCode);
    request.input(
      "OrderChannel",
      sql.NVarChar(50),
      data.orderChannel || "ORDER_AT_COUNTER",
    );
    request.input("EmployeeId", sql.Int, data.employeeId);
    request.input("CustomerId", sql.Int, data.customerId || null);
    request.input("PagerId", sql.Int, data.pagerId || null);
    request.input("SubTotal", sql.Decimal(18, 2), data.subTotal);
    request.input(
      "DiscountAmount",
      sql.Decimal(18, 2),
      data.discountAmount || 0,
    );
    request.input("TotalAmount", sql.Decimal(18, 2), data.totalAmount);
    request.input("PaymentMethod", sql.NVarChar(50), data.paymentMethod);
    request.input("OrderDetails", detailsTVP);
    request.input("OrderToppings", toppingsTVP);
    request.output("NewOrderId", sql.Int);

    const result = await request.execute("sp_CreateCounterOrder");
    const newOrderId = result.output.NewOrderId;

    if (newOrderId) {
      await this.insertToppingsForOrder(newOrderId, data.items);
    }

    return newOrderId;
  }

  /**
   * Tạo đơn hàng kết hợp cấp phát thẻ rung qua Stored Procedure sp_CreateOrderWithPager
   */
  async createOrderWithPager(data: CreateOrderType): Promise<number> {
    const pool = await getPool();
    const request = pool.request();

    const detailsTVP = this.buildOrderDetailTVP(data.items);

    request.input("OrderCode", sql.VarChar(64), data.orderCode);
    request.input(
      "OrderChannel",
      sql.NVarChar(50),
      data.orderChannel || "ORDER_AT_COUNTER",
    );
    request.input("PagerCode", sql.VarChar(50), data.pagerCode);
    request.input("EmployeeId", sql.Int, data.employeeId);
    request.input("CustomerId", sql.Int, data.customerId || null);
    request.input("SubTotal", sql.Decimal(18, 2), data.subTotal);
    request.input(
      "DiscountAmount",
      sql.Decimal(18, 2),
      data.discountAmount || 0,
    );
    request.input("PaymentMethod", sql.NVarChar(50), data.paymentMethod);
    request.input("OrderDetails", detailsTVP);
    request.output("NewOrderId", sql.Int);

    const result = await request.execute("sp_CreateOrderWithPager");
    const newOrderId = result.output.NewOrderId;

    if (newOrderId) {
      await this.insertToppingsForOrder(newOrderId, data.items);
    }

    return newOrderId;
  }

  /**
   * Tự động tích điểm hội viên khi tạo đơn hàng thành công tại quầy (10.000 VNĐ = 1 Điểm)
   */
  async earnLoyaltyPoints(
    orderId: number,
    customerId: number,
    totalAmount: number,
  ): Promise<number> {
    if (!customerId || totalAmount < 10000) return 0;

    const pointsEarned = Math.floor(totalAmount / 10000);
    if (pointsEarned <= 0) return 0;

    const pool = await getPool();
    // Lấy số dư điểm hiện tại
    const custRes = await pool
      .request()
      .input("customerId", sql.Int, customerId)
      .query(
        `SELECT rewardPoints FROM Customer WHERE id = @customerId AND deletedAt IS NULL`,
      );

    const currentPoints = custRes.recordset[0]?.rewardPoints || 0;
    const newBalance = currentPoints + pointsEarned;

    // Ghi vào sổ cái LoyaltyTransaction (Trigger trg_LoyaltyTransaction_SyncPoints sẽ tự động sync sang Customer.rewardPoints)
    await pool
      .request()
      .input("customerId", sql.Int, customerId)
      .input("orderId", sql.Int, orderId)
      .input("points", sql.Int, pointsEarned)
      .input("balanceAfter", sql.Int, newBalance)
      .input(
        "description",
        sql.NVarChar(500),
        `Tích điểm từ đơn hàng #${orderId}`,
      ).query(`
        INSERT INTO LoyaltyTransaction (customerId, orderId, transactionType, points, balanceAfter, description, createdAt)
        VALUES (@customerId, @orderId, 'EARN', @points, @balanceAfter, @description, SYSDATETIME())
      `);

    return pointsEarned;
  }

  /**
   * Hoàn tất thanh toán qua Stored Procedure sp_CompleteOrderPayment
   */
  async completeOrderPayment(
    orderId: number,
    paymentMethod: string,
  ): Promise<void> {
    const pool = await getPool();
    await pool
      .request()
      .input("OrderId", sql.Int, orderId)
      .input("PaymentMethod", sql.NVarChar(50), paymentMethod)
      .execute("sp_CompleteOrderPayment");
  }

  /**
   * Hủy đơn hàng và giải phóng thẻ rung qua Stored Procedure sp_CancelOrder
   */
  async cancelOrder(
    orderId: number,
    employeeId: number,
    cancelReason: string,
  ): Promise<void> {
    const pool = await getPool();
    await pool
      .request()
      .input("OrderId", sql.Int, orderId)
      .input("EmployeeId", sql.Int, employeeId)
      .input("CancelReason", sql.NVarChar(500), cancelReason)
      .execute("sp_CancelOrder");
  }

  /**
   * Áp dụng điểm thưởng hội viên để chiết khấu qua Stored Procedure sp_ApplyLoyaltyPoints
   */
  async applyLoyaltyPoints(
    orderId: number,
    customerId: number,
    pointsToRedeem: number,
    conversionRate: number = 1000,
  ): Promise<void> {
    const pool = await getPool();
    await pool
      .request()
      .input("OrderId", sql.Int, orderId)
      .input("CustomerId", sql.Int, customerId)
      .input("PointsToRedeem", sql.Int, pointsToRedeem)
      .input("ConversionRate", sql.Decimal(18, 2), conversionRate)
      .execute("sp_ApplyLoyaltyPoints");
  }

  /**
   * Xóa món khỏi đơn hàng chưa chế biến qua Stored Procedure sp_RemoveOrderItem
   */
  async removeOrderItem(orderDetailId: number): Promise<void> {
    const pool = await getPool();
    await pool
      .request()
      .input("OrderDetailId", sql.Int, orderDetailId)
      .execute("sp_RemoveOrderItem");
  }

  /**
   * Kiểm tra tính khả dụng của thẻ rung thông qua Function fn_IsPagerAvailable
   */
  async isPagerAvailable(pagerId: number): Promise<boolean> {
    const pool = await getPool();
    const result = await pool
      .request()
      .input("pagerId", sql.Int, pagerId)
      .query(`SELECT dbo.fn_IsPagerAvailable(@pagerId) AS isAvailable`);

    return (
      result.recordset[0]?.isAvailable === true ||
      result.recordset[0]?.isAvailable === 1
    );
  }

  /**
   * Lấy danh sách đơn hàng có phân trang và bộ lọc
   */
  async getOrders(filter: FilterOrderQueryType) {
    const pool = await getPool();
    const request = pool.request();

    const {
      search,
      status,
      paymentMethod,
      orderChannel,
      employeeId,
      customerId,
      fromDate,
      toDate,
      page = 1,
      limit = 20,
    } = filter;

    const offset = (page - 1) * limit;
    const conditions: string[] = ["o.deletedAt IS NULL"];

    if (search) {
      request.input("search", sql.NVarChar(150), `%${search}%`);
      conditions.push(
        "(o.orderCode LIKE @search OR c.fullName LIKE @search OR c.phoneNumber LIKE @search)",
      );
    }

    if (status) {
      request.input("status", sql.NVarChar(50), status);
      conditions.push("o.status = @status");
    }

    if (paymentMethod) {
      request.input("paymentMethod", sql.NVarChar(50), paymentMethod);
      conditions.push("o.paymentMethod = @paymentMethod");
    }

    if (orderChannel) {
      request.input("orderChannel", sql.NVarChar(50), orderChannel);
      conditions.push("o.orderChannel = @orderChannel");
    }

    if (employeeId) {
      request.input("employeeId", sql.Int, employeeId);
      conditions.push("o.employeeId = @employeeId");
    }

    if (customerId) {
      request.input("customerId", sql.Int, customerId);
      conditions.push("o.customerId = @customerId");
    }

    if (fromDate) {
      const formattedFrom = fromDate.includes("T")
        ? fromDate.split("T")[0]
        : fromDate;
      request.input("fromDate", sql.Date, formattedFrom);
      conditions.push("CAST(o.createdAt AS DATE) >= @fromDate");
    }

    if (toDate) {
      const formattedTo = toDate.includes("T") ? toDate.split("T")[0] : toDate;
      request.input("toDate", sql.Date, formattedTo);
      conditions.push("CAST(o.createdAt AS DATE) <= @toDate");
    }

    const whereClause = `WHERE ${conditions.join(" AND ")}`;

    // Đếm tổng số bản ghi
    const countRes = await request.query(
      `SELECT COUNT(1) AS total 
       FROM [Order] o 
       LEFT JOIN Customer c ON o.customerId = c.id 
       ${whereClause}`,
    );
    const totalItems = countRes.recordset[0]?.total || 0;

    // Lấy dữ liệu phân trang
    request.input("offset", sql.Int, offset);
    request.input("limit", sql.Int, limit);

    const listQuery = `
      SELECT 
        o.id,
        o.orderCode,
        o.orderChannel,
        o.status,
        o.paymentMethod,
        o.subTotal,
        o.discountAmount,
        o.totalAmount,
        o.paidAt,
        o.pickupAt,
        o.cancelReason,
        o.createdAt,
        o.updatedAt,
        e.id AS employeeId,
        e.fullName AS employeeName,
        c.id AS customerId,
        c.fullName AS customerName,
        c.phoneNumber AS customerPhone,
        p.id AS pagerId,
        p.pagerCode
      FROM [Order] o
      LEFT JOIN Employee e ON o.employeeId = e.id
      LEFT JOIN Customer c ON o.customerId = c.id
      LEFT JOIN PagerDevice p ON o.pagerId = p.id
      ${whereClause}
      ORDER BY o.createdAt DESC
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
   * Lấy chi tiết đơn hàng (Header, Item Details, Toppings)
   */
  async getOrderById(id: number) {
    const pool = await getPool();
    const request = pool.request();
    request.input("id", sql.Int, id);

    // Lấy thông tin Header của Order
    const orderRes = await request.query(`
      SELECT 
        o.id,
        o.orderCode,
        o.orderChannel,
        o.status,
        o.paymentMethod,
        o.subTotal,
        o.discountAmount,
        o.totalAmount,
        o.paidAt,
        o.pickupAt,
        o.cancelReason,
        o.createdAt,
        o.updatedAt,
        e.id AS employeeId,
        e.fullName AS employeeName,
        c.id AS customerId,
        c.fullName AS customerName,
        c.phoneNumber AS customerPhone,
        c.membershipTier AS customerTier,
        c.rewardPoints AS customerPoints,
        p.id AS pagerId,
        p.pagerCode,
        p.status AS pagerStatus
      FROM [Order] o
      LEFT JOIN Employee e ON o.employeeId = e.id
      LEFT JOIN Customer c ON o.customerId = c.id
      LEFT JOIN PagerDevice p ON o.pagerId = p.id
      WHERE o.id = @id AND o.deletedAt IS NULL
    `);

    const order = orderRes.recordset[0];
    if (!order) return null;

    // Lấy danh sách OrderDetail
    const itemsRes = await pool.request().input("orderId", sql.Int, id).query(`
        SELECT 
          od.id,
          od.variantId,
          od.quantity,
          od.note,
          od.itemSnapshotName,
          od.sizeSnapshot,
          od.unitPrice,
          od.totalToppingPriceSnapshot,
          od.totalPrice,
          od.itemStatus,
          od.createdAt
        FROM OrderDetail od
        WHERE od.orderId = @orderId
        ORDER BY od.id ASC
      `);

    const items = itemsRes.recordset;

    // Lấy Topping cho từng item nếu có
    if (items.length > 0) {
      const detailIds = items.map((i: any) => i.id);
      const toppingsRes = await pool.request().query(`
          SELECT 
            id,
            orderDetailId,
            toppingId,
            toppingSnapshotName,
            toppingPrice,
            quantity
          FROM OrderDetailTopping
          WHERE orderDetailId IN (${detailIds.join(",")})
        `);

      const toppings = toppingsRes.recordset;
      for (const item of items) {
        item.toppings = toppings.filter(
          (t: any) => t.orderDetailId === item.id,
        );
      }
    }

    return {
      ...order,
      items,
    };
  }

  /**
   * Truy vấn thông tin chi tiết hóa đơn từ View v_InvoiceDetails
   */
  async getInvoiceDetails(orderId: number) {
    const pool = await getPool();
    const result = await pool
      .request()
      .input("orderId", sql.Int, orderId)
      .query(`SELECT * FROM v_InvoiceDetails WHERE orderId = @orderId`);

    return result.recordset;
  }
}
