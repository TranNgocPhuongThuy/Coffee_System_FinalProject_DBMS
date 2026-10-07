// components/pos/ApplyLoyaltyModal.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { X, Award, CheckCircle2 } from 'lucide-react';
import { SelectedCustomer } from '@/hooks/usePosCart';

interface ApplyLoyaltyModalProps {
  isOpen: boolean;
  customer: SelectedCustomer | null;
  subTotal: number;
  currentPointsToRedeem: number;
  conversionRate?: number;
  onClose: () => void;
  onApply: (points: number) => void;
}

export const ApplyLoyaltyModal: React.FC<ApplyLoyaltyModalProps> = ({
  isOpen,
  customer,
  subTotal,
  currentPointsToRedeem,
  conversionRate = 1000,
  onClose,
  onApply,
}) => {
  const [points, setPoints] = useState<number>(currentPointsToRedeem);

  useEffect(() => {
    setPoints(currentPointsToRedeem);
  }, [currentPointsToRedeem, isOpen]);

  if (!isOpen || !customer) return null;

  const maxPointsBySubtotal = Math.floor(subTotal / conversionRate);
  const maxUsablePoints = Math.min(customer.rewardPoints, maxPointsBySubtotal);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    const validPoints = Math.min(Math.max(0, points), maxUsablePoints);
    onApply(validPoints);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
      <div className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-200 px-6 py-4 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400">
              <Award className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-zinc-900 dark:text-zinc-100">Đổi điểm thưởng hội viên</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Quy đổi: 1 điểm = {formatCurrency(conversionRate)}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Thông tin hội viên */}
        <div className="p-6 space-y-5">
          <div className="rounded-2xl border border-amber-200/80 bg-amber-50/50 p-4 dark:border-amber-900/40 dark:bg-amber-950/20 flex items-center justify-between">
            <div>
              <div className="font-bold text-sm text-zinc-900 dark:text-zinc-100">{customer.fullName}</div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">{customer.phoneNumber}</div>
            </div>
            <div className="text-right">
              <div className="text-xs font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
                Hạng {customer.membershipTier}
              </div>
              <div className="text-base font-black text-amber-600 dark:text-amber-300">
                {customer.rewardPoints} <span className="text-xs font-medium">điểm</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleApply} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-2">
                Số điểm muốn đổi (Tối đa: {maxUsablePoints} điểm)
              </label>
              <div className="relative">
                <input
                  type="number"
                  min={0}
                  max={maxUsablePoints}
                  value={points}
                  onChange={(e) => setPoints(Number(e.target.value) || 0)}
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-lg font-bold text-zinc-900 focus:border-amber-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 dark:border-zinc-800 dark:bg-zinc-800/60 dark:text-zinc-100"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-zinc-400">
                  điểm
                </span>
              </div>
            </div>

            {/* Phím bấm chọn nhanh */}
            <div className="flex gap-2">
              {[10, 20, 50].map((pt) => {
                if (pt > maxUsablePoints) return null;
                return (
                  <button
                    key={pt}
                    type="button"
                    onClick={() => setPoints(pt)}
                    className="flex-1 rounded-lg border border-zinc-200 bg-zinc-50 py-1.5 text-xs font-bold text-zinc-700 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-300"
                  >
                    +{pt} điểm
                  </button>
                );
              })}
              <button
                type="button"
                onClick={() => setPoints(maxUsablePoints)}
                className="flex-1 rounded-lg border border-amber-300 bg-amber-50 py-1.5 text-xs font-bold text-amber-700 hover:bg-amber-100 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-300"
              >
                Dùng hết ({maxUsablePoints})
              </button>
            </div>

            {/* Preview giảm giá */}
            <div className="rounded-xl bg-zinc-100 p-3.5 dark:bg-zinc-800/60 flex items-center justify-between text-sm">
              <span className="text-zinc-600 dark:text-zinc-400 font-medium">Số tiền giảm trừ:</span>
              <span className="font-extrabold text-amber-600 dark:text-amber-400 text-base">
                -{formatCurrency(points * conversionRate)}
              </span>
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  onApply(0);
                  onClose();
                }}
                className="rounded-xl border border-zinc-200 px-4 py-2.5 text-sm font-semibold text-zinc-700 hover:bg-zinc-100 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                Bỏ áp dụng
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 rounded-xl bg-amber-600 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-amber-600/30 hover:bg-amber-700 active:scale-[0.98]"
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>Xác nhận đổi điểm</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ApplyLoyaltyModal;
