
// 1. Trạng thái của từng ly nước trong hàng đợi pha chế
export type KdsItemStatus = 'PENDING' | 'PREPARING' | 'DONE' | 'CANCELLED';

// 2. Trạng thái lọc trên thanh công cụ KDS (Khớp với QueryKdsQueueSchema backend)
export type KdsQueueStatusFilter = 'ALL' | 'PENDING' | 'PREPARING';

// 3. Topping đi kèm của từng ly nước
export interface KdsItemTopping {
  name: string;
  quantity: number;
}

// 4. Chi tiết một món cần pha chế (Khớp 100% câu SELECT từ kds.repo.ts)
export interface KdsQueueItem {
  orderId: number;
  orderCode: string;
  orderChannel: string;
  pagerCode: string | null;       // Cho phép null khi đơn không gắn thẻ rung
  batteryLevel: number | null;    // Cho phép null
  orderDetailId: number;
  itemSnapshotName: string;
  sizeSnapshot: string;
  quantity: number;
  note: string | null;            // Cho phép null khi khách không ghi chú
  itemStatus: KdsItemStatus;
  itemCreatedAt: string;          // ISO Date string
  waitingMinutes: number;         // DATEDIFF tính từ DB
  toppings: KdsItemTopping[];
}

// 5. Payload khi Barista bấm chuyển trạng thái món (Khớp UpdateItemStatusSchema backend)
export interface UpdateKdsItemStatusPayload {
  itemStatus: 'PREPARING' | 'DONE' | 'CANCELLED';
}

// 6. Response trả về từ API chuông báo sẵn sàng
export interface KdsNotifyReadyResponse {
  orderId: number;
  status: string;
  pagerId: number | null;
  itemsCompleted?: number;
  alarmTriggered: boolean;
  message: string;
}