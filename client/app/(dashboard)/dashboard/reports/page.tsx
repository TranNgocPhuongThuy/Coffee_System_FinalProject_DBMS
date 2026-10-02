"use client";

import { useState } from "react";
import {
  TrendingUp,
  Receipt,
  Coffee,
  Users,
  Download,
  Sparkles,
  ArrowUpRight,
  ChevronDown,
} from "lucide-react";

interface WeeklyBar {
  day: string;
  revenue: number;
  orders: number;
  heightPercent: number;
  isPeak?: boolean;
}

const WEEKLY_DATA: WeeklyBar[] = [
  { day: "Thứ 2", revenue: 1850000, orders: 72, heightPercent: 45 },
  { day: "Thứ 3", revenue: 2150000, orders: 84, heightPercent: 55 },
  { day: "Thứ 4", revenue: 1950000, orders: 78, heightPercent: 48 },
  { day: "Thứ 5", revenue: 2600000, orders: 98, heightPercent: 68 },
  { day: "Thứ 6", revenue: 3200000, orders: 115, heightPercent: 82 },
  { day: "Thứ 7", revenue: 4100000, orders: 156, heightPercent: 100, isPeak: true },
  { day: "Chủ nhật", revenue: 3850000, orders: 142, heightPercent: 92 },
];

const TOP_PRODUCTS = [
  {
    rank: 1,
    name: "Cà phê sữa đá",
    category: "Cà phê",
    quantity: 185,
    revenue: 5365000,
    percentage: 38,
  },
  {
    rank: 2,
    name: "Bạc xỉu 3 tầng",
    category: "Cà phê",
    quantity: 142,
    revenue: 4544000,
    percentage: 30,
  },
  {
    rank: 3,
    name: "Trà đào cam sả",
    category: "Trà trái cây",
    quantity: 98,
    revenue: 3430000,
    percentage: 22,
  },
  {
    rank: 4,
    name: "Trà sen vàng macchiato",
    category: "Trà trái cây",
    quantity: 76,
    revenue: 2964000,
    percentage: 18,
  },
  {
    rank: 5,
    name: "Bánh Tiramisu Espresso",
    category: "Bánh ngọt",
    quantity: 45,
    revenue: 2025000,
    percentage: 12,
  },
];

