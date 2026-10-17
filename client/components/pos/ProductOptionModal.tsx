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

    const safeQuantity = Math.max(1, Math.floor(Number(quantity) || 1));

    const toppingPayload: CartToppingItem[] = Object.values(selectedToppings)
      .filter((item) => (item.quantity || 0) > 0)
      .map((item) => ({
        toppingId: item.topping.id,
        toppingSnapshotName: item.topping.name,
        toppingPrice: Math.max(0, item.topping.price),
        quantity: Math.max(1, Math.floor(Number(item.quantity) || 1)),
      }));

    onConfirm({
      productId: product.id,
      productName: product.name,
      variantId: selectedVariant.id,
      size: selectedVariant.size,
      unitPrice: Math.max(0, selectedVariant.price),
      quantity: safeQuantity,
      note: note.trim() || undefined,
      toppings: toppingPayload,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-fade-in">
      <div className="relative flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-zinc-900 border border-zinc-800 shadow-2xl text-zinc-100">
        {/* Header Modal */}
        <div className="flex items-center justify-between border-b border-zinc-800 px-6 py-4 bg-zinc-900 shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#6F4E37]/30 text-[#D4A373]">
              <Coffee className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-zinc-100">{product.name}</h3>
              <p className="text-xs text-zinc-400">
                {product.categoryName || 'Tùy chọn kích cỡ & Topping'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Nội dung tùy chọn cuộn được */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* 1. Chọn Kích cỡ (Size) */}
          <div>
            <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2.5">
              1. Chọn kích cỡ <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-3">
              {product.variants?.map((v) => {
                const isSelected = selectedVariant?.id === v.id;
                return (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setSelectedVariant(v)}
                    className={`flex flex-col items-center justify-center rounded-xl border p-3.5 transition-all text-center cursor-pointer ${
                      isSelected
                        ? 'border-[#D4A373] bg-[#6F4E37]/30 text-[#D4A373] ring-2 ring-[#D4A373]/30 shadow-sm'
                        : 'border-zinc-700 bg-zinc-800/80 text-zinc-200 hover:bg-zinc-750 hover:border-zinc-600'
                    }`}
                  >
                    <span className={`text-base font-extrabold ${isSelected ? 'text-[#D4A373]' : 'text-zinc-100'}`}>
                      Size {v.size}
                    </span>
                    <span className="text-xs font-bold text-zinc-400 mt-1">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(v.price)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Chọn Topping - SỬA LỖI MÀU CHỮ NỀN ĐEN KHÔNG BỊ TRẮNG TRÊN TRẮNG */}
          {toppings && toppings.length > 0 && (
            <div>
              <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2.5">
                2. Thêm Topping
              </label>
              <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                {toppings
                  .filter((t) => t.status === 'AVAILABLE' || t.status === 'ACTIVE')
                  .map((t) => {
                    const toppingSelected = selectedToppings[t.id];
                    const isChecked = Boolean(toppingSelected);

                    return (
                      <div
                        key={t.id}
                        className={`flex items-center justify-between rounded-xl border p-3 transition-all ${
                          isChecked
                            ? 'border-[#D4A373]/80 bg-[#6F4E37]/25 text-zinc-100'
                            : 'border-zinc-800 bg-zinc-800/60 hover:bg-zinc-800 hover:border-zinc-700 text-zinc-200'
                        }`}
                      >
                        <div
                          className="flex items-center gap-3 cursor-pointer flex-1"
                          onClick={() => toggleTopping(t)}
                        >
                          <div
                            className={`flex h-5 w-5 items-center justify-center rounded-md border transition-all ${
                              isChecked
                                ? 'border-[#D4A373] bg-[#6F4E37] text-white'
                                : 'border-zinc-600 bg-zinc-900 text-transparent'
                            }`}
                          >
                            {isChecked && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                          </div>
                          <div>
                            <div className="text-sm font-bold text-zinc-100 leading-snug">{t.name}</div>
                            <div className="text-xs font-bold text-[#D4A373] mt-0.5">
                              +{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(t.price)}
                            </div>
                          </div>
                        </div>

                        {isChecked && (
                          <div className="flex items-center gap-2 bg-zinc-900 rounded-lg border border-zinc-700 px-2 py-1">
                            <button
                              type="button"
                              onClick={() => updateToppingQuantity(t.id, -1)}
                              className="text-zinc-400 hover:text-zinc-100 cursor-pointer p-0.5"
                            >
                              <Minus className="h-3.5 w-3.5" />
                            </button>
                            <span className="text-xs font-extrabold text-zinc-100 w-4 text-center">
                              {toppingSelected.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateToppingQuantity(t.id, 1)}
                              className="text-zinc-400 hover:text-zinc-100 cursor-pointer p-0.5"
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
            <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">
              3. Ghi chú món (Đá, Đường, Yêu cầu khác)
            </label>
            <input
              type="text"
              placeholder="VD: Ít đá, 50% đường, để đá riêng..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-[#D4A373] focus:outline-none focus:ring-1 focus:ring-[#D4A373]"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="border-t border-zinc-800 bg-zinc-900/90 p-4 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-zinc-400">Số lượng:</span>
            <div className="flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-800 px-2 py-1">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="rounded p-1 text-zinc-400 hover:text-zinc-100 cursor-pointer"
              >
                <Minus className="h-4 w-4" />
              </button>
              <input
                type="text"
                inputMode="numeric"
                value={quantity}
                onChange={(e) => {
                  const val = parseInt(e.target.value.replace(/\D/g, ''), 10);
                  setQuantity(isNaN(val) ? 1 : Math.min(999, Math.max(1, val)));
                }}
                className="w-10 text-center text-sm font-bold text-zinc-100 focus:outline-none bg-transparent"
              />
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.min(999, q + 1))}
                className="rounded p-1 text-zinc-400 hover:text-zinc-100 cursor-pointer"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            className="flex-1 rounded-xl bg-[#6F4E37] hover:bg-[#5A3F2C] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-[#6F4E37]/30 transition-all flex items-center justify-between cursor-pointer"
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