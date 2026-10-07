// components/pos/ProductOptionModal.tsx
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { X, Plus, Minus, Check, Coffee } from 'lucide-react';
import { Product, ProductVariant, Topping } from '@/types/menu';
import { CartToppingItem } from '@/hooks/usePosCart';

interface ProductOptionModalProps {
  isOpen: boolean;
  product: Product | null;
  toppings: Topping[];
  onClose: () => void;
  onConfirm: (item: {
    productId: number;
    productName: string;
    variantId: number;
    size: string;
    unitPrice: number;
    quantity: number;
    note?: string;
    toppings?: CartToppingItem[];
  }) => void;
}

export const ProductOptionModal: React.FC<ProductOptionModalProps> = ({
  isOpen,
  product,
  toppings,
  onClose,
  onConfirm,
}) => {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [selectedToppings, setSelectedToppings] = useState<Record<number, { topping: Topping; quantity: number }>>({});
  const [note, setNote] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);

  // Khởi tạo variant mặc định khi mở modal
  useEffect(() => {
    if (product && product.variants && product.variants.length > 0) {
      setSelectedVariant(product.variants[0]);
      setSelectedToppings({});
      setNote('');
      setQuantity(1);
    }
  }, [product, isOpen]);

  const toggleTopping = (topping: Topping) => {
    setSelectedToppings((prev) => {
      const next = { ...prev };
      if (next[topping.id]) {
        delete next[topping.id];
      } else {
        next[topping.id] = { topping, quantity: 1 };
      }
      return next;
    });
  };

  const updateToppingQuantity = (toppingId: number, delta: number) => {
    setSelectedToppings((prev) => {
      const current = prev[toppingId];
      if (!current) return prev;
      const newQty = current.quantity + delta;
      if (newQty <= 0) {
        const next = { ...prev };
        delete next[toppingId];
        return next;
      }
      return {
        ...prev,
        [toppingId]: { ...current, quantity: newQty },
      };
    });
  };

  // Tính tổng giá món đang cấu hình
  const toppingTotal = useMemo(() => {
    return Object.values(selectedToppings).reduce(
      (sum, item) => sum + item.topping.price * item.quantity,
      0
    );
  }, [selectedToppings]);

  const unitPrice = selectedVariant?.price || 0;
  const lineTotalPrice = (unitPrice + toppingTotal) * quantity;

  if (!isOpen || !product) return null;

  const handleAddToCart = () => {
    if (!selectedVariant) return;

    const toppingPayload: CartToppingItem[] = Object.values(selectedToppings).map((item) => ({
      toppingId: item.topping.id,
      toppingSnapshotName: item.topping.name,
      toppingPrice: item.topping.price,
      quantity: item.quantity,
    }));

    onConfirm({
      productId: product.id,
      productName: product.name,
      variantId: selectedVariant.id,
      size: selectedVariant.size,
      unitPrice: selectedVariant.price,
      quantity,
      note: note.trim() || undefined,
      toppings: toppingPayload,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
      <div className="relative flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-zinc-900">
        {/* Header Modal */}
        <div className="flex items-center justify-between border-b border-zinc-200 px-6 py-4 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400">
              <Coffee className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-zinc-900 dark:text-zinc-100">{product.name}</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                {product.categoryName || 'Tùy chọn kích cỡ & Topping'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-200 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Nội dung tùy chọn cuộn được */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* 1. Chọn Kích cỡ (Size) */}
          <div>
            <label className="block text-sm font-semibold text-zinc-800 dark:text-zinc-200 mb-3">
              1. Chọn kích cỡ <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-3">
              {product.variants?.map((v) => {
                const isSelected = selectedVariant?.id === v.id;
                return (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setSelectedVariant(v)}
                    className={`flex flex-col items-center justify-center rounded-xl border p-3.5 transition-all text-center ${
                      isSelected
                        ? 'border-amber-500 bg-amber-50/70 text-amber-900 ring-2 ring-amber-500/20 dark:border-amber-500 dark:bg-amber-950/40 dark:text-amber-200'
                        : 'border-zinc-200 bg-zinc-50 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-800/60 dark:hover:bg-zinc-800'
                    }`}
                  >
                    <span className="text-base font-bold">Size {v.size}</span>
                    <span className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 font-medium">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(v.price)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Chọn Topping */}
          {toppings && toppings.length > 0 && (
            <div>
              <label className="block text-sm font-semibold text-zinc-800 dark:text-zinc-200 mb-3">
                2. Thêm Topping
              </label>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {toppings
                  .filter((t) => t.status === 'ACTIVE')
                  .map((t) => {
                    const toppingSelected = selectedToppings[t.id];
                    const isChecked = Boolean(toppingSelected);

                    return (
                      <div
                        key={t.id}
                        className={`flex items-center justify-between rounded-xl border p-3 transition-all ${
                          isChecked
                            ? 'border-amber-500/80 bg-amber-50/40 dark:border-amber-500/60 dark:bg-amber-950/20'
                            : 'border-zinc-200 bg-white hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-850'
                        }`}
                      >
                        <div
                          className="flex items-center gap-3 cursor-pointer flex-1"
                          onClick={() => toggleTopping(t)}
                        >
                          <div
                            className={`flex h-5 w-5 items-center justify-center rounded-md border transition-all ${
                              isChecked
                                ? 'border-amber-500 bg-amber-500 text-white'
                                : 'border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800'
                            }`}
                          >
                            {isChecked && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{t.name}</div>
                            <div className="text-xs text-amber-600 dark:text-amber-400 font-semibold">
                              +{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(t.price)}
                            </div>
                          </div>
                        </div>

                        {isChecked && (
                          <div className="flex items-center gap-2 bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 px-2 py-1">
                            <button
                              type="button"
                              onClick={() => updateToppingQuantity(t.id, -1)}
                              className="text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
                            >
                              <Minus className="h-3.5 w-3.5" />
                            </button>
                            <span className="text-xs font-bold w-4 text-center">{toppingSelected.quantity}</span>
                            <button
                              type="button"
                              onClick={() => updateToppingQuantity(t.id, 1)}
                              className="text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
                            >
                              <Plus className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {/* 3. Ghi chú món */}
          <div>
            <label className="block text-sm font-semibold text-zinc-800 dark:text-zinc-200 mb-2">
              3. Ghi chú món (Đá, Đường, Yêu cầu khác)
            </label>
            <input
              type="text"
              placeholder="VD: Ít đá, 50% đường, để đá riêng..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-amber-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 dark:border-zinc-800 dark:bg-zinc-800/60 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:bg-zinc-900"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="border-t border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/80 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Số lượng:</span>
            <div className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-2 py-1 dark:border-zinc-700 dark:bg-zinc-800">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="rounded p-1 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-700 dark:hover:text-zinc-100"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-8 text-center text-sm font-bold text-zinc-900 dark:text-zinc-100">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                className="rounded p-1 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-700 dark:hover:text-zinc-100"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            className="flex-1 rounded-xl bg-amber-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-amber-600/30 hover:bg-amber-700 active:scale-[0.98] transition-all flex items-center justify-between"
          >
            <span>Thêm vào đơn</span>
            <span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(lineTotalPrice)}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductOptionModal;
