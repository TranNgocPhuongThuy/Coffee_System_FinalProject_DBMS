'use client';

import { useState, useEffect, useCallback, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Edit,
  PlusCircle,
  Clock,
  Sparkles,
  Crown,
  Shield,
  Medal,
  ArrowDownLeft,
  ArrowUpRight,
  UserCheck,
  Calendar,
  Phone,
  FileText,
  ExternalLink,
} from 'lucide-react';
import { useAuthContext } from '@/context/AuthContext';
import { loyaltyService, CustomerItem } from '@/api/loyalty.service';
import { LoyaltyTransaction } from '@/types/customer';
import { CustomerFormModal } from '@/components/loyalty/CustomerFormModal';
import { AdjustPointsModal } from '@/components/loyalty/AdjustPointsModal';

export default function CustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const customerId = resolvedParams.id;
  const router = useRouter();
  const { user } = useAuthContext();
  const isManager = user?.role === 'MANAGER' || user?.role === 'ADMIN';

  const [customer, setCustomer] = useState<CustomerItem | null>(null);
  const [transactions, setTransactions] = useState<LoyaltyTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingHistory, setLoadingHistory] = useState(true);

  // Modals
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAdjustPointsOpen, setIsAdjustPointsOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const fetchCustomerDetail = useCallback(async () => {
    if (!customerId) return;
    setLoading(true);
    try {
      const data = await loyaltyService.getCustomerById(customerId);
      setCustomer(data);
    } catch {
      setCustomer(null);
    } finally {
      setLoading(false);
    }
  }, [customerId]);

  const fetchCustomerHistory = useCallback(async () => {
    if (!customerId) return;
    setLoadingHistory(true);
    try {
      const res = await loyaltyService.getLoyaltyHistory({
        customerId: Number(customerId),
        limit: 50,
      });
      setTransactions(res.items || res.data || []);
    } catch {
      setTransactions([]);
    } finally {
      setLoadingHistory(false);
    }
  }, [customerId]);

  useEffect(() => {
    fetchCustomerDetail();
    fetchCustomerHistory();
  }, [fetchCustomerDetail, fetchCustomerHistory]);

  const handleUpdateCustomer = async (data: { fullName: string; phoneNumber: string; password?: string }) => {
    if (!customer) return;
    await loyaltyService.updateCustomer(customer.id, data);
    showToast('Cập nhật thông tin khách hàng thành công!');
    fetchCustomerDetail();
  };

  const getTierBadge = (tier: string) => {
    switch (tier) {
      case 'DIAMOND':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800 border border-purple-200">
            <Sparkles className="w-4 h-4 text-purple-600" />
            Hạng Kim Cương
          </span>
        );
      case 'GOLD':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
            <Crown className="w-4 h-4 text-amber-600" />
            Hạng Vàng
          </span>
        );
      case 'SILVER':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-200 text-slate-800 border border-slate-300">
            <Shield className="w-4 h-4 text-slate-600" />
            Hạng Bạc
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-800 border border-orange-200">
            <Medal className="w-4 h-4 text-orange-600" />
            Hạng Chuẩn (Standard)
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-gray-500 font-medium animate-pulse">
        Đang tải thông tin chi tiết khách hàng...
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="p-8 max-w-2xl mx-auto text-center space-y-4">
        <div className="p-6 bg-red-50 text-red-600 rounded-2xl border border-red-200 text-sm font-medium">
          Khách hàng không tồn tại hoặc đã bị xóa khỏi hệ thống.
        </div>
        <button
          type="button"
          onClick={() => router.push('/dashboard/customers')}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#6F4E37] text-white rounded-xl font-semibold text-sm cursor-pointer hover:bg-[#5A3F2C]"
        >
          <ArrowLeft className="w-4 h-4" />
          Quay lại danh sách
        </button>
      </div>
    );
  }

  const initial = customer.fullName ? customer.fullName.charAt(0).toUpperCase() : 'K';

  // Tier progress calculation
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
    <div className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-lg text-sm font-semibold z-50 animate-in fade-in">
          {toastMessage}
        </div>
      )}

      {/* Breadcrumb & Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard/customers"
          className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại danh sách Khách hàng</span>
        </Link>
      </div>

      {/* Main Profile Header Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#8B5E3C] to-[#6F4E37] text-white font-bold text-3xl flex items-center justify-center shrink-0 shadow-md">
            {initial}
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{customer.fullName}</h1>
              {getTierBadge(customer.membershipTier)}
            </div>
            <div className="flex items-center gap-4 text-xs text-gray-500 font-medium flex-wrap">
              <span className="flex items-center gap-1.5 font-mono">
                <Phone className="w-3.5 h-3.5 text-gray-400" />
                {customer.phoneNumber}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-gray-400" />
                Ngày tham gia: {customer.createdAt ? new Date(customer.createdAt).toLocaleDateString('vi-VN') : 'N/A'}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 flex-wrap w-full md:w-auto">
          {isManager && (
            <button
              type="button"
              onClick={() => setIsAdjustPointsOpen(true)}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2.5 rounded-xl font-semibold text-sm shadow-sm transition-all cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Thêm / Trừ điểm</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsEditModalOpen(true)}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 px-4 py-2.5 rounded-xl font-semibold text-sm shadow-sm transition-all cursor-pointer"
          >
            <Edit className="w-4 h-4 text-gray-500" />
            <span>Sửa thông tin</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Points Balance */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400 font-medium">Điểm khả dụng hiện tại</p>
            <p className="text-2xl font-bold text-[#6F4E37] mt-1">
              {(customer.rewardPoints || 0).toLocaleString('vi-VN')} <span className="text-sm">pts</span>
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#F5EBE6] text-[#6F4E37] flex items-center justify-center font-bold">
            <UserCheck className="w-6 h-6" />
          </div>
        </div>

        {/* Lifetime Earned */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400 font-medium">Tổng điểm đã tích lũy (Lifetime)</p>
            <p className="text-2xl font-bold text-emerald-600 mt-1">
              {(customer.totalPointsEarned || customer.rewardPoints || 0).toLocaleString('vi-VN')}{' '}
              <span className="text-sm">pts</span>
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <ArrowDownLeft className="w-6 h-6" />
          </div>
        </div>

        {/* Total Redeemed */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400 font-medium">Tổng điểm đã đổi thưởng</p>
            <p className="text-2xl font-bold text-amber-600 mt-1">
              {(customer.totalPointsRedeemed || 0).toLocaleString('vi-VN')} <span className="text-sm">pts</span>
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <ArrowUpRight className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Tier Progress Bar Card */}
      <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-3">
        <div className="flex items-center justify-between text-sm font-semibold">
          <span className="text-gray-700">Tiến trình thăng hạng hội viên</span>
          <span className="text-gray-900">
            {isMaxTier
              ? 'Đã đạt hạng Kim Cương tối đa!'
              : `${currentEarned} / ${targetPoints} pts (Tiếp theo: ${nextTierName})`}
          </span>
        </div>
        <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#8B5E3C] to-[#6F4E37] rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <p className="text-xs text-gray-400">
          Chính sách thăng hạng: Bạc (200 pts) • Vàng (500 pts) • Kim Cương (1000 pts tích lũy)
        </p>
      </div>

      {/* Transaction History Section */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden space-y-4 p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#6F4E37]" />
            <span>Lịch sử tích / tiêu điểm của khách hàng</span>
          </h2>
          <div className="flex items-center gap-3">
            <Link
              href={`/dashboard/customers/transactions?customerId=${customer.id}`}
              className="text-xs font-semibold text-[#6F4E37] hover:underline inline-flex items-center gap-1"
            >
              <span>Xem trên sổ cái</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
            <span className="text-xs font-medium text-gray-500">
              ({transactions.length} giao dịch)
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#FAF6F0] border-b border-gray-100 text-xs font-bold text-gray-600 uppercase tracking-wider">
                <th className="py-3 px-4">Mã GD / ID</th>
                <th className="py-3 px-4">Đơn hàng</th>
                <th className="py-3 px-4">Loại giao dịch</th>
                <th className="py-3 px-4">Số điểm</th>
                <th className="py-3 px-4">Số dư sau GD</th>
                <th className="py-3 px-4">Ghi chú</th>
                <th className="py-3 px-4">Thời gian</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {loadingHistory ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-gray-400 text-xs">
                    Đang tải nhật ký điểm...
                  </td>
                </tr>
              ) : transactions.length > 0 ? (
                transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="py-3 px-4 font-mono text-xs font-bold text-gray-700">#{tx.id}</td>
                    <td className="py-3 px-4 text-xs">
                      {tx.orderId ? (
                        <span className="font-semibold text-blue-600">Đơn hàng #{tx.orderId}</span>
                      ) : (
                        <span className="text-gray-400 italic">Thủ công / Khác</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {tx.transactionType === 'EARN' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <ArrowDownLeft className="w-3.5 h-3.5" />
                          Cộng điểm
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-50 text-red-700 border border-red-200">
                          <ArrowUpRight className="w-3.5 h-3.5" />
                          Trừ điểm
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-bold text-xs">
                      <span className={tx.transactionType === 'EARN' ? 'text-emerald-600' : 'text-red-600'}>
                        {tx.transactionType === 'EARN' ? `+${Math.abs(tx.points)}` : `-${Math.abs(tx.points)}`} pts
                      </span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-gray-800 text-xs font-mono">
                      {(tx.balanceAfter || 0).toLocaleString('vi-VN')} pts
                    </td>
                    <td className="py-3 px-4 text-xs text-gray-500 max-w-xs truncate">
                      {tx.description || '-'}
                    </td>
                    <td className="py-3 px-4 text-xs text-gray-400 font-mono">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {tx.createdAt ? new Date(tx.createdAt).toLocaleString('vi-VN') : 'N/A'}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-gray-400 text-xs">
                    Chưa phát sinh giao dịch điểm thưởng nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Customer Form Modal */}
      <CustomerFormModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleUpdateCustomer}
        customer={customer}
      />

      {/* Adjust Points Modal */}
      <AdjustPointsModal
        isOpen={isAdjustPointsOpen}
        onClose={() => setIsAdjustPointsOpen(false)}
        onSuccess={() => {
          showToast('Điều chỉnh điểm thành công!');
          fetchCustomerDetail();
          fetchCustomerHistory();
        }}
        customer={customer}
      />
    </div>
  );
}