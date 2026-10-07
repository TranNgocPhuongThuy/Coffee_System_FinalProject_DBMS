// components/pos/ProductGrid.tsx
'use client';

import React, { useState, useMemo } from 'react';
import { Search, Coffee, Sparkles } from 'lucide-react';
import { Category, Product } from '@/types/menu';

interface ProductGridProps {
  categories: Category[];
  products: Product[];
  isLoading?: boolean;
  onSelectProduct: (product: Product) => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  categories,
  products,
  isLoading = false,
  onSelectProduct,
}) => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Lọc sản phẩm theo Category và từ khóa tìm kiếm
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (p.status !== 'ACTIVE') return false;

      const matchesCategory =
        selectedCategoryId === null || p.categoryId === selectedCategoryId;
      const matchesSearch =
        searchQuery.trim() === '' ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase().trim());

      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategoryId, searchQuery]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  return (
    <div className="flex h-full flex-col overflow-hidden bg-zinc-50/50 dark:bg-zinc-950/40 p-4 space-y-4">
      {/* 1. Thanh tìm kiếm & Lọc Category */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Ô tìm kiếm */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Tìm kiếm món nhanh (Tên sản phẩm)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-zinc-200 bg-white pl-10 pr-4 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 shadow-xs dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100"
          />
        </div>

        {/* Thống kê số lượng */}
        <div className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 self-center">
          Hiển thị <span className="text-amber-600 dark:text-amber-400 font-bold">{filteredProducts.length}</span> món
        </div>
      </div>

      {/* 2. Danh sách Danh mục (Pills cuộn ngang) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        <button
          type="button"
          onClick={() => setSelectedCategoryId(null)}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold whitespace-nowrap transition-all ${
            selectedCategoryId === null
              ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
              : 'bg-white text-zinc-700 hover:bg-zinc-100 border border-zinc-200 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800'
          }`}
        >
          <Sparkles className="h-4 w-4" />
          <span>Tất cả</span>
        </button>

        {categories.map((cat) => {
          const isSelected = selectedCategoryId === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategoryId(cat.id)}
              className={`rounded-xl px-4 py-2 text-sm font-bold whitespace-nowrap transition-all ${
                isSelected
                  ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
                  : 'bg-white text-zinc-700 hover:bg-zinc-100 border border-zinc-200 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800'
              }`}
            >
              {cat.name}
            </button>
          );
        })}
      </div>

      {/* 3. Lưới sản phẩm (Grid) */}
      <div className="flex-1 overflow-y-auto pr-1">
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 animate-pulse">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-44 rounded-2xl bg-zinc-200 dark:bg-zinc-800/60" />
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center text-zinc-400">
            <Coffee className="h-12 w-12 stroke-[1.5] mb-2 opacity-50" />
            <p className="font-medium text-sm">Không tìm thấy món nào phù hợp</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3.5">
            {filteredProducts.map((product) => {
              const lowestPrice = product.variants?.length
                ? Math.min(...product.variants.map((v) => v.price))
                : 0;

              return (
                <div
                  key={product.id}
                  onClick={() => onSelectProduct(product)}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-zinc-200/80 bg-white p-3.5 shadow-xs hover:border-amber-500/80 hover:shadow-lg hover:shadow-amber-500/10 cursor-pointer active:scale-[0.98] transition-all dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-amber-500/50"
                >
                  {/* Ảnh hoặc Placeholder Thumbnail */}
                  <div className="relative mb-3 aspect-4/3 w-full overflow-hidden rounded-xl bg-gradient-to-br from-amber-100 to-orange-50 dark:from-zinc-800 dark:to-zinc-850 flex items-center justify-center">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <Coffee className="h-8 w-8 text-amber-600/60 dark:text-amber-400/60" />
                    )}

                    {/* Tag size đếm */}
                    {product.variants && product.variants.length > 0 && (
                      <span className="absolute bottom-2 right-2 rounded-md bg-black/60 backdrop-blur-xs px-1.5 py-0.5 text-[10px] font-bold text-white">
                        {product.variants.length} sizes
                      </span>
                    )}
                  </div>

                  {/* Thông tin sản phẩm */}
                  <div>
                    <h4 className="font-bold text-sm text-zinc-900 line-clamp-1 dark:text-zinc-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                      {product.name}
                    </h4>
                    <p className="text-[11px] text-zinc-400 line-clamp-1 mt-0.5">
                      {product.categoryName || 'Cà phê & Đồ uống'}
                    </p>
                  </div>

                  {/* Giá tiền */}
                  <div className="mt-3 flex items-center justify-between border-t border-zinc-100 pt-2 dark:border-zinc-800/80">
                    <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
                      {formatCurrency(lowestPrice)}
                    </span>
                    <span className="rounded-lg bg-amber-500/10 px-2 py-1 text-[11px] font-bold text-amber-600 dark:bg-amber-500/20 dark:text-amber-400 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                      + Chọn
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductGrid;
