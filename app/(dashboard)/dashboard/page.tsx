"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useDashboardSession } from "@/components/dashboard-shell";
import { getUserOrders } from "@/lib/store-api";
import type { UserOrder } from "@/lib/store-api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { OrderCardSkeleton } from "@/components/dashboard/order-card-skeleton";
import {
  PackageIcon,
  ExternalLinkIcon,
  TruckIcon,
  ShoppingBagIcon,
} from "lucide-react";

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

function OrderCard({ order }: { order: UserOrder }) {
  return (
    <div
      className="rounded-lg border bg-card p-4 shadow-sm transition-colors hover:bg-muted/30"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 flex-1 items-start gap-3">
          <div className="rounded-md bg-muted/50 p-2">
            <PackageIcon className="size-5 text-muted-foreground" />
          </div>
          <div className="min-w-0 space-y-1">
            <p className="font-semibold">Order {order.orderNumber}</p>
            <p className="text-muted-foreground text-sm">
              {formatDate(order.createdAt)} · {order.itemCount} item
              {order.itemCount !== 1 ? "s" : ""}
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant={STATUS_VARIANTS[order.status] ?? "outline"}>
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
              <Link href={`/dashboard/orders/${order.orderNumber}`}>View</Link>
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
  );
}

export default function DashboardPage() {
  const session = useDashboardSession();
  const [recentOrders, setRecentOrders] = useState<UserOrder[]>([]);
  const [totalOrders, setTotalOrders] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUserOrders({ limit: 5, offset: 0 })
      .then((data) => {
        setRecentOrders(data.items);
        setTotalOrders(data.total);
      })
      .catch(() => {
        setRecentOrders([]);
        setTotalOrders(0);
      })
      .finally(() => setLoading(false));
  }, []);

  const lastOrder = recentOrders[0];
  const hasOrders = totalOrders > 0;

  return (
    <div className="@container/main flex flex-1 flex-col gap-2">
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <div className="flex flex-col gap-1 px-4 lg:px-6">
          <h2 className="text-lg font-semibold">
            Welcome back, {session?.user?.name ?? "User"}
          </h2>
          <p className="text-muted-foreground text-sm">Your dashboard</p>
        </div>

        <div className="px-4 lg:px-6 space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Link
              href="/dashboard/orders"
              className="flex items-center gap-4 rounded-lg border bg-card p-4 shadow-sm transition-colors hover:bg-muted/30"
            >
              <div className="rounded-md bg-muted/50 p-2">
                <PackageIcon className="size-5 text-muted-foreground" />
              </div>
              <div>
                <p className="font-semibold">My Orders</p>
                <p className="text-muted-foreground text-sm">
                  {loading
                    ? "Loading…"
                    : hasOrders
                      ? `${totalOrders} order${totalOrders === 1 ? "" : "s"}`
                      : "View all orders"}
                </p>
              </div>
            </Link>
            <Link
              href="/products"
              className="flex items-center gap-4 rounded-lg border bg-card p-4 shadow-sm transition-colors hover:bg-muted/30"
            >
              <div className="rounded-md bg-muted/50 p-2">
                <ShoppingBagIcon className="size-5 text-muted-foreground" />
              </div>
              <div>
                <p className="font-semibold">Browse products</p>
                <p className="text-muted-foreground text-sm">
                  Discover new items
                </p>
              </div>
            </Link>
            <Link
              href="/dashboard/orders"
              className="flex items-center gap-4 rounded-lg border bg-card p-4 shadow-sm transition-colors hover:bg-muted/30"
            >
              <div className="rounded-md bg-muted/50 p-2">
                <TruckIcon className="size-5 text-muted-foreground" />
              </div>
              <div>
                <p className="font-semibold">Track orders</p>
                <p className="text-muted-foreground text-sm">
                  View and track your orders
                </p>
              </div>
            </Link>
          </div>

          <div>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold">Recent orders</h3>
              {hasOrders && (
                <Button asChild variant="ghost" size="sm">
                  <Link href="/dashboard/orders">View all</Link>
                </Button>
              )}
            </div>
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <OrderCardSkeleton key={i} />
                ))}
              </div>
            ) : hasOrders ? (
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <OrderCard key={order.id} order={order} />
                ))}
              </div>
            ) : (
              <div className="rounded-lg border border-dashed p-12 text-center text-muted-foreground">
                <PackageIcon className="mx-auto mb-4 size-12 opacity-50" />
                <p className="text-sm">You haven&apos;t placed any orders yet.</p>
                <Button asChild variant="outline" className="mt-4">
                  <Link href="/products">Browse products</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
