import React from 'react';
import { Sparkles, Trophy } from 'lucide-react';
import { TopProductReport } from '@/types/report';

interface RevenueBarChartProps {
  topProducts: TopProductReport[];
  loading?: boolean;
  timeFilterLabel?: string;
}

export const RevenueBarChart: React.FC<RevenueBarChartProps> = ({
  topProducts,
  loading = false,
  timeFilterLabel = 'Tuần này',
}) => {
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(val || 0);
  };

  const maxQty = Math.max(...topProducts.map((p) => p.totalQuantitySold || 1), 1);
  const totalQtyAll = topProducts.reduce((sum, p) => sum + (p.totalQuantitySold || 0), 0);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
        <div className="h-5 bg-gray-200 rounded w-48 animate-pulse" />
        <div className="space-y-3 pt-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-10 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
      <div className="flex items-center justify-between gap-2 mb-6">
        <div>
          <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-500" />
            <span>Top sản phẩm bán chạy ({timeFilterLabel})</span>
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">
            Xếp hạng sản phẩm theo số lượng bán ra & doanh thu thu được
          </p>
        </div>

        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#6F4E37] bg-[#F5EBE6] px-3 py-1.5 rounded-full shrink-0">
          <Sparkles className="w-3.5 h-3.5" />
          Tổng bán: {totalQtyAll.toLocaleString('vi-VN')} ly
        </span>
      </div>

      {topProducts.length > 0 ? (
        <div className="space-y-4">
          {topProducts.map((prod, idx) => {
            const name = prod.productName || `Sản phẩm #${idx + 1}`;
            const qty = prod.totalQuantitySold || 0;
            const rev = prod.totalRevenue || 0;
            const percent = Math.round((qty / maxQty) * 100);

            return (
              <div key={idx} className="space-y-1.5 group">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                        idx === 0
                          ? 'bg-amber-100 text-amber-800 border border-amber-300'
                          : idx === 1
                          ? 'bg-slate-200 text-slate-700 border border-slate-300'
                          : idx === 2
                          ? 'bg-orange-100 text-orange-800 border border-orange-300'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      #{idx + 1}
                    </span>
                    <span className="font-bold text-gray-800 group-hover:text-[#6F4E37] transition-colors">
                      {name}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="font-bold text-[#6F4E37] text-sm">
                      {qty.toLocaleString('vi-VN')}
                    </span>
                    <span className="text-xs text-gray-400 ml-1">ly</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${Math.max(percent, 4)}%` }}
                    className={`h-full rounded-full transition-all duration-500 ${
                      idx === 0
                        ? 'bg-gradient-to-r from-amber-500 to-[#6F4E37]'
                        : 'bg-[#6F4E37] group-hover:bg-[#5A3F2C]'
                    }`}
                  />
                </div>

                <div className="flex justify-between items-center text-[11px] text-gray-400 font-mono">
                  <span>Doanh thu tạo ra:</span>
                  <span className="font-semibold text-gray-700">{formatCurrency(rev)}</span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-12 text-center text-gray-400 text-sm">
          Chưa có dữ liệu sản phẩm bán chạy trong khoảng thời gian này.
        </div>
      )}
    </div>
  );
};

export default RevenueBarChart;
