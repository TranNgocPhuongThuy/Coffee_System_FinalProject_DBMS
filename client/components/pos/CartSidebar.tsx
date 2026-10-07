// components/pos/CartSidebar.tsx
'use client';

import React, { useState } from 'react';
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  User,
  Radio,
  CreditCard,
  Banknote,
  QrCode,
  Award,
  UserPlus,
  X,
  Loader2,
  ReceiptText,
} from 'lucide-react';
import { CartItem, SelectedCustomer, SelectedPager } from '@/hooks/usePosCart';
import { PagerDevice } from '@/types/pager';
import { CustomerItem } from '@/api/loyalty.service';
import { OrderChannel, PaymentMethod } from '@/types/enums';

interface CartSidebarProps {
  items: CartItem[];
  subTotal: number;
  discountAmount: number;
  totalAmount: number;
  totalItemCount: number;
  orderChannel: OrderChannel;
  paymentMethod: PaymentMethod;
  selectedCustomer: SelectedCustomer | null;
  selectedPager: SelectedPager | null;
  availablePagers: PagerDevice[];
  allCustomers: CustomerItem[];
  isSubmitting?: boolean;
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
  onSetOrderChannel: (channel: OrderChannel) => void;
  onSetPaymentMethod: (method: PaymentMethod) => void;
  onSelectCustomer: (customer: SelectedCustomer | null) => void;
  onSelectPager: (pager: SelectedPager | null) => void;
  onOpenQuickCreateCustomer: () => void;
  onOpenApplyLoyalty: () => void;
  onSubmitOrder: () => void;
}

