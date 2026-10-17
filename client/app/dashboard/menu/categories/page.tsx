'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Coffee,
  CupSoda,
  CakeSlice,
  LayoutGrid,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { CategoryDisplayStatus } from '@/types/enums';
import { menuService } from '@/api/menu.service';
import { Modal } from '@/components/common/Modal';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { ConfirmModal } from '@/components/common/ConfirmModal';
import MenuNavTabs from '@/components/menu/MenuNavTabs';

const getCategoryIcon = (name: string) => {
  const lower = name.toLowerCase();
  if (lower.includes('cà phê') || lower.includes('cafe') || lower.includes('coffee') || lower.includes('espresso')) {
    return Coffee;
  }
  if (
    lower.includes('trà') ||
    lower.includes('tea') ||
    lower.includes('đá xay') ||
    lower.includes('frappuccino') ||
    lower.includes('sinh tố') ||
    lower.includes('smoothie') ||
    lower.includes('nước') ||
    lower.includes('juice')
  ) {
    return CupSoda;
  }
  if (
    lower.includes('bánh') ||
    lower.includes('cake') ||
    lower.includes('pastry') ||
    lower.includes('bakery') ||
    lower.includes('croissant')
  ) {
    return CakeSlice;
  }
  return LayoutGrid;
};

interface CategoryItem {
  id: number;
  name: string;
  displayStatus?: CategoryDisplayStatus;
  productCount?: number;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);
  const [name, setName] = useState('');
  const [displayStatus, setDisplayStatus] = useState<CategoryDisplayStatus>('SHOW');

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingCategory, setDeletingCategory] = useState<CategoryItem | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Toast
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const data = await menuService.getCategories();
      setCategories(Array.isArray(data) ? data : []);
    } catch {
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenCreate = () => {
    setEditingCategory(null);
    setName('');
    setDisplayStatus('SHOW');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cat: CategoryItem) => {
    setEditingCategory(cat);
    setName(cat.name || '');
    setDisplayStatus(cat.displayStatus || 'SHOW');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Vui lòng nhập tên danh mục!');
      return;
    }
    setSubmitting(true);
    try {
      if (editingCategory) {
        await menuService.updateCategory(editingCategory.id, { name: name.trim(), displayStatus });
        showToast(`Đã cập nhật danh mục "${name.trim()}"!`);
      } else {
        await menuService.createCategory({ name: name.trim(), displayStatus });
        showToast(`Đã tạo danh mục "${name.trim()}" thành công!`);
      }
      setIsModalOpen(false);
      fetchCategories();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Thao tác thất bại');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingCategory) return;
    try {
      await menuService.deleteCategory(deletingCategory.id);
      setIsDeleteModalOpen(false);
      showToast(`Đã xóa danh mục "${deletingCategory.name}"!`);
      setDeletingCategory(null);
      fetchCategories();
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
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 w-full">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm danh mục món..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 text-sm shadow-sm focus:outline-none focus:border-[#6F4E37] focus:ring-2 focus:ring-[#6F4E37]/20"
          />
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
          <span className="text-xs text-gray-500 font-medium hidden sm:inline">
            Hiển thị: <b className="text-gray-900 font-bold">{filteredCategories.length}</b>/{categories.length} danh mục
          </span>

          <button
            type="button"
            onClick={handleOpenCreate}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#6F4E37] hover:bg-[#5A3F2C] text-white font-bold text-sm shadow-sm hover:shadow-md active:scale-95 transition-all cursor-pointer w-full sm:w-auto"
          >
            <Plus className="w-4 h-4" strokeWidth={2.5} />
            <span>Thêm danh mục</span>
          </button>
        </div>
      </div>

      {/* TẦNG 3: Bảng Dữ Liệu */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#FAF6F0]/80 border-b border-gray-200/70 text-[11px] font-bold text-gray-600 uppercase tracking-wider">
                <th className="py-4 px-6 text-left">Tên danh mục</th>
                <th className="py-4 px-6 text-center w-40">Số lượng món</th>
                <th className="py-4 px-6 text-center w-48">Trạng thái</th>
                <th className="py-4 px-6 text-right w-32">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {loading ? (
                <tr>
                  <td colSpan={4} className="py-16 text-center text-gray-400">
                    Đang tải danh mục...
                  </td>
                </tr>
              ) : filteredCategories.length > 0 ? (
                filteredCategories.map((cat) => {
                  const CategoryIcon = getCategoryIcon(cat.name);
                  return (
                    <tr key={cat.id} className="hover:bg-gray-50/70 transition-colors group">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-[#F5EBE6] text-[#6F4E37] flex items-center justify-center shrink-0">
                            <CategoryIcon className="w-5 h-5" />
                          </div>
                          <span className="font-bold text-gray-900 group-hover:text-[#6F4E37] transition-colors">
                            {cat.name}
                          </span>
                        </div>
                      </td>

                    <td className="py-4 px-6 text-center">
                      <span className="inline-flex items-center justify-center gap-1.5 px-3 py-1 rounded-lg bg-gray-100 font-semibold text-gray-800 text-xs">
                        {cat.productCount || 0} món
                      </span>
                    </td>

                    <td className="py-4 px-6 text-center">
                      {cat.displayStatus === 'HIDE' ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600">
                          <XCircle className="w-3.5 h-3.5" />
                          Đã ẩn
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/70">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Đang hiển thị
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(cat)}
                          className="p-2 rounded-xl text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                          title="Sửa danh mục"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setDeletingCategory(cat);
                            setIsDeleteModalOpen(true);
                          }}
                          className="p-2 rounded-xl text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Xóa danh mục"
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
                  <td colSpan={4} className="py-12 text-center text-gray-400 text-sm">
                    Chưa có danh mục nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Category Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCategory ? 'Chỉnh sửa danh mục' : 'Thêm danh mục mới'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Tên danh mục"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ví dụ: Cà phê, Trà hoa quả..."
            required
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Trạng thái hiển thị
            </label>
            <select
              value={displayStatus}
              onChange={(e) => setDisplayStatus(e.target.value as CategoryDisplayStatus)}
              className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#6F4E37] focus:ring-2 focus:ring-[#6F4E37]/20"
            >
              <option value="SHOW">Hiển thị (SHOW)</option>
              <option value="HIDE">Ẩn (HIDE)</option>
            </select>
          </div>
          <div className="pt-2 flex gap-3">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
              Hủy
            </Button>
            <Button type="submit" isLoading={submitting}>
              {editingCategory ? 'Lưu thay đổi' : 'Tạo danh mục'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Xóa danh mục"
        message={`Bạn có chắc chắn muốn xóa danh mục "${deletingCategory?.name || ''}" không?`}
      />
    </div>
  );
}
