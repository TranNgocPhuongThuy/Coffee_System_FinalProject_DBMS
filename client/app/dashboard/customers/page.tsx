'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  UserCheck,
  Crown,
  Shield,
  Medal,
  Clock,
  Sparkles,
} from 'lucide-react';
import { useAuthContext } from '@/context/AuthContext';
import { loyaltyService, CustomerItem } from '@/api/customer-loyalty/loyalty.service';
import { CustomerFormModal } from '@/components/loyalty/CustomerFormModal';
import { AssignRoleModal } from '@/components/loyalty/AssignRoleModal';
import { ConfirmModal } from '@/components/common/ConfirmModal';

export default function CustomersPage() {
  const { user } = useAuthContext();
  const isManager = user?.role === 'MANAGER' || user?.role === 'ADMIN';

  const [customers, setCustomers] = useState<CustomerItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTier, setSelectedTier] = useState('all');

  // Modal states
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerItem | null>(null);

  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [assignCustomer, setAssignCustomer] = useState<CustomerItem | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteCustomerTarget, setDeleteCustomerTarget] = useState<CustomerItem | null>(null);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await loyaltyService.getCustomers({
        search: searchQuery || undefined,
        membershipTier: selectedTier !== 'all' ? selectedTier : undefined,
      });
      setCustomers(res.items || res.data || []);
    } catch {
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedTier]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const handleCreateCustomer = async (data: { fullName: string; phoneNumber: string; password?: string }) => {
    await loyaltyService.createCustomer(data);
    showToast('Tạo khách hàng mới thành công!');
    fetchCustomers();
  };

  const handleUpdateCustomer = async (data: { fullName: string; phoneNumber: string; password?: string }) => {
    if (!selectedCustomer) return;
    await loyaltyService.updateCustomer(selectedCustomer.id, data);
    showToast('Cập nhật thông tin khách hàng thành công!');
    fetchCustomers();
  };

  const handleDeleteCustomer = async () => {
    if (!deleteCustomerTarget) return;
    try {
      await loyaltyService.deleteCustomer(deleteCustomerTarget.id);
      showToast('Xóa khách hàng thành công!');
      fetchCustomers();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Xóa thất bại');
    } finally {
      setIsDeleteModalOpen(false);
      setDeleteCustomerTarget(null);
    }
  };

  const handleAssignRole = async (data: {
    fullName: string;
    username: string;
    password: string;
    role: 'CASHIER' | 'BARISTA' | 'STOREKEEPER';
    phoneNumber?: string;
  }) => {
    await loyaltyService.assignEmployeeRole(data);
    showToast(`Đã cấp quyền nhân viên ${data.role} cho ${data.fullName}!`);
  };

  const getTierBadge = (tier: string) => {
    switch (tier) {
      case 'DIAMOND':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-800 border border-purple-200">
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            Hạng Kim Cương
          </span>
        );
      case 'GOLD':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
            <Crown className="w-3.5 h-3.5 text-amber-600" />
            Hạng Vàng
          </span>
        );
      case 'SILVER':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
            <Shield className="w-3.5 h-3.5 text-slate-500" />
            Hạng Bạc
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-orange-50 text-orange-800 border border-orange-200">
            <Medal className="w-3.5 h-3.5 text-orange-600" />
            Hạng Chuẩn (Standard)
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6">
      {/* Notification Toast */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-lg text-sm font-semibold z-50 animate-in fade-in">
          {toastMessage}
        </div>
      )}

      {/* Header Title & Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Quản lý Khách hàng</h1>
          <p className="text-sm text-gray-500 mt-1">Danh sách hội viên, tích điểm và phân quyền</p>
        </div>

        {isManager && (
          <button
            type="button"
            onClick={() => {
              setSelectedCustomer(null);
              setIsAddEditModalOpen(true);
            }}
            className="flex items-center gap-2 bg-[#6F4E37] hover:bg-[#5A3F2C] text-white px-4 py-2.5 rounded-xl font-semibold text-sm shadow-sm transition-all cursor-pointer active:scale-[0.99]"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm khách hàng</span>
          </button>
        )}
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo tên, số điện thoại..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 text-sm focus:outline-none focus:border-[#6F4E37] focus:ring-2 focus:ring-[#6F4E37]/20 transition-all"
          />
        </div>

        <div className="relative">
          <Filter className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <select
            value={selectedTier}
            onChange={(e) => setSelectedTier(e.target.value)}
            className="pl-10 pr-8 py-2 rounded-xl border border-gray-200 bg-white text-gray-700 text-sm font-medium focus:outline-none focus:border-[#6F4E37] focus:ring-2 focus:ring-[#6F4E37]/20 cursor-pointer appearance-none"
          >
            <option value="all">Tất cả hạng thẻ</option>
            <option value="STANDARD">Standard</option>
            <option value="SILVER">Silver</option>
            <option value="GOLD">Gold</option>
            <option value="DIAMOND">Diamond</option>
          </select>
        </div>
      </div>

      {/* Customers Data Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#FAF6F0] border-b border-gray-100 text-xs font-bold text-gray-600 uppercase tracking-wider">
                <th className="py-3.5 px-5">Khách hàng</th>
                <th className="py-3.5 px-5">Số điện thoại</th>
                <th className="py-3.5 px-5">Điểm tích lũy</th>
                <th className="py-3.5 px-5">Hạng thẻ</th>
                <th className="py-3.5 px-5">Ngày tham gia</th>
                {isManager && <th className="py-3.5 px-5 text-right">Thao tác Quản lý</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {loading ? (
                <tr>
                  <td colSpan={isManager ? 6 : 5} className="py-12 text-center text-gray-400 text-sm">
                    Đang tải danh sách khách hàng...
                  </td>
                </tr>
              ) : customers.length > 0 ? (
                customers.map((cust) => {
                  const initial = cust.fullName ? cust.fullName.charAt(0).toUpperCase() : 'K';
                  return (
                    <tr key={cust.id} className="hover:bg-gray-50/60 transition-colors group">
                      {/* Name & Avatar */}
                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-[#F5EBE6] text-[#6F4E37] font-bold text-xs flex items-center justify-center shrink-0">
                            {initial}
                          </div>
                          <div>
                            <span className="font-semibold text-gray-900 group-hover:text-[#6F4E37] transition-colors block">
                              {cust.fullName}
                            </span>
                            <span className="text-xs text-gray-400 font-mono">ID: #{cust.id}</span>
                          </div>
                        </div>
                      </td>

                      {/* Phone */}
                      <td className="py-3.5 px-5 font-mono text-gray-700 font-medium text-xs">
                        {cust.phoneNumber}
                      </td>

                      {/* Points */}
                      <td className="py-3.5 px-5">
                        <span className="font-bold text-[#6F4E37]">
                          {(cust.rewardPoints || 0).toLocaleString('vi-VN')}
                        </span>
                        <span className="text-xs text-gray-400 ml-1">pts</span>
                      </td>

                      {/* Tier */}
                      <td className="py-3.5 px-5">{getTierBadge(cust.membershipTier)}</td>

                      {/* Created At */}
                      <td className="py-3.5 px-5 text-gray-500 text-xs">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-gray-400" />
                          <span>
                            {cust.createdAt
                              ? new Date(cust.createdAt).toLocaleDateString('vi-VN')
                              : 'N/A'}
                          </span>
                        </div>
                      </td>

                      {/* Manager Actions */}
                      {isManager && (
                        <td className="py-3.5 px-5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Edit Button */}
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedCustomer(cust);
                                setIsAddEditModalOpen(true);
                              }}
                              className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                              title="Sửa thông tin khách hàng"
                            >
                              <Edit className="w-4 h-4" />
                            </button>

                            {/* Set Role Button (Manager only, restricted from setting Manager) */}
                            <button
                              type="button"
                              onClick={() => {
                                setAssignCustomer(cust);
                                setIsAssignModalOpen(true);
                              }}
                              className="p-2 rounded-lg text-amber-600 hover:bg-amber-50 transition-colors cursor-pointer"
                              title="Cấp quyền Nhân viên (Thu ngân, Pha chế, Thủ kho)"
                            >
                              <UserCheck className="w-4 h-4" />
                            </button>

                            {/* Delete Button */}
                            <button
                              type="button"
                              onClick={() => {
                                setDeleteCustomerTarget(cust);
                                setIsDeleteModalOpen(true);
                              }}
                              className="p-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                              title="Xóa khách hàng"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={isManager ? 6 : 5} className="py-12 text-center text-gray-400 text-sm">
                    Không tìm thấy khách hàng phù hợp.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info */}
        <div className="p-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500 bg-white">
          <p>
            Hiển thị <span className="font-semibold text-gray-700">{customers.length}</span> khách hàng
          </p>
        </div>
      </div>

      {/* Add / Edit Customer Modal */}
      <CustomerFormModal
        isOpen={isAddEditModalOpen}
        onClose={() => {
          setIsAddEditModalOpen(false);
          setSelectedCustomer(null);
        }}
        onSubmit={selectedCustomer ? handleUpdateCustomer : handleCreateCustomer}
        customer={selectedCustomer}
      />

      {/* Assign Employee Role Modal */}
      <AssignRoleModal
        isOpen={isAssignModalOpen}
        onClose={() => {
          setIsAssignModalOpen(false);
          setAssignCustomer(null);
        }}
        onSubmit={handleAssignRole}
        customer={assignCustomer}
      />

      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeleteCustomerTarget(null);
        }}
        onConfirm={handleDeleteCustomer}
        title="Xóa thông tin khách hàng"
        message={`Bạn có chắc chắn muốn xóa khách hàng "${deleteCustomerTarget?.fullName || ''}" khỏi hệ thống không?`}
      />
    </div>
  );
}
