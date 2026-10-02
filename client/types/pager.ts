export interface PagerDevice {
  id: string;
  code: string;
  status: string;
  battery: number;
}

export interface ActivePagerDashboard {
  activePagers: PagerDevice[];
}
