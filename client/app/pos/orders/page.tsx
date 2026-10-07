// app/pos/orders/page.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Search,
  Eye,
  Printer,
  Ban,
  Clock,
  ArrowLeft,
  User,
  Radio,
  Coffee,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Filter,
  Receipt,
  Plus,
} from 'lucide-react';
import { posService } from '@/api/pos.service';
import { OrderItemResponse } from '@/types/pos';
import { OrderStatus } from '@/types/enums';
import { OrderDetailDrawer } from '@/components/pos/OrderDetailDrawer';
import { PrintReceiptModal } from '@/components/pos/PrintReceiptModal';
import { CancelOrderModal } from '@/components/pos/CancelOrderModal';

const STATUS_FILTERS: { key: OrderStatus | 'ALL'; label: string }[] = [
  { key: 'ALL', label: 'Tất cả' },
  { key: 'PENDING_PREP', label: 'Chờ pha chế' },
  { key: 'PREPARING', label: 'Đang pha chế' },
  { key: 'READY_FOR_PICKUP', label: 'Chờ lấy món' },
  { key: 'COMPLETED', label: 'Hoàn tất' },
  { key: 'CANCELLED', label: 'Đã hủy' },
];

export default function PosOrdersPage() {
  const [orders, setOrders] = useState<OrderItemResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [meta, setMeta] = useState({ page: 1, limit: 10, totalItems: 0, totalPages: 1 });

  // Bộ lọc
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'ALL'>('ALL');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  // Modals & Drawer States
  const [selectedOrder, setSelectedOrder] = useState<OrderItemResponse | null>(null);
  const [printOrderId, setPrintOrderId] = useState<number | null>(null);
  const [cancelOrderId, setCancelOrderId] = useState<number | null>(null);
  const [cancelOrderCode, setCancelOrderCode] = useState<string>('');

  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const fetchOrders = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const params: any = {
        page,
        limit: 10,
      };

      if (search.trim()) params.search = search.trim();
      if (statusFilter !== 'ALL') params.status = statusFilter;
      if (fromDate) params.fromDate = fromDate;
      if (toDate) params.toDate = toDate;

      const res = await posService.getOrders(params);
      setOrders(res.items || res.data || []);
      if (res.meta) {
        setMeta(res.meta);
      }
    } catch (err: any) {
      setToastMessage({ type: 'error', message: err.message || 'Không thể tải danh sách đơn hàng' });
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, fromDate, toDate]);

  useEffect(() => {
    fetchOrders(1);
  }, [fetchOrders]);

  // Tự động tắt toast
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'PENDING_PREP':
        return <span className="rounded-md bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700 border border-amber-200 dark:bg-amber-950/40 dark:border-amber-800 dark:text-amber-300">Chờ pha chế</span>;
      case 'PREPARING':
        return <span className="rounded-md bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700 border border-blue-200 dark:bg-blue-950/40 dark:border-blue-800 dark:text-blue-300">Đang pha chế</span>;
      case 'READY_FOR_PICKUP':
        return <span className="rounded-md bg-purple-50 px-2.5 py-1 text-xs font-bold text-purple-700 border border-purple-200 dark:bg-purple-950/40 dark:border-purple-800 dark:text-purple-300">Chờ lấy món</span>;
      case 'COMPLETED':
        return <span className="rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-300">Hoàn tất</span>;
      case 'CANCELLED':
        return <span className="rounded-md bg-rose-50 px-2.5 py-1 text-xs font-bold text-rose-700 border border-rose-200 dark:bg-rose-950/40 dark:border-rose-800 dark:text-rose-300">Đã hủy</span>;
      default:
        return <span className="rounded-md bg-zinc-100 px-2.5 py-1 text-xs font-bold text-zinc-700">{status}</span>;
    }
  };

  const handleOpenDetail = async (id: number) => {
    try {
      const data = await posService.getOrderById(id);
      setSelectedOrder(data);
    } catch (err: any) {
      setToastMessage({ type: 'error', message: err.message || 'Không thể xem chi tiết đơn hàng' });
    }
  };

  const handlePayOrder = async (orderId: number) => {
    try {
      await posService.completePayment(orderId, 'CASH');
      setToastMessage({ type: 'success', message: `Thanh toán thành công đơn #${orderId}` });
      fetchOrders(meta.page);
      if (selectedOrder?.id === orderId) {
        handleOpenDetail(orderId);
      }
    } catch (err: any) {
      setToastMessage({ type: 'error', message: err.message || 'Thanh toán thất bại' });
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-zinc-100 dark:bg-zinc-950">
      {/* 1. Topbar */}
      <header className="flex h-16 items-center justify-between border-b border-zinc-200 bg-white px-6 dark:border-zinc-800 dark:bg-zinc-900 shadow-2xs">
        <div className="flex items-center gap-3">
          <Link
            href="/pos/terminal"
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-600 text-white font-black">
              <Receipt className="h-4 w-4" />
            </div>
            <div>
              <h1 className="font-extrabold text-base text-zinc-900 dark:text-zinc-100 tracking-tight leading-tight">
                QUẢN LÝ ĐƠN HÀNG POS
              </h1>
              <p className="text-xs text-zinc-400 font-medium leading-none">Danh sách & Tra cứu hóa đơn</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/pos/terminal"
            className="flex items-center gap-2 rounded-xl bg-amber-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-amber-600/30 hover:bg-amber-700 active:scale-95 transition-all"
          >
            <Plus className="h-4 w-4" />
            <span>Mở POS Bán hàng</span>
          </Link>
          <button
            type="button"
            onClick={() => fetchOrders(meta.page)}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-200 text-zinc-600 hover:bg-zinc-100 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
      </header>

      {/* 2. Toast Thông báo */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 animate-bounce">
          <div
            className={`flex items-center gap-2.5 rounded-xl px-4 py-3 text-xs font-bold shadow-xl ${
              toastMessage.type === 'success'
                ? 'bg-emerald-600 text-white'
                : 'bg-rose-600 text-white'
            }`}
          >
            {toastMessage.type === 'success' ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
            <span>{toastMessage.message}</span>
          </div>
        </div>
      )}

      {/* 3. Main Content Area */}
      <main className="flex-1 p-6 space-y-5 max-w-7xl mx-auto w-full">
        {/* Bộ lọc & Tìm kiếm */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-xs dark:border-zinc-800 dark:bg-zinc-900 space-y-3.5">
          <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              <input
                type="text"
                placeholder="Tìm mã đơn, tên khách, số điện thoại..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 pl-10 pr-4 py-2.5 text-xs text-zinc-900 placeholder:text-zinc-400 focus:border-amber-500 focus:bg-white focus:outline-none dark:border-zinc-800 dark:bg-zinc-850 dark:text-zinc-100"
              />
            </div>

            {/* Date filter */}
            <div className="flex items-center gap-2 text-xs">
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-zinc-800 dark:border-zinc-800 dark:bg-zinc-850 dark:text-zinc-200"
              />
              <span className="text-zinc-400 font-bold">-</span>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-zinc-800 dark:border-zinc-800 dark:bg-zinc-850 dark:text-zinc-200"
              />
            </div>
          </div>

          {/* Status Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {STATUS_FILTERS.map((f) => {
              const active = statusFilter === f.key;
              return (
                <button
                  key={f.key}
                  type="button"
                  onClick={() => setStatusFilter(f.key)}
                  className={`rounded-xl px-3.5 py-1.5 text-xs font-bold whitespace-nowrap transition-all ${
                    active
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400'
                  }`}
                >
                  {f.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Bảng danh sách đơn hàng */}
        <div className="rounded-2xl border border-zinc-200 bg-white shadow-xs dark:border-zinc-800 dark:bg-zinc-900 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-zinc-200 bg-zinc-50/70 text-zinc-500 font-bold uppercase tracking-wider dark:border-zinc-800 dark:bg-zinc-850/50">
                <tr>
                  <th className="py-3 px-4">Mã đơn</th>
                  <th className="py-3 px-4">Thời gian</th>
                  <th className="py-3 px-4">Khách hàng</th>
                  <th className="py-3 px-4">Thẻ rung</th>
                  <th className="py-3 px-4">Tổng tiền</th>
                  <th className="py-3 px-4">Hình thức</th>
                  <th className="py-3 px-4">Trạng thái</th>
                  <th className="py-3 px-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-zinc-400 font-medium">
                      Đang tải dữ liệu đơn hàng...
                    </td>
                  </tr>
                ) : orders.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-zinc-400 font-medium">
                      Không tìm thấy đơn hàng nào
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr key={order.id} className="hover:bg-zinc-50/80 dark:hover:bg-zinc-850/40 transition-colors">
                      <td className="py-3 px-4 font-extrabold text-zinc-900 dark:text-zinc-100">
                        #{order.orderCode}
                      </td>
                      <td className="py-3 px-4 text-zinc-500 dark:text-zinc-400">
                        {new Date(order.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                        <div className="text-[10px] text-zinc-400">
                          {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        {order.customerName ? (
                          <div>
                            <div className="font-bold text-zinc-800 dark:text-zinc-200">{order.customerName}</div>
                            <div className="text-[10px] text-zinc-400">{order.customerPhone}</div>
                          </div>
                        ) : (
                          <span className="text-zinc-400 italic">Khách vãng lai</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {order.pagerCode ? (
                          <span className="rounded-md bg-amber-500/10 px-2 py-0.5 text-xs font-black text-amber-600 dark:bg-amber-500/20 dark:text-amber-400">
                            {order.pagerCode}
                          </span>
                        ) : (
                          <span className="text-zinc-400">-</span>
                        )}
                      </td>
                      <td className="py-3 px-4 font-black text-amber-600 dark:text-amber-400">
                        {formatCurrency(order.totalAmount)}
                      </td>
                      <td className="py-3 px-4 font-medium text-zinc-600 dark:text-zinc-300">
                        {order.paymentMethod || 'Tiền mặt'}
                      </td>
                      <td className="py-3 px-4">{getStatusBadge(order.status)}</td>
                      <td className="py-3 px-4 text-right space-x-1.5 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => handleOpenDetail(order.id)}
                          title="Xem chi tiết"
                          className="rounded-lg p-1.5 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setPrintOrderId(order.id)}
                          title="In hóa đơn"
                          className="rounded-lg p-1.5 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
                        >
                          <Printer className="h-4 w-4" />
                        </button>
                        {order.status !== 'COMPLETED' && order.status !== 'CANCELLED' && (
                          <button
                            type="button"
                            onClick={() => {
                              setCancelOrderId(order.id);
                              setCancelOrderCode(order.orderCode);
                            }}
                            title="Hủy đơn"
                            className="rounded-lg p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                          >
                            <Ban className="h-4 w-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Phân trang */}
          {meta.totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-zinc-200 px-4 py-3 dark:border-zinc-800">
              <div className="text-xs text-zinc-500">
                Hiển thị trang <strong className="text-zinc-800 dark:text-zinc-200">{meta.page}</strong> /{' '}
                {meta.totalPages} ({meta.totalItems} đơn hàng)
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={meta.page <= 1}
                  onClick={() => fetchOrders(meta.page - 1)}
                  className="rounded-lg border border-zinc-200 p-1.5 text-zinc-600 hover:bg-zinc-100 disabled:opacity-40 dark:border-zinc-700 dark:text-zinc-300"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  disabled={meta.page >= meta.totalPages}
                  onClick={() => fetchOrders(meta.page + 1)}
                  className="rounded-lg border border-zinc-200 p-1.5 text-zinc-600 hover:bg-zinc-100 disabled:opacity-40 dark:border-zinc-700 dark:text-zinc-300"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Drawer xem chi tiết */}
      <OrderDetailDrawer
        isOpen={Boolean(selectedOrder)}
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
        onPrintInvoice={(id) => setPrintOrderId(id)}
        onPayOrder={handlePayOrder}
        onCancelOrder={(id) => {
          setCancelOrderId(id);
          setCancelOrderCode(selectedOrder?.orderCode || '');
        }}
      />

      {/* Modal in hóa đơn */}
      <PrintReceiptModal
        isOpen={Boolean(printOrderId)}
        orderId={printOrderId}
        onClose={() => setPrintOrderId(null)}
      />

      {/* Modal hủy đơn */}
      <CancelOrderModal
        isOpen={Boolean(cancelOrderId)}
        orderId={cancelOrderId}
        orderCode={cancelOrderCode}
        onClose={() => setCancelOrderId(null)}
        onSuccess={() => {
          setToastMessage({ type: 'success', message: 'Hủy đơn hàng và giải phóng thẻ rung thành công!' });
          fetchOrders(meta.page);
          if (selectedOrder?.id === cancelOrderId) {
            handleOpenDetail(cancelOrderId);
          }
        }}
      />
    </div>
  );
}
