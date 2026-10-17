'use client';

import { useCartContext } from '@/context/CartContext';
export type { CartItem, CartToppingItem, SelectedCustomer, SelectedPager } from '@/context/CartContext';

export function usePosCart() {
  return useCartContext();
}

export default usePosCart;
