import { SoftDeletableEntity } from './common';
import { PagerStatus } from './enums';

export interface PagerDevice extends SoftDeletableEntity {
  pagerCode: string;
  status: PagerStatus;
  batteryLevel: number;
}

// Phản hồi từ v_ActivePagerDashboard
export interface ActivePagerDashboardItem {
  pagerCode: string;
  pagerStatus: PagerStatus;
  batteryLevel: number;
  orderId: number;
  orderCode: string;
  customerName?: string | null;
  customerPhone?: string | null;
  waitingMinutes: number;
}