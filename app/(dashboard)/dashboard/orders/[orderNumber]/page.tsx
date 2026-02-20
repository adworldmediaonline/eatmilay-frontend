"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getUserOrderByNumber } from "@/lib/store-api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PriceDisplay } from "@/components/store/price-display";
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
            <div className="mt-4 pt-4 border-t flex justify-between font-semibold">
              <span>Total</span>
              <PriceDisplay amount={order.total} currency={order.currency} />
            </div>
          </div>

          {order.trackingNumber && (
            <div className="rounded-lg border bg-card p-6">
              <div className="flex items-center gap-2 mb-2">
                <TruckIcon className="size-5 text-muted-foreground" />
                <h3 className="font-semibold">Tracking</h3>
              </div>
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
                    Track on Shiprocket
                    <ExternalLinkIcon className="ml-2 size-4" />
                  </a>
                </Button>
              )}
            </div>
          )}

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

          {!order.trackingNumber &&
            (order.status === "shipped" || order.status === "processing") && (
              <div className="rounded-lg border border-dashed p-4 text-muted-foreground text-sm">
                <PackageIcon className="inline-block size-4 mr-2 align-middle" />
                Tracking will be available once the shipment is dispatched.
              </div>
            )}
        </div>
      </div>
    </div>
  );
}