export default function ReportsPage() {
  const [timeFilter, setTimeFilter] = useState("Tuần này");

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(val);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* 1. Page Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Báo cáo doanh thu
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Tổng hợp hiệu suất kinh doanh, số lượng đơn hàng và sản phẩm bán chạy
          </p>
        </div>

        {/* Action Toolbar */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Time filter selector */}
          <div className="relative">
            <select
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
              className="pl-3.5 pr-8 py-2 rounded-xl border border-gray-200 bg-white text-gray-800 text-xs font-semibold shadow-2xs hover:bg-gray-50 transition-colors focus:outline-none focus:border-[#6F4E37] focus:ring-2 focus:ring-[#6F4E37]/20 cursor-pointer appearance-none"
            >
              <option value="Hôm nay">Hôm nay</option>
              <option value="Tuần này">Tuần này</option>
              <option value="Tháng này">Tháng này</option>
              <option value="Năm nay">Năm nay</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Export Excel Button */}
          <button
            type="button"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4 text-gray-500" />
            <span>Xuất Excel</span>
          </button>
        </div>
      </div>

      {/* 2. Quick Stat Cards (4 Columns) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Card 1: Tổng doanh thu */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Tổng doanh thu
            </p>
            <h3 className="text-2xl font-extrabold text-[#6F4E37] mt-1.5">
              19.700.000 đ
            </h3>
            <div className="flex items-center gap-1 mt-2 text-xs font-semibold text-emerald-600">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+15.2% so với kỳ trước</span>
            </div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        {/* Card 2: Tổng số đơn hàng */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Tổng đơn hàng
            </p>
            <h3 className="text-2xl font-extrabold text-gray-900 mt-1.5">
              745 <span className="text-sm font-normal text-gray-500">đơn</span>
            </h3>
            <div className="flex items-center gap-1 mt-2 text-xs font-semibold text-emerald-600">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+8.5% tăng trưởng</span>
            </div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
            <Receipt className="w-5 h-5" />
          </div>
        </div>

        {/* Card 3: Món bán chạy nhất */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Món bán chạy nhất
            </p>
            <h3 className="text-lg font-bold text-gray-900 mt-1.5 truncate max-w-[160px]">
              Cà phê sữa đá
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              Đã bán: <span className="font-semibold text-gray-700">185 ly</span>
            </p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-[#F5EBE6] text-[#6F4E37] flex items-center justify-center shrink-0">
            <Coffee className="w-5 h-5" />
          </div>
        </div>

        {/* Card 4: Khách hàng mới */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Khách hàng mới
            </p>
            <h3 className="text-2xl font-extrabold text-gray-900 mt-1.5">
              64 <span className="text-sm font-normal text-gray-500">thành viên</span>
            </h3>
            <div className="flex items-center gap-1 mt-2 text-xs font-semibold text-blue-600">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+18 khách tuần này</span>
            </div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Users className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* 3. Main Content: Chart (Left) + Top Products List (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cột Trái: Biểu đồ tăng trưởng doanh thu theo tuần (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
          {/* Chart Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
            <div>
              <h3 className="text-base font-bold text-gray-900">
                Doanh thu theo ngày ({timeFilter})
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Đỉnh doanh thu vào Thứ 7 (4.100.000 đ)
              </p>
            </div>
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#6F4E37] bg-[#F5EBE6] px-3 py-1 rounded-full w-fit">
              <Sparkles className="w-3.5 h-3.5" />
              Tổng: 19.700.000 đ
            </span>
          </div>

          {/* Bar Chart Mockup Area */}
          <div className="h-64 sm:h-72 w-full flex items-end justify-between gap-2 sm:gap-4 pt-8 pb-2 px-2 border-b border-gray-100">
            {WEEKLY_DATA.map((item) => (
              <div
                key={item.day}
                className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer"
              >
                {/* Tooltip on hover */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-150 mb-2 bg-gray-900 text-white text-[10px] font-medium py-1 px-2 rounded-md shadow-lg pointer-events-none whitespace-nowrap text-center">
                  <p className="font-bold">{formatCurrency(item.revenue)}</p>
                  <p className="text-gray-300 text-[9px]">{item.orders} đơn</p>
                </div>

                {/* Vertical Bar */}
                <div className="w-full max-w-[42px] bg-gray-100 rounded-t-xl overflow-hidden flex flex-col justify-end h-full">
                  <div
                    style={{ height: `${item.heightPercent}%` }}
                    className={`w-full rounded-t-xl transition-all duration-300 ${
                      item.isPeak
                        ? "bg-[#6F4E37] shadow-sm shadow-[#6F4E37]/30"
                        : "bg-[#8D6E63] group-hover:bg-[#6F4E37]"
                    }`}
                  />
                </div>

                {/* Day label */}
                <span
                  className={`text-[11px] mt-3 font-semibold transition-colors ${
                    item.isPeak
                      ? "text-[#6F4E37] font-bold"
                      : "text-gray-500 group-hover:text-gray-800"
                  }`}
                >
                  {item.day}
                </span>
              </div>
            ))}
          </div>

          {/* Chart Footer Notes */}
          <div className="mt-4 flex items-center justify-between text-xs text-gray-400 pt-2">
            <span>Đơn vị: VNĐ</span>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#8D6E63] inline-block" />
                Ngày thường
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#6F4E37] inline-block" />
                Đỉnh doanh thu
              </span>
            </div>
          </div>
        </div>

        {/* Cột Phải: Top sản phẩm bán chạy (1 col) */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-gray-100 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-gray-900">
              Top món bán chạy
            </h3>
            <span className="text-xs text-gray-400 font-medium">Theo số lượng</span>
          </div>

          {/* List items */}
          <div className="flex-1 space-y-4">
            {TOP_PRODUCTS.map((prod) => (
              <div key={prod.name} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ${
                        prod.rank === 1
                          ? "bg-amber-100 text-amber-800"
                          : prod.rank === 2
                          ? "bg-slate-200 text-slate-700"
                          : prod.rank === 3
                          ? "bg-orange-100 text-orange-800"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {prod.rank}
                    </span>
                    <span className="font-semibold text-gray-800">
                      {prod.name}
                    </span>
                  </div>
                  <span className="font-bold text-[#6F4E37]">
                    {prod.quantity} ly
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${prod.percentage * 2.5}%` }}
                    className="h-full bg-[#6F4E37] rounded-full"
                  />
                </div>

                <div className="flex justify-between text-[11px] text-gray-400">
                  <span>{prod.category}</span>
                  <span className="font-medium text-gray-600">
                    {formatCurrency(prod.revenue)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
