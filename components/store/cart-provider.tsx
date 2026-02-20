"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  validateStoreDiscount,
  getAvailableOffers,
  getStoreCouponSettings,
} from "@/lib/store-api";
import type { AvailableOffer } from "@/lib/store-api";
import type { CartItem } from "@/lib/store-types";
import { toast } from "sonner";

const CART_STORAGE_KEY = "store-cart";
const COUPON_STORAGE_KEY = "store-cart-coupon";
const USER_REMOVED_KEY = "store-cart-user-removed";

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
  couponCode: string | null;
  discountAmount: number;
  applyCoupon: (amount: number, code: string) => void;
  removeCoupon: () => void;
  /** Clears user-removed state and triggers auto-apply check. Use when user expands coupon section. */
  retryAutoApply: () => void;
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

function loadCoupon(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(COUPON_STORAGE_KEY);
    return raw && raw.trim() ? raw.trim().toUpperCase() : null;
  } catch {
    return null;
  }
}

function saveCoupon(code: string | null) {
  if (typeof window === "undefined") return;
  try {
    if (code) {
      localStorage.setItem(COUPON_STORAGE_KEY, code);
    } else {
      localStorage.removeItem(COUPON_STORAGE_KEY);
    }
  } catch {
    // ignore
  }
}

function loadUserRemoved(): { itemCount: number; subtotal: number } | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(USER_REMOVED_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { itemCount: number; subtotal: number };
    return parsed;
  } catch {
    return null;
  }
}

function saveUserRemoved(itemCount: number, subtotal: number) {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(
      USER_REMOVED_KEY,
      JSON.stringify({ itemCount, subtotal })
    );
  } catch {
    // ignore
  }
}

function clearUserRemoved() {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(USER_REMOVED_KEY);
  } catch {
    // ignore
  }
}

