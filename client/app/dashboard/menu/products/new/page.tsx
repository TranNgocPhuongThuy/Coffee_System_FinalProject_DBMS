'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  CupSoda,
  Plus,
  Trash2,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Image as ImageIcon,
} from 'lucide-react';
import { menuService } from '@/api/menu.service';
import { Category, ProductSize } from '@/types/menu';
import { ProductStatus } from '@/types/enums';

interface VariantFormItem {
  size: 'S' | 'M' | 'L' | 'XL';
  price: number;
}

const AVAILABLE_SIZES: Array<'S' | 'M' | 'L' | 'XL'> = ['S', 'M', 'L', 'XL'];

export default function NewProductPage() {
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCats, setLoadingCats] = useState(true);

  // Form states
  const [categoryId, setCategoryId] = useState<number | ''>('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [status, setStatus] = useState<ProductStatus>('ACTIVE');
  const [variants, setVariants] = useState<VariantFormItem[]>([
    { size: 'M', price: 40000 },
    { size: 'L', price: 50000 },
  ]);

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  useEffect(() => {
    async function loadCategories() {
      setLoadingCats(true);
      try {
        const data = await menuService.getCategories();
        const cats = Array.isArray(data) ? data : [];
        setCategories(cats);
        if (cats.length > 0) {
          setCategoryId(cats[0].id);
        }
      } catch (err) {
        console.error('Lỗi khi tải danh mục:', err);
      } finally {
        setLoadingCats(false);
      }
    }
    loadCategories();
  }, []);

  const handleAddVariant = () => {
    const existingSizes = variants.map((v) => v.size);
    const nextSize = AVAILABLE_SIZES.find((s) => !existingSizes.includes(s)) || 'S';
    setVariants([...variants, { size: nextSize, price: 45000 }]);
  };

  const handleRemoveVariant = (index: number) => {
    if (variants.length <= 1) {
      setErrorMsg('Sản phẩm phải có ít nhất 1 biến thể kích thước (Size)!');
      return;
    }
    setVariants(variants.filter((_, idx) => idx !== index));
  };

  const handleVariantChange = (
    index: number,
    field: 'size' | 'price',
    value: string | number
  ) => {
    const updated = [...variants];
    if (field === 'size') {
      updated[index].size = value as 'S' | 'M' | 'L' | 'XL';
    } else {
      updated[index].price = typeof value === 'number' ? value : Number(value) || 0;
    }
    setVariants(updated);
  };

  const handleApplyPresetSizes = () => {
    setVariants([
      { size: 'S', price: 35000 },
      { size: 'M', price: 45000 },
      { size: 'L', price: 55000 },
    ]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim()) {
      setErrorMsg('Vui lòng nhập tên món ăn/đồ uống!');
      return;
    }

    if (!categoryId) {
      setErrorMsg('Vui lòng chọn danh mục cho món!');
      return;
    }

    if (variants.length === 0) {
      setErrorMsg('Vui lòng cấu hình ít nhất 1 kích thước/giá bán!');
      return;
    }

    // Check unique sizes
    const sizeSet = new Set(variants.map((v) => v.size));
    if (sizeSet.size !== variants.length) {
      setErrorMsg('Các kích thước Size không được trùng lặp nhau!');
      return;
    }

    setSubmitting(true);
    try {
      await menuService.createProduct({
        categoryId: Number(categoryId),
        name: name.trim(),
        description: description.trim() || undefined,
        image: image.trim() || undefined,
        status,
        variants: variants.map((v) => ({
          size: v.size,
          price: Number(v.price),
        })),
      });

      setToastMsg('Tạo món mới thành công!');
      setTimeout(() => {
        router.push('/dashboard/menu/products');
      }, 1000);
    } catch (err: any) {
      setErrorMsg(
        err.response?.data?.message || err.message || 'Có lỗi xảy ra khi tạo món mới'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-4 sm:p-6 pb-20">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#6F4E37] text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-5 h-5 text-emerald-300" />
          <span className="font-semibold text-sm">{toastMsg}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/menu/products"
          className="p-2.5 rounded-2xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 transition-colors shadow-sm cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">
            Thêm Món Mới Vào Thực Đơn
          </h1>
          <p className="text-xs sm:text-sm text-gray-500">
            Điền thông tin đồ uống, tải ảnh minh họa và cấu hình các kích cỡ (Size)
          </p>
        </div>
      </div>

      {/* Error Alert */}
      {errorMsg && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 text-sm flex items-center gap-3 animate-shake">
          <AlertCircle className="w-5 h-5 shrink-0 text-rose-500" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section 1: General Info */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3">
            <CupSoda className="w-5 h-5 text-[#6F4E37]" />
            <span>1. Thông tin chung về món</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Category */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Danh mục món <span className="text-rose-500">*</span>
              </label>
              <select
                required
                value={categoryId}
                onChange={(e) => setCategoryId(Number(e.target.value))}
                className="w-full px-4 py-3 bg-[#FAF6F0] border border-gray-200 rounded-2xl text-sm font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#6F4E37] cursor-pointer"
              >
                {loadingCats ? (
                  <option value="">Đang tải danh mục...</option>
                ) : categories.length > 0 ? (
                  categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))
                ) : (
                  <option value="">Chưa có danh mục nào</option>
                )}
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Trạng thái kinh doanh <span className="text-rose-500">*</span>
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ProductStatus)}
                className="w-full px-4 py-3 bg-[#FAF6F0] border border-gray-200 rounded-2xl text-sm font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#6F4E37] cursor-pointer"
              >
                <option value="ACTIVE">Đang bán (ACTIVE)</option>
                <option value="OUT_OF_STOCK">Hết hàng (OUT_OF_STOCK)</option>
                <option value="INACTIVE">Ngưng bán (INACTIVE)</option>
              </select>
            </div>

            {/* Product Name */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Tên món đồ uống / thức ăn <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ví dụ: Cà phê Muối Hải Phòng, Trà Đào Cam Sả..."
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-white text-gray-900 text-sm font-semibold focus:outline-none focus:border-[#6F4E37] focus:ring-2 focus:ring-[#6F4E37]/20 placeholder:text-gray-400"
              />
            </div>

            {/* Description */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Mô tả chi tiết / Thành phần
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ví dụ: Cà phê robusta thượng hạng kết hợp lớp kem béo mặn sánh mịn đặc trưng..."
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-white text-gray-900 text-sm focus:outline-none focus:border-[#6F4E37] focus:ring-2 focus:ring-[#6F4E37]/20 placeholder:text-gray-400"
              />
            </div>

            {/* Image URL with Preview */}
            <div className="sm:col-span-2 space-y-3">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                Đường dẫn hình ảnh minh họa (Image URL)
              </label>
              <div className="flex gap-4 items-start">
                <div className="flex-1">
                  <input
                    type="url"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    placeholder="https://example.com/images/espresso.jpg"
                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-white text-gray-900 text-sm focus:outline-none focus:border-[#6F4E37] focus:ring-2 focus:ring-[#6F4E37]/20 placeholder:text-gray-400"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Dán URL ảnh trực tiếp từ Unsplash, Imgur hoặc CDN.
                  </p>
                </div>

                <div className="w-20 h-20 rounded-2xl bg-[#FAF6F0] border border-gray-200 overflow-hidden flex items-center justify-center shrink-0">
                  {image ? (
                    <img
                      src={image}
                      alt="Preview"
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.onerror = null;
                        target.style.display = 'none';
                        if (target.parentElement && !target.parentElement.querySelector('.fallback-icon')) {
                          const fallback = document.createElement('span');
                          fallback.className = 'fallback-icon text-[#6F4E37] text-2xl select-none';
                          fallback.textContent = '☕';
                          target.parentElement.appendChild(fallback);
                        }
                      }}
                    />
                  ) : (
                    <ImageIcon className="w-6 h-6 text-gray-400" />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Size Variants & Pricing */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
            <div>
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-700" />
                <span>2. Kích cỡ (Size) & Đơn giá bán</span>
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Mỗi món có thể có nhiều kích cỡ với các mức giá khác nhau
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleApplyPresetSizes}
                className="px-3 py-1.5 bg-[#FAF6F0] hover:bg-[#F5EBE6] text-[#6F4E37] text-xs font-bold rounded-xl transition-colors cursor-pointer"
                title="Tạo nhanh 3 size S, M, L"
              >
                Mẫu nhanh (S/M/L)
              </button>
              <button
                type="button"
                onClick={handleAddVariant}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#6F4E37] hover:bg-[#5A3F2C] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Thêm Size</span>
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {variants.map((v, idx) => (
              <div
                key={idx}
                className="p-4 bg-[#FAF6F0]/60 border border-gray-200/80 rounded-2xl flex flex-col sm:flex-row items-center gap-4"
              >
                <div className="w-full sm:w-40">
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                    Kích cỡ (Size)
                  </label>
                  <select
                    value={v.size}
                    onChange={(e) => handleVariantChange(idx, 'size', e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-bold text-[#6F4E37] focus:outline-none focus:ring-2 focus:ring-[#6F4E37]"
                  >
                    {AVAILABLE_SIZES.map((s) => (
                      <option key={s} value={s}>
                        Size {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex-1 w-full">
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                    Đơn giá bán (VNĐ) <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      step="1"
                      placeholder="0"
                      value={v.price === 0 ? '' : v.price}
                      onKeyDown={(e) => {
                        if (['e', 'E', '+', '-', '.', ','].includes(e.key)) {
                          e.preventDefault();
                        }
                      }}
                      onChange={(e) => {
                        const val = e.target.value === '' ? 0 : Number(e.target.value);
                        handleVariantChange(idx, 'price', val);
                      }}
                      className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#6F4E37]"
                    />
                    <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-400">
                      đ
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center pt-2 sm:pt-4">
                  <button
                    type="button"
                    onClick={() => handleRemoveVariant(idx)}
                    disabled={variants.length <= 1}
                    className="p-2.5 rounded-xl text-rose-600 hover:bg-rose-50 disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer"
                    title="Xóa size này"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Form Action Buttons */}
        <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-200">
          <Link
            href="/dashboard/menu/products"
            className="px-6 py-3 rounded-2xl border border-gray-300 text-gray-700 font-bold text-sm hover:bg-gray-100 transition-colors cursor-pointer"
          >
            Hủy bỏ
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="px-8 py-3 bg-[#6F4E37] hover:bg-[#5A3F2C] active:scale-95 text-white font-bold text-sm rounded-2xl shadow-lg hover:shadow-xl transition-all cursor-pointer flex items-center gap-2 disabled:opacity-50"
          >
            {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
            <span>Lưu & Tạo Món</span>
          </button>
        </div>
      </form>
    </div>
  );
}
