// app/pos/terminal/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Coffee,
  Radio,
  Receipt,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Clock,
  UserCheck,
} from 'lucide-react';
import { menuService } from '@/api/menu.service';
import { pagerService } from '@/api/pager.service';
import { loyaltyService, CustomerItem } from '@/api/loyalty.service';
import { posService } from '@/api/pos.service';
import { Category, Product, Topping } from '@/types/menu';
import { PagerDevice } from '@/types/pager';
import { usePosCart } from '@/hooks/usePosCart';
import { ProductGrid } from '@/components/pos/ProductGrid';
import { CartSidebar } from '@/components/pos/CartSidebar';
import { ProductOptionModal } from '@/components/pos/ProductOptionModal';
import { QuickCreateCustomerModal } from '@/components/pos/QuickCreateCustomerModal';
import { ApplyLoyaltyModal } from '@/components/pos/ApplyLoyaltyModal';
import { PrintReceiptModal } from '@/components/pos/PrintReceiptModal';

export default function PosTerminalPage() {
  // 1. Data States từ API
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [toppings, setToppings] = useState<Topping[]>([]);
  const [availablePagers, setAvailablePagers] = useState<PagerDevice[]>([]);
  const [customers, setCustomers] = useState<CustomerItem[]>([]);
  const [loadingData, setLoadingData] = useState<boolean>(true);

  // 2. Modals States
  const [selectedProductForOption, setSelectedProductForOption] = useState<Product | null>(null);
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState<boolean>(false);
  const [isLoyaltyModalOpen, setIsLoyaltyModalOpen] = useState<boolean>(false);
  const [createdOrderIdForReceipt, setCreatedOrderIdForReceipt] = useState<number | null>(null);

  // 3. Thông báo Toast
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // 4. Custom Hook giỏ hàng POS
  const {
    items,
    selectedCustomer,
    selectedPager,
    orderChannel,
    paymentMethod,
    pointsToRedeem,
    conversionRate,
    subTotal,
    discountAmount,
    totalAmount,
    totalItemCount,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    setSelectedCustomer,
    setSelectedPager,
    setOrderChannel,
    setPaymentMethod,
    setPointsToRedeem,
    buildPayload,
  } = usePosCart();

  // 5. Tải dữ liệu ban đầu
  const fetchData = async () => {
    setLoadingData(true);
    try {
      const [catsRes, prodsRes, topsRes, pagersRes, custsRes] = await Promise.all([
        menuService.getCategories({ displayStatus: 'SHOW' as any }).catch(() => [] as any),
        menuService.getProducts({ status: 'ACTIVE' as any }).catch(() => [] as any),
        menuService.getToppings({ status: 'ACTIVE' as any }).catch(() => [] as any),
        pagerService.getAvailablePagers().catch(() => [] as any),
        loyaltyService.getCustomers({ limit: 100 }).catch(() => ({ items: [] } as any)),
      ]);

      setCategories(Array.isArray(catsRes) ? (catsRes as any) : (catsRes as any)?.data || []);
      setProducts(Array.isArray(prodsRes) ? (prodsRes as any) : (prodsRes as any)?.data || []);
      setToppings(Array.isArray(topsRes) ? (topsRes as any) : (topsRes as any)?.data || []);
      setAvailablePagers(Array.isArray(pagersRes) ? (pagersRes as any) : (pagersRes as any)?.data || []);
      setCustomers((custsRes as any)?.items || (custsRes as any)?.data || []);
    } catch (error: any) {
      console.error('Lỗi khi tải dữ liệu POS:', error);
      setToastMessage({ type: 'error', message: 'Không thể tải đầy đủ danh mục và thực đơn' });
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Tự động tắt toast sau 4 giây
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // 6. Xử lý Chốt đơn & Thanh toán
  const handleCheckout = async () => {
    if (items.length === 0) {
      setToastMessage({ type: 'error', message: 'Vui lòng chọn ít nhất 1 món vào đơn hàng' });
      return;
    }

    setIsSubmitting(true);

    try {
      // employeeId = 1 (hoặc lấy từ auth user profile)
      const payload = buildPayload(1);
      const res = await posService.createOrder(payload);
      const createdOrder = res?.data || res;
      const newOrderId = createdOrder.id || res.orderId;

      setToastMessage({
        type: 'success',
        message: `Tạo đơn #${createdOrder.orderCode || newOrderId} thành công!`,
      });

      // Mở modal in hóa đơn
      if (newOrderId) {
        setCreatedOrderIdForReceipt(newOrderId);
      }

      // Reset giỏ hàng và reload lại danh sách thẻ rung trống
      clearCart();
      const updatedPagers = await pagerService.getAvailablePagers().catch(() => []);
      setAvailablePagers(updatedPagers);
    } catch (err: any) {
      setToastMessage({
        type: 'error',
        message: err.message || 'Không thể tạo đơn hàng. Vui lòng kiểm tra lại nguyên liệu hoặc thẻ rung.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex h-screen w-full flex-col bg-zinc-100 dark:bg-zinc-950 overflow-hidden select-none">
      {/* 1. Header Topbar POS */}
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-zinc-200 bg-white px-5 dark:border-zinc-800 dark:bg-zinc-900 shadow-2xs">
        <div className="flex items-center gap-3">
          <Link
            href="/pos/orders"
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700 transition-colors"
            title="Về danh sách đơn"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>

          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-600 text-white font-black shadow-xs">
              <Coffee className="h-4 w-4" />
            </div>
            <div>
              <h1 className="font-extrabold text-sm text-zinc-900 dark:text-zinc-100 tracking-tight leading-tight">
                POS TERMINAL
              </h1>
              <p className="text-[10px] text-zinc-400 font-medium leading-none">Quầy Order</p>
            </div>
          </div>
        </div>

        {/* Quick Nav Links */}
        <div className="flex items-center gap-2">
          <Link
            href="/pos/orders"
            className="flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs font-bold text-zinc-700 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-200"
          >
            <Receipt className="h-3.5 w-3.5 text-amber-600" />
            <span>Lịch sử hóa đơn</span>
          </Link>

          <Link
            href="/pos/pagers"
            className="flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs font-bold text-zinc-700 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-200"
          >
            <Radio className="h-3.5 w-3.5 text-amber-600" />
            <span>Thẻ rung</span>
          </Link>

          <button
            type="button"
            onClick={fetchData}
            title="Làm mới thực đơn"
            className="flex h-8 w-8 items-center justify-center rounded-xl border border-zinc-200 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-800"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        </div>
      </header>

      {/* 2. Toast Thông báo */}
      {toastMessage && (
        <div className="fixed top-16 right-6 z-50 animate-bounce">
          <div
            className={`flex items-center gap-2.5 rounded-xl px-4 py-3 text-xs font-bold shadow-xl ${toastMessage.type === 'success'
              ? 'bg-emerald-600 text-white'
              : 'bg-rose-600 text-white'
              }`}
          >
            {toastMessage.type === 'success' ? (
              <CheckCircle2 className="h-4 w-4" />
            ) : (
              <AlertCircle className="h-4 w-4" />
            )}
            <span>{toastMessage.message}</span>
          </div>
        </div>
      )}

      {/* 3. Khung làm việc chính: Chia 2 cột (Menu Grid 65% + Cart Sidebar 35%) */}
      <div className="flex flex-1 overflow-hidden">
        {/* Cột trái: Lưới sản phẩm */}
        <div className="flex-1 overflow-hidden">
          <ProductGrid
            categories={categories}
            products={products}
            isLoading={loadingData}
            onSelectProduct={(prod) => setSelectedProductForOption(prod)}
          />
        </div>

        {/* Cột phải: Giỏ hàng Sidebar */}
        <div className="w-[380px] lg:w-[420px] shrink-0 h-full">
          <CartSidebar
            items={items}
            subTotal={subTotal}
            discountAmount={discountAmount}
            totalAmount={totalAmount}
            totalItemCount={totalItemCount}
            orderChannel={orderChannel}
            paymentMethod={paymentMethod}
            selectedCustomer={selectedCustomer}
            selectedPager={selectedPager}
            availablePagers={availablePagers}
            allCustomers={customers}
            isSubmitting={isSubmitting}
            onUpdateQuantity={updateQuantity}
            onRemoveItem={removeItem}
            onClearCart={clearCart}
            onSetOrderChannel={setOrderChannel}
            onSetPaymentMethod={setPaymentMethod}
            onSelectCustomer={setSelectedCustomer}
            onSelectPager={setSelectedPager}
            onOpenQuickCreateCustomer={() => setIsCustomerModalOpen(true)}
            onOpenApplyLoyalty={() => setIsLoyaltyModalOpen(true)}
            onSubmitOrder={handleCheckout}
          />
        </div>
      </div>

      {/* 4. Modals */}
      {/* Modal tùy chọn món */}
      <ProductOptionModal
        isOpen={Boolean(selectedProductForOption)}
        product={selectedProductForOption}
        toppings={toppings}
        onClose={() => setSelectedProductForOption(null)}
        onConfirm={addItem}
      />

      {/* Modal tạo nhanh khách hàng */}
      <QuickCreateCustomerModal
        isOpen={isCustomerModalOpen}
        onClose={() => setIsCustomerModalOpen(false)}
        onCustomerCreated={(newCust) => {
          setSelectedCustomer(newCust);
          setCustomers((prev) => [newCust as any, ...prev]);
        }}
      />

      {/* Modal đổi điểm thưởng */}
      <ApplyLoyaltyModal
        isOpen={isLoyaltyModalOpen}
        customer={selectedCustomer}
        subTotal={subTotal}
        currentPointsToRedeem={pointsToRedeem}
        conversionRate={conversionRate}
        onClose={() => setIsLoyaltyModalOpen(false)}
        onApply={setPointsToRedeem}
      />

      {/* Modal in hóa đơn */}
      <PrintReceiptModal
        isOpen={Boolean(createdOrderIdForReceipt)}
        orderId={createdOrderIdForReceipt}
        onClose={() => setCreatedOrderIdForReceipt(null)}
      />
    </div>
  );
}
