// components/pos/PrintReceiptModal.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { X, Printer, Loader2 } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-fade-in">
      <div className="relative flex max-h-[92vh] w-full max-w-md flex-col overflow-hidden rounded-2xl bg-zinc-900 border border-zinc-800 shadow-2xl text-zinc-100">
        {/* Header Modal */}
        <div className="flex items-center justify-between border-b border-zinc-800 px-6 py-4 bg-zinc-900 shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#6F4E37]/30 text-[#D4A373]">
              <Printer className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-zinc-100">Xem trước Hóa đơn in</h3>
              <p className="text-xs text-zinc-400">Mẫu in nhiệt chuẩn 80mm</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 cursor-pointer transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Nội dung Hóa đơn: LUÔN LÀ NỀN GIẤY TRẮNG CHỮ ĐEN RÕ RÀNG */}
        <div className="flex-1 overflow-y-auto p-5 bg-zinc-950 flex justify-center">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 text-zinc-400">
              <Loader2 className="h-8 w-8 animate-spin text-[#D4A373] mb-2" />
              <p className="text-xs font-medium">Đang trích xuất snapshot hóa đơn...</p>
            </div>
          ) : errorMsg ? (
            <div className="rounded-xl bg-red-950/40 border border-red-800 p-4 text-center text-xs font-semibold text-red-300">
              {errorMsg}
            </div>
          ) : invoice ? (
            <div className="w-full rounded-xl border border-dashed border-zinc-400 bg-white p-5 font-mono text-xs text-zinc-900 shadow-xl select-text">
              {/* Receipt Header */}
              <div className="text-center font-black text-sm uppercase tracking-wide text-zinc-950">
                HỆ THỐNG CÀ PHÊ MEPHAPHIN
              </div>
              <div className="text-center text-[10px] text-zinc-600 mt-0.5">
                Số 01 Võ Văn Ngân, TP. Thủ Đức, TP. HCM
              </div>
              <div className="my-2 border-t border-dashed border-zinc-400" />

              <div className="text-center font-bold text-xs text-zinc-800">PHIẾU THANH TOÁN</div>
              <div className="text-center font-extrabold text-sm text-[#6F4E37] tracking-wider mt-0.5">
                {invoice.orderCode}
              </div>
              <div className="my-2 border-t border-dashed border-zinc-400" />

              <div className="space-y-1 text-[11px] text-zinc-800">
                <div>
                  <span className="font-bold text-zinc-950">Thời gian:</span>{' '}
                  {new Date(invoice.paidAt || invoice.orderCreatedAt || Date.now()).toLocaleString('vi-VN')}
                </div>
                <div>
                  <span className="font-bold text-zinc-950">Thu ngân:</span> {invoice.employeeName || 'Quầy POS'}
                </div>
                {invoice.customerName && (
                  <div>
                    <span className="font-bold text-zinc-950">Khách hàng:</span> {invoice.customerName} ({invoice.customerPhone})
                  </div>
                )}
                <div>
                  <span className="font-bold text-zinc-950">Phương thức TT:</span>{' '}
                  <span className="font-black text-[#6F4E37]">
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
              <table className="w-full text-left text-[11px] text-zinc-900">
                <thead>
                  <tr className="border-b border-zinc-300 font-bold text-zinc-700">
                    <th className="py-1">Món</th>
                    <th className="text-right py-1">T.Tiền</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200">
                  {invoice.items?.map((item, idx) => (
                    <tr key={idx} className="align-top">
                      <td className="py-1.5 pr-2">
                        <div className="font-bold text-zinc-950">
                          {idx + 1}. {item.itemSnapshotName} ({item.sizeSnapshot})
                        </div>
                        {item.itemNote && <div className="italic text-zinc-600 text-[10px]">* {item.itemNote}</div>}
                        <div className="text-zinc-600 text-[10px]">
                          {item.quantity} x {formatCurrency(item.unitPrice + (item.totalToppingPriceSnapshot || 0))}
                        </div>
                      </td>
                      <td className="text-right font-bold text-zinc-950 py-1.5 whitespace-nowrap">
                        {formatCurrency(item.lineTotalPrice)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="my-2 border-t border-dashed border-zinc-400" />

              {/* Totals */}
              <div className="space-y-1 text-[11px] text-zinc-800">
                <div className="flex justify-between">
                  <span>Tạm tính:</span>
                  <span className="font-bold">{formatCurrency(invoice.subTotal)}</span>
                </div>
                {invoice.discountAmount > 0 && (
                  <div className="flex justify-between text-rose-700 font-bold">
                    <span>Chiết khấu / Đổi điểm:</span>
                    <span>-{formatCurrency(invoice.discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-black text-zinc-950 pt-1.5 border-t border-zinc-300">
                  <span>TỔNG CỘNG:</span>
                  <span className="text-[#6F4E37]">{formatCurrency(invoice.totalAmount)}</span>
                </div>
                <div className="flex justify-between text-[11px] text-zinc-700 pt-0.5">
                  <span>Thanh toán ({invoice.paymentMethod === 'CASH' ? 'Tiền mặt' : invoice.paymentMethod}):</span>
                  <span className="font-black text-zinc-950">{formatCurrency(invoice.totalAmount)}</span>
                </div>
              </div>

              <div className="my-3 border-t-2 border-zinc-900" />
              <div className="text-center text-[10px] text-zinc-600 italic">
                * Cảm ơn Quý khách và Hẹn gặp lại! *
              </div>
            </div>
          ) : null}
        </div>

        {/* Footer Actions */}
        <div className="border-t border-zinc-800 bg-zinc-900 p-4 flex items-center justify-end gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-zinc-700 bg-zinc-800 px-5 py-2.5 text-xs font-bold text-zinc-300 hover:bg-zinc-700 cursor-pointer"
          >
            Đóng
          </button>
          <button
            type="button"
            disabled={!invoice || loading}
            onClick={handlePrint}
            className="flex items-center gap-2 rounded-xl bg-[#6F4E37] hover:bg-[#5A3F2C] px-5 py-2.5 text-xs font-bold text-white shadow-md cursor-pointer disabled:opacity-50"
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