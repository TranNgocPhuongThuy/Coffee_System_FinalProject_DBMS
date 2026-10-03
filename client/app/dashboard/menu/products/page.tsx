'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Coffee,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { menuService } from '@/api/menu.service';
import { ConfirmModal } from '@/components/common/ConfirmModal';

interface ProductItem {
  id: number;
  productName?: string;
  name?: string;
  categoryName?: string;
  basePrice?: number;
  price?: number;
  status?: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingProduct, setDeletingProduct] = useState<ProductItem | null>(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await menuService.getProducts();
      setProducts(Array.isArray(data) ? data : []);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const filteredProducts = products.filter((p) => {
    const name = p.productName || p.name || '';
    return name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const formatCurrency = (val?: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(val || 0);
  };

  const handleDelete = async () => {
    if (!deletingProduct) return;
    try {
      await menuService.deleteProduct(deletingProduct.id);
      setIsDeleteModalOpen(false);
      setDeletingProduct(null);
      fetchProducts();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Xóa thất bại');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Danh sách Thực đơn</h1>
          <p className="text-sm text-gray-500 mt-1">Quản lý các món đồ uống, đồ ăn và trạng thái kinh doanh</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm tên món..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 text-sm focus:outline-none focus:border-[#6F4E37] focus:ring-2 focus:ring-[#6F4E37]/20"
          />
        </div>

        <div className="text-xs text-gray-500 hidden sm:block">
          Hiển thị: <span className="font-semibold text-gray-800">{filteredProducts.length}</span> món
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-100 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                <th className="py-3.5 px-5">Món ăn / Đồ uống</th>
                <th className="py-3.5 px-5">Danh mục</th>
                <th className="py-3.5 px-5">Giá gốc</th>
                <th className="py-3.5 px-5">Trạng thái</th>
                <th className="py-3.5 px-5 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-400 text-sm">
                    Đang tải danh sách sản phẩm...
                  </td>
                </tr>
              ) : filteredProducts.length > 0 ? (
                filteredProducts.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/60 transition-colors group">
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#F5EBE6] text-[#6F4E37] flex items-center justify-center shrink-0">
                          <Coffee className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="font-semibold text-gray-900 group-hover:text-[#6F4E37] transition-colors block">
                            {item.productName || item.name}
                          </span>
                          <span className="text-xs text-gray-400 font-mono">ID: #{item.id}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-5 text-gray-600 font-medium">
                      {item.categoryName || 'Mặc định'}
                    </td>

                    <td className="py-3.5 px-5 font-bold text-[#6F4E37]">
                      {formatCurrency(item.basePrice || item.price)}
                    </td>

                    <td className="py-3.5 px-5">
                      {item.status === 'OUT_OF_STOCK' || item.status === 'INACTIVE' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200/70">
                          <XCircle className="w-3.5 h-3.5" />
                          Hết hàng
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/70">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Đang bán
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setDeletingProduct(item);
                            setIsDeleteModalOpen(true);
                          }}
                          className="p-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                          title="Xóa món"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-400 text-sm">
                    Chưa có thực đơn nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Modal */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Xóa món khỏi thực đơn"
        message={`Bạn có chắc chắn muốn xóa món "${deletingProduct?.productName || deletingProduct?.name || ''}" không?`}
      />
    </div>
  );
}
