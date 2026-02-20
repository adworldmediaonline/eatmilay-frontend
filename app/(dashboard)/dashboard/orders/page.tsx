"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getUserOrders } from "@/lib/store-api";
import type { UserOrder } from "@/lib/store-api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { OrderCardSkeleton } from "@/components/dashboard/order-card-skeleton";
import { PackageIcon, ExternalLinkIcon, TruckIcon } from "lucide-react";

const STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  paid: "Paid",
  confirmed: "Confirmed",
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

const STATUS_VARIANTS: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  pending: "outline",
  paid: "secondary",
  confirmed: "secondary",
  processing: "default",
  shipped: "default",
  delivered: "default",
  cancelled: "destructive",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatCurrency(amount: number, currency: string) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: currency === "INR" ? "INR" : "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

const PAGE_SIZE = 20;

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<UserOrder[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getUserOrders({ limit: PAGE_SIZE, offset: 0 })
      .then((data) => {
        setOrders(data.items);
        setTotal(data.total);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load orders"))
      .finally(() => setLoading(false));
  }, []);

  const hasMore = orders.length < total;

  async function handleLoadMore() {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    getUserOrders({ limit: PAGE_SIZE, offset: orders.length })
      .then((data) => {
        setOrders((prev) => [...prev, ...data.items]);
      })
      .catch(() => {})
      .finally(() => setLoadingMore(false));
  }

  if (loading) {
    return (
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="flex flex-col gap-1 px-4 lg:px-6">
            <h2 className="text-lg font-semibold">My Orders</h2>
            <p className="text-muted-foreground text-sm">Loading your orders…</p>
          </div>
          <div className="px-4 lg:px-6">
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <OrderCardSkeleton key={i} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="px-4 lg:px-6">
            <h2 className="text-lg font-semibold">My Orders</h2>
            <p className="text-destructive text-sm">{error}</p>
          </div>
          <div className="px-4 lg:px-6">
            <Button variant="outline" onClick={() => window.location.reload()}>
              Try again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="@container/main flex flex-1 flex-col gap-2">
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <div className="flex flex-col gap-1 px-4 lg:px-6">
          <h2 className="text-lg font-semibold">My Orders</h2>
          <p className="text-muted-foreground text-sm">
            {total === 0
              ? "No orders yet"
              : `${total} order${total === 1 ? "" : "s"}`}
          </p>
        </div>

        {orders.length === 0 ? (
          <div className="px-4 lg:px-6">
            <div className="rounded-lg border border-dashed p-12 text-center">
              <PackageIcon className="text-muted-foreground mx-auto mb-4 size-16 opacity-50" />
              <h3 className="font-semibold text-foreground mb-1">
                No orders yet
              </h3>
              <p className="text-muted-foreground text-sm mb-6 max-w-sm mx-auto">
                When you place an order, it will appear here. Start shopping to
                see your order history.
              </p>
              <Button asChild size="lg">
                <Link href="/products">Browse products</Link>
              </Button>
            </div>
          </div>
        ) : (
          <div className="px-4 lg:px-6">
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="rounded-lg border bg-card p-4 shadow-sm transition-colors hover:bg-muted/30"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex min-w-0 flex-1 items-start gap-3">
                      <div className="rounded-md bg-muted/50 p-2">
                        <PackageIcon className="size-5 text-muted-foreground" />
                      </div>
                      <div className="min-w-0 space-y-1">
                        <p className="font-semibold">
                          Order {order.orderNumber}
                        </p>
                        <p className="text-muted-foreground text-sm">
                          {formatDate(order.createdAt)} · {order.itemCount} item
                          {order.itemCount !== 1 ? "s" : ""}
                        </p>
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge
                            variant={
                              STATUS_VARIANTS[order.status] ?? "outline"
                            }
                          >
                            {STATUS_LABELS[order.status] ?? order.status}
                          </Badge>
                          {order.trackingNumber && (
                            <span className="text-muted-foreground flex items-center gap-1 text-xs">
                              <TruckIcon className="size-3" />
                              {order.courierName ?? "Tracking"}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-3">
                      <p className="font-medium">
                        {formatCurrency(order.total, order.currency)}
                      </p>
                      <div className="flex gap-2">
                        <Button asChild variant="outline" size="sm">
                          <Link href={`/dashboard/orders/${order.orderNumber}`}>
                            View
                          </Link>
                        </Button>
                        {order.trackingUrl && (
                          <Button asChild variant="outline" size="sm">
                            <a
                              href={order.trackingUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              Track
                              <ExternalLinkIcon className="ml-1 size-3" />
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {hasMore && (
              <div className="mt-6 flex justify-center">
                <Button
                  variant="outline"
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                >
                  {loadingMore ? "Loading…" : "Load more"}
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
