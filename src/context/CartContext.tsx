'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem } from '@/types';
import { createShopifyCheckout } from '@/lib/shopify';

interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  totalCount: number;
  totalPrice: number;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  lastAddedProduct: Product | null;
  dismissNotification: () => void;
  isCheckingOut: boolean;
  checkoutResult: { checkoutUrl?: string; payloadPreview?: object; error?: string } | null;
  clearCheckoutResult: () => void;
  initiateCheckout: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'roomora_cart_v1';

export function CartProvider({ children }: { children: React.ReactNode }) {
  // Use lazy state initialization to read from localStorage without setState in useEffect
  const [items, setItems] = useState<CartItem[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const saved = window.localStorage.getItem(LOCAL_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isOpen, setIsOpen] = useState(false);
  const [lastAddedProduct, setLastAddedProduct] = useState<Product | null>(null);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutResult, setCheckoutResult] = useState<{ checkoutUrl?: string; payloadPreview?: object; error?: string } | null>(null);

  // Synchronize cart with LocalStorage on changes
  useEffect(() => {
    try {
      window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Ignore write errors
    }
  }, [items]);

  const addItem = (product: Product, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });

    setLastAddedProduct(product);
  };

  const removeItem = (productId: string) => {
    setItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);
  const toggleCart = () => setIsOpen((prev) => !prev);
  const dismissNotification = () => setLastAddedProduct(null);

  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const initiateCheckout = async () => {
    if (items.length === 0) return;
    setIsCheckingOut(true);
    try {
      const res = await createShopifyCheckout(items);
      setCheckoutResult(res);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Checkout initiation failed';
      setCheckoutResult({ error: message });
    } finally {
      setIsCheckingOut(false);
    }
  };

  const clearCheckoutResult = () => {
    setCheckoutResult(null);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        totalCount,
        totalPrice,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        openCart,
        closeCart,
        toggleCart,
        lastAddedProduct,
        dismissNotification,
        isCheckingOut,
        checkoutResult,
        clearCheckoutResult,
        initiateCheckout,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