function pickBestOffer(
  offers: AvailableOffer[],
  strategy: "best_savings" | "first_created" | "highest_percentage"
): AvailableOffer | null {
  const applicable = offers.filter((o) => !o.locked && (o.allowAutoApply !== false));
  if (applicable.length === 0) return null;

  if (strategy === "best_savings") {
    return applicable.reduce((best, o) =>
      o.discountAmount > best.discountAmount ? o : best
    );
  }
  if (strategy === "first_created") {
    return applicable.reduce((oldest, o) => {
      const oDate = o.createdAt ? new Date(o.createdAt).getTime() : 0;
      const oldestDate = oldest.createdAt ? new Date(oldest.createdAt).getTime() : 0;
      return oDate < oldestDate ? o : oldest;
    });
  }
  if (strategy === "highest_percentage") {
    const withPct = applicable.filter((o) => o.type === "percentage");
    if (withPct.length > 0) {
      return withPct.reduce((best, o) => (o.value > best.value ? o : best));
    }
    return applicable.reduce((best, o) =>
      o.discountAmount > best.discountAmount ? o : best
    );
  }
  return applicable[0];
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [couponCode, setCouponCode] = useState<string | null>(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponSettings, setCouponSettings] = useState<{
    autoApply: boolean;
    autoApplyStrategy: "best_savings" | "first_created" | "highest_percentage" | "customer_choice";
    showToastOnApply: boolean;
  } | null>(null);
  const autoApplyInProgress = useRef(false);
  const [autoApplyRetry, setAutoApplyRetry] = useState(0);

  useEffect(() => {
    setItems(loadCart());
    setCouponCode(loadCoupon());
    setHydrated(true);
  }, []);

  useEffect(() => {
    getStoreCouponSettings()
      .then(setCouponSettings)
      .catch(() => setCouponSettings(null));
  }, []);

  useEffect(() => {
    if (hydrated) saveCart(items);
  }, [items, hydrated]);

  useEffect(() => {
    if (hydrated && couponCode) saveCoupon(couponCode);
  }, [couponCode, hydrated]);

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

  const clearCart = useCallback(() => {
    setItems([]);
    setCouponCode(null);
    setDiscountAmount(0);
    saveCoupon(null);
    clearUserRemoved();
  }, []);

  const applyCoupon = useCallback((amount: number, code: string) => {
    const normalized = code.trim().toUpperCase();
    setCouponCode(normalized);
    setDiscountAmount(amount);
    saveCoupon(normalized);
  }, []);

  const removeCoupon = useCallback(() => {
    setCouponCode(null);
    setDiscountAmount(0);
    saveCoupon(null);
    const itemCount = items.reduce((s, i) => s + i.quantity, 0);
    const subtotal = items.reduce((s, i) => s + i.lineTotal, 0);
    saveUserRemoved(itemCount, subtotal);
  }, [items]);

  const retryAutoApply = useCallback(() => {
    clearUserRemoved();
    setAutoApplyRetry((r) => r + 1);
  }, []);

  const itemCount = useMemo(
    () => items.reduce((sum, i) => sum + i.quantity, 0),
    [items]
  );

  const subtotal = useMemo(
    () => items.reduce((sum, i) => sum + i.lineTotal, 0),
    [items]
  );

  useEffect(() => {
    if (!hydrated || !couponCode || items.length === 0 || subtotal <= 0) {
      if (items.length === 0 && couponCode) {
        setCouponCode(null);
        setDiscountAmount(0);
        saveCoupon(null);
      }
      return;
    }
    let cancelled = false;
    validateStoreDiscount(
      couponCode,
      subtotal,
      items.map((i) => ({
        productId: i.productId,
        quantity: i.quantity,
        unitPrice: i.unitPrice,
      }))
    ).then((result) => {
      if (cancelled) return;
      if (result.valid) {
        setDiscountAmount(result.discountAmount);
      } else {
        setCouponCode(null);
        setDiscountAmount(0);
        saveCoupon(null);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [hydrated, couponCode, items, subtotal]);

  useEffect(() => {
    if (
      !hydrated ||
      couponCode ||
      items.length === 0 ||
      subtotal <= 0 ||
      autoApplyInProgress.current
    ) {
      return;
    }

    const removed = loadUserRemoved();
    if (removed && removed.itemCount === itemCount && removed.subtotal === subtotal) {
      return;
    }

    autoApplyInProgress.current = true;
    const cartItems = items.map((i) => ({
      productId: i.productId,
      quantity: i.quantity,
      unitPrice: i.unitPrice,
    }));

    getStoreCouponSettings()
      .then((settings) => {
        if (
          !settings.autoApply ||
          settings.autoApplyStrategy === "customer_choice"
        ) {
          return null;
        }
        setCouponSettings(settings);
        return getAvailableOffers(subtotal, cartItems).then((offers) => ({
          settings,
          offers,
        }));
      })
      .then((result) => {
        if (!result || !Array.isArray(result.offers)) return;
        const { settings, offers } = result;
        const strategy = settings.autoApplyStrategy;
        const best =
          strategy === "customer_choice"
            ? null
            : pickBestOffer(offers, strategy);
        if (!best) return;

        return validateStoreDiscount(best.code, subtotal, cartItems).then(
          (validationResult) => {
            if (validationResult.valid) {
              setCouponCode(best.code.trim().toUpperCase());
              setDiscountAmount(validationResult.discountAmount);
              saveCoupon(best.code.trim().toUpperCase());
              if (settings.showToastOnApply) {
                const pct =
                  subtotal > 0
                    ? Math.round(
                        (validationResult.discountAmount / subtotal) * 100
                      )
                    : 0;
                toast.success(
                  `${best.code} applied – Save ${pct}% on your order`,
                  {
                    action: {
                      label: "Undo",
                      onClick: () => {
                        setCouponCode(null);
                        setDiscountAmount(0);
                        saveCoupon(null);
                        saveUserRemoved(itemCount, subtotal);
                      },
                    },
                  }
                );
              }
            }
          }
        );
      })
      .catch(() => {
        // ignore
      })
      .finally(() => {
        autoApplyInProgress.current = false;
      });
  }, [
    hydrated,
    couponCode,
    items,
    subtotal,
    itemCount,
    autoApplyRetry,
  ]);

  const value = useMemo(
    () => ({
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      itemCount,
      subtotal,
      couponCode,
      discountAmount,
      applyCoupon,
      removeCoupon,
      retryAutoApply,
    }),
    [
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      itemCount,
      subtotal,
      couponCode,
      discountAmount,
      applyCoupon,
      removeCoupon,
      retryAutoApply,
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
