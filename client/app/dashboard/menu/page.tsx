'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  CupSoda,
  Layers,
  Sparkles,
  Plus,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  Eye,
  RefreshCw,
  Search,
  SlidersHorizontal,
} from 'lucide-react';
import { menuService } from '@/api/menu.service';
import { Product, Category, Topping } from '@/types/menu';
import MenuNavTabs from '@/components/menu/MenuNavTabs';

export default function MenuHubPage() {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [toppings, setToppings] = useState<Topping[]>([]);
  const [searchPreview, setSearchPreview] = useState('');

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [prodsData, catsData, topsData] = await Promise.all([
        menuService.getProducts().catch(() => []),
        menuService.getCategories().catch(() => []),
        menuService.getToppings().catch(() => []),
      ]);
      setProducts(Array.isArray(prodsData) ? prodsData : []);
      setCategories(Array.isArray(catsData) ? catsData : []);
      setToppings(Array.isArray(topsData) ? topsData : []);
    } catch (error) {
      console.error('Error fetching menu overview data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const activeProductsCount = products.filter((p) => p.status === 'ACTIVE').length;
  const activeCategoriesCount = categories.filter((c) => c.displayStatus === 'SHOW').length;
  const activeToppingsCount = toppings.filter((t) => (t.status as string) !== 'INACTIVE').length;

  const filteredPreviewProducts = products
    .filter((p) => p.name.toLowerCase().includes(searchPreview.toLowerCase()))
    .slice(0, 6);

  const formatCurrency = (amount?: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount || 0);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto p-4 sm:p-6 pb-16">
      {/* Navigation Sub-tabs */}
      <MenuNavTabs />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-[#6F4E37] via-[#855e43] to-[#5A3F2C] p-6 sm:p-8 rounded-3xl text-white shadow-xl shadow-[#6F4E37]/10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-amber-200 text-xs font-semibold backdrop-blur-md mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Quản trị Thực đơn & Danh mục (Menu-Catalog)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Trung tâm Quản lý Thực đơn
          </h1>
          <p className="text-sm text-amber-100/90 mt-1 max-w-xl">
            Điều chỉnh danh mục, cấu hình món ăn, quản lý biến thể kích cỡ (Size) và hệ thống topping đi kèm cho toàn bộ chi nhánh.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={loadData}
            disabled={loading}
            className="p-3 bg-white/10 hover:bg-white/20 active:scale-95 text-white rounded-2xl transition-all backdrop-blur-md cursor-pointer disabled:opacity-50"
            title="Làm mới dữ liệu"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <Link
            href="/dashboard/menu/products/new"
            className="flex items-center gap-2 px-5 py-3 bg-[#FAF6F0] hover:bg-white text-[#6F4E37] rounded-2xl font-bold text-sm shadow-lg hover:shadow-xl active:scale-95 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tạo món mới</span>
          </Link>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Card 1: Products */}
        <div className="bg-white p-6 rounded-3xl border border-amber-900/10 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <div className="p-3 bg-[#FAF6F0] text-[#6F4E37] rounded-2xl group-hover:scale-110 transition-transform">
              <CupSoda className="w-6 h-6" />
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {activeProductsCount} Đang bán
            </span>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-black text-gray-900">{products.length}</div>
            <div className="text-sm font-medium text-gray-500 mt-0.5">Tổng số món đồ uống / thực đơn</div>
          </div>
          <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between text-xs font-semibold">
            <Link
              href="/dashboard/menu/products"
              className="text-[#6F4E37] hover:text-[#5A3F2C] flex items-center gap-1.5"
            >
              Xem danh sách món <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="/dashboard/menu/products/new"
              className="text-gray-500 hover:text-gray-900 flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Thêm mới
            </Link>
          </div>
        </div>

        {/* Card 2: Categories */}
        <div className="bg-white p-6 rounded-3xl border border-amber-900/10 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <div className="p-3 bg-amber-50 text-amber-800 rounded-2xl group-hover:scale-110 transition-transform">
              <Layers className="w-6 h-6" />
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 bg-amber-50 text-amber-700 rounded-full flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" />
              {activeCategoriesCount} Đang hiển thị
            </span>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-black text-gray-900">{categories.length}</div>
            <div className="text-sm font-medium text-gray-500 mt-0.5">Danh mục phân loại thực đơn</div>
          </div>
          <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between text-xs font-semibold">
            <Link
              href="/dashboard/menu/categories"
              className="text-[#6F4E37] hover:text-[#5A3F2C] flex items-center gap-1.5"
            >
              Quản lý danh mục <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <span className="text-gray-400">Tự động đồng bộ POS</span>
          </div>
        </div>

        {/* Card 3: Toppings */}
        <div className="bg-white p-6 rounded-3xl border border-amber-900/10 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <div className="p-3 bg-[#F5EBE6] text-[#6F4E37] rounded-2xl group-hover:scale-110 transition-transform">
              <Sparkles className="w-6 h-6" />
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {activeToppingsCount} Khả dụng
            </span>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-black text-gray-900">{toppings.length}</div>
            <div className="text-sm font-medium text-gray-500 mt-0.5">Topping & thành phần thêm</div>
          </div>
          <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between text-xs font-semibold">
            <Link
              href="/dashboard/menu/toppings"
              className="text-[#6F4E37] hover:text-[#5A3F2C] flex items-center gap-1.5"
            >
              Quản lý Topping <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="/dashboard/inventory/boms"
              className="text-gray-500 hover:text-gray-900 flex items-center gap-1"
            >
              Định lượng BOM
            </Link>
          </div>
        </div>
      </div>

      {/* Module Navigation Sections */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Section 1: Products Section */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between hover:border-[#6F4E37]/30 transition-all group">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#FAF6F0] flex items-center justify-center text-[#6F4E37]">
              <CupSoda className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#6F4E37] transition-colors">
              Món & Biến thể Size
            </h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              Thiết lập danh sách đồ uống (Cà phê, Trà sữa, Sinh tố...), định giá từng kích thước (S, M, L, XL), hình ảnh minh họa và trạng thái hết hàng.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-gray-100 flex items-center gap-2">
            <Link
              href="/dashboard/menu/products"
              className="flex-1 text-center py-2.5 px-4 bg-[#6F4E37] hover:bg-[#5A3F2C] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
            >
              Mở danh sách
            </Link>
            <Link
              href="/dashboard/menu/products/new"
              className="py-2.5 px-4 bg-[#FAF6F0] hover:bg-[#F5EBE6] text-[#6F4E37] text-xs font-bold rounded-xl transition-colors cursor-pointer"
            >
              + Tạo mới
            </Link>
          </div>
        </div>

        {/* Section 2: Categories Section */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between hover:border-[#6F4E37]/30 transition-all group">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-800">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#6F4E37] transition-colors">
              Phân loại Danh mục
            </h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              Tổ chức menu theo nhóm khoa học (Cà phê truyền thống, Cold Brew, Trà trái cây, Bánh ngọt). Bật/ẩn danh mục để tối ưu màn hình POS & Order.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-gray-100 flex items-center gap-2">
            <Link
              href="/dashboard/menu/categories"
              className="w-full text-center py-2.5 px-4 bg-[#6F4E37] hover:bg-[#5A3F2C] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
            >
              Quản lý danh mục
            </Link>
          </div>
        </div>

        {/* Section 3: Toppings Section */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between hover:border-[#6F4E37]/30 transition-all group">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#F5EBE6] flex items-center justify-center text-[#6F4E37]">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#6F4E37] transition-colors">
              Topping & Extra
            </h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              Quản lý các loại trân châu, thạch, kem phô mai, espresso shot kèm đơn giá bán cộng thêm. Liên kết định lượng nguyên vật liệu kho (BOM).
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-gray-100 flex items-center gap-2">
            <Link
              href="/dashboard/menu/toppings"
              className="w-full text-center py-2.5 px-4 bg-[#6F4E37] hover:bg-[#5A3F2C] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
            >
              Quản lý Topping
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Preview Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Món thực đơn gần đây</h2>
            <p className="text-xs text-gray-500 mt-0.5">Xem nhanh danh sách sản phẩm và các biến thể kích thước</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchPreview}
                onChange={(e) => setSearchPreview(e.target.value)}
                placeholder="Tìm nhanh món..."
                className="w-full pl-9 pr-4 py-2 bg-[#FAF6F0] rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#6F4E37]"
              />
            </div>
            <Link
              href="/dashboard/menu/products"
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl transition-colors whitespace-nowrap"
            >
              Xem tất cả ({products.length})
            </Link>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#FAF6F0]/60 text-gray-600 text-xs font-bold uppercase tracking-wider border-b border-gray-100">
                <th className="py-4 px-6">Tên món</th>
                <th className="py-4 px-6">Danh mục</th>
                <th className="py-4 px-6">Các kích cỡ & Đơn giá</th>
                <th className="py-4 px-6 text-center">Trạng thái</th>
                <th className="py-4 px-6 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-400">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-[#6F4E37]" />
                    Đang tải dữ liệu thực đơn...
                  </td>
                </tr>
              ) : filteredPreviewProducts.length > 0 ? (
                filteredPreviewProducts.map((p) => {
                  const minPrice = p.variants?.length
                    ? Math.min(...p.variants.map((v) => Number(v.price)))
                    : 0;

                  return (
                    <tr key={p.id} className="hover:bg-gray-50/70 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-[#FAF6F0] border border-gray-200/60 overflow-hidden flex items-center justify-center shrink-0">
                            {p.image ? (
                              <img
                                src={p.image}
                                alt={p.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src =
                                    'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=100&auto=format&fit=crop&q=60';
                                }}
                              />
                            ) : (
                              <CupSoda className="w-5 h-5 text-[#6F4E37]" />
                            )}
                          </div>
                          <div>
                            <div className="font-bold text-gray-900">{p.name}</div>
                            <div className="text-xs text-gray-400 line-clamp-1">
                              {p.description || 'Chưa có mô tả'}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-6">
                        <span className="px-2.5 py-1 bg-amber-50 text-[#6F4E37] rounded-lg text-xs font-semibold">
                          {p.categoryName || 'Mặc định'}
                        </span>
                      </td>

                      <td className="py-4 px-6">
                        <div className="flex flex-wrap items-center gap-1.5">
                          {p.variants && p.variants.length > 0 ? (
                            p.variants.map((v) => (
                              <span
                                key={v.id || v.size}
                                className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded-md text-xs font-medium"
                              >
                                Size {v.size}: <b className="font-semibold text-gray-900">{formatCurrency(v.price)}</b>
                              </span>
                            ))
                          ) : (
                            <span className="text-xs text-gray-400">Từ {formatCurrency(minPrice)}</span>
                          )}
                        </div>
                      </td>

                      <td className="py-4 px-6 text-center">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${p.status === 'ACTIVE'
                            ? 'bg-emerald-50 text-emerald-700'
                            : p.status === 'OUT_OF_STOCK'
                              ? 'bg-amber-50 text-amber-700'
                              : 'bg-rose-50 text-rose-700'
                            }`}
                        >
                          {p.status === 'ACTIVE' ? 'Đang bán' : p.status === 'OUT_OF_STOCK' ? 'Hết hàng' : 'Ngưng bán'}
                        </span>
                      </td>

                      <td className="py-4 px-6 text-right">
                        <Link
                          href={`/dashboard/menu/products/${p.id}`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#FAF6F0] hover:bg-[#F5EBE6] text-[#6F4E37] text-xs font-bold rounded-xl transition-colors cursor-pointer"
                        >
                          Chi tiết
                        </Link>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-400">
                    <AlertCircle className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                    Không tìm thấy món nào phù hợp với từ khóa.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
