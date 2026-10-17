'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  CupSoda,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Filter,
  Layers,
  FlaskConical,
  RefreshCw,
  SlidersHorizontal,
  Coffee,
} from 'lucide-react';
import { menuService } from '@/api/menu.service';
import { Product, Category } from '@/types/menu';
import { ConfirmModal } from '@/components/common/ConfirmModal';
import MenuNavTabs from '@/components/menu/MenuNavTabs';
import { SafeProductImage } from '@/components/common/SafeProductImage';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | 'ALL'>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');

  // Deletion Modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Toast
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const fetchInitialData = useCallback(async () => {
    setLoading(true);
    try {
      console.log('[DEBUG Frontend] Fetching products and categories from Backend...');
      const [prodsData, catsData] = await Promise.all([
        menuService.getProducts(),
        menuService.getCategories(),
      ]);

      console.log('[DEBUG Frontend] Raw Products received:', prodsData);
      console.log('[DEBUG Frontend] Raw Categories received:', catsData);

      // Robust mapping to protect against subtle field name differences
      const normalizedProducts: Product[] = (Array.isArray(prodsData) ? prodsData : []).map((p: any) => ({
        id: Number(p.id),
        categoryId: Number(p.categoryId ?? p.category_id ?? 0),
        categoryName: p.categoryName ?? p.category_name ?? 'Mặc định',
        name: p.name ?? p.productName ?? p.product_name ?? 'Món chưa đặt tên',
        description: p.description ?? p.desc ?? null,
        image: p.image ?? p.imageUrl ?? p.image_url ?? null,
        status: p.status ?? 'ACTIVE',
        createdAt: p.createdAt ?? new Date().toISOString(),
        variants: Array.isArray(p.variants)
          ? p.variants.map((v: any) => ({
              id: Number(v.id ?? 0),
              productId: Number(v.productId ?? p.id),
              size: v.size,
              price: Number(v.price) || 0,
              createdAt: v.createdAt ?? new Date().toISOString(),
            }))
          : p.price || p.basePrice
          ? [{ id: 0, productId: Number(p.id), size: 'M' as const, price: Number(p.price || p.basePrice) || 0, createdAt: new Date().toISOString() }]
          : [],
      }));

      const normalizedCategories: Category[] = (Array.isArray(catsData) ? catsData : []).map((c: any) => ({
        id: Number(c.id),
        name: c.name ?? c.categoryName ?? 'Danh mục',
        displayStatus: c.displayStatus ?? c.display_status ?? 'SHOW',
        productCount: Number(c.productCount ?? c.product_count ?? 0),
        createdAt: c.createdAt ?? new Date().toISOString(),
      }));

      console.log('[DEBUG Frontend] Normalized Products Count:', normalizedProducts.length);
      console.log('[DEBUG Frontend] Normalized Categories Count:', normalizedCategories.length);

      setProducts(normalizedProducts);
      setCategories(normalizedCategories);
    } catch (err) {
      console.error('[DEBUG Frontend] Lỗi tải dữ liệu thực đơn:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  const filteredProducts = products.filter((p) => {
    const searchLower = searchQuery.toLowerCase().trim();
    const matchSearch =
      !searchLower ||
      (p.name || '').toLowerCase().includes(searchLower) ||
      (p.categoryName || '').toLowerCase().includes(searchLower);

    const matchCategory =
      selectedCategoryId === 'ALL' || Number(p.categoryId) === Number(selectedCategoryId);

    const matchStatus =
      selectedStatus === 'ALL' ||
      (selectedStatus === 'ACTIVE' && p.status === 'ACTIVE') ||
      (selectedStatus === 'OUT_OF_STOCK' && p.status === 'OUT_OF_STOCK') ||
      (selectedStatus === 'INACTIVE' && p.status === 'INACTIVE');

    return matchSearch && matchCategory && matchStatus;
  });

  const totalProducts = products.length;
  const activeCount = products.filter((p) => p.status === 'ACTIVE').length;
  const outOfStockCount = products.filter((p) => p.status === 'OUT_OF_STOCK').length;
  const inactiveCount = products.filter((p) => p.status === 'INACTIVE').length;

  const formatCurrency = (val?: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(val || 0);
  };

  const handleDelete = async () => {
    if (!deletingProduct) return;
    setDeleting(true);
    try {
      await menuService.deleteProduct(deletingProduct.id);
      setIsDeleteModalOpen(false);
      setDeletingProduct(null);
      showToast(`Đã xóa món "${deletingProduct.name}" khỏi thực đơn!`);
      fetchInitialData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Xóa món thất bại');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6 pb-16">
      {/* Toast Alert */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#6F4E37] text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-5 h-5 text-emerald-300" />
          <span className="font-semibold text-sm">{toastMsg}</span>
        </div>
      )}

      {/* 1. Header Title & Actions (Đồng bộ theo trang Khách hàng) */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Quản lý Thực đơn & Món ăn</h1>
          <p className="text-sm text-gray-500 mt-1">
            Danh mục đồ uống, giá bán theo kích thước và trạng thái phục vụ
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/dashboard/menu/products/new"
            className="flex items-center gap-2 bg-[#6F4E37] hover:bg-[#5A3F2C] text-white px-4 py-2.5 rounded-xl font-semibold text-sm shadow-sm transition-all cursor-pointer active:scale-[0.99]"
          >
            <Plus className="w-4 h-4" />
            <span>Tạo món mới</span>
          </Link>
        </div>
      </div>

      {/* 2. Thanh Điều Hướng Menu Tabs */}
      <MenuNavTabs />

      {/* 3. Thẻ Metric Cards (Bố cục Icon bên trái - Thông số bên phải chuẩn) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#F5EBE6] text-[#6F4E37] flex items-center justify-center shrink-0 font-bold">
            <Coffee className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-medium">Tổng số món ăn/uống</p>
            <p className="text-xl font-bold text-gray-900 mt-0.5">{totalProducts.toLocaleString('vi-VN')}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 font-bold">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-medium">Đang mở bán</p>
            <p className="text-xl font-bold text-emerald-700 mt-0.5">{activeCount.toLocaleString('vi-VN')}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 font-bold">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-medium">Hết hàng tạm thời</p>
            <p className="text-xl font-bold text-amber-800 mt-0.5">{outOfStockCount.toLocaleString('vi-VN')}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 font-bold">
            <XCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-medium">Tạm ngưng phục vụ</p>
            <p className="text-xl font-bold text-rose-800 mt-0.5">{inactiveCount.toLocaleString('vi-VN')}</p>
          </div>
        </div>
      </div>

      {/* 4. Toolbar (Card trắng độc lập chuẩn theo trang Khách hàng) */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="flex flex-1 flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <button
            type="button"
            onClick={fetchInitialData}
            className="p-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 transition-colors cursor-pointer shrink-0 self-start sm:self-auto"
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
              placeholder="Tìm kiếm theo tên món đồ uống..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 text-sm focus:outline-none focus:border-[#6F4E37] focus:ring-2 focus:ring-[#6F4E37]/20 transition-all"
            />
          </div>

          <div className="relative">
            <Filter className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="pl-10 pr-8 py-2 rounded-xl border border-gray-200 bg-white text-gray-700 text-sm font-medium focus:outline-none focus:border-[#6F4E37] focus:ring-2 focus:ring-[#6F4E37]/20 cursor-pointer appearance-none"
            >
              <option value="ALL">Tất cả trạng thái</option>
              <option value="ACTIVE">Đang bán (ACTIVE)</option>
              <option value="OUT_OF_STOCK">Hết hàng (OUT_OF_STOCK)</option>
              <option value="INACTIVE">Ngưng bán (INACTIVE)</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-end shrink-0">
          <span className="text-xs text-gray-500 font-medium">
            Hiển thị: <b className="text-gray-900 font-bold">{filteredProducts.length}</b>/{products.length} món
          </span>
        </div>
      </div>

      {/* TẦNG 3: Bảng Dữ Liệu & Bộ lọc Danh mục */}
      <div className="space-y-3">
        {/* Category Pills Slider */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          <button
            type="button"
            onClick={() => setSelectedCategoryId('ALL')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategoryId === 'ALL'
                ? 'bg-[#6F4E37] text-white shadow-sm'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            Tất cả danh mục ({products.length})
          </button>
          {categories.map((cat) => {
            const count = products.filter((p) => Number(p.categoryId) === Number(cat.id)).length;
            const isSelected = selectedCategoryId === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategoryId(cat.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-[#6F4E37] text-white shadow-sm'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                <span>{cat.name}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    isSelected ? 'bg-white/25 text-white' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#FAF6F0]/80 border-b border-gray-200/70 text-[11px] font-bold text-gray-600 uppercase tracking-wider">
                <th className="py-4 px-5">Món ăn / Đồ uống</th>
                <th className="py-4 px-5">Danh mục</th>
                <th className="py-4 px-5">Kích thước (Size) & Giá</th>
                <th className="py-4 px-5 text-center">Trạng thái</th>
                <th className="py-4 px-6 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-16 text-center text-gray-400">
                    <RefreshCw className="w-7 h-7 animate-spin mx-auto mb-2 text-[#6F4E37]" />
                    Đang tải danh sách thực đơn...
                  </td>
                </tr>
              ) : filteredProducts.length > 0 ? (
                filteredProducts.map((item) => {
                  const sortedVariants = item.variants
                    ? [...item.variants].sort((a, b) => Number(a.price) - Number(b.price))
                    : [];

                  return (
                    <tr key={item.id} className="hover:bg-gray-50/70 transition-colors group">
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3.5">
                          <div className="w-12 h-12 rounded-2xl bg-[#FAF6F0] border border-gray-200/60 overflow-hidden flex items-center justify-center shrink-0 shadow-inner">
                            <SafeProductImage
                              src={item.image}
                              alt={item.name}
                              fallbackIcon={<CupSoda className="w-6 h-6 text-[#6F4E37]" />}
                            />
                          </div>
                          <div>
                            <Link
                              href={`/dashboard/menu/products/${item.id}`}
                              className="font-bold text-gray-900 group-hover:text-[#6F4E37] transition-colors block text-base leading-snug hover:underline"
                            >
                              {item.name}
                            </Link>
                            {item.description && (
                              <span className="text-xs text-gray-500 line-clamp-1 mt-0.5 max-w-sm">
                                {item.description}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-5">
                        <span className="inline-flex items-center px-2.5 py-1 bg-amber-50 text-[#6F4E37] rounded-lg text-xs font-bold border border-amber-200/50">
                          {item.categoryName || 'Mặc định'}
                        </span>
                      </td>

                      <td className="py-4 px-5">
                        <div className="flex flex-wrap items-center gap-1.5">
                          {sortedVariants.length > 0 ? (
                            sortedVariants.map((v) => (
                              <span
                                key={v.id || v.size}
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gray-100 text-gray-800 text-xs font-medium border border-gray-200/60"
                              >
                                <span className="font-bold text-[#6F4E37]">Size {v.size}:</span>
                                <span>{formatCurrency(v.price)}</span>
                              </span>
                            ))
                          ) : (
                            <span className="text-xs text-gray-400 italic">Chưa có giá</span>
                          )}
                        </div>
                      </td>

                      <td className="py-4 px-5 text-center">
                        {item.status === 'ACTIVE' ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Đang bán
                          </span>
                        ) : item.status === 'OUT_OF_STOCK' ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                            <AlertCircle className="w-3.5 h-3.5" />
                            Hết hàng
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
                            <XCircle className="w-3.5 h-3.5" />
                            Ngưng bán
                          </span>
                        )}
                      </td>

                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            href={`/dashboard/inventory/boms`}
                            className="p-2 rounded-xl text-amber-700 hover:bg-amber-50 transition-colors cursor-pointer"
                            title="Định lượng BOM nguyên liệu"
                          >
                            <FlaskConical className="w-4 h-4" />
                          </Link>
                          <Link
                            href={`/dashboard/menu/products/${item.id}`}
                            className="p-2 rounded-xl text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                            title="Chỉnh sửa món"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                          <button
                            type="button"
                            onClick={() => {
                              setDeletingProduct(item);
                              setIsDeleteModalOpen(true);
                            }}
                            className="p-2 rounded-xl text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Xóa món"
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
                  <td colSpan={5} className="py-16 text-center text-gray-400">
                    <AlertCircle className="w-9 h-9 mx-auto mb-2 text-gray-300" />
                    Không tìm thấy món ăn nào phù hợp với bộ lọc ({products.length} món trong CSDL).
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      </div>

      {/* Delete Modal */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Xóa món khỏi thực đơn"
        message={`Bạn có chắc chắn muốn xóa món "${deletingProduct?.name || ''}" và toàn bộ các biến thể kích cỡ liên quan?`}
      />
    </div>
  );
}
