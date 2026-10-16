// components/pos/CancelOrderModal.tsx
'use client';

import React, { useState } from 'react';
import { X, AlertTriangle, Loader2 } from 'lucide-react';
import { posService } from '@/api/pos.service';

interface CancelOrderModalProps {
  isOpen: boolean;
  orderId: number | null;
  orderCode?: string;
  employeeId?: number;
  onClose: () => void;
  onSuccess: () => void;
}

const QUICK_REASONS = [
  'Khách đổi ý muốn hủy đơn',
  'Pha chế nhầm món/kích cỡ',
  'Hết nguyên liệu phục vụ',
  'Khách chờ lâu và rời quán',
  'Lỗi nhập liệu thu ngân',
];

export const CancelOrderModal: React.FC<CancelOrderModalProps> = ({
  isOpen,
  orderId,
  orderCode,
  employeeId = 1,
  onClose,
  onSuccess,
}) => {
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen || !orderId) return null;

  const handleCancel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      setErrorMsg('Vui lòng nhập lý do hủy đơn hàng');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      await posService.cancelOrder(orderId, reason.trim(), employeeId);
      onSuccess();
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Không thể hủy đơn hàng này.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
      <div className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-200 px-6 py-4 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-zinc-900 dark:text-zinc-100">Xác nhận hủy đơn hàng</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Mã đơn: <span className="font-bold">{orderCode || `#${orderId}`}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleCancel} className="p-6 space-y-4">
          {errorMsg && (
            <div className="rounded-xl bg-red-50 p-3 text-xs font-semibold text-red-600 border border-red-200 dark:bg-red-950/40 dark:border-red-800 dark:text-red-300">
              {errorMsg}
            </div>
          )}

          <div className="rounded-xl bg-[#FAF6F0] p-3 text-xs text-[#6F4E37] dark:bg-amber-950/30 dark:text-amber-300 border border-[#EBE3D5] dark:border-amber-800">
            ⚠️ <strong>Lưu ý:</strong> Khi hủy đơn, thiết bị thẻ rung liên kết sẽ tự động được giải phóng về trạng thái <strong>AVAILABLE</strong>.
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-2">
              Lý do hủy đơn <span className="text-red-500">*</span>
            </label>

            {/* Gợi ý lý do */}
            <div className="flex flex-wrap gap-1.5 mb-2.5">
              {QUICK_REASONS.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setReason(r)}
                  className={`rounded-lg px-2.5 py-1 text-[11px] font-medium border transition-all ${
                    reason === r
                      ? 'border-rose-500 bg-rose-50 text-rose-700 font-bold dark:bg-rose-950/40 dark:text-rose-300'
                      : 'border-zinc-200 bg-zinc-50 text-zinc-600 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-400'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>

            <textarea
              rows={3}
              placeholder="Nhập lý do cụ thể..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
              className="w-full rounded-xl border border-zinc-200 bg-zinc-50 p-3 text-sm text-zinc-900 focus:border-rose-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20 dark:border-zinc-800 dark:bg-zinc-800/60 dark:text-zinc-100"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-zinc-200 px-4 py-2.5 text-sm font-semibold text-zinc-700 hover:bg-zinc-100 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              Không hủy
            </button>
            <button
              type="submit"
              disabled={loading || !reason.trim()}
              className="flex items-center gap-2 rounded-xl bg-rose-600 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-rose-600/30 hover:bg-rose-700 active:scale-[0.98] disabled:opacity-50"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              <span>Xác nhận HỦY ĐƠN</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CancelOrderModal;
