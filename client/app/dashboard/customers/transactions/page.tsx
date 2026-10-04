'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Search,
  Filter,
  Clock,
  ArrowDownLeft,
  ArrowUpRight,
  PlusCircle,
  Calendar,
  FileText,
  X,
  ExternalLink,
} from 'lucide-react';
import { useAuthContext } from '@/context/AuthContext';
import { loyaltyService } from '@/api/loyalty.service';
import { LoyaltyTransaction } from '@/types/customer';
import { AdjustPointsModal } from '@/components/loyalty/AdjustPointsModal';

function TransactionsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialCustomerId = searchParams.get('customerId');

  const { user } = useAuthContext();
  const isManager = user?.role === 'MANAGER' || user?.role === 'ADMIN';

  const [transactions, setTransactions] = useState<LoyaltyTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [customerIdFilter, setCustomerIdFilter] = useState<string>(initialCustomerId || '');
  const [orderIdFilter, setOrderIdFilter] = useState<string>('');
  const [transactionType, setTransactionType] = useState<string>('all');
  const [fromDate, setFromDate] = useState<string>('');
  const [toDate, setToDate] = useState<string>('');

  // Sync customerIdFilter state with URL searchParams when URL changes
  useEffect(() => {
    const queryCustId = searchParams.get('customerId');
    setCustomerIdFilter(queryCustId || '');
  }, [searchParams]);

  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Modals
  const [isAdjustPointsOpen, setIsAdjustPointsOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    try {
      const res = await loyaltyService.getLoyaltyHistory({
        customerId: customerIdFilter ? Number(customerIdFilter) : undefined,
        orderId: orderIdFilter ? Number(orderIdFilter) : undefined,
        transactionType: transactionType !== 'all' ? (transactionType as 'EARN' | 'REDEEM') : undefined,
        fromDate: fromDate || undefined,
        toDate: toDate || undefined,
        page,
        limit: 20,
      });

      setTransactions(res.items || res.data || []);
      if (res.meta) {
        setTotalPages(res.meta.totalPages || 1);
        setTotalItems(res.meta.totalItems || 0);
      } else {
        setTotalItems(res.items?.length || 0);
      }
    } catch {
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  }, [customerIdFilter, orderIdFilter, transactionType, fromDate, toDate, page]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const handleFilterByCustomer = (id: number | string) => {
    const idStr = String(id);
    setCustomerIdFilter(idStr);
    setPage(1);
    router.push(`/dashboard/customers/transactions?customerId=${idStr}`);
  };

  const handleClearCustomerFilter = () => {
    setCustomerIdFilter('');
    setPage(1);
    router.push('/dashboard/customers/transactions');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-lg text-sm font-semibold z-50 animate-in fade-in">
          {toastMessage}
        </div>
      )}

      {/* Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <Link
            href="/dashboard/customers"
            className="inline-flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-gray-900 transition-colors mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Danh sách Khách hàng</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Sổ cái biến động điểm thưởng</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Nhật ký toàn bộ giao dịch tích điểm (EARN) và trừ / đổi điểm (REDEEM)
          </p>
        </div>

        {isManager && (
          <button
            type="button"
            onClick={() => setIsAdjustPointsOpen(true)}
            className="flex items-center gap-2 bg-[#6F4E37] hover:bg-[#5A3F2C] text-white px-4 py-2.5 rounded-xl font-semibold text-sm shadow-sm transition-all cursor-pointer active:scale-[0.99]"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Điều chỉnh điểm thủ công</span>
          </button>
        )}
      </div>

      {/* Customer Filter Active Indicator Badge */}
      {customerIdFilter && (
        <div className="p-3 bg-[#FAF6F0] rounded-xl border border-[#EBE3D5] flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#6F4E37]" />
            <p className="text-xs text-gray-700 font-medium">
              Đang lọc giao dịch theo Khách hàng: <span className="font-bold text-[#6F4E37]">#{customerIdFilter}</span>
            </p>
          </div>
          <button
            type="button"
            onClick={handleClearCustomerFilter}
            className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 hover:underline cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
            <span>Xóa lọc khách hàng</span>
          </button>
        </div>
      )}

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Filter Customer ID */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Mã Khách hàng (ID)</label>
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="number"
                value={customerIdFilter}
                onChange={(e) => {
                  const val = e.target.value;
                  setCustomerIdFilter(val);
                  setPage(1);
                  if (val) {
                    router.push(`/dashboard/customers/transactions?customerId=${val}`);
                  } else {
                    router.push('/dashboard/customers/transactions');
                  }
                }}
                placeholder="Nhập ID khách..."
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#6F4E37] focus:ring-2 focus:ring-[#6F4E37]/20"
              />
            </div>
          </div>

          {/* Filter Order ID */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Mã đơn hàng (Order ID)</label>
            <div className="relative">
              <FileText className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="number"
                value={orderIdFilter}
                onChange={(e) => {
                  setOrderIdFilter(e.target.value);
                  setPage(1);
                }}
                placeholder="Nhập mã đơn..."
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#6F4E37] focus:ring-2 focus:ring-[#6F4E37]/20"
              />
            </div>
          </div>

          {/* Filter Transaction Type */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Loại giao dịch</label>
            <div className="relative">
              <Filter className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                value={transactionType}
                onChange={(e) => {
                  setTransactionType(e.target.value);
                  setPage(1);
                }}
                className="w-full pl-9 pr-8 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#6F4E37] focus:ring-2 focus:ring-[#6F4E37]/20 cursor-pointer appearance-none bg-white"
              >
                <option value="all">Tất cả loại giao dịch</option>
                <option value="EARN">Cộng điểm (+)</option>
                <option value="REDEEM">Trừ / Đổi điểm (-)</option>
              </select>
            </div>
          </div>

          {/* Filter Date Range */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Từ ngày</label>
            <div className="relative">
              <Calendar className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="date"
                value={fromDate}
                onChange={(e) => {
                  setFromDate(e.target.value);
                  setPage(1);
                }}
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#6F4E37] focus:ring-2 focus:ring-[#6F4E37]/20"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Transactions Data Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#FAF6F0] border-b border-gray-100 text-xs font-bold text-gray-600 uppercase tracking-wider">
                <th className="py-3.5 px-5">Mã GD</th>
                <th className="py-3.5 px-5">Khách hàng</th>
                <th className="py-3.5 px-5">Đơn hàng</th>
                <th className="py-3.5 px-5">Loại giao dịch</th>
                <th className="py-3.5 px-5">Số điểm</th>
                <th className="py-3.5 px-5">Số dư sau GD</th>
                <th className="py-3.5 px-5">Ghi chú</th>
                <th className="py-3.5 px-5">Thời gian</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-gray-400 text-sm">
                    Đang tải danh sách biến động điểm...
                  </td>
                </tr>
              ) : transactions.length > 0 ? (
                transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-gray-50/60 transition-colors">
                    {/* ID */}
                    <td className="py-3.5 px-5 font-mono text-xs font-bold text-gray-700">#{tx.id}</td>

                    {/* Customer */}
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleFilterByCustomer(tx.customerId)}
                          className="group text-left cursor-pointer"
                          title="Click để lọc tất cả giao dịch của khách này"
                        >
                          <span className="font-semibold text-gray-900 group-hover:text-[#6F4E37] transition-colors block">
                            {tx.customerName || `Khách hàng #${tx.customerId}`}
                          </span>
                          <span className="block text-xs text-gray-400 font-mono">
                            {tx.customerPhone || `ID: #${tx.customerId}`}
                          </span>
                        </button>

                        <Link
                          href={`/dashboard/customers/${tx.customerId}`}
                          className="p-1 text-gray-400 hover:text-[#6F4E37] transition-colors"
                          title="Xem hồ sơ chi tiết khách hàng"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </td>

                    {/* Order ID */}
                    <td className="py-3.5 px-5 text-xs font-mono">
                      {tx.orderId ? (
                        <span className="font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-md border border-blue-100">
                          Order #{tx.orderId}
                        </span>
                      ) : (
                        <span className="text-gray-400 italic">Hệ thống</span>
                      )}
                    </td>

                    {/* Transaction Type */}
                    <td className="py-3.5 px-5">
                      {tx.transactionType === 'EARN' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <ArrowDownLeft className="w-3.5 h-3.5" />
                          Cộng điểm
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-red-50 text-red-700 border border-red-200">
                          <ArrowUpRight className="w-3.5 h-3.5" />
                          Trừ điểm
                        </span>
                      )}
                    </td>

                    {/* Points */}
                    <td className="py-3.5 px-5 font-bold text-sm">
                      <span className={tx.transactionType === 'EARN' ? 'text-emerald-600' : 'text-red-600'}>
                        {tx.transactionType === 'EARN' ? `+${tx.points}` : `-${tx.points}`} pts
                      </span>
                    </td>

                    {/* Balance After */}
                    <td className="py-3.5 px-5 font-bold text-gray-900 font-mono text-xs">
                      {(tx.balanceAfter || 0).toLocaleString('vi-VN')} pts
                    </td>

                    {/* Description */}
                    <td className="py-3.5 px-5 text-xs text-gray-500 max-w-xs truncate">
                      {tx.description || '-'}
                    </td>

                    {/* Time */}
                    <td className="py-3.5 px-5 text-xs text-gray-400 font-mono">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-gray-400" />
                        <span>{tx.createdAt ? new Date(tx.createdAt).toLocaleString('vi-VN') : 'N/A'}</span>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-gray-400 text-sm">
                    Không có nhật ký giao dịch phù hợp với bộ lọc.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info & Pagination */}
        <div className="p-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500 bg-white">
          <p>
            Hiển thị <span className="font-semibold text-gray-700">{transactions.length}</span> / {totalItems} bản ghi
          </p>

          {totalPages > 1 && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 font-semibold cursor-pointer"
              >
                Trước
              </button>
              <span className="font-semibold text-gray-700">
                {page} / {totalPages}
              </span>
              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 font-semibold cursor-pointer"
              >
                Sau
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Adjust Points Modal */}
      <AdjustPointsModal
        isOpen={isAdjustPointsOpen}
        onClose={() => setIsAdjustPointsOpen(false)}
        onSuccess={() => {
          showToast('Điều chỉnh điểm thưởng thành công!');
          fetchTransactions();
        }}
      />
    </div>
  );
}

export default function TransactionsPage() {
  return (
    <Suspense fallback={<div className="p-6 text-center text-gray-400 text-sm">Đang tải...</div>}>
      <TransactionsContent />
    </Suspense>
  );
}
