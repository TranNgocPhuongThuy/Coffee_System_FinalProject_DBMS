"use client";

import { useState, useEffect } from "react";
import {
  TrendingUp,
  Receipt,
  Coffee,
  AlertTriangle,
  Download,
  Sparkles,
  ChevronDown,
  Loader2,
  RefreshCw,
} from "lucide-react";
import reportService from "@/api/report.service";

interface TopProductItem {
  productName?: string;
  name?: string;
  categoryName?: string;
  totalQuantity?: number;
  totalRevenue?: number;
}

interface RevenueItem {
  date?: string;
  day?: string;
  revenue?: number;
  orders?: number;
}

export default function ReportsPage() {
  const [timeFilter, setTimeFilter] = useState("Tuần này");
  const [loading, setLoading] = useState(true);
  const [topProducts, setTopProducts] = useState<TopProductItem[]>([]);
  const [revenueData, setRevenueData] = useState<RevenueItem[]>([]);
  const [lowStockCount, setLowStockCount] = useState(0);

  const fetchReportData = async () => {
    setLoading(true);
    try {
      const [topRes, revRes, lowStockRes] = await Promise.all([
        reportService.getTopProducts().catch(() => []),
        reportService.getDailyRevenue().catch(() => []),
        reportService.getLowStockAlert().catch(() => []),
      ]);

      setTopProducts(Array.isArray(topRes) ? topRes : []);
      setRevenueData(Array.isArray(revRes) ? revRes : []);
      setLowStockCount(Array.isArray(lowStockRes) ? lowStockRes.length : 0);
    } catch (err) {
      console.error("Failed to load report data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportData();
  }, [timeFilter]);

  const totalRevenue = revenueData.reduce((sum, item) => sum + (Number(item.revenue) || 0), 0);
  const totalOrders = revenueData.reduce((sum, item) => sum + (Number(item.orders) || 0), 0);
  const topProduct = topProducts[0]?.productName || topProducts[0]?.name || "—";
  const topProductQty = topProducts[0]?.totalQuantity || 0;

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(val);
  };

  const maxRevenue = Math.max(...revenueData.map((r) => Number(r.revenue) || 1), 1);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* 1. Page Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Báo cáo doanh thu & Kinh doanh
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Tổng hợp hiệu suất kinh doanh, số lượng đơn hàng và sản phẩm bán chạy từ hệ thống
          </p>
        </div>

        {/* Action Toolbar */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={fetchReportData}
            className="p-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 transition-colors cursor-pointer"
            title="Làm mới"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>

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

          <button
            type="button"
            onClick={() => alert("Đang xuất file Excel báo cáo...")}
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
              {formatCurrency(totalRevenue)}
            </h3>
            <p className="text-xs text-emerald-600 font-semibold mt-1">Dữ liệu thời gian thực</p>
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
              {totalOrders} <span className="text-sm font-normal text-gray-500">đơn</span>
            </h3>
            <p className="text-xs text-gray-400 mt-1">Ghi nhận qua POS</p>
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
              {topProduct}
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              Đã bán: <span className="font-semibold text-gray-700">{topProductQty} ly</span>
            </p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-[#F5EBE6] text-[#6F4E37] flex items-center justify-center shrink-0">
            <Coffee className="w-5 h-5" />
          </div>
        </div>

        {/* Card 4: Cảnh báo kho */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Cảnh báo kho
            </p>
            <h3 className="text-2xl font-extrabold text-rose-600 mt-1.5">
              {lowStockCount} <span className="text-sm font-normal text-rose-500">mặt hàng</span>
            </h3>
            <p className="text-xs text-rose-500/80 font-medium mt-1">Sắp hết hoặc cần nhập thêm</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* 3. Main Content: Chart (Left) + Top Products List (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cột Trái: Biểu đồ doanh thu */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
            <div>
              <h3 className="text-base font-bold text-gray-900">
                Biểu đồ doanh thu ({timeFilter})
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Thống kê doanh thu theo mốc thời gian
              </p>
            </div>
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#6F4E37] bg-[#F5EBE6] px-3 py-1 rounded-full w-fit">
              <Sparkles className="w-3.5 h-3.5" />
              Tổng: {formatCurrency(totalRevenue)}
            </span>
          </div>

          {loading ? (
            <div className="h-64 flex flex-col items-center justify-center text-gray-400">
              <Loader2 className="w-6 h-6 animate-spin mb-2 text-[#6F4E37]" />
              Đang tải dữ liệu biểu đồ...
            </div>
          ) : revenueData.length > 0 ? (
            <div className="h-64 sm:h-72 w-full flex items-end justify-between gap-2 sm:gap-4 pt-8 pb-2 px-2 border-b border-gray-100">
              {revenueData.map((item, idx) => {
                const heightPercent = Math.round(((Number(item.revenue) || 0) / maxRevenue) * 100);
                const label = item.day || item.date || `T${idx + 1}`;
                return (
                  <div
                    key={idx}
                    className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer"
                  >
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-150 mb-2 bg-gray-900 text-white text-[10px] font-medium py-1 px-2 rounded-md shadow-lg pointer-events-none whitespace-nowrap text-center">
                      <p className="font-bold">{formatCurrency(Number(item.revenue) || 0)}</p>
                      <p className="text-gray-300 text-[9px]">{item.orders || 0} đơn</p>
                    </div>

                    <div className="w-full max-w-[42px] bg-gray-100 rounded-t-xl overflow-hidden flex flex-col justify-end h-full">
                      <div
                        style={{ height: `${Math.max(heightPercent, 5)}%` }}
                        className="w-full rounded-t-xl bg-[#6F4E37] group-hover:bg-[#5A3F2C] transition-all duration-300"
                      />
                    </div>

                    <span className="text-[11px] mt-3 font-semibold text-gray-500 group-hover:text-gray-800 truncate max-w-[50px]">
                      {label}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-400 text-sm">
              Chưa có dữ liệu doanh thu trong khoảng thời gian này.
            </div>
          )}
        </div>

        {/* Cột Phải: Top sản phẩm bán chạy */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-gray-100 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-gray-900">
              Top sản phẩm bán chạy
            </h3>
            <span className="text-xs text-gray-400 font-medium">Số lượng ly</span>
          </div>

          <div className="flex-1 space-y-4">
            {loading ? (
              <div className="py-12 text-center text-gray-400">
                <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2 text-[#6F4E37]" />
                Đang tải danh sách...
              </div>
            ) : topProducts.length > 0 ? (
              topProducts.slice(0, 5).map((prod, idx) => {
                const name = prod.productName || prod.name || `Sản phẩm #${idx + 1}`;
                const qty = prod.totalQuantity || 0;
                const rev = prod.totalRevenue || 0;
                return (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ${
                            idx === 0
                              ? "bg-amber-100 text-amber-800"
                              : idx === 1
                              ? "bg-slate-200 text-slate-700"
                              : idx === 2
                              ? "bg-orange-100 text-orange-800"
                              : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {idx + 1}
                        </span>
                        <span className="font-semibold text-gray-800">{name}</span>
                      </div>
                      <span className="font-bold text-[#6F4E37]">{qty} ly</span>
                    </div>

                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        style={{
                          width: `${Math.min(
                            100,
                            (qty / (topProducts[0]?.totalQuantity || 1)) * 100
                          )}%`,
                        }}
                        className="h-full bg-[#6F4E37] rounded-full"
                      />
                    </div>

                    <div className="flex justify-between text-[11px] text-gray-400">
                      <span>{prod.categoryName || "Thực đơn"}</span>
                      <span className="font-medium text-gray-600">{formatCurrency(rev)}</span>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-xs text-gray-400 text-center py-8">Chưa có dữ liệu bán chạy.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
