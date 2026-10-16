// components/pos/OrderDetailDrawer.tsx
'use client';

import React from 'react';
import {
  X,
  Printer,
  Ban,
  CheckCircle2,
  Clock,
  User,
  Radio,
  CreditCard,
  Coffee,
} from 'lucide-react';
import { OrderItemResponse } from '@/types/pos';
import { OrderStatus } from '@/types/enums';

interface OrderDetailDrawerProps {
  isOpen: boolean;
  order: OrderItemResponse | null;
  onClose: () => void;
  onPrintInvoice: (orderId: number) => void;
  onPayOrder?: (orderId: number) => void;
  onCancelOrder?: (orderId: number) => void;
}

export const OrderDetailDrawer: React.FC<OrderDetailDrawerProps> = ({
  isOpen,
  order,
  onClose,
  onPrintInvoice,
  onPayOrder,
  onCancelOrder,
}) => {
  if (!isOpen || !order) return null;

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
        return <span className="rounded-md bg-purple-50 px-2.5 py-1 text-xs font-bold text-purple-700 border border-purple-200 dark:bg-purple-950/40 dark:border-purple-800 dark:text-purple-300">Sẵn sàng lấy món</span>;
      case 'COMPLETED':
        return <span className="rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-300">Hoàn tất</span>;
      case 'CANCELLED':
        return <span className="rounded-md bg-rose-50 px-2.5 py-1 text-xs font-bold text-rose-700 border border-rose-200 dark:bg-rose-950/40 dark:border-rose-800 dark:text-rose-300">Đã hủy</span>;
      default:
        return <span className="rounded-md bg-zinc-100 px-2.5 py-1 text-xs font-bold text-zinc-700">{status}</span>;
    }
  };

  const isCompletedOrCancelled = order.status === 'COMPLETED' || order.status === 'CANCELLED';

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs animate-fade-in">
      <div className="flex h-full w-full max-w-lg flex-col bg-white shadow-2xl dark:bg-zinc-900 border-l border-zinc-200 dark:border-zinc-800 overflow-hidden">
        {/* Header Drawer */}
        <div className="flex items-center justify-between border-b border-zinc-200 px-6 py-4 dark:border-zinc-800">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-lg text-zinc-900 dark:text-zinc-100">
                #{order.orderCode}
              </h3>
              {getStatusBadge(order.status)}
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              Tạo lúc: {new Date(order.createdAt).toLocaleString('vi-VN')}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-200 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Nội dung chi tiết */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Thông tin đối tượng liên quan (Thu ngân, Khách hàng, Thẻ rung) */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-850/60">
              <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-500 dark:text-zinc-400 mb-1">
                <User className="h-3.5 w-3.5" />
                <span>Thu ngân:</span>
              </div>
              <div className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                {order.employeeName || 'Quầy thu ngân'}
              </div>
            </div>

            <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-850/60">
              <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-500 dark:text-zinc-400 mb-1">
                <Radio className="h-3.5 w-3.5" />
                <span>Thẻ rung:</span>
              </div>
              <div className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                {order.pagerCode ? (
                  <span className="text-[#6F4E37] dark:text-[#D4A373] font-extrabold">{order.pagerCode}</span>
                ) : (
                  <span className="text-zinc-400">Không dùng</span>
                )}
              </div>
            </div>
          </div>

          {/* Thông tin Khách hàng hội viên */}
          {order.customerName && (
            <div className="rounded-xl border border-[#EBE3D5] bg-[#FAF6F0] p-3.5 dark:border-[#6F4E37]/30 dark:bg-zinc-850">
              <div className="text-xs font-bold text-[#6F4E37] dark:text-[#D4A373] uppercase tracking-wider mb-1">
                Khách hàng hội viên
              </div>
              <div className="flex items-center justify-between text-sm">
                <div>
                  <span className="font-bold text-zinc-900 dark:text-zinc-100">{order.customerName}</span>
                  <span className="text-zinc-500 dark:text-zinc-400 ml-2">({order.customerPhone})</span>
                </div>
                {order.customerTier && (
                  <span className="rounded-md bg-[#F5EBE6] px-2 py-0.5 text-xs font-black text-[#6F4E37] dark:bg-[#6F4E37]/20 dark:text-[#D4A373]">
                    Hạng {order.customerTier}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Danh sách món trong đơn */}
          <div>
            <h4 className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-3">
              Danh sách món ({order.items?.length || 0} món)
            </h4>
            <div className="space-y-2.5">
              {order.items?.map((item) => (
                <div
                  key={item.id}
                  className="rounded-xl border border-zinc-200/90 bg-white p-3.5 dark:border-zinc-800 dark:bg-zinc-850/50"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                        {item.itemSnapshotName}{' '}
                        <span className="rounded bg-zinc-100 px-1.5 py-0.5 text-xs font-extrabold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                          {item.sizeSnapshot}
                        </span>
                      </div>
                      <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                        Số lượng: <strong className="text-zinc-900 dark:text-zinc-100">x{item.quantity}</strong> • Đơn giá:{' '}
                        {formatCurrency(item.unitPrice)}
                      </div>

                      {/* Toppings */}
                      {item.toppings && item.toppings.length > 0 && (
                        <div className="mt-1.5 flex flex-wrap gap-1">
                          {item.toppings.map((t) => (
                            <span
                              key={t.id}
                              className="rounded-md bg-[#F5EBE6] px-2 py-0.5 text-[11px] font-medium text-[#6F4E37] dark:bg-[#6F4E37]/20 dark:text-[#D4A373]"
                            >
                              +{t.toppingSnapshotName} ({formatCurrency(t.toppingPrice)})
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Note */}
                      {item.note && (
                        <p className="mt-1 text-xs italic text-zinc-500 dark:text-zinc-400">* {item.note}</p>
                      )}
                    </div>

                    <div className="text-right font-extrabold text-sm text-zinc-900 dark:text-zinc-100">
                      {formatCurrency(item.totalPrice)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Lý do hủy nếu có */}
          {order.cancelReason && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 p-3.5 text-xs text-rose-700 dark:border-rose-900/40 dark:bg-rose-950/20 dark:text-rose-300">
              <span className="font-bold">Lý do hủy đơn:</span> {order.cancelReason}
            </div>
          )}

          {/* Tổng quan thanh toán */}
          <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 space-y-2 dark:border-zinc-800 dark:bg-zinc-850/60 text-sm">
            <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
              <span>Tạm tính:</span>
              <span className="font-semibold text-zinc-900 dark:text-zinc-100">{formatCurrency(order.subTotal)}</span>
            </div>
            {order.discountAmount > 0 && (
              <div className="flex justify-between text-[#6F4E37] dark:text-[#D4A373] font-semibold">
                <span>Chiết khấu / Đổi điểm:</span>
                <span>-{formatCurrency(order.discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between font-extrabold text-base text-zinc-900 dark:text-zinc-100 pt-2 border-t border-zinc-200 dark:border-zinc-800">
              <span>Tổng thanh toán:</span>
              <span className="text-[#6F4E37] dark:text-[#D4A373]">{formatCurrency(order.totalAmount)}</span>
            </div>
            <div className="flex justify-between text-xs text-zinc-500 pt-1">
              <span>Phương thức:</span>
              <span className="font-bold text-zinc-800 dark:text-zinc-200">{order.paymentMethod || 'Tiền mặt'}</span>
            </div>
            {order.paidAt && (
              <div className="flex justify-between text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                <span>Thanh toán lúc:</span>
                <span>{new Date(order.paidAt).toLocaleString('vi-VN')}</span>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="border-t border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => onPrintInvoice(order.id)}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-zinc-300 bg-white py-2.5 text-sm font-bold text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 shadow-xs"
          >
            <Printer className="h-4 w-4" />
            <span>In hóa đơn</span>
          </button>

          {!isCompletedOrCancelled && (
            <>
              {onCancelOrder && (
                <button
                  type="button"
                  onClick={() => onCancelOrder(order.id)}
                  className="rounded-xl border border-rose-300 bg-rose-50 px-4 py-2.5 text-sm font-bold text-rose-700 hover:bg-rose-100 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-300"
                >
                  <Ban className="h-4 w-4" />
                </button>
              )}

              {onPayOrder && (
                <button
                  type="button"
                  onClick={() => onPayOrder(order.id)}
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-emerald-600 py-2.5 text-sm font-bold text-white shadow-md shadow-emerald-600/30 hover:bg-emerald-700"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Thanh toán</span>
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetailDrawer;
