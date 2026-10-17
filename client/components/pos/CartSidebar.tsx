// components/pos/CartSidebar.tsx
'use client';

import React, { useState, useEffect } from 'react';
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
import { CustomerItem, loyaltyService } from '@/api/loyalty.service';
import { OrderChannel, PaymentMethod } from '@/types/enums';
import { useDebounce } from '@/hooks/useDebounce';

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
  const [searchedCustomers, setSearchedCustomers] = useState<CustomerItem[]>([]);
  const [isSearchingCustomer, setIsSearchingCustomer] = useState(false);
  const [receivedCashStr, setReceivedCashStr] = useState<string>('');

  const debouncedCustomerSearch = useDebounce(customerSearchQuery, 300);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  useEffect(() => {
    if (!debouncedCustomerSearch.trim()) {
      setSearchedCustomers(allCustomers.slice(0, 30));
      return;
    }

    let active = true;
    setIsSearchingCustomer(true);
    loyaltyService
      .getCustomers({ search: debouncedCustomerSearch.trim(), limit: 20 })
      .then((res: any) => {
        if (active) {
          const fetchedItems = res?.items || res?.data || (Array.isArray(res) ? res : []);
          setSearchedCustomers(fetchedItems);
        }
      })
      .catch((err) => {
        console.error('Lỗi tìm kiếm khách hàng:', err);
      })
      .finally(() => {
        if (active) setIsSearchingCustomer(false);
      });

    return () => {
      active = false;
    };
  }, [debouncedCustomerSearch, allCustomers]);

  const receivedCashNum = Number(receivedCashStr) || 0;

  return (
    <div className="flex h-full w-full flex-col border-l border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xl select-none">
      {/* 1. KHU VỰC CÀI ĐẶT THIẾT KẾ NHỎ GỌN (BỎ HEADER TO "ĐƠN HÀNG" ĐỂ TIẾT KIỆM DIỆN TÍCH) */}
      <div className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-950/50 p-3 space-y-2.5 text-xs">
        {/* Kênh bán (Tabs nhỏ) */}
        <div className="grid grid-cols-3 gap-1 rounded-xl bg-zinc-200/70 dark:bg-zinc-800 p-1">
          {(
            [
              { key: 'ORDER_AT_COUNTER', label: 'Tại quầy' },
              { key: 'POS', label: 'Mang đi' },
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
              className={`rounded-lg py-1 text-center font-bold transition-all cursor-pointer ${
                orderChannel === tab.key
                  ? 'bg-white text-[#6F4E37] shadow-xs dark:bg-zinc-900 dark:text-[#D4A373]'
                  : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Thẻ rung & Hội viên trên cùng hàng thu gọn */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {/* Thẻ rung */}
          <div className="flex items-center gap-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-2.5 py-1">
            <Radio className="h-3.5 w-3.5 text-[#6F4E37] dark:text-[#D4A373] shrink-0" />
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
              className="w-full bg-transparent font-bold text-zinc-800 dark:text-zinc-200 focus:outline-none cursor-pointer"
            >
              <option value="" className="dark:bg-zinc-900">
                {orderChannel === 'DELIVERY' ? 'Giao đi' : 'Không thẻ'}
              </option>
              {orderChannel !== 'DELIVERY' &&
                availablePagers.map((p) => (
                  <option key={p.id} value={p.id} className="dark:bg-zinc-900">
                    {p.pagerCode} (Pin {p.batteryLevel}%)
                  </option>
                ))}
            </select>
          </div>

          {/* Ô tìm hội viên */}
          <div className="relative">
            {selectedCustomer ? (
              <div className="flex items-center justify-between rounded-xl border border-amber-300 dark:border-amber-800/60 bg-amber-50/80 dark:bg-zinc-800 px-2.5 py-1.5">
                <div className="truncate mr-1">
                  <span className="font-bold text-zinc-900 dark:text-zinc-100 block truncate text-xs">
                    {selectedCustomer.fullName}
                  </span>
                  <span className="text-[10px] text-[#6F4E37] dark:text-[#D4A373] font-bold">
                    {selectedCustomer.phoneNumber} • {selectedCustomer.rewardPoints} điểm
                  </span>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={onOpenApplyLoyalty}
                    className="rounded-lg bg-[#6F4E37] px-2 py-0.5 text-[10px] font-bold text-white hover:bg-[#5A3F2C]"
                  >
                    Đổi
                  </button>
                  <button
                    type="button"
                    onClick={() => onSelectCustomer(null)}
                    className="p-1 text-zinc-400 hover:text-rose-500 cursor-pointer"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ) : (
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
                    className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 pl-8 pr-2 py-1.5 text-xs text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:border-[#6F4E37] dark:focus:border-[#D4A373] focus:outline-none shadow-2xs"
                  />
                </div>
                <button
                  type="button"
                  onClick={onOpenQuickCreateCustomer}
                  title="Thêm khách mới"
                  className="rounded-xl border border-dashed border-[#6F4E37]/60 dark:border-zinc-600 p-1.5 text-[#6F4E37] dark:text-[#D4A373] hover:bg-[#F5EBE6] dark:hover:bg-zinc-800 cursor-pointer"
                >
                  <UserPlus className="h-4 w-4" />
                </button>
              </div>
            )}

            {/* Lớp nền trong suốt click ra ngoài để đóng dropdown */}
            {showCustomerDropdown && (
              <div
                className="fixed inset-0 z-30"
                onClick={() => setShowCustomerDropdown(false)}
              />
            )}

            {/* Dropdown kết quả tìm kiếm với màu nền và chữ tương phản rõ rệt */}
            {showCustomerDropdown && (
              <div className="absolute left-0 right-0 top-full z-40 mt-1 max-h-52 overflow-y-auto rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 p-1 shadow-2xl">
                {isSearchingCustomer ? (
                  <div className="flex items-center justify-center p-3 text-xs text-zinc-400 gap-2">
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-[#6F4E37] dark:text-[#D4A373]" />
                    <span>Đang tìm kiếm...</span>
                  </div>
                ) : searchedCustomers.length > 0 ? (
                  searchedCustomers.map((c) => (
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
                      className="w-full rounded-lg px-2.5 py-1.5 text-left text-xs hover:bg-[#F5EBE6] dark:hover:bg-zinc-700 flex items-center justify-between cursor-pointer transition-colors"
                    >
                      <div className="truncate">
                        <div className="font-bold text-zinc-900 dark:text-zinc-100 truncate">{c.fullName}</div>
                        <div className="text-[10px] text-zinc-500 dark:text-zinc-400">{c.phoneNumber}</div>
                      </div>
                      <span className="font-extrabold text-[#6F4E37] dark:text-[#D4A373] ml-2 shrink-0">
                        {c.rewardPoints || 0} pts
                      </span>
                    </button>
                  ))
                ) : (
                  <div className="p-3 text-center text-xs text-zinc-500 dark:text-zinc-400">
                    Không tìm thấy khách hàng.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2. THANH TIÊU ĐỀ DANH SÁCH MÓN & NÚT THÙNG RÁC XÓA HẾT */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-zinc-100 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 shrink-0">
        <span className="font-extrabold text-xs text-zinc-700 dark:text-zinc-200 uppercase tracking-wider">
          Danh sách món ({totalItemCount} món)
        </span>
        {items.length > 0 && (
          <button
            type="button"
            onClick={onClearCart}
            className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-100/60 dark:hover:bg-rose-950/60 transition-colors cursor-pointer"
          >
            <Trash2 className="h-3.5 w-3.5 text-rose-600 dark:text-rose-400" />
            <span>Xóa hết</span>
          </button>
        )}
      </div>

      {/* 3. KHÔNG GIAN HIỂN THỊ DANH SÁCH MÓN ĐƯỢC MỞ RỘNG TỐI ĐA */}
      <div className="flex-1 min-h-0 overflow-y-auto p-3.5 space-y-2.5 bg-zinc-50/50 dark:bg-zinc-950/30">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-zinc-400 py-10">
            <ShoppingBag className="h-10 w-10 stroke-[1.5] mb-2 opacity-40 text-[#6F4E37]" />
            <p className="font-bold text-xs">Chưa có món nào được chọn</p>
            <p className="text-[11px] text-zinc-500 mt-0.5">Bấm vào thực đơn bên trái để thêm món</p>
          </div>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className="flex flex-col rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 p-3 shadow-xs transition-all"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-xs text-zinc-900 dark:text-white flex items-center gap-1.5 flex-wrap">
                    <span className="text-zinc-950 dark:text-zinc-50 font-extrabold">{item.productName}</span>
                    <span className="rounded bg-zinc-200 dark:bg-zinc-700 px-1.5 py-0.5 text-[10px] font-black text-zinc-800 dark:text-zinc-200">
                      Size {item.size}
                    </span>
                  </div>

                  {/* Toppings */}
                  {item.toppings && item.toppings.length > 0 && (
                    <div className="mt-1 flex flex-wrap gap-1">
                      {item.toppings.map((t, idx) => (
                        <span
                          key={idx}
                          className="rounded-md bg-[#F5EBE6] dark:bg-[#6F4E37]/40 px-1.5 py-0.5 text-[10px] font-semibold text-[#6F4E37] dark:text-[#E8DDD4]"
                        >
                          +{t.toppingSnapshotName} {t.quantity > 1 ? `x${t.quantity}` : ''}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Note */}
                  {item.note && (
                    <p className="mt-1 text-[10px] italic text-zinc-600 dark:text-zinc-400">
                      * {item.note}
                    </p>
                  )}
                </div>

                {/* Nút xóa món */}
                <button
                  type="button"
                  onClick={() => onRemoveItem(item.id)}
                  className="text-zinc-400 hover:text-rose-500 transition-colors p-1 cursor-pointer"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Tăng giảm số lượng & Thành tiền */}
              <div className="mt-2.5 flex items-center justify-between border-t border-zinc-200 dark:border-zinc-700 pt-2">
                <div className="flex items-center gap-2 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-zinc-100 dark:bg-zinc-900 px-1.5 py-0.5">
                  <button
                    type="button"
                    onClick={() => onUpdateQuantity(item.id, -1)}
                    className="p-0.5 text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white cursor-pointer"
                  >
                    <Minus className="h-3 w-3" />
                  </button>
                  <span className="w-5 text-center text-xs font-black text-zinc-900 dark:text-white">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => onUpdateQuantity(item.id, 1)}
                    className="p-0.5 text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white cursor-pointer"
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                </div>

                <span className="text-xs font-black text-[#6F4E37] dark:text-[#D4A373]">
                  {formatCurrency(item.totalPrice)}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 4. FOOTER THANH TOÁN (THU GỌN VÀ HIỂN THỊ TIỀN RÕ RÀNG) */}
      <div className="border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 p-3.5 space-y-2.5 shrink-0">
        {/* Phương thức thanh toán */}
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
                className={`flex flex-col items-center justify-center rounded-xl border py-1.5 px-1 text-center transition-all cursor-pointer ${
                  isSelected
                    ? 'border-[#D4A373] bg-[#6F4E37]/25 text-[#D4A373] ring-1 ring-[#D4A373]'
                    : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                }`}
              >
                <Icon className="h-3.5 w-3.5 mb-0.5 text-[#6F4E37] dark:text-[#D4A373]" />
                <span className="text-[10px] font-bold leading-tight">{pm.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tiền khách đưa (khi chọn tiền mặt) */}
        {paymentMethod === 'CASH' && (
          <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-2 space-y-1.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-zinc-700 dark:text-zinc-300">Khách đưa:</span>
              <input
                type="text"
                placeholder="0 đ"
                value={receivedCashStr ? Number(receivedCashStr).toLocaleString('vi-VN') : ''}
                onChange={(e) => {
                  const raw = e.target.value.replace(/\D/g, '');
                  setReceivedCashStr(raw);
                }}
                className="w-32 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-2 py-0.5 text-right font-bold text-zinc-900 dark:text-zinc-100 focus:outline-none"
              />
            </div>
            {/* Tính tiền thối hoặc tiền thiếu */}
            {receivedCashNum > 0 && (
              <div className="flex items-center justify-between text-xs font-black border-t border-zinc-200 dark:border-zinc-800 pt-1.5">
                <span className="text-zinc-800 dark:text-zinc-200 font-extrabold">
                  {receivedCashNum >= totalAmount ? 'Tiền thối lại:' : 'Khách đưa thiếu:'}
                </span>
                <span className={receivedCashNum >= totalAmount ? 'text-emerald-600 dark:text-emerald-400 text-sm font-black' : 'text-rose-500 font-bold'}>
                  {formatCurrency(Math.abs(receivedCashNum - totalAmount))}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Bảng tổng kết tiền */}
        <div className="space-y-1 text-xs">
          <div className="flex justify-between text-zinc-500 dark:text-zinc-400">
            <span>Tạm tính:</span>
            <span className="font-bold text-zinc-900 dark:text-zinc-200">{formatCurrency(subTotal)}</span>
          </div>
          {discountAmount > 0 && (
            <div className="flex justify-between text-[#D4A373] font-bold">
              <span>Chiết khấu / Đổi điểm:</span>
              <span>-{formatCurrency(discountAmount)}</span>
            </div>
          )}
          <div className="flex justify-between text-sm font-black text-zinc-900 dark:text-zinc-100 pt-1 border-t border-zinc-200 dark:border-zinc-800">
            <span>TỔNG CỘNG:</span>
            <span className="text-[#6F4E37] dark:text-[#D4A373] text-base">{formatCurrency(totalAmount)}</span>
          </div>
        </div>

        {/* Nút Tạo Đơn & Thanh Toán */}
        <button
          type="button"
          disabled={items.length === 0 || isSubmitting}
          onClick={onSubmitOrder}
          className="w-full rounded-xl bg-[#6F4E37] hover:bg-[#5A3F2C] py-3 text-xs font-black text-white shadow-lg shadow-[#6F4E37]/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
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