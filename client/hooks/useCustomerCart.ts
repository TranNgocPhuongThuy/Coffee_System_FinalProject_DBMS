'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';

export interface CustomerCartTopping {
  toppingId?: number | null;
  toppingSnapshotName: string;
  toppingPrice: number;
  quantity: number;
}

export interface CustomerCartItem {
  id: string;
  productId: number;
  productName: string;
  variantId: number;
  size: string;
  unitPrice: number;
  quantity: number;
  note?: string;
  toppings: CustomerCartTopping[];
  totalToppingPrice: number;
  totalPrice: number;
}

const STORAGE_KEY = 'mepaphin_customer_storefront_cart';

export function useCustomerCart() {
  const [items, setItems] = useState<CustomerCartItem[]>([]);
  const [deliveryAddress, setDeliveryAddress] = useState<string>('');
  const [customerNote, setCustomerNote] = useState<string>('');
  const [contactName, setContactName] = useState<string>('');
  const [contactPhone, setContactPhone] = useState<string>('');

  // Load from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.items)) setItems(parsed.items);
        if (parsed.deliveryAddress) setDeliveryAddress(parsed.deliveryAddress);
        if (parsed.customerNote) setCustomerNote(parsed.customerNote);
      }
    } catch {
      // Ignore
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          items,
          deliveryAddress,
          customerNote,
        })
      );
    } catch {
      // Ignore
    }
  }, [items, deliveryAddress, customerNote]);

  const addItem = useCallback(
    (item: {
      productId: number;
      productName: string;
      variantId: number;
      size: string;
      unitPrice: number;
      quantity: number;
      note?: string;
      toppings?: CustomerCartTopping[];
    }) => {
      const safeQty = Math.max(1, Math.floor(Number(item.quantity) || 1));
      const cleanNote = (item.note || '').trim();
      const cleanToppings = (item.toppings || [])
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
        // Gộp nếu trùng variant, note và danh sách topping
        const existingIdx = prev.findIndex(
          (ex) =>
            ex.variantId === item.variantId &&
            (ex.note || '').trim() === cleanNote &&
            ex.toppings.length === cleanToppings.length &&
            ex.toppings.every(
              (t, i) =>
                t.toppingId === cleanToppings[i].toppingId &&
                t.quantity === cleanToppings[i].quantity
            )
        );

        if (existingIdx > -1) {
          const updated = [...prev];
          const curr = updated[existingIdx];
          const newQty = curr.quantity + safeQty;
          const singlePrice = curr.unitPrice + curr.totalToppingPrice;
          updated[existingIdx] = {
            ...curr,
            quantity: newQty,
            totalPrice: singlePrice * newQty,
          };
          return updated;
        }

        const singlePrice = item.unitPrice + totalToppingPrice;
        const newItem: CustomerCartItem = {
          id: `cust_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          productId: item.productId,
          productName: item.productName,
          variantId: item.variantId,
          size: item.size,
          unitPrice: item.unitPrice,
          quantity: safeQty,
          note: cleanNote,
          toppings: cleanToppings,
          totalToppingPrice,
          totalPrice: singlePrice * safeQty,
        };
        return [...prev, newItem];
      });
    },
    []
  );

  const updateQuantity = useCallback((id: string, delta: number) => {
    setItems((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            if (newQty <= 0) return null;
            const singlePrice = item.unitPrice + item.totalToppingPrice;
            return {
              ...item,
              quantity: newQty,
              totalPrice: singlePrice * newQty,
            };
          }
          return item;
        })
        .filter((item): item is CustomerCartItem => item !== null)
    );
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    setCustomerNote('');
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const subTotal = useMemo(() => {
    return items.reduce((sum, item) => sum + item.totalPrice, 0);
  }, [items]);

  const totalItemCount = useMemo(() => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }, [items]);

  return {
    items,
    deliveryAddress,
    customerNote,
    contactName,
    contactPhone,
    subTotal,
    totalItemCount,
    setDeliveryAddress,
    setCustomerNote,
    setContactName,
    setContactPhone,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
  };
}
