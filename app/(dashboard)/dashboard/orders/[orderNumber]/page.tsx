"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getUserOrderByNumber } from "@/lib/store-api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PriceDisplay, formatPrice } from "@/components/store/price-display";
import { OrderDetailSkeleton } from "@/components/dashboard/order-detail-skeleton";
import {
  PackageIcon,
  ExternalLinkIcon,
  TruckIcon,
  ArrowLeftIcon,
  MapPinIcon,
} from "lucide-react";

type ShippingAddressRecord = {
  fullName?: string;
  phone?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
};

function formatShippingAddress(addr: ShippingAddressRecord | null | undefined): string {
  if (!addr || typeof addr !== "object") return "";
  const parts = [
    addr.fullName,
    addr.addressLine1,
    addr.addressLine2,
    [addr.city, addr.state, addr.postalCode].filter(Boolean).join(", "),
    addr.country,
  ].filter(Boolean);
  return parts.join("\n");
}

const STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  paid: "Paid",
  confirmed: "Confirmed",
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

const PAYMENT_METHOD_LABELS: Record<string, string> = {
  razorpay: "Online Payment (Razorpay)",
  cod: "Cash on Delivery",
};

const PAYMENT_STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  completed: "Completed",
  failed: "Failed",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function OrderDetailPage() {
  const params = useParams();
  const orderNumber = params.orderNumber as string;
  const [order, setOrder] = useState<Awaited<ReturnType<typeof getUserOrderByNumber>> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderNumber) return;
    getUserOrderByNumber(orderNumber)
      .then(setOrder)
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load order"))
      .finally(() => setLoading(false));
  }, [orderNumber]);

  if (loading) {
    return (
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="px-4 lg:px-6">
            <OrderDetailSkeleton />
          </div>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="px-4 lg:px-6">
            <div className="rounded-lg border border-dashed p-12 text-center">
              <PackageIcon className="text-muted-foreground mx-auto mb-4 size-16 opacity-50" />
              <h3 className="font-semibold text-foreground mb-1">
                Order not found
              </h3>
              <p className="text-muted-foreground text-sm mb-6 max-w-sm mx-auto">
                {error ??
                  "We couldn't find this order. It may have been placed with a different account or the order number might be incorrect."}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  variant="outline"
                  onClick={() => window.location.reload()}
                >
                  Try again
                </Button>
                <Button asChild variant="outline">
                  <Link href="/dashboard/orders">
                    <ArrowLeftIcon className="mr-2 size-4" />
                    Back to orders
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="@container/main flex flex-1 flex-col gap-2">
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <div className="flex flex-col gap-2 px-4 lg:px-6">
          <Button asChild variant="ghost" size="sm" className="w-fit -ml-2">
            <Link href="/dashboard/orders">
              <ArrowLeftIcon className="mr-2 size-4" />
              Back to orders
            </Link>
          </Button>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold">Order {order.orderNumber}</h2>
              <p className="text-muted-foreground text-sm">
                Placed on {formatDate(order.createdAt)}
              </p>
            </div>
            <Badge variant="outline" className="text-sm">
              {STATUS_LABELS[order.status] ?? order.status}
            </Badge>
          </div>
        </div>

        <div className="px-4 lg:px-6 space-y-6">
          <div className="rounded-lg border bg-card p-6">
            <h3 className="font-semibold mb-4">Items</h3>
            <ul className="space-y-3">
              {order.items.map((item: { productName: string; quantity: number; unitPrice: number; lineTotal: number }, idx: number) => (
                <li key={idx} className="flex justify-between text-sm">
                  <span>
                    {item.productName} × {item.quantity}
                  </span>
                  <span>
                    <PriceDisplay amount={item.lineTotal} currency={order.currency} size="sm" />
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-4 space-y-2 border-t pt-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <PriceDisplay amount={order.subtotal ?? order.total} currency={order.currency} size="sm" />
              </div>
              {(order.discountAmount ?? 0) > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    Discount
                    {order.couponCode && (
                      <span className="ml-1 text-green-600 dark:text-green-500">
                        ({order.couponCode})
                      </span>
                    )}
                  </span>
                  <span className="font-medium text-green-600 dark:text-green-500">
                    -{formatPrice(order.discountAmount, order.currency)}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                {(order.shippingAmount ?? 0) > 0 ? (
                  <PriceDisplay amount={order.shippingAmount} currency={order.currency} size="sm" />
                ) : (
                  <span className="text-muted-foreground">Free</span>
                )}
              </div>
              <div className="flex justify-between font-semibold pt-2">
                <span>Total</span>
                <PriceDisplay amount={order.total} currency={order.currency} />
              </div>
            </div>
          </div>

          {(order.paymentMethod || order.paymentStatus || order.razorpayPaymentId || order.razorpayOrderId) && (
            <div className="rounded-lg border bg-card p-6">
              <h3 className="font-semibold mb-2">Payment</h3>
              <dl className="space-y-1 text-sm">
                {order.paymentMethod && (
                  <div className="flex justify-between gap-2">
                    <dt className="text-muted-foreground shrink-0">Method</dt>
                    <dd className="text-right">{PAYMENT_METHOD_LABELS[order.paymentMethod] ?? order.paymentMethod}</dd>
                  </div>
                )}
                {order.paymentStatus && (
                  <div className="flex justify-between gap-2">
                    <dt className="text-muted-foreground shrink-0">Status</dt>
                    <dd>
                      <Badge variant={order.paymentStatus === "completed" ? "default" : "secondary"} className="text-xs">
                        {PAYMENT_STATUS_LABELS[order.paymentStatus] ?? order.paymentStatus}
                      </Badge>
                    </dd>
                  </div>
                )}
                {order.razorpayPaymentId && (
                  <div className="flex flex-col gap-0.5 sm:flex-row sm:justify-between sm:items-center pt-2 border-t">
                    <dt className="text-muted-foreground shrink-0">Payment ID</dt>
                    <dd className="font-mono text-xs break-all" title="Use this for support or refund requests">
                      {order.razorpayPaymentId}
                    </dd>
                  </div>
                )}
                {order.razorpayOrderId && (
                  <div className="flex flex-col gap-0.5 sm:flex-row sm:justify-between sm:items-center">
                    <dt className="text-muted-foreground shrink-0">Order ID</dt>
                    <dd className="font-mono text-xs break-all">{order.razorpayOrderId}</dd>
                  </div>
                )}
              </dl>
            </div>
          )}

          {order.notes && order.notes.trim() && (
            <div className="rounded-lg border bg-card p-6">
              <h3 className="font-semibold mb-2">Order notes</h3>
              <p className="text-muted-foreground whitespace-pre-wrap text-sm">{order.notes}</p>
            </div>
          )}

          <div className="rounded-lg border bg-card p-6">
            <div className="flex items-center gap-2 mb-2">
              <TruckIcon className="size-5 text-muted-foreground" />
              <h3 className="font-semibold">Tracking</h3>
            </div>
            {order.trackingNumber ? (
              <>
                <p className="text-muted-foreground text-sm mb-2">
                  {order.courierName && `${order.courierName} · `}
                  AWB: {order.trackingNumber}
                </p>
                {order.estimatedDelivery && (
                  <p className="text-muted-foreground text-sm mb-4">
                    Estimated delivery: {order.estimatedDelivery}
                  </p>
                )}
                {order.trackingUrl && (
                  <Button asChild variant="outline" size="sm">
                    <a
                      href={order.trackingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Track shipment
                      <ExternalLinkIcon className="ml-2 size-4" />
                    </a>
                  </Button>
                )}
              </>
            ) : (
              <p className="text-muted-foreground text-sm">
                {order.status === "delivered"
                  ? "This order has been delivered."
                  : order.status === "shipped" || order.status === "processing"
                    ? "Tracking will be available once the shipment is dispatched. Check back soon."
                    : order.status === "cancelled"
                      ? "This order was cancelled."
                      : "Your order is being prepared. Tracking details will appear here once the shipment is dispatched."}
              </p>
            )}
          </div>

          {order.shippingAddress &&
            typeof order.shippingAddress === "object" &&
            formatShippingAddress(order.shippingAddress as ShippingAddressRecord) && (
              <div className="rounded-lg border bg-card p-6">
                <div className="mb-4 flex items-center gap-2">
                  <MapPinIcon className="size-5 text-muted-foreground" />
                  <h3 className="font-semibold">Shipping address</h3>
                </div>
                <pre className="text-muted-foreground whitespace-pre-wrap font-sans text-sm">
                  {formatShippingAddress(order.shippingAddress as ShippingAddressRecord)}
                </pre>
                {(order.shippingAddress as ShippingAddressRecord).phone && (
                  <p className="text-muted-foreground mt-2 text-sm">
                    Phone: {(order.shippingAddress as ShippingAddressRecord).phone}
                  </p>
                )}
              </div>
            )}
        </div>
      </div>
    </div>
  );
}
