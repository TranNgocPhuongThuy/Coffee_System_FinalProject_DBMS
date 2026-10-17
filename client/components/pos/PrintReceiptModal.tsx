// components/pos/PrintReceiptModal.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { X, Printer, Loader2, CheckCircle2 } from 'lucide-react';
import { posService } from '@/api/pos.service';
import { InvoiceData, printReceipt } from '@/utils/printReceipt';

interface PrintReceiptModalProps {
  isOpen: boolean;
  orderId: number | null;
  onClose: () => void;
}

export const PrintReceiptModal: React.FC<PrintReceiptModalProps> = ({
  isOpen,
  orderId,
  onClose,
}) => {
  const [invoice, setInvoice] = useState<InvoiceData | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && orderId) {
      setLoading(true);
      setErrorMsg(null);
      posService
        .getInvoice(orderId)
        .then((res: any) => {
          const data = res?.data || res;
          setInvoice(data);
        })
        .catch((err: any) => {
          setErrorMsg(err.message || 'Không thể tải thông tin hóa đơn');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [isOpen, orderId]);

  if (!isOpen || !orderId) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const handlePrint = () => {
    if (invoice) {
      printReceipt(invoice);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
      <div className="relative flex max-h-[90vh] w-full max-w-md flex-col overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-200 px-6 py-4 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F5EBE6] text-[#6F4E37] dark:bg-[#6F4E37]/20 dark:text-[#D4A373]">
              <Printer className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-zinc-900 dark:text-zinc-100">Xem trước Hóa đơn in</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Mẫu in nhiệt chuẩn 80mm</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-200 cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Nội dung hóa đơn cuộn được */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 text-zinc-400">
              <Loader2 className="h-8 w-8 animate-spin text-[#6F4E37] mb-2" />
              <p className="text-xs font-medium">Đang trích xuất snapshot hóa đơn...</p>
            </div>
          ) : errorMsg ? (
            <div className="rounded-xl bg-red-50 p-4 text-center text-xs font-semibold text-red-600 border border-red-200 dark:bg-red-950/40 dark:border-red-800 dark:text-red-300">
              {errorMsg}
            </div>
          ) : invoice ? (
            <div className="rounded-xl border border-dashed border-zinc-300 bg-zinc-50 p-5 font-mono text-xs dark:border-zinc-700 dark:bg-zinc-950/80 shadow-inner">
              {/* Receipt Header */}
              <div className="text-center font-bold text-sm uppercase">HỆ THỐNG CÀ PHÊ MEPHAPHIN</div>
              <div className="text-center text-[10px] text-zinc-500">Số 01 Võ Văn Ngân, TP. Thủ Đức, TP. HCM</div>
              <div className="my-2 border-t border-dashed border-zinc-400" />

              <div className="text-center font-bold text-xs">PHIẾU THANH TOÁN</div>
              <div className="text-center font-bold text-[#6F4E37] dark:text-[#D4A373]">{invoice.orderCode}</div>
              <div className="my-2 border-t border-dashed border-zinc-400" />

              <div className="space-y-0.5 text-[11px]">
                <div>
                  <strong>Thời gian:</strong>{' '}
                  {new Date(invoice.paidAt || invoice.orderCreatedAt || Date.now()).toLocaleString('vi-VN')}
                </div>
                <div>
                  <strong>Thu ngân:</strong> {invoice.employeeName || 'Quầy POS'}
                </div>
                {invoice.customerName && (
                  <div>
                    <strong>Khách hàng:</strong> {invoice.customerName} ({invoice.customerPhone})
                  </div>
                )}
                <div>
                  <strong>Phương thức thanh toán:</strong>{' '}
                  <span className="font-bold text-[#6F4E37] dark:text-[#D4A373]">
                    {invoice.paymentMethod === 'BANK_TRANSFER' || invoice.paymentMethod === 'BANKING'
                      ? 'Chuyển khoản (VietQR)'
                      : invoice.paymentMethod === 'CARD' || invoice.paymentMethod === 'CREDIT_CARD'
                        ? 'Thẻ ngân hàng (POS)'
                        : invoice.paymentMethod === 'MOMO'
                          ? 'Ví MoMo'
                          : invoice.paymentMethod === 'VNPAY'
                            ? 'Cổng VNPay-QR'
                            : invoice.paymentMethod === 'POINT_EXCHANGE'
                              ? 'Đổi điểm hội viên'
                              : 'Tiền mặt'}
                  </span>
                </div>
              </div>
              <div className="my-2 border-t border-dashed border-zinc-400" />

              {/* Items */}
              <table className="w-full text-left text-[11px]">
                <thead>
                  <tr className="border-b border-zinc-300">
                    <th className="py-1">Món</th>
                    <th className="text-right py-1">T.Tiền</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                  {invoice.items?.map((item, idx) => (
                    <tr key={idx} className="align-top">
                      <td className="py-1 pr-2">
                        <div className="font-bold">
                          {idx + 1}. {item.itemSnapshotName} ({item.sizeSnapshot})
                        </div>
                        {item.itemNote && <div className="italic text-zinc-500">* {item.itemNote}</div>}
                        <div className="text-zinc-500 text-[10px]">
                          {item.quantity} x {formatCurrency(item.unitPrice + (item.totalToppingPriceSnapshot || 0))}
                        </div>
                      </td>
                      <td className="text-right font-bold py-1">{formatCurrency(item.lineTotalPrice)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="my-2 border-t border-dashed border-zinc-400" />

              {/* Totals */}
              <div className="space-y-1 text-[11px]">
                <div className="flex justify-between">
                  <span>Tạm tính:</span>
                  <span className="font-bold">{formatCurrency(invoice.subTotal)}</span>
                </div>
                {invoice.discountAmount > 0 && (
                  <div className="flex justify-between text-[#6F4E37] dark:text-[#D4A373] font-bold">
                    <span>Chiết khấu:</span>
                    <span>-{formatCurrency(invoice.discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-black pt-1 border-t border-zinc-300">
                  <span>TỔNG CỘNG:</span>
                  <span>{formatCurrency(invoice.totalAmount)}</span>
                </div>
                <div className="flex justify-between text-[11px] text-zinc-600 dark:text-zinc-400 pt-0.5">
                  <span>Thanh toán:</span>
                  <span className="font-bold text-zinc-900 dark:text-zinc-100">
                    {invoice.paymentMethod === 'BANK_TRANSFER' || invoice.paymentMethod === 'BANKING'
                      ? 'Chuyển khoản (VietQR)'
                      : invoice.paymentMethod === 'CARD' || invoice.paymentMethod === 'CREDIT_CARD'
                        ? 'Thẻ ngân hàng (POS)'
                        : invoice.paymentMethod === 'MOMO'
                          ? 'Ví MoMo'
                          : invoice.paymentMethod === 'VNPAY'
                            ? 'Cổng VNPay-QR'
                            : invoice.paymentMethod === 'POINT_EXCHANGE'
                              ? 'Đổi điểm hội viên'
                              : 'Tiền mặt'}
                  </span>
                </div>
              </div>

              <div className="my-3 border-t-2 border-zinc-400" />
              <div className="text-center text-[10px] text-zinc-500">* Cảm ơn Quý khách và Hẹn gặp lại! *</div>
            </div>
          ) : null}
        </div>

        {/* Footer Actions */}
        <div className="border-t border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-zinc-200 px-4 py-2.5 text-sm font-semibold text-zinc-700 hover:bg-zinc-100 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-800 cursor-pointer"
          >
            Đóng
          </button>
          <button
            type="button"
            disabled={!invoice || loading}
            onClick={handlePrint}
            className="flex items-center gap-2 rounded-xl bg-[#6F4E37] px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-[#6F4E37]/30 hover:bg-[#5A3F2C] active:scale-[0.98] disabled:opacity-50 cursor-pointer"
          >
            <Printer className="h-4 w-4" />
            <span>In Hóa Đơn Ngay</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrintReceiptModal;
