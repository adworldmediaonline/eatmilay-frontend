"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { CartItem } from "@/lib/store-types";

const CART_STORAGE_KEY = "store-cart";

type CartContextValue = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "lineTotal">) => void;
  removeItem: (productId: string, variantIndex?: number) => void;
  updateQuantity: (
    productId: string,
    variantIndex: number | undefined,
    quantity: number
  ) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
};

const CartContext = createContext<CartContextValue | null>(null);

function loadCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CartItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveCart(items: CartItem[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch {
    // ignore
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setItems(loadCart());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) saveCart(items);
  }, [items, hydrated]);

  const addItem = useCallback((item: Omit<CartItem, "lineTotal">) => {
    const lineTotal = item.unitPrice * item.quantity;
    const newItem: CartItem = { ...item, lineTotal };

    setItems((prev) => {
      const idx = prev.findIndex(
        (i) =>
          i.productId === item.productId &&
          (i.variantIndex ?? -1) === (item.variantIndex ?? -1)
      );
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = {
          ...updated[idx],
          quantity: updated[idx].quantity + item.quantity,
          lineTotal:
            updated[idx].unitPrice * (updated[idx].quantity + item.quantity),
        };
        return updated;
      }
      return [...prev, newItem];
    });
  }, []);

  const removeItem = useCallback(
    (productId: string, variantIndex?: number) => {
      setItems((prev) =>
        prev.filter(
          (i) =>
            !(i.productId === productId && (i.variantIndex ?? -1) === (variantIndex ?? -1))
        )
      );
    },
    []
  );

  const updateQuantity = useCallback(
    (productId: string, variantIndex: number | undefined, quantity: number) => {
      if (quantity < 1) {
        removeItem(productId, variantIndex);
        return;
      }
      setItems((prev) =>
        prev.map((i) => {
          if (
            i.productId === productId &&
            (i.variantIndex ?? -1) === (variantIndex ?? -1)
          ) {
            return {
              ...i,
              quantity,
              lineTotal: i.unitPrice * quantity,
            };
          }
          return i;
        })
      );
    },
    [removeItem]
  );

  const clearCart = useCallback(() => setItems([]), []);

  const itemCount = useMemo(
    () => items.reduce((sum, i) => sum + i.quantity, 0),
    [items]
  );

  const subtotal = useMemo(
    () => items.reduce((sum, i) => sum + i.lineTotal, 0),
    [items]
  );

  const value = useMemo(
    () => ({
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      itemCount,
      subtotal,
    }),
    [
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      itemCount,
      subtotal,
    ]
  );

  return (
    <CartContext.Provider value={value}>{children}</CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
