'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  RefreshCw,
  Download,
  AlertTriangle,
  Calendar,
  Layers,
  ChevronDown,
} from 'lucide-react';
import reportService from '@/api/report.service';
import { RevenueOverviewReport, TopProductReport, LowStockIngredientReport } from '@/types/report';
import { RevenueSummaryCards } from '@/components/reports/RevenueSummaryCards';
import { RevenueBarChart } from '@/components/reports/RevenueBarChart';
import { ExportReportModal } from '@/components/reports/ExportReportModal';

export default function ReportsPage() {
  const [timeFilter, setTimeFilter] = useState<string>('Tuần này');
  const [customFromDate, setCustomFromDate] = useState<string>('');
  const [customToDate, setCustomToDate] = useState<string>('');

  const [loading, setLoading] = useState(true);
  const [revenueOverview, setRevenueOverview] = useState<RevenueOverviewReport | null>(null);
  const [topProducts, setTopProducts] = useState<TopProductReport[]>([]);
  const [lowStockIngredients, setLowStockIngredients] = useState<LowStockIngredientReport[]>([]);

  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Compute date range based on timeFilter
  const getDateRange = useCallback(() => {
    const today = new Date();
    const formatDate = (d: Date) => {
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    if (timeFilter === 'Tùy chỉnh') {
      return {
        fromDate: customFromDate || undefined,
        toDate: customToDate || undefined,
      };
    }

    if (timeFilter === 'Hôm nay') {
      const start = formatDate(today);
      return { fromDate: start, toDate: start };
    }

    if (timeFilter === 'Tuần này') {
      const pastWeek = new Date();
      pastWeek.setDate(today.getDate() - 7);
      return { fromDate: formatDate(pastWeek), toDate: formatDate(today) };
    }

    if (timeFilter === 'Tháng này') {
      const pastMonth = new Date();
      pastMonth.setDate(today.getDate() - 30);
      return { fromDate: formatDate(pastMonth), toDate: formatDate(today) };
    }

    if (timeFilter === 'Năm nay') {
      const startOfYear = new Date(today.getFullYear(), 0, 1);
      return { fromDate: formatDate(startOfYear), toDate: formatDate(today) };
    }

    return {};
  }, [timeFilter, customFromDate, customToDate]);

  const fetchReportData = useCallback(async () => {
    setLoading(true);
    const { fromDate, toDate } = getDateRange();

    try {
      const [overviewData, topRes, lowStockRes] = await Promise.all([
        reportService.getRevenueOverview({ fromDate, toDate }).catch(() => null),
        reportService.getTopProducts({ limit: 5, fromDate, toDate }).catch(() => []),
        reportService.getLowStockAlert().catch(() => []),
      ]);

      setRevenueOverview(overviewData);
      setTopProducts(Array.isArray(topRes) ? topRes : []);
      setLowStockIngredients(Array.isArray(lowStockRes) ? lowStockRes : []);
    } catch (err) {
      console.error('Failed to load report data:', err);
    } finally {
      setLoading(false);
    }
  }, [getDateRange]);

  useEffect(() => {
    fetchReportData();
  }, [fetchReportData]);

  const handleExportData = (
    format: 'csv' | 'json',
    options: { includeTopProducts: boolean; includeLowStock: boolean }
  ) => {
    const exportPayload = {
      title: `Báo cáo Doanh thu & Kinh doanh (${timeFilter})`,
      exportedAt: new Date().toLocaleString('vi-VN'),
      revenueOverview,
      ...(options.includeTopProducts ? { topProducts } : {}),
      ...(options.includeLowStock ? { lowStockIngredients } : {}),
    };

    if (format === 'json') {
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportPayload, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `bao-cao-doanh-thu-${Date.now()}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    } else {
      // CSV format
      let csvContent = 'data:text/csv;charset=utf-8,\uFEFF';
      csvContent += 'BÁO CÁO DOANH THU & KINH DOANH\n';
      csvContent += `Thời gian,${timeFilter}\n`;
      csvContent += `Tổng số đơn hàng,${revenueOverview?.totalOrders || 0}\n`;
      csvContent += `Doanh thu thực nhận,${revenueOverview?.netRevenue || 0}\n`;
      csvContent += `Tổng chiết khấu,${revenueOverview?.totalDiscount || 0}\n\n`;

      if (options.includeTopProducts && topProducts.length > 0) {
        csvContent += 'TOP SẢN PHẨM BÁN CHẠY\n';
        csvContent += 'Tên sản phẩm,Số lượng bán,Doanh thu\n';
        topProducts.forEach((p) => {
          csvContent += `"${p.productName}",${p.totalQuantitySold},${p.totalRevenue}\n`;
        });
        csvContent += '\n';
      }

      if (options.includeLowStock && lowStockIngredients.length > 0) {
        csvContent += 'CẢNH BÁO NGUYÊN LIỆU SẮP HẾT\n';
        csvContent += 'Tên nguyên liệu,Đơn vị,Tồn hiện tại,Ngưỡng tối thiểu\n';
        lowStockIngredients.forEach((i) => {
          csvContent += `"${i.name}",${i.unit},${i.stockQuantity},${i.minimumThreshold}\n`;
        });
      }

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `bao-cao-doanh-thu-${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    }

    showToast(`Đã xuất báo cáo định dạng .${format.toUpperCase()} thành công!`);
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(val || 0);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-lg text-sm font-semibold z-50 animate-in fade-in">
          {toastMessage}
        </div>
      )}

      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Báo cáo doanh thu & Kinh doanh
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Tổng hợp hiệu suất bán hàng, sản phẩm tiêu biểu và cảnh báo tồn kho
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={fetchReportData}
            className="p-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 transition-colors cursor-pointer"
            title="Làm mới dữ liệu"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#6F4E37]' : ''}`} />
          </button>

          {/* Time Filter Selector */}
          <div className="relative">
            <select
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
              className="pl-3.5 pr-8 py-2 rounded-xl border border-gray-200 bg-white text-gray-700 text-xs font-semibold focus:outline-none focus:border-[#6F4E37] focus:ring-2 focus:ring-[#6F4E37]/20 cursor-pointer appearance-none shadow-2xs"
            >
              <option value="Hôm nay">Hôm nay</option>
              <option value="Tuần này">Tuần này (7 ngày)</option>
              <option value="Tháng này">Tháng này (30 ngày)</option>
              <option value="Năm nay">Năm nay</option>
              <option value="Tùy chỉnh">Tùy chỉnh ngày</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Export Button */}
          <button
            type="button"
            onClick={() => setIsExportModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#6F4E37] hover:bg-[#5A3F2C] text-white text-xs font-semibold shadow-sm transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Xuất báo cáo</span>
          </button>
        </div>
      </div>

      {/* Custom Date Pickers (Shown if "Tùy chỉnh" is selected) */}
      {timeFilter === 'Tùy chỉnh' && (
        <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row items-center gap-3 animate-in fade-in">
          <div className="flex items-center gap-2 text-xs font-medium text-gray-600">
            <Calendar className="w-4 h-4 text-[#6F4E37]" />
            <span>Khoảng thời gian:</span>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={customFromDate}
              onChange={(e) => setCustomFromDate(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-gray-200 text-xs font-mono focus:outline-none focus:border-[#6F4E37]"
            />
            <span className="text-gray-400 text-xs">đến</span>
            <input
              type="date"
              value={customToDate}
              onChange={(e) => setCustomToDate(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-gray-200 text-xs font-mono focus:outline-none focus:border-[#6F4E37]"
            />
            <button
              type="button"
              onClick={fetchReportData}
              className="px-3 py-1.5 bg-[#6F4E37] text-white rounded-xl text-xs font-semibold hover:bg-[#5A3F2C]"
            >
              Áp dụng
            </button>
          </div>
        </div>
      )}

      {/* 2. Stat Summary Cards */}
      <RevenueSummaryCards
        overview={revenueOverview}
        lowStockCount={lowStockIngredients.length}
        topProductName={topProducts[0]?.productName}
        topProductQty={topProducts[0]?.totalQuantitySold}
        loading={loading}
      />

      {/* 3. Top Products Chart & Low Stock Alert Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Top Selling Products */}
        <div className="lg:col-span-2">
          <RevenueBarChart
            topProducts={topProducts}
            loading={loading}
            timeFilterLabel={timeFilter}
          />
        </div>

        {/* Right Column: Low Stock Ingredients Table */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-500" />
                <span>Cảnh báo kho nguyên liệu</span>
              </h3>
              <span className="text-xs text-rose-600 font-semibold bg-rose-50 px-2.5 py-1 rounded-full">
                {lowStockIngredients.length} mặt hàng
              </span>
            </div>

            {loading ? (
              <div className="py-10 text-center text-xs text-gray-400">Đang tải dữ liệu kho...</div>
            ) : lowStockIngredients.length > 0 ? (
              <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                {lowStockIngredients.map((item) => {
                  const shortage = item.minimumThreshold - item.stockQuantity;
                  return (
                    <div
                      key={item.id}
                      className="p-3 rounded-xl border border-rose-100 bg-rose-50/40 flex items-center justify-between text-xs hover:bg-rose-50 transition-colors"
                    >
                      <div>
                        <p className="font-bold text-gray-900">{item.name}</p>
                        <p className="text-[11px] text-gray-500 mt-0.5">
                          Tồn hiện tại: <span className="font-bold text-rose-600">{item.stockQuantity} {item.unit}</span>
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
                          Thiếu {shortage > 0 ? shortage : 0} {item.unit}
                        </span>
                        <p className="text-[10px] text-gray-400 mt-0.5">
                          Ngưỡng tối thiểu: {item.minimumThreshold} {item.unit}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-12 text-center text-gray-400 text-xs">
                Kho hàng đang ở trạng thái an toàn. Không có nguyên liệu dưới ngưỡng tối thiểu.
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-gray-100 text-right">
            <a
              href="/dashboard/inventory/ingredients"
              className="text-xs font-semibold text-[#6F4E37] hover:underline inline-flex items-center gap-1"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Quản lý kho nguyên liệu</span>
            </a>
          </div>
        </div>
      </div>

      {/* Export Report Modal */}
      <ExportReportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        onExport={handleExportData}
      />
    </div>
  );
}