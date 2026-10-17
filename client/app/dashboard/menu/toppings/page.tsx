'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Sparkles,
  Cloud,
  CircleDot,
  Droplet,
  CheckCircle2,
  XCircle,
  FlaskConical,
  RefreshCw,
  AlertCircle,
  Layers,
} from 'lucide-react';
import { menuService } from '@/api/menu.service';
import { Modal } from '@/components/common/Modal';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { ConfirmModal } from '@/components/common/ConfirmModal';
import { ToppingStatus } from '@/types/enums';
import MenuNavTabs from '@/components/menu/MenuNavTabs';

const getToppingIcon = (name: string) => {
  const lower = name.toLowerCase();
  if (
    lower.includes('kem') ||
    lower.includes('cheese') ||
    lower.includes('cream') ||
    lower.includes('foam') ||
    lower.includes('váng sữa')
  ) {
    return Cloud;
  }
  if (
    lower.includes('trân châu') ||
    lower.includes('thạch') ||
    lower.includes('pearl') ||
    lower.includes('boba') ||
    lower.includes('jelly') ||
    lower.includes('hạt') ||
    lower.includes('pudding')
  ) {
    return CircleDot;
  }
  if (
    lower.includes('shot') ||
    lower.includes('bổ sung') ||
    lower.includes('syrup') ||
    lower.includes('siro') ||
    lower.includes('sốt') ||
    lower.includes('sauce') ||
    lower.includes('espresso') ||
    lower.includes('thêm')
  ) {
    return Droplet;
  }
  return Sparkles;
};

interface ToppingItem {
  id: number;
  name: string;
  price: number;
  status?: ToppingStatus;
}

