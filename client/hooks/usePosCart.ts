// hooks/usePosCart.ts
'use client';

import { useState, useMemo, useCallback } from 'react';
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

export function usePosCart() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<SelectedCustomer | null>(null);
  const [selectedPager, setSelectedPager] = useState<SelectedPager | null>(null);
  const [orderChannel, setOrderChannel] = useState<OrderChannel>('ORDER_AT_COUNTER');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('CASH');
  const [pointsToRedeem, setPointsToRedeem] = useState<number>(0);
  const [conversionRate] = useState<number>(1000); // 1 điểm = 1.000 VNĐ

  // 1. Thêm món vào giỏ
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
      const toppings = item.toppings || [];
      const totalToppingPrice = toppings.reduce(
        (sum, t) => sum + t.toppingPrice * (t.quantity || 1),
        0
      );
      const lineTotalPrice = (item.unitPrice + totalToppingPrice) * item.quantity;

      const newItem: CartItem = {
        id: `cart_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        productId: item.productId,
        productName: item.productName,
        variantId: item.variantId,
        size: item.size,
        unitPrice: item.unitPrice,
        quantity: item.quantity,
        note: item.note || '',
        toppings,
        totalToppingPriceSnapshot: totalToppingPrice,
        totalPrice: lineTotalPrice,
      };

      setItems((prev) => [...prev, newItem]);
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

  return {
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
  };
}

export default usePosCart;
