"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { CartItem } from "./cart-item";
import { PriceDisplay } from "./price-display";
import { EmptyState } from "./empty-state";
import { useCart } from "./cart-provider";
import { getStoreShippingSettings } from "@/lib/store-api";

type CartDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function CartDrawer({ open, onOpenChange }: CartDrawerProps) {
  const {
    items,
    itemCount,
    subtotal,
    discountAmount,
    couponCode,
    updateQuantity,
    removeItem,
  } = useCart();
  const [freeShippingThreshold, setFreeShippingThreshold] = useState<
    number | null
  >(null);

  const subtotalAfterDiscount = Math.max(0, subtotal - discountAmount);
  const total = subtotalAfterDiscount;
  const gapToFreeShipping =
    freeShippingThreshold != null &&
    freeShippingThreshold > 0 &&
    subtotalAfterDiscount < freeShippingThreshold
      ? Math.ceil(freeShippingThreshold - subtotalAfterDiscount)
      : null;

  useEffect(() => {
    getStoreShippingSettings()
      .then((s) => setFreeShippingThreshold(s.freeShippingThreshold))
      .catch(() => setFreeShippingThreshold(null));
  }, []);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex w-full flex-col sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Cart ({itemCount})</SheetTitle>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto px-4">
          {items.length === 0 ? (
            <EmptyState
              title="Your cart is empty"
              description="Add items to get started."
              href="/products"
              linkText="Browse products"
            />
          ) : (
            <div className="py-4">
              {items.map((item) => (
                <CartItem
                  key={`${item.productId}-${item.variantIndex ?? "s"}`}
                  item={item}
                  onUpdateQuantity={(qty) =>
                    updateQuantity(item.productId, item.variantIndex, qty)
                  }
                  onRemove={() => removeItem(item.productId, item.variantIndex)}
                />
              ))}
            </div>
          )}
        </div>
        {items.length > 0 && (
          <SheetFooter className="flex-col gap-2 border-t pt-4">
            <div className="flex w-full items-center justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <PriceDisplay amount={subtotal} />
            </div>
            {discountAmount > 0 && (
              <div className="flex w-full items-center justify-between text-sm text-green-600 dark:text-green-400">
                <span>
                  Discount{couponCode ? ` (${couponCode})` : ""}
                </span>
                <span>-₹{discountAmount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex w-full items-center justify-between font-semibold">
              <span>Total</span>
              <PriceDisplay amount={total} />
            </div>
            {gapToFreeShipping != null && gapToFreeShipping > 0 && (
              <p className="text-muted-foreground text-xs">
                Add ₹{gapToFreeShipping} more for free shipping
              </p>
            )}
            <Button asChild className="w-full" size="lg">
              <Link href="/checkout" onClick={() => onOpenChange(false)}>
                Checkout
              </Link>
            </Button>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
