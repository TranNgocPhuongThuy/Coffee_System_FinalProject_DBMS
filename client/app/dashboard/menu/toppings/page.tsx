'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Sparkles,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { menuService } from '@/api/menu.service';
import { Modal } from '@/components/common/Modal';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { ConfirmModal } from '@/components/common/ConfirmModal';

interface ToppingItem {
  id: number;
  name: string;
  price: number;
  status?: string;
}

export default function ToppingsPage() {
  const [toppings, setToppings] = useState<ToppingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTopping, setEditingTopping] = useState<ToppingItem | null>(null);
  const [name, setName] = useState('');
  const [price, setPrice] = useState<number>(10000);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingTopping, setDeletingTopping] = useState<ToppingItem | null>(null);
  const [submitting, setSubmitting] = useState(false);

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

  const filteredToppings = toppings.filter((t) =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(val);
  };

  const handleOpenCreate = () => {
    setEditingTopping(null);
    setName('');
    setPrice(10000);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (t: ToppingItem) => {
    setEditingTopping(t);
    setName(t.name || '');
    setPrice(t.price || 0);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingTopping) {
        await menuService.updateTopping(editingTopping.id, { name, price });
      } else {
        await menuService.createTopping({ name, price });
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
      setDeletingTopping(null);
      fetchToppings();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Xóa thất bại');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Quản lý Topping & Món thêm</h1>
          <p className="text-sm text-gray-500 mt-1">Danh sách topping tùy chọn kèm theo đồ uống</p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#6F4E37] hover:bg-[#5A3F2C] text-white font-semibold text-sm shadow-sm transition-all duration-200 cursor-pointer active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" strokeWidth={2.2} />
          <span>Thêm topping mới</span>
        </button>
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm topping..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 text-sm focus:outline-none focus:border-[#6F4E37] focus:ring-2 focus:ring-[#6F4E37]/20"
          />
        </div>

        <div className="text-xs text-gray-500 hidden sm:block">
          Hiển thị: <span className="font-semibold text-gray-800">{filteredToppings.length}</span> topping
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-100 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                <th className="py-3.5 px-5">Tên Topping</th>
                <th className="py-3.5 px-5">Giá cộng thêm</th>
                <th className="py-3.5 px-5">Trạng thái</th>
                <th className="py-3.5 px-5 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {loading ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-gray-400 text-sm">
                    Đang tải danh sách topping...
                  </td>
                </tr>
              ) : filteredToppings.length > 0 ? (
                filteredToppings.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/60 transition-colors group">
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#F5EBE6] text-[#6F4E37] flex items-center justify-center shrink-0">
                          <Sparkles className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="font-semibold text-gray-900 group-hover:text-[#6F4E37] transition-colors block">
                            {item.name}
                          </span>
                          <span className="text-xs text-gray-400 font-mono">ID: #{item.id}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-5 font-bold text-[#6F4E37]">
                      +{formatCurrency(item.price)}
                    </td>

                    <td className="py-3.5 px-5">
                      {item.status === 'UNAVAILABLE' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200/70">
                          <XCircle className="w-3.5 h-3.5" />
                          Tạm ngưng
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/70">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Đang phục vụ
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(item)}
                          className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
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
                          className="p-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                          title="Xóa topping"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-gray-400 text-sm">
                    Chưa có topping nào.
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
          <Input
            label="Giá cộng thêm (VNĐ)"
            type="number"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            placeholder="10000..."
            required
          />
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
        message={`Bạn có chắc chắn muốn xóa topping "${deletingTopping?.name || ''}" không?`}
      />
    </div>
  );
}
