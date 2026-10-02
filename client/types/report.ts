export interface DailyRevenue {
  date: string;
  revenue: number;
  totalOrders: number;
}

export interface TopProductReport {
  productId: string;
  productName: string;
  quantitySold: number;
  totalRevenue: number;
}