export default function ToppingsPage() {
  const [toppings, setToppings] = useState<ToppingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | ToppingStatus>('ALL');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTopping, setEditingTopping] = useState<ToppingItem | null>(null);
  const [name, setName] = useState('');
  const [price, setPrice] = useState<number>(10000);
  const [status, setStatus] = useState<ToppingStatus>('AVAILABLE');

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingTopping, setDeletingTopping] = useState<ToppingItem | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Toast
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const fetchToppings = useCallback(async () => {
    setLoading(true);
    try {
      const data = await menuService.getToppings();
      setToppings(Array.isArray(data) ? data : []);
    } catch {
      setToppings([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchToppings();
  }, [fetchToppings]);

  const filteredToppings = toppings.filter((t) => {
    const matchSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus =
      statusFilter === 'ALL' || (t.status || 'AVAILABLE') === statusFilter;
    return matchSearch && matchStatus;
  });

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(val || 0);
  };

  const handleOpenCreate = () => {
    setEditingTopping(null);
    setName('');
    setPrice(10000);
    setStatus('AVAILABLE');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (t: ToppingItem) => {
    setEditingTopping(t);
    setName(t.name || '');
    setPrice(Number(t.price) || 0);
    setStatus(t.status || 'AVAILABLE');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Vui lòng nhập tên topping!');
      return;
    }
    if (price < 0) {
      alert('Đơn giá không được âm!');
      return;
    }

    setSubmitting(true);
    try {
      if (editingTopping) {
        await menuService.updateTopping(editingTopping.id, {
          name: name.trim(),
          price: Number(price),
          status,
        });
        showToast(`Đã cập nhật topping "${name}"!`);
      } else {
        await menuService.createTopping({
          name: name.trim(),
          price: Number(price),
          status,
        });
        showToast(`Đã thêm topping "${name}" mới!`);
      }
      setIsModalOpen(false);
      fetchToppings();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Thao tác thất bại');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingTopping) return;
    try {
      await menuService.deleteTopping(deletingTopping.id);
      setIsDeleteModalOpen(false);
      showToast(`Đã xóa topping "${deletingTopping.name}"!`);
      setDeletingTopping(null);
      fetchToppings();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Xóa thất bại');
    }
  };

  return (
    <div className="space-y-4 max-w-7xl mx-auto p-4 sm:p-6 pb-16">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#6F4E37] text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-5 h-5 text-emerald-300" />
          <span className="font-semibold text-sm">{toastMsg}</span>
        </div>
      )}

      {/* TẦNG 1: Thanh Điều Hướng (Tabs) */}
      <MenuNavTabs />

      {/* TẦNG 2: Thanh Công Cụ (Toolbar) */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 w-full">
        {/* Bên trái: Nút làm mới + Search + Dropdown trạng thái */}
        <div className="flex flex-1 flex-col sm:flex-row items-stretch sm:items-center gap-2.5 max-w-2xl">
          <button
            type="button"
            onClick={fetchToppings}
            className="p-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 shadow-sm transition-colors cursor-pointer shrink-0 self-start sm:self-auto"
            title="Làm mới"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm topping (Trân châu, Kem cheese, Thạch...)"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 text-sm shadow-sm focus:outline-none focus:border-[#6F4E37] focus:ring-2 focus:ring-[#6F4E37]/20"
            />
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full sm:w-auto px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#6F4E37] cursor-pointer"
            >
              <option value="ALL">Tất cả ({toppings.length})</option>
              <option value="AVAILABLE">Đang phục vụ (AVAILABLE)</option>
              <option value="UNAVAILABLE">Tạm ngưng (UNAVAILABLE)</option>
            </select>
          </div>
        </div>

        {/* Bên phải: BOM Link + Nút hành động chính */}
        <div className="flex items-center justify-between sm:justify-end gap-2.5 shrink-0">
          <Link
            href="/dashboard/inventory/boms"
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-amber-200 bg-white hover:bg-amber-50 text-[#6F4E37] font-semibold text-xs shadow-sm transition-colors cursor-pointer"
            title="Định lượng Topping (BOM)"
          >
            <FlaskConical className="w-4 h-4 text-amber-700" />
            <span className="hidden sm:inline">Định lượng BOM</span>
          </Link>

          <button
            type="button"
            onClick={handleOpenCreate}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#6F4E37] hover:bg-[#5A3F2C] text-white font-bold text-sm shadow-sm hover:shadow-md active:scale-95 transition-all cursor-pointer w-full sm:w-auto"
          >
            <Plus className="w-4 h-4" strokeWidth={2.5} />
            <span>Thêm Topping mới</span>
          </button>
        </div>
      </div>

      {/* TẦNG 3: Bảng Dữ Liệu */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#FAF6F0]/80 border-b border-gray-200/70 text-[11px] font-bold text-gray-600 uppercase tracking-wider">
                <th className="py-4 px-6 text-left">Tên Topping</th>
                <th className="py-4 px-6 text-center w-52">Giá cộng thêm (Phụ thu)</th>
                <th className="py-4 px-6 text-center w-48">Trạng thái</th>
                <th className="py-4 px-6 text-right w-36">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {loading ? (
                <tr>
                  <td colSpan={4} className="py-16 text-center text-gray-400">
                    <RefreshCw className="w-7 h-7 animate-spin mx-auto mb-2 text-[#6F4E37]" />
                    Đang tải danh sách topping...
                  </td>
                </tr>
              ) : filteredToppings.length > 0 ? (
                filteredToppings.map((item) => {
                  const ToppingIcon = getToppingIcon(item.name);
                  return (
                    <tr key={item.id} className="hover:bg-gray-50/70 transition-colors group">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3.5">
                          <div className="w-11 h-11 rounded-2xl bg-[#FAF6F0] text-[#6F4E37] flex items-center justify-center shrink-0 border border-amber-200/50 shadow-inner">
                            <ToppingIcon className="w-5 h-5" />
                          </div>
                          <span className="font-bold text-gray-900 group-hover:text-[#6F4E37] transition-colors text-base">
                            {item.name}
                          </span>
                        </div>
                      </td>

                      <td className="py-4 px-6 text-center font-bold text-[#6F4E37] text-base">
                        +{formatCurrency(item.price)}
                      </td>

                      <td className="py-4 px-6 text-center">
                        {item.status === 'UNAVAILABLE' ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
                            <XCircle className="w-3.5 h-3.5" />
                            Tạm ngưng
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Đang phục vụ
                          </span>
                        )}
                      </td>

                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            href="/dashboard/inventory/boms"
                            className="p-2 rounded-xl text-amber-700 hover:bg-amber-50 transition-colors cursor-pointer"
                            title="Cấu hình định mức kho"
                          >
                            <FlaskConical className="w-4 h-4" />
                          </Link>
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(item)}
                            className="p-2 rounded-xl text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                            title="Sửa topping"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setDeletingTopping(item);
                              setIsDeleteModalOpen(true);
                            }}
                            className="p-2 rounded-xl text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Xóa topping"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={4} className="py-16 text-center text-gray-400">
                    <AlertCircle className="w-9 h-9 mx-auto mb-2 text-gray-300" />
                    Chưa có topping nào hoặc không khớp với tìm kiếm.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingTopping ? 'Chỉnh sửa topping' : 'Thêm topping mới'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Tên topping"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ví dụ: Trân châu hoàng kim, Kem Cheese..."
            required
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Giá phụ thu (VNĐ) <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              min="0"
              step="1"
              placeholder="0"
              value={price === 0 ? '' : price}
              onKeyDown={(e) => {
                if (['e', 'E', '+', '-', '.', ','].includes(e.key)) {
                  e.preventDefault();
                }
              }}
              onChange={(e) => {
                const val = e.target.value === '' ? 0 : Number(e.target.value);
                setPrice(val);
              }}
              className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-900 focus:outline-none focus:border-[#6F4E37] focus:ring-2 focus:ring-[#6F4E37]/20"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Trạng thái phục vụ
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as ToppingStatus)}
              className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:border-[#6F4E37] focus:ring-2 focus:ring-[#6F4E37]/20"
            >
              <option value="AVAILABLE">Đang phục vụ (AVAILABLE)</option>
              <option value="UNAVAILABLE">Tạm ngưng (UNAVAILABLE)</option>
            </select>
          </div>
          <div className="pt-2 flex gap-3">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
              Hủy
            </Button>
            <Button type="submit" isLoading={submitting}>
              {editingTopping ? 'Lưu thay đổi' : 'Tạo topping'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirm Modal */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Xóa topping"
        message={`Bạn có chắc chắn muốn xóa topping "${deletingTopping?.name || ''}" khỏi thực đơn?`}
      />
    </div>
  );
}
