"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CartItem } from "./cart-item";
import { PriceDisplay } from "./price-display";
import { CouponInput } from "./coupon-input";
import { useCart } from "./cart-provider";
import {
  createStoreOrder,
  verifyPayment,
  getShippingRates,
  type ShippingAddress,
  type ShippingCourier,
} from "@/lib/store-api";
import { toast } from "sonner";

const PICKUP_POSTCODE =
  process.env.NEXT_PUBLIC_SHIPROCKET_PICKUP_POSTCODE ?? "302017";

const emptyAddress: ShippingAddress = {
  fullName: "",
  email: "",
  phone: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  postalCode: "",
  country: "India",
};

export function CheckoutForm() {
  const router = useRouter();
  const { items, subtotal, updateQuantity, removeItem, clearCart } = useCart();
  const [address, setAddress] = useState<ShippingAddress>(emptyAddress);
  const [notes, setNotes] = useState("");
  const [couponCode, setCouponCode] = useState<string | null>(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<"razorpay" | "cod">("razorpay");
  const [shippingRates, setShippingRates] = useState<ShippingCourier[]>([]);
  const [selectedCourierId, setSelectedCourierId] = useState<number | null>(null);
  const [shippingCost, setShippingCost] = useState(0);
  const [isLoadingRates, setIsLoadingRates] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const orderItems = items.map((i) => ({
    productId: i.productId,
    productName: i.productName,
    variantIndex: i.variantIndex,
    quantity: i.quantity,
    unitPrice: i.unitPrice,
    lineTotal: i.lineTotal,
  }));

  const subtotalAfterDiscount = Math.max(0, subtotal - discountAmount);
  const total = subtotalAfterDiscount + shippingCost;

  const selectedCourier = shippingRates.find(
    (c) => c.courier_company_id === selectedCourierId
  );

  const calculateWeight = useCallback(() => {
    const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
    return Math.max(0.1, totalItems * 0.2).toFixed(2);
  }, [items]);

  useEffect(() => {
    if (!address.postalCode || address.postalCode.length !== 6) {
      setShippingRates([]);
      setSelectedCourierId(null);
      setShippingCost(0);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setIsLoadingRates(true);
      try {
        const data = await getShippingRates({
          pickup_postcode: PICKUP_POSTCODE,
          delivery_postcode: address.postalCode,
          cod: paymentMethod === "cod",
          weight: calculateWeight(),
        });
        const couriers = data.available_courier_companies ?? [];
        setShippingRates(couriers);

        const recommendedId = data.recommended_courier_company_id ?? couriers[0]?.courier_company_id;
        const chosen = couriers.find((c) => c.courier_company_id === recommendedId) ?? couriers[0];
        if (chosen) {
          setSelectedCourierId(chosen.courier_company_id);
          setShippingCost(chosen.rate);
        } else {
          setSelectedCourierId(null);
          setShippingCost(0);
        }
      } catch {
        setShippingRates([]);
        setSelectedCourierId(null);
        setShippingCost(0);
        toast.error("Failed to fetch shipping rates");
      } finally {
        setIsLoadingRates(false);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [address.postalCode, paymentMethod, calculateWeight]);

  const handleApplyCoupon = (amount: number, code: string) => {
    setDiscountAmount(amount);
    setCouponCode(code);
  };

  const handleRemoveCoupon = () => {
    setDiscountAmount(0);
    setCouponCode(null);
  };

  const openRazorpayCheckout = useCallback(
    (order: { id: string; razorpayOrderId: string; orderNumber: string }) => {
      const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
      if (!keyId) {
        toast.error("Payment gateway not configured");
        setSubmitting(false);
        return;
      }

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      document.body.appendChild(script);

      script.onload = () => {
        const Razorpay = (window as unknown as { Razorpay: new (opts: unknown) => { open: () => void } }).Razorpay;
        const rzp = new Razorpay({
          key: keyId,
          amount: Math.round(total * 100),
          currency: "INR",
          name: "Store",
          description: `Order #${order.orderNumber}`,
          order_id: order.razorpayOrderId,
          handler: async (response: {
            razorpay_payment_id: string;
            razorpay_order_id: string;
            razorpay_signature: string;
          }) => {
            try {
              await verifyPayment({
                orderId: order.id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              });
              clearCart();
              toast.success(`Order ${order.orderNumber} placed successfully`);
              router.push(`/checkout/confirmation?order=${order.orderNumber}`);
            } catch {
              toast.error("Payment verification failed");
            } finally {
              setSubmitting(false);
            }
          },
          prefill: {
            name: address.fullName,
            email: address.email,
            contact: address.phone,
          },
          modal: {
            ondismiss: () => {
              toast.error("Payment cancelled");
              setSubmitting(false);
            },
          },
        });
        rzp.open();
      };

      script.onerror = () => {
        toast.error("Failed to load payment gateway");
        setSubmitting(false);
      };
    },
    [total, address.fullName, address.email, address.phone, clearCart, router]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    if (!address.email?.trim()) {
      toast.error("Email is required");
      return;
    }
    if (!address.fullName?.trim()) {
      toast.error("Full name is required");
      return;
    }
    if (!address.phone?.trim()) {
      toast.error("Phone is required");
      return;
    }
    if (!address.addressLine1?.trim()) {
      toast.error("Address is required");
      return;
    }
    if (!address.city?.trim()) {
      toast.error("City is required");
      return;
    }
    if (!address.state?.trim()) {
      toast.error("State is required");
      return;
    }
    if (address.postalCode?.length !== 6) {
      toast.error("Enter a valid 6-digit PIN code");
      return;
    }

    if (paymentMethod === "razorpay" && shippingCost === 0 && address.postalCode) {
      if (isLoadingRates) {
        toast.error("Please wait for shipping rates to load");
        return;
      }
      if (shippingRates.length === 0) {
        toast.error("No shipping options available for this PIN code");
        return;
      }
    }

    setSubmitting(true);
    try {
      const order = await createStoreOrder({
        customerEmail: address.email.trim(),
        customerName: address.fullName.trim() || null,
        items: orderItems,
        subtotal,
        discountAmount,
        total,
        couponCode,
        notes: notes.trim() || null,
        shippingAddress: address,
        paymentMethod,
        shippingAmount: shippingCost,
        courierId: selectedCourierId ?? undefined,
        courierName: selectedCourier?.courier_name,
        estimatedDelivery: selectedCourier?.etd,
      });

      if (paymentMethod === "cod") {
        clearCart();
        toast.success(`Order ${order.orderNumber} placed successfully`);
        router.push(`/checkout/confirmation?order=${order.orderNumber}`);
      } else if (order.razorpayOrderId) {
        openRazorpayCheckout({
          id: order.id,
          razorpayOrderId: order.razorpayOrderId,
          orderNumber: order.orderNumber,
        });
        return;
      } else {
        clearCart();
        toast.success(`Order ${order.orderNumber} placed successfully`);
        router.push(`/checkout/confirmation?order=${order.orderNumber}`);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to place order");
    } finally {
      setSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-12 text-center">
        <p className="text-muted-foreground">Your cart is empty.</p>
        <Button asChild variant="outline" className="mt-4">
          <Link href="/products">Browse products</Link>
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        <div className="space-y-6">
          <h3 className="text-lg font-semibold">Shipping address</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="fullName">Full name *</Label>
              <Input
                id="fullName"
                value={address.fullName}
                onChange={(e) =>
                  setAddress((a) => ({ ...a, fullName: e.target.value }))
                }
                placeholder="Your full name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={address.email}
                onChange={(e) =>
                  setAddress((a) => ({ ...a, email: e.target.value }))
                }
                placeholder="you@example.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone *</Label>
              <Input
                id="phone"
                type="tel"
                value={address.phone}
                onChange={(e) =>
                  setAddress((a) => ({ ...a, phone: e.target.value }))
                }
                placeholder="10-digit mobile"
                required
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="addressLine1">Address line 1 *</Label>
              <Input
                id="addressLine1"
                value={address.addressLine1}
                onChange={(e) =>
                  setAddress((a) => ({ ...a, addressLine1: e.target.value }))
                }
                placeholder="Street, building"
                required
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="addressLine2">Address line 2</Label>
              <Input
                id="addressLine2"
                value={address.addressLine2 ?? ""}
                onChange={(e) =>
                  setAddress((a) => ({ ...a, addressLine2: e.target.value }))
                }
                placeholder="Apartment, suite (optional)"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">City *</Label>
              <Input
                id="city"
                value={address.city}
                onChange={(e) =>
                  setAddress((a) => ({ ...a, city: e.target.value }))
                }
                placeholder="City"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State *</Label>
              <Input
                id="state"
                value={address.state}
                onChange={(e) =>
                  setAddress((a) => ({ ...a, state: e.target.value }))
                }
                placeholder="State"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="postalCode">PIN code *</Label>
              <Input
                id="postalCode"
                value={address.postalCode}
                onChange={(e) =>
                  setAddress((a) => ({
                    ...a,
                    postalCode: e.target.value.replace(/\D/g, "").slice(0, 6),
                  }))
                }
                placeholder="6 digits"
                maxLength={6}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                value={address.country}
                onChange={(e) =>
                  setAddress((a) => ({ ...a, country: e.target.value }))
                }
                placeholder="India"
              />
            </div>
          </div>

          {address.postalCode.length === 6 && (
            <div className="space-y-2">
              <Label>Shipping options</Label>
              {isLoadingRates ? (
                <p className="text-sm text-muted-foreground">
                  Loading shipping rates...
                </p>
              ) : shippingRates.length > 0 ? (
                <div className="space-y-2 rounded-lg border p-3">
                  {shippingRates.map((c) => (
                    <label
                      key={c.courier_company_id}
                      className={`flex cursor-pointer items-center justify-between rounded-md border p-2 ${selectedCourierId === c.courier_company_id ? "border-primary" : ""}`}
                    >
                      <input
                        type="radio"
                        name="courier"
                        checked={selectedCourierId === c.courier_company_id}
                        onChange={() => {
                          setSelectedCourierId(c.courier_company_id);
                          setShippingCost(c.rate);
                        }}
                        className="sr-only"
                      />
                      <span className="text-sm font-medium">
                        {c.courier_name}
                      </span>
                      <span className="text-sm">
                        ₹{c.rate} · {c.etd}
                      </span>
                    </label>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No shipping options for this PIN code
                </p>
              )}
            </div>
          )}

          <div className="space-y-2">
            <Label>Payment method</Label>
            <div className="flex gap-4">
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "razorpay"}
                  onChange={() => setPaymentMethod("razorpay")}
                />
                <span>Online (Razorpay)</span>
              </label>
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "cod"}
                  onChange={() => setPaymentMethod("cod")}
                />
                <span>Cash on Delivery</span>
              </label>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Order summary</h3>
          <div className="rounded-lg border p-4">
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
            <div className="mt-4 space-y-2 border-t pt-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <PriceDisplay amount={subtotal} currency="INR" size="sm" />
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-sm text-green-600 dark:text-green-400">
                  <span>Discount</span>
                  <span>-₹{discountAmount.toFixed(2)}</span>
                </div>
              )}
              {shippingCost > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>₹{shippingCost.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <PriceDisplay amount={total} currency="INR" />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Coupon code</Label>
            <CouponInput
              subtotal={subtotal}
              items={items.map((i) => ({
                productId: i.productId,
                quantity: i.quantity,
                unitPrice: i.unitPrice,
              }))}
              onApplied={handleApplyCoupon}
              appliedCode={couponCode}
              appliedAmount={discountAmount}
              onRemove={handleRemoveCoupon}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Input
              id="notes"
              placeholder="Order notes (optional)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </div>
      </div>

      <Button
        type="submit"
        size="lg"
        className="min-h-12 w-full text-base"
        disabled={submitting}
      >
        {submitting ? "Processing..." : "Place order"}
      </Button>
    </form>
  );
}