export const CartSidebar: React.FC<CartSidebarProps> = ({
  items,
  subTotal,
  discountAmount,
  totalAmount,
  totalItemCount,
  orderChannel,
  paymentMethod,
  selectedCustomer,
  selectedPager,
  availablePagers,
  allCustomers,
  isSubmitting = false,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onSetOrderChannel,
  onSetPaymentMethod,
  onSelectCustomer,
  onSelectPager,
  onOpenQuickCreateCustomer,
  onOpenApplyLoyalty,
  onSubmitOrder,
}) => {
  const [customerSearchQuery, setCustomerSearchQuery] = useState('');
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  // Lọc khách hàng khi tìm kiếm
  const matchedCustomers = allCustomers.filter((c) => {
    if (!customerSearchQuery.trim()) return false;
    const q = customerSearchQuery.toLowerCase();
    return c.fullName.toLowerCase().includes(q) || c.phoneNumber.includes(q);
  });

  return (
    <div className="flex h-full w-full flex-col border-l border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 shadow-xl">
      {/* 1. Header Giỏ hàng */}
      <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-3.5 dark:border-zinc-800">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400">
            <ShoppingBag className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100">Đơn hàng</h3>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium">
              {totalItemCount} món trong giỏ
            </p>
          </div>
        </div>

        {items.length > 0 && (
          <button
            type="button"
            onClick={onClearCart}
            className="flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40 transition-colors"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Xóa hết</span>
          </button>
        )}
      </div>

      {/* 2. Cài đặt đơn: Kênh bán & Thẻ rung & Hội viên */}
      <div className="border-b border-zinc-200 bg-zinc-50/70 p-3.5 space-y-3 dark:border-zinc-800 dark:bg-zinc-950/40 text-xs">
        {/* Kênh bán (Tabs) */}
        <div className="grid grid-cols-3 gap-1 rounded-xl bg-zinc-200/70 p-1 dark:bg-zinc-800">
          {(
            [
              { key: 'ORDER_AT_COUNTER', label: 'Tại quầy' },
              { key: 'POS', label: 'Mang đi (POS)' },
              { key: 'DELIVERY', label: 'Giao hàng' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => {
                onSetOrderChannel(tab.key);
                if (tab.key === 'DELIVERY') {
                  onSelectPager(null);
                }
              }}
              className={`rounded-lg py-1.5 text-center font-bold transition-all cursor-pointer ${
                orderChannel === tab.key
                  ? 'bg-white text-amber-700 shadow-xs dark:bg-zinc-900 dark:text-amber-300'
                  : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Cấp Thẻ rung (Pager) */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 font-bold text-zinc-700 dark:text-zinc-300">
            <Radio className="h-3.5 w-3.5 text-amber-600" />
            <span>Thẻ rung:</span>
          </div>

          <select
            value={orderChannel === 'DELIVERY' ? '' : (selectedPager?.id || '')}
            disabled={orderChannel === 'DELIVERY'}
            onChange={(e) => {
              const val = e.target.value;
              if (!val) {
                onSelectPager(null);
              } else {
                const p = availablePagers.find((x) => x.id === Number(val));
                if (p) onSelectPager({ id: p.id, pagerCode: p.pagerCode, batteryLevel: p.batteryLevel });
              }
            }}
            className="rounded-lg border border-zinc-200 bg-white px-3 py-1.5 font-bold text-zinc-900 focus:border-amber-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 disabled:opacity-60 disabled:bg-zinc-100 dark:disabled:bg-zinc-800 disabled:cursor-not-allowed"
          >
            <option value="">{orderChannel === 'DELIVERY' ? '-- Không cấp thẻ (Giao đi) --' : '-- Không cấp thẻ --'}</option>
            {orderChannel !== 'DELIVERY' &&
              availablePagers.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.pagerCode} (Pin {p.batteryLevel}%)
                </option>
              ))}
          </select>
        </div>

        {/* Khách hàng hội viên */}
        <div>
          {selectedCustomer ? (
            <div className="flex items-center justify-between rounded-xl border border-amber-200 bg-amber-50/70 p-2.5 dark:border-amber-900/50 dark:bg-amber-950/30">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-500 text-white font-bold text-[10px]">
                  {selectedCustomer.fullName.charAt(0)}
                </div>
                <div>
                  <div className="font-bold text-zinc-900 dark:text-zinc-100 line-clamp-1">
                    {selectedCustomer.fullName}
                  </div>
                  <div className="text-[10px] text-amber-700 dark:text-amber-400 font-semibold">
                    {selectedCustomer.phoneNumber} • {selectedCustomer.rewardPoints} điểm
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={onOpenApplyLoyalty}
                  className="rounded-lg bg-amber-600 px-2 py-1 text-[11px] font-bold text-white hover:bg-amber-700"
                >
                  <Award className="inline h-3 w-3 mr-0.5" />
                  Đổi điểm
                </button>
                <button
                  type="button"
                  onClick={() => onSelectCustomer(null)}
                  className="rounded-lg p-1 text-zinc-400 hover:text-red-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="relative">
              <div className="flex items-center gap-1.5">
                <div className="relative flex-1">
                  <User className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400" />
                  <input
                    type="text"
                    placeholder="Tìm SĐT hoặc Tên khách..."
                    value={customerSearchQuery}
                    onChange={(e) => {
                      setCustomerSearchQuery(e.target.value);
                      setShowCustomerDropdown(true);
                    }}
                    onFocus={() => setShowCustomerDropdown(true)}
                    className="w-full rounded-xl border border-zinc-200 bg-white pl-8 pr-2 py-1.5 text-xs text-zinc-900 placeholder:text-zinc-400 focus:border-amber-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
                  />
                </div>
                <button
                  type="button"
                  onClick={onOpenQuickCreateCustomer}
                  title="Đăng ký thành viên nhanh"
                  className="rounded-xl border border-dashed border-amber-400 bg-amber-50/50 p-1.5 text-amber-700 hover:bg-amber-100 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-300 transition-colors"
                >
                  <UserPlus className="h-4 w-4" />
                </button>
              </div>

              {/* Dropdown tìm kiếm khách */}
              {showCustomerDropdown && matchedCustomers.length > 0 && (
                <div className="absolute left-0 right-0 top-full z-20 mt-1 max-h-40 overflow-y-auto rounded-xl border border-zinc-200 bg-white p-1 shadow-lg dark:border-zinc-700 dark:bg-zinc-800">
                  {matchedCustomers.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => {
                        onSelectCustomer({
                          id: c.id,
                          fullName: c.fullName,
                          phoneNumber: c.phoneNumber,
                          rewardPoints: c.rewardPoints || 0,
                          membershipTier: c.membershipTier || 'STANDARD',
                        });
                        setShowCustomerDropdown(false);
                        setCustomerSearchQuery('');
                      }}
                      className="w-full rounded-lg px-3 py-1.5 text-left text-xs hover:bg-amber-50 dark:hover:bg-zinc-700/60 flex items-center justify-between"
                    >
                      <div>
                        <div className="font-bold text-zinc-800 dark:text-zinc-200">{c.fullName}</div>
                        <div className="text-[10px] text-zinc-400">{c.phoneNumber}</div>
                      </div>
                      <span className="font-semibold text-amber-600 dark:text-amber-400">{c.rewardPoints} đ</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 3. Danh sách các món trong giỏ (Cuộn) */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-zinc-400 py-12">
            <ShoppingBag className="h-10 w-10 stroke-[1.5] mb-2 opacity-40" />
            <p className="font-medium text-xs">Chưa có món nào trong đơn</p>
            <p className="text-[11px] text-zinc-400 mt-0.5">Vui lòng chọn món từ menu bên trái</p>
          </div>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className="flex flex-col rounded-xl border border-zinc-200/90 bg-white p-3 shadow-2xs dark:border-zinc-800 dark:bg-zinc-850/60 transition-all"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <div className="font-bold text-xs text-zinc-900 dark:text-zinc-100">
                    {item.productName}{' '}
                    <span className="rounded bg-zinc-100 px-1.5 py-0.5 text-[10px] font-extrabold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                      {item.size}
                    </span>
                  </div>

                  {/* Topping list */}
                  {item.toppings && item.toppings.length > 0 && (
                    <div className="mt-1 flex flex-wrap gap-1">
                      {item.toppings.map((t, idx) => (
                        <span
                          key={idx}
                          className="rounded-md bg-amber-50 px-1.5 py-0.5 text-[10px] font-medium text-amber-700 dark:bg-amber-950/40 dark:text-amber-300"
                        >
                          +{t.toppingSnapshotName} {t.quantity > 1 ? `x${t.quantity}` : ''}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Note */}
                  {item.note && (
                    <p className="mt-1 text-[10px] italic text-zinc-500 dark:text-zinc-400">
                      * {item.note}
                    </p>
                  )}
                </div>

                {/* Xóa món */}
                <button
                  type="button"
                  onClick={() => onRemoveItem(item.id)}
                  className="text-zinc-400 hover:text-red-500 transition-colors p-0.5"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Stepper & Line Price */}
              <div className="mt-2.5 flex items-center justify-between border-t border-zinc-100 pt-2 dark:border-zinc-800">
                <div className="flex items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-1.5 py-0.5 dark:border-zinc-700 dark:bg-zinc-800">
                  <button
                    type="button"
                    onClick={() => onUpdateQuantity(item.id, -1)}
                    className="p-0.5 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
                  >
                    <Minus className="h-3 w-3" />
                  </button>
                  <span className="w-5 text-center text-xs font-bold text-zinc-800 dark:text-zinc-200">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => onUpdateQuantity(item.id, 1)}
                    className="p-0.5 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                </div>

                <span className="text-xs font-extrabold text-amber-600 dark:text-amber-400">
                  {formatCurrency(item.totalPrice)}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 4. Phương thức thanh toán & Tổng tiền & Nút Chốt đơn */}
      <div className="border-t border-zinc-200 bg-zinc-50 p-4 space-y-3 dark:border-zinc-800 dark:bg-zinc-950/80">
        {/* Chọn Phương thức thanh toán */}
        <div>
          <div className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1.5">
            <span>Phương thức thanh toán:</span>
          </div>
          <div className="grid grid-cols-5 gap-1">
            {[
              { key: 'CASH', label: 'Tiền mặt', icon: Banknote },
              { key: 'BANK_TRANSFER', label: 'Ngân hàng', icon: QrCode },
              { key: 'CARD', label: 'Quẹt thẻ', icon: CreditCard },
              { key: 'MOMO', label: 'MoMo', icon: CreditCard },
              { key: 'VNPAY', label: 'VNPay', icon: QrCode },
            ].map((pm) => {
              const Icon = pm.icon;
              const isSelected = paymentMethod === pm.key;
              return (
                <button
                  key={pm.key}
                  type="button"
                  onClick={() => onSetPaymentMethod(pm.key as PaymentMethod)}
                  className={`flex flex-col items-center justify-center rounded-xl border py-2 px-1 text-center transition-all cursor-pointer ${
                    isSelected
                      ? 'border-amber-500 bg-amber-50 text-amber-800 ring-2 ring-amber-500/20 dark:border-amber-500 dark:bg-amber-950/40 dark:text-amber-200 shadow-xs'
                      : 'border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5 mb-1 text-amber-600 dark:text-amber-400" />
                  <span className="text-[10px] font-bold leading-tight">{pm.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Bảng chi tiết tiền */}
        <div className="space-y-1 text-xs pt-1 border-t border-zinc-200 dark:border-zinc-800">
          <div className="flex justify-between text-zinc-500 dark:text-zinc-400">
            <span>Tạm tính:</span>
            <span className="font-semibold text-zinc-800 dark:text-zinc-200">{formatCurrency(subTotal)}</span>
          </div>

          {discountAmount > 0 && (
            <div className="flex justify-between text-amber-600 dark:text-amber-400 font-semibold">
              <span>Chiết khấu / Đổi điểm:</span>
              <span>-{formatCurrency(discountAmount)}</span>
            </div>
          )}

          <div className="flex justify-between text-sm font-black text-zinc-900 dark:text-zinc-100 pt-1">
            <span>TỔNG CỘNG:</span>
            <span className="text-base text-amber-600 dark:text-amber-400">{formatCurrency(totalAmount)}</span>
          </div>
        </div>

        {/* Nút Chốt đơn */}
        <button
          type="button"
          disabled={items.length === 0 || isSubmitting}
          onClick={onSubmitOrder}
          className="w-full rounded-xl bg-amber-600 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-amber-600/30 hover:bg-amber-700 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Đang xử lý đơn...</span>
            </>
          ) : (
            <>
              <ReceiptText className="h-4 w-4" />
              <span>TẠO ĐƠN & THANH TOÁN ({formatCurrency(totalAmount)})</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default CartSidebar;
