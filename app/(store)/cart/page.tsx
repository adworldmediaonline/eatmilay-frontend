"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StoreContainer, StoreSection } from "@/components/store/store-layout";
import { CartItem } from "@/components/store/cart-item";
import { PriceDisplay } from "@/components/store/price-display";
import { EmptyState } from "@/components/store/empty-state";
import { CouponSection } from "@/components/store/coupon-section";
import { getStoredReferralCode } from "@/components/store/referral-tracker";
import { useCart } from "@/components/store/cart-provider";
import { authClient } from "@/lib/auth-client";
import { updateCartReminderEmail } from "@/lib/store-api";
import { toast } from "sonner";

function isAnonymousEmail(email: string | null | undefined): boolean {
  if (!email) return true;
  return /^temp[-.]?[^@]*@/i.test(email) || email.includes("temp@");
}

export default function CartPage() {
  const { data: session } = authClient.useSession();
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
  const [reminderEmail, setReminderEmail] = useState("");
  const [reminderSaving, setReminderSaving] = useState(false);
  const [reminderSaved, setReminderSaved] = useState(false);

  const total = Math.max(0, subtotal - discountAmount);
  const isAnonymous = isAnonymousEmail(session?.user?.email);

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
              customerReferralCode={getStoredReferralCode()}
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
            {isAnonymous && !reminderSaved && (
              <div className="mt-6 rounded-lg border border-dashed border-border/60 bg-muted/30 p-4">
                <p className="text-muted-foreground mb-2 text-sm">
                  Get a reminder if you leave
                </p>
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const email = reminderEmail.trim();
                    if (!email) return;
                    setReminderSaving(true);
                    try {
                      await updateCartReminderEmail(email);
                      setReminderSaved(true);
                      toast.success("We'll send you a reminder if you leave");
                    } catch {
                      toast.error("Failed to save. Try again.");
                    } finally {
                      setReminderSaving(false);
                    }
                  }}
                  className="flex gap-2"
                >
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    value={reminderEmail}
                    onChange={(e) => setReminderEmail(e.target.value)}
                    className="flex-1"
                    disabled={reminderSaving}
                  />
                  <Button type="submit" size="sm" disabled={reminderSaving || !reminderEmail.trim()}>
                    {reminderSaving ? "Saving..." : "Save"}
                  </Button>
                </form>
              </div>
            )}
          </div>
        </div>
      </StoreContainer>
    </StoreSection>
  );
}
