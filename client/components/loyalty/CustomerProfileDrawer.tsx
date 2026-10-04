import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Drawer } from '@/components/common/Drawer';
import { CustomerItem, loyaltyService } from '@/api/loyalty.service';
import { Sparkles, Crown, Shield, Medal, Clock, ArrowUpRight, ArrowDownLeft, Edit, PlusCircle, ExternalLink } from 'lucide-react';
import { LoyaltyTransaction } from '@/types/customer';

interface CustomerProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  customer: CustomerItem | null;
  onEdit?: (customer: CustomerItem) => void;
  onAdjustPoints?: (customer: CustomerItem) => void;
  isManager?: boolean;
}

export const CustomerProfileDrawer: React.FC<CustomerProfileDrawerProps> = ({
  isOpen,
  onClose,
  customer,
  onEdit,
  onAdjustPoints,
  isManager = false,
}) => {
  const [history, setHistory] = useState<LoyaltyTransaction[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  useEffect(() => {
    if (isOpen && customer) {
      const fetchHistory = async () => {
        setLoadingHistory(true);
        try {
          const res = await loyaltyService.getLoyaltyHistory({
            customerId: customer.id,
            limit: 5,
          });
          setHistory(res.items || res.data || []);
        } catch {
          setHistory([]);
        } finally {
          setLoadingHistory(false);
        }
      };
      fetchHistory();
    }
  }, [isOpen, customer]);

  if (!customer) return null;

  const getTierBadge = (tier: string) => {
    switch (tier) {
      case 'DIAMOND':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800">
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            Kim Cương
          </span>
        );
      case 'GOLD':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
            <Crown className="w-3.5 h-3.5 text-amber-600" />
            Hạng Vàng
          </span>
        );
      case 'SILVER':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-200 text-slate-800">
            <Shield className="w-3.5 h-3.5 text-slate-600" />
            Hạng Bạc
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-800">
            <Medal className="w-3.5 h-3.5 text-orange-600" />
            Hạng Chuẩn
          </span>
        );
    }
  };

  const initial = customer.fullName ? customer.fullName.charAt(0).toUpperCase() : 'K';

  // Calculate tier progress
  let nextTierName = 'SILVER';
  let targetPoints = 200;
  if (customer.membershipTier === 'SILVER') {
    nextTierName = 'GOLD';
    targetPoints = 500;
  } else if (customer.membershipTier === 'GOLD') {
    nextTierName = 'DIAMOND';
    targetPoints = 1000;
  }
  const currentEarned = customer.totalPointsEarned || customer.rewardPoints || 0;
  const isMaxTier = customer.membershipTier === 'DIAMOND';
  const progressPercent = isMaxTier
    ? 100
    : Math.min(100, Math.round((currentEarned / targetPoints) * 100));

  return (
    <Drawer isOpen={isOpen} onClose={onClose} title="Hồ sơ chi tiết khách hàng">
      <div className="space-y-6">
        {/* Profile Card Header */}
        <div className="p-4 bg-gradient-to-br from-[#FAF6F0] to-[#F5EBE6] rounded-2xl border border-[#EBE3D5] flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#6F4E37] text-white font-bold text-xl flex items-center justify-center shrink-0 shadow-sm">
            {initial}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-gray-900 text-lg truncate">{customer.fullName}</h3>
            <p className="text-xs text-gray-500 font-mono mt-0.5">{customer.phoneNumber}</p>
            <div className="mt-2">{getTierBadge(customer.membershipTier)}</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          {onEdit && (
            <button
              type="button"
              onClick={() => onEdit(customer)}
              className="flex-1 py-2 px-3 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <Edit className="w-3.5 h-3.5" />
              <span>Chỉnh sửa</span>
            </button>
          )}

          {isManager && onAdjustPoints && (
            <button
              type="button"
              onClick={() => onAdjustPoints(customer)}
              className="flex-1 py-2 px-3 bg-[#6F4E37] hover:bg-[#5A3F2C] text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Thêm/Trừ điểm</span>
            </button>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-2.5">
          <div className="p-3 bg-white rounded-xl border border-gray-100 shadow-sm text-center">
            <p className="text-[11px] text-gray-400 font-medium">Điểm hiện có</p>
            <p className="text-base font-bold text-[#6F4E37] mt-0.5">
              {(customer.rewardPoints || 0).toLocaleString('vi-VN')}
            </p>
          </div>
          <div className="p-3 bg-white rounded-xl border border-gray-100 shadow-sm text-center">
            <p className="text-[11px] text-gray-400 font-medium">Tổng tích lũy</p>
            <p className="text-base font-bold text-emerald-600 mt-0.5">
              {(customer.totalPointsEarned || customer.rewardPoints || 0).toLocaleString('vi-VN')}
            </p>
          </div>
          <div className="p-3 bg-white rounded-xl border border-gray-100 shadow-sm text-center">
            <p className="text-[11px] text-gray-400 font-medium">Đã sử dụng</p>
            <p className="text-base font-bold text-amber-600 mt-0.5">
              {(customer.totalPointsRedeemed || 0).toLocaleString('vi-VN')}
            </p>
          </div>
        </div>

        {/* Tier Progress */}
        <div className="p-3.5 bg-white rounded-xl border border-gray-100 shadow-sm space-y-2">
          <div className="flex justify-between text-xs font-medium">
            <span className="text-gray-600">Tiến trình thăng hạng</span>
            <span className="text-gray-900 font-semibold">
              {isMaxTier ? 'Hạng cao nhất' : `${currentEarned} / ${targetPoints} pts (${nextTierName})`}
            </span>
          </div>
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#8B5E3C] to-[#6F4E37] rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Recent Transactions List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
              Lịch sử giao dịch gần đây
            </h4>
            <Link
              href={`/dashboard/customers/transactions?customerId=${customer.id}`}
              onClick={onClose}
              className="text-xs font-semibold text-[#6F4E37] hover:underline inline-flex items-center gap-1"
            >
              <span>Xem tất cả</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>

          {loadingHistory ? (
            <div className="py-6 text-center text-xs text-gray-400">Đang tải lịch sử...</div>
          ) : history.length > 0 ? (
            <div className="space-y-2">
              {history.map((tx) => (
                <div
                  key={tx.id}
                  className="p-3 bg-white rounded-xl border border-gray-100 flex items-center justify-between text-xs hover:border-gray-200 transition-all"
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                        tx.transactionType === 'EARN'
                          ? 'bg-emerald-50 text-emerald-600'
                          : 'bg-red-50 text-red-600'
                      }`}
                    >
                      {tx.transactionType === 'EARN' ? (
                        <ArrowDownLeft className="w-4 h-4" />
                      ) : (
                        <ArrowUpRight className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">
                        {tx.transactionType === 'EARN' ? 'Cộng điểm thưởng' : 'Đổi / Trừ điểm'}
                      </p>
                      <p className="text-[11px] text-gray-400">
                        {tx.description || (tx.orderId ? `Đơn hàng #${tx.orderId}` : 'Hệ thống')}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p
                      className={`font-bold ${
                        tx.transactionType === 'EARN' ? 'text-emerald-600' : 'text-red-600'
                      }`}
                    >
                      {tx.transactionType === 'EARN' ? `+${tx.points}` : `-${tx.points}`} pts
                    </p>
                    <p className="text-[10px] text-gray-400 flex items-center justify-end gap-1">
                      <Clock className="w-3 h-3" />
                      {tx.createdAt ? new Date(tx.createdAt).toLocaleDateString('vi-VN') : ''}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-6 text-center text-xs text-gray-400 bg-gray-50 rounded-xl">
              Chưa có lịch sử tích / tiêu điểm.
            </div>
          )}
        </div>
      </div>
    </Drawer>
  );
};

export default CustomerProfileDrawer;
