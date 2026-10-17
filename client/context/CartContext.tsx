'use client';

import React, { createContext, useContext, useState, useMemo, useCallback, useEffect } from 'react';
import { CreateOrderPayload, OrderItemPayload, OrderItemToppingPayload } from '@/types/pos';
import { OrderChannel, PaymentMethod } from '@/types/enums';

export interface CartToppingItem {
  toppingId?: number | null;
  toppingSnapshotName: string;
  toppingPrice: number;
  quantity: number;
}

export interface CartItem {
  id: string; // Unique client ID
  productId: number;
  productName: string;
  variantId: number;
  size: string;
  unitPrice: number;
  quantity: number;
  note?: string;
  toppings: CartToppingItem[];
  totalToppingPriceSnapshot: number;
  totalPrice: number;
}

export interface SelectedCustomer {
  id: number;
  fullName: string;
  phoneNumber: string;
  rewardPoints: number;
  membershipTier: string;
}

export interface SelectedPager {
  id: number;
  pagerCode: string;
  batteryLevel: number;
}

export interface CartContextType {
  items: CartItem[];
  selectedCustomer: SelectedCustomer | null;
  selectedPager: SelectedPager | null;
  orderChannel: OrderChannel;
  paymentMethod: PaymentMethod;
  pointsToRedeem: number;
  conversionRate: number;
  cashReceived: number;
  subTotal: number;
  discountAmount: number;
  totalAmount: number;
  totalItemCount: number;
  changeAmount: number;
  addItem: (item: {
    productId: number;
    productName: string;
    variantId: number;
    size: string;
    unitPrice: number;
    quantity: number;
    note?: string;
    toppings?: CartToppingItem[];
  }) => void;
  updateQuantity: (id: string, delta: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  setSelectedCustomer: (customer: SelectedCustomer | null) => void;
  setSelectedPager: (pager: SelectedPager | null) => void;
  setOrderChannel: (channel: OrderChannel) => void;
  setPaymentMethod: (method: PaymentMethod) => void;
  setPointsToRedeem: (points: number) => void;
  setCashReceived: (amount: number) => void;
  buildPayload: (employeeId: number) => CreateOrderPayload;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const STORAGE_KEY = 'mepaphin_pos_cart';

// Helper so sánh danh sách topping xem có hoàn toàn giống nhau không
function areToppingsEqual(a: CartToppingItem[], b: CartToppingItem[]): boolean {
  if (a.length !== b.length) return false;
  const sortedA = [...a].sort((x, y) => (x.toppingId || 0) - (y.toppingId || 0));
  const sortedB = [...b].sort((x, y) => (x.toppingId || 0) - (y.toppingId || 0));
  return sortedA.every(
    (item, idx) =>
      item.toppingId === sortedB[idx].toppingId &&
      item.quantity === sortedB[idx].quantity &&
      item.toppingPrice === sortedB[idx].toppingPrice
  );
}

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<SelectedCustomer | null>(null);
  const [selectedPager, setSelectedPager] = useState<SelectedPager | null>(null);
  const [orderChannel, setOrderChannel] = useState<OrderChannel>('ORDER_AT_COUNTER');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('CASH');
  const [pointsToRedeem, setPointsToRedeem] = useState<number>(0);
  const [cashReceived, setCashReceived] = useState<number>(0);
  const conversionRate = 1000; // 1 điểm = 1.000 VNĐ

  // Phục hồi giỏ hàng từ sessionStorage khi refresh trang
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.items)) setItems(parsed.items);
        if (parsed.selectedCustomer) setSelectedCustomer(parsed.selectedCustomer);
        if (parsed.selectedPager) setSelectedPager(parsed.selectedPager);
        if (parsed.orderChannel) setOrderChannel(parsed.orderChannel);
        if (parsed.paymentMethod) setPaymentMethod(parsed.paymentMethod);
        if (typeof parsed.pointsToRedeem === 'number') setPointsToRedeem(parsed.pointsToRedeem);
      }
    } catch {
      // Bỏ qua lỗi parse
    }
  }, []);

  // Lưu trữ giỏ hàng vào sessionStorage khi state thay đổi
  useEffect(() => {
    try {
      sessionStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          items,
          selectedCustomer,
          selectedPager,
          orderChannel,
          paymentMethod,
          pointsToRedeem,
        })
      );
    } catch {
      // Bỏ qua nếu storage đầy
    }
  }, [items, selectedCustomer, selectedPager, orderChannel, paymentMethod, pointsToRedeem]);

  // 1. Thêm món vào giỏ hàng: Kiểm tra và gộp món nếu trùng lặp
  const addItem = useCallback(
    (item: {
      productId: number;
      productName: string;
      variantId: number;
      size: string;
      unitPrice: number;
      quantity: number;
      note?: string;
      toppings?: CartToppingItem[];
    }) => {
      // Validate cứng số lượng món >= 1
      const safeQuantity = Math.max(1, Math.floor(Number(item.quantity) || 1));
      const cleanNote = (item.note || '').trim();

      // Loại bỏ topping số lượng <= 0, validate số lượng topping >= 1
      const cleanToppings: CartToppingItem[] = (item.toppings || [])
        .filter((t) => (t.quantity || 0) > 0)
        .map((t) => ({
          toppingId: t.toppingId || null,
          toppingSnapshotName: t.toppingSnapshotName,
          toppingPrice: Math.max(0, t.toppingPrice),
          quantity: Math.max(1, Math.floor(Number(t.quantity) || 1)),
        }));

      const totalToppingPrice = cleanToppings.reduce(
        (sum, t) => sum + t.toppingPrice * t.quantity,
        0
      );

      setItems((prev) => {
        // Tìm xem đã có món này trong giỏ chưa (cùng variantId, cùng note, cùng toppings)
        const existingIdx = prev.findIndex(
          (existing) =>
            existing.variantId === item.variantId &&
            (existing.note || '').trim() === cleanNote &&
            areToppingsEqual(existing.toppings, cleanToppings)
        );

        if (existingIdx > -1) {
          // Gộp số lượng món trùng lặp
          const updated = [...prev];
          const current = updated[existingIdx];
          const newQty = current.quantity + safeQuantity;
          const singleItemPrice = current.unitPrice + current.totalToppingPriceSnapshot;

          updated[existingIdx] = {
            ...current,
            quantity: newQty,
            totalPrice: singleItemPrice * newQty,
          };
          return updated;
        }

        // Tạo dòng món mới nếu chưa trùng
        const singleItemPrice = item.unitPrice + totalToppingPrice;
        const newItem: CartItem = {
          id: `cart_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          productId: item.productId,
          productName: item.productName,
          variantId: item.variantId,
          size: item.size,
          unitPrice: Math.max(0, item.unitPrice),
          quantity: safeQuantity,
          note: cleanNote,
          toppings: cleanToppings,
          totalToppingPriceSnapshot: totalToppingPrice,
          totalPrice: singleItemPrice * safeQuantity,
        };

        return [...prev, newItem];
      });
    },
    []
  );

  // 2. Tăng / Giảm số lượng món
  const updateQuantity = useCallback((id: string, delta: number) => {
    setItems((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            if (newQty <= 0) return null;
            const singleUnitPrice = item.unitPrice + item.totalToppingPriceSnapshot;
            return {
              ...item,
              quantity: newQty,
              totalPrice: singleUnitPrice * newQty,
            };
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null)
    );
  }, []);

  // 3. Xóa một món khỏi giỏ
  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  // 4. Xóa toàn bộ giỏ hàng
  const clearCart = useCallback(() => {
    setItems([]);
    setSelectedCustomer(null);
    setSelectedPager(null);
    setPointsToRedeem(0);
    setCashReceived(0);
    sessionStorage.removeItem(STORAGE_KEY);
  }, []);

  // 5. Tính toán tiền tự động
  const subTotal = useMemo(() => {
    return items.reduce((acc, item) => acc + item.totalPrice, 0);
  }, [items]);

  const discountAmount = useMemo(() => {
    const maxDiscount = pointsToRedeem * conversionRate;
    return Math.min(subTotal, Math.max(0, maxDiscount));
  }, [pointsToRedeem, conversionRate, subTotal]);

  const totalAmount = useMemo(() => {
    return Math.max(0, subTotal - discountAmount);
  }, [subTotal, discountAmount]);

  const totalItemCount = useMemo(() => {
    return items.reduce((acc, item) => acc + item.quantity, 0);
  }, [items]);

  const changeAmount = useMemo(() => {
    return Math.max(0, cashReceived - totalAmount);
  }, [cashReceived, totalAmount]);

  // 6. Xây dựng Payload chuẩn gửi lên API POST /pos/orders
  const buildPayload = useCallback(
    (employeeId: number): CreateOrderPayload => {
      const orderItems: OrderItemPayload[] = items.map((item) => ({
        variantId: item.variantId,
        quantity: item.quantity,
        note: item.note ? item.note.trim() : null,
        itemSnapshotName: item.productName,
        sizeSnapshot: item.size,
        unitPrice: item.unitPrice,
        totalToppingPriceSnapshot: item.totalToppingPriceSnapshot,
        totalPrice: item.totalPrice,
        toppings: item.toppings.map(
          (t): OrderItemToppingPayload => ({
            toppingId: t.toppingId || null,
            toppingSnapshotName: t.toppingSnapshotName,
            toppingPrice: t.toppingPrice,
            quantity: t.quantity || 1,
          })
        ),
      }));

      return {
        employeeId,
        customerId: selectedCustomer ? selectedCustomer.id : null,
        pagerId: selectedPager ? selectedPager.id : null,
        pagerCode: selectedPager ? selectedPager.pagerCode : null,
        orderChannel,
        subTotal,
        discountAmount,
        totalAmount,
        paymentMethod,
        items: orderItems,
      };
    },
    [
      items,
      selectedCustomer,
      selectedPager,
      orderChannel,
      subTotal,
      discountAmount,
      totalAmount,
      paymentMethod,
    ]
  );

  return (
    <CartContext.Provider
      value={{
        items,
        selectedCustomer,
        selectedPager,
        orderChannel,
        paymentMethod,
        pointsToRedeem,
        conversionRate,
        cashReceived,
        subTotal,
        discountAmount,
        totalAmount,
        totalItemCount,
        changeAmount,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        setSelectedCustomer,
        setSelectedPager,
        setOrderChannel,
        setPaymentMethod,
        setPointsToRedeem,
        setCashReceived,
        buildPayload,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCartContext = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCartContext must be used within CartProvider');
  }
  return context;
};

export default CartContext;