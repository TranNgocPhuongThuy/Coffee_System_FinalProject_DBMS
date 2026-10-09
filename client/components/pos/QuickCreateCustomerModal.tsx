// components/pos/QuickCreateCustomerModal.tsx
'use client';

import React, { useState } from 'react';
import { X, UserPlus, Phone, User, Loader2 } from 'lucide-react';
import { loyaltyService } from '@/api/loyalty.service';
import { SelectedCustomer } from '@/hooks/usePosCart';

interface QuickCreateCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCustomerCreated: (customer: SelectedCustomer) => void;
}

export const QuickCreateCustomerModal: React.FC<QuickCreateCustomerModalProps> = ({
  isOpen,
  onClose,
  onCustomerCreated,
}) => {
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phoneNumber.trim()) {
      setErrorMsg('Vui lòng nhập đầy đủ họ tên và số điện thoại');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await loyaltyService.createCustomer({
        fullName: fullName.trim(),
        phoneNumber: phoneNumber.trim(),
      });

      const customerData = res.data || res;
      onCustomerCreated({
        id: customerData.id,
        fullName: customerData.fullName,
        phoneNumber: customerData.phoneNumber,
        rewardPoints: customerData.rewardPoints || 0,
        membershipTier: customerData.membershipTier || 'STANDARD',
      });

      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Không thể tạo khách hàng. Số điện thoại có thể đã tồn tại.');
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
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F5EBE6] text-[#6F4E37] dark:bg-[#6F4E37]/20 dark:text-[#D4A373]">
              <UserPlus className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-zinc-900 dark:text-zinc-100">Đăng ký thành viên nhanh</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Tạo thông tin khách hàng để tích điểm tại quầy</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-200 cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMsg && (
            <div className="rounded-xl bg-red-50 p-3 text-xs font-semibold text-red-600 border border-red-200 dark:bg-red-950/40 dark:border-red-800 dark:text-red-300">
              {errorMsg}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
              Số điện thoại <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              <input
                type="tel"
                placeholder="VD: 0988123456"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 pl-10 pr-4 py-2.5 text-sm text-zinc-900 focus:border-[#6F4E37] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#6F4E37]/20 dark:border-zinc-800 dark:bg-zinc-800/60 dark:text-zinc-100"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
              Họ và tên khách hàng <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              <input
                type="text"
                placeholder="VD: Nguyễn Văn A"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 pl-10 pr-4 py-2.5 text-sm text-zinc-900 focus:border-[#6F4E37] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#6F4E37]/20 dark:border-zinc-800 dark:bg-zinc-800/60 dark:text-zinc-100"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-zinc-200 px-4 py-2.5 text-sm font-semibold text-zinc-700 hover:bg-zinc-100 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-800 cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 rounded-xl bg-[#6F4E37] px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-[#6F4E37]/30 hover:bg-[#5A3F2C] active:scale-[0.98] disabled:opacity-50 cursor-pointer"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              <span>Đăng ký & Chọn ngay</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuickCreateCustomerModal;
