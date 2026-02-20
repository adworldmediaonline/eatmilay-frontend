"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { StoreContainer, StoreSection } from "@/components/store/store-layout";
import { CartItem } from "@/components/store/cart-item";
import { PriceDisplay } from "@/components/store/price-display";
import { EmptyState } from "@/components/store/empty-state";
import { CouponSection } from "@/components/store/coupon-section";
import { useCart } from "@/components/store/cart-provider";

export default function CartPage() {
  const {
    items,
    subtotal,
    updateQuantity,
    removeItem,
    couponCode,
    discountAmount,
    applyCoupon,
    removeCoupon,
    retryAutoApply,
  } = useCart();

  const total = Math.max(0, subtotal - discountAmount);

  if (items.length === 0) {
    return (
      <StoreSection>
        <StoreContainer size="tight">
          <EmptyState
            title="Your cart is empty"
            description="Add items to get started."
            href="/products"
            linkText="Browse products"
          />
        </StoreContainer>
      </StoreSection>
    );
  }

  return (
    <StoreSection>
      <StoreContainer size="narrow">
        <h1 className="mb-6 text-2xl font-bold sm:text-3xl">Cart</h1>
        <div className="grid gap-8 lg:grid-cols-[1fr,340px]">
          <div className="space-y-4">
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
          <div className="rounded-xl border border-border/80 bg-card p-6 shadow-sm lg:sticky lg:top-24 lg:self-start">
            <h3 className="mb-4 text-lg font-semibold">Order summary</h3>
            <CouponSection
              label="Coupon code"
              subtotal={subtotal}
              items={items.map((i) => ({
                productId: i.productId,
                quantity: i.quantity,
                unitPrice: i.unitPrice,
              }))}
              onApplied={applyCoupon}
              appliedCode={couponCode}
              appliedAmount={discountAmount}
              onRemove={removeCoupon}
              onRetryAutoApply={retryAutoApply}
            />
            <div className="mt-4 space-y-2 border-t pt-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <PriceDisplay amount={subtotal} size="sm" />
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-sm text-green-600 dark:text-green-400">
                  <span>Discount</span>
                  <span>-₹{discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <PriceDisplay amount={total} size="sm" />
              </div>
            </div>
            <Button asChild size="lg" className="mt-6 w-full">
              <Link href="/checkout">Proceed to checkout</Link>
            </Button>
          </div>
        </div>
      </StoreContainer>
    </StoreSection>
  );
}
