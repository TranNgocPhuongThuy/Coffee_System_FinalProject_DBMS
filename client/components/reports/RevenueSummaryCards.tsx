import React from 'react';
import { TrendingUp, Receipt, Coffee, AlertTriangle } from 'lucide-react';
import { RevenueOverviewReport } from '@/types/report';

interface RevenueSummaryCardsProps {
  overview: RevenueOverviewReport | null;
  lowStockCount: number;
  topProductName?: string;
  topProductQty?: number;
  loading?: boolean;
}

export const RevenueSummaryCards: React.FC<RevenueSummaryCardsProps> = ({
  overview,
  lowStockCount,
  topProductName = '—',
  topProductQty = 0,
  loading = false,
}) => {
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(val || 0);
  };

  const netRevenue = overview?.netRevenue || 0;
  const totalOrders = overview?.totalOrders || 0;
  const totalDiscount = overview?.totalDiscount || 0;

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 animate-pulse h-28 flex items-center justify-between">
            <div className="space-y-2 flex-1">
              <div className="h-3 bg-gray-200 rounded w-24" />
              <div className="h-6 bg-gray-200 rounded w-32" />
              <div className="h-3 bg-gray-100 rounded w-20" />
            </div>
            <div className="w-11 h-11 bg-gray-200 rounded-xl shrink-0" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Card 1: Tổng doanh thu thực nhận */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-start justify-between">
        <div>
          <p className="text-xs text-gray-400 font-medium">
            Doanh thu thực nhận
          </p>
          <h3 className="text-xl font-bold text-[#6F4E37] mt-0.5">
            {formatCurrency(netRevenue)}
          </h3>
          <p className="text-xs text-gray-400 font-medium mt-1">
            Đã giảm giá: <span className="text-amber-600 font-semibold">{formatCurrency(totalDiscount)}</span>
          </p>
        </div>
        <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
          <TrendingUp className="w-5 h-5" />
        </div>
      </div>

      {/* Card 2: Tổng số đơn hàng */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-start justify-between">
        <div>
          <p className="text-xs text-gray-400 font-medium">
            Tổng đơn hàng
          </p>
          <h3 className="text-xl font-bold text-gray-900 mt-0.5">
            {totalOrders.toLocaleString('vi-VN')} <span className="text-sm font-normal text-gray-500">đơn</span>
          </h3>
          <p className="text-xs text-gray-400 mt-1">Ghi nhận từ POS & Online</p>
        </div>
        <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
          <Receipt className="w-5 h-5" />
        </div>
      </div>

      {/* Card 3: Món bán chạy nhất */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-start justify-between">
        <div className="min-w-0 pr-2">
          <p className="text-xs text-gray-400 font-medium">
            Món bán chạy nhất
          </p>
          <h3 className="text-xl font-bold text-gray-900 mt-0.5 truncate">
            {topProductName}
          </h3>
          <p className="text-xs text-gray-400 mt-1">
            Đã bán: <span className="font-semibold text-gray-700">{topProductQty.toLocaleString('vi-VN')} ly</span>
          </p>
        </div>
        <div className="w-11 h-11 rounded-xl bg-[#F5EBE6] text-[#6F4E37] flex items-center justify-center shrink-0">
          <Coffee className="w-5 h-5" />
        </div>
      </div>

      {/* Card 4: Cảnh báo kho nguyên liệu */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-start justify-between">
        <div>
          <p className="text-xs text-gray-400 font-medium">
            Cảnh báo kho
          </p>
          <h3 className="text-xl font-bold text-rose-600 mt-0.5">
            {lowStockCount} <span className="text-sm font-normal text-rose-500">mặt hàng</span>
          </h3>
          <p className="text-xs text-rose-500/80 font-medium mt-1">Sắp hết hoặc chạm ngưỡng</p>
        </div>
        <div className="w-11 h-11 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
          <AlertTriangle className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
};

export default RevenueSummaryCards;
