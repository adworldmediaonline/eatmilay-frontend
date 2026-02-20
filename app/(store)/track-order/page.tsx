"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getOrderTracking, getUserOrders } from "@/lib/store-api";
import type { UserOrder } from "@/lib/store-api";
import { useStoreSession } from "@/components/store/store-session-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StoreContainer, StoreSection } from "@/components/store/store-layout";
import { PackageIcon, TruckIcon, ExternalLinkIcon, ChevronDownIcon } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

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
    month: "short",
    day: "numeric",
  });
}

export default function TrackOrderPage() {
  const session = useStoreSession();
  const [orderNumber, setOrderNumber] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Awaited<ReturnType<typeof getOrderTracking>> | null>(null);
  const [userOrders, setUserOrders] = useState<UserOrder[]>([]);
  const [userOrdersLoading, setUserOrdersLoading] = useState(false);
  const [guestFormOpen, setGuestFormOpen] = useState(false);

  const isLoggedIn = !!session?.user;

  useEffect(() => {
    if (!isLoggedIn) return;
    setUserOrdersLoading(true);
    getUserOrders({ limit: 20, offset: 0 })
      .then((data) => setUserOrders(data.items))
      .catch(() => setUserOrders([]))
      .finally(() => setUserOrdersLoading(false));
  }, [isLoggedIn]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResult(null);
    if (!orderNumber.trim() || !email.trim()) {
      setError("Please enter both order number and email");
      return;
    }
    setLoading(true);
    try {
      const data = await getOrderTracking(orderNumber.trim(), email.trim());
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch order");
    } finally {
      setLoading(false);
    }
  };

  const ordersWithTracking = userOrders.filter((o) => o.trackingUrl);

  return (
    <StoreSection>
      <StoreContainer size="compact">
        <div className="mx-auto max-w-2xl">
          <h1 className="text-2xl font-bold">Track your order</h1>

          {isLoggedIn ? (
            <>
              <p className="text-muted-foreground mt-1 text-sm">
                View and track your orders below. No need to enter any details.
              </p>

              {userOrdersLoading ? (
                <div className="mt-6 rounded-lg border border-dashed p-8 text-center text-muted-foreground text-sm">
                  Loading your orders…
                </div>
              ) : userOrders.length === 0 ? (
                <div className="mt-6 rounded-lg border border-dashed p-8 text-center">
                  <PackageIcon className="text-muted-foreground mx-auto mb-3 size-12 opacity-50" />
                  <p className="text-muted-foreground text-sm">You have no orders yet.</p>
                  <Button asChild variant="outline" className="mt-4">
                    <Link href="/products">Browse products</Link>
                  </Button>
                </div>
              ) : (
                <div className="mt-6 space-y-4">
                  {userOrders.map((order) => (
                    <div
                      key={order.id}
                      className="rounded-lg border bg-card p-4"
                    >
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="font-semibold">Order {order.orderNumber}</p>
                          <p className="text-muted-foreground text-sm">
                            {formatDate(order.createdAt)} · {order.itemCount} item
                            {order.itemCount !== 1 ? "s" : ""}
                          </p>
                          <span className="text-muted-foreground mt-1 inline-block text-xs capitalize">
                            {STATUS_LABELS[order.status] ?? order.status}
                          </span>
                        </div>
                        <div className="flex shrink-0 gap-2">
                          <Button asChild variant="outline" size="sm">
                            <Link href={`/dashboard/orders/${order.orderNumber}`}>
                              View details
                            </Link>
                          </Button>
                          {order.trackingUrl ? (
                            <Button asChild size="sm">
                              <a
                                href={order.trackingUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                Track
                                <ExternalLinkIcon className="ml-1 size-3" />
                              </a>
                            </Button>
                          ) : (
                            <span className="text-muted-foreground flex items-center gap-1 text-xs">
                              <TruckIcon className="size-3" />
                              Tracking available soon
                            </span>
                          )}
                        </div>
                      </div>
                      {order.trackingNumber && order.estimatedDelivery && (
                        <p className="text-muted-foreground mt-2 text-xs">
                          {order.courierName && `${order.courierName} · `}
                          Est. delivery: {order.estimatedDelivery}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}

              <p className="text-muted-foreground mt-6 text-center text-sm">
                <Link href="/dashboard/orders" className="underline hover:text-foreground">
                  View all orders in dashboard
                </Link>
              </p>

              <Collapsible open={guestFormOpen} onOpenChange={setGuestFormOpen} className="mt-8">
                <CollapsibleTrigger asChild>
                  <button
                    type="button"
                    className="text-muted-foreground hover:text-foreground flex w-full items-center justify-center gap-2 text-sm"
                  >
                    Track an order with order number
                    <ChevronDownIcon
                      className={`size-4 transition-transform ${guestFormOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <GuestTrackForm
                    orderNumber={orderNumber}
                    setOrderNumber={setOrderNumber}
                    email={email}
                    setEmail={setEmail}
                    loading={loading}
                    error={error}
                    result={result}
                    handleSubmit={handleSubmit}
                  />
                </CollapsibleContent>
              </Collapsible>
            </>
          ) : (
            <>
              <p className="text-muted-foreground mt-1 text-sm">
                Enter your order number and email to see tracking details.
              </p>
              <GuestTrackForm
                orderNumber={orderNumber}
                setOrderNumber={setOrderNumber}
                email={email}
                setEmail={setEmail}
                loading={loading}
                error={error}
                result={result}
                handleSubmit={handleSubmit}
              />
            </>
          )}

          <p className="text-muted-foreground mt-6 text-center text-sm">
            <Link href="/" className="underline hover:text-foreground">
              Back to home
            </Link>
          </p>
        </div>
      </StoreContainer>
    </StoreSection>
  );
}

function GuestTrackForm({
  orderNumber,
  setOrderNumber,
  email,
  setEmail,
  loading,
  error,
  result,
  handleSubmit,
}: {
  orderNumber: string;
  setOrderNumber: (v: string) => void;
  email: string;
  setEmail: (v: string) => void;
  loading: boolean;
  error: string | null;
  result: Awaited<ReturnType<typeof getOrderTracking>> | null;
  handleSubmit: (e: React.FormEvent) => void;
}) {
  return (
    <>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="orderNumber">Order number</Label>
          <Input
            id="orderNumber"
            type="text"
            placeholder="e.g. ORD-0001"
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full"
          />
        </div>
        {error && (
          <p className="text-destructive text-sm">{error}</p>
        )}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Looking up…" : "Track order"}
        </Button>
      </form>

      {result && (
        <div className="mt-8 rounded-lg border bg-card p-6">
          <div className="flex items-center gap-2">
            <PackageIcon className="size-5 text-muted-foreground" />
            <h2 className="font-semibold">Order {result.orderNumber}</h2>
          </div>
          <dl className="mt-4 space-y-2 text-sm">
            <div>
              <dt className="text-muted-foreground">Status</dt>
              <dd className="font-medium capitalize">
                {STATUS_LABELS[result.status] ?? result.status}
              </dd>
            </div>
            {result.courierName && (
              <div>
                <dt className="text-muted-foreground">Courier</dt>
                <dd>{result.courierName}</dd>
              </div>
            )}
            {result.estimatedDelivery && (
              <div>
                <dt className="text-muted-foreground">Estimated delivery</dt>
                <dd>{result.estimatedDelivery}</dd>
              </div>
            )}
            {result.trackingNumber && result.trackingUrl && (
              <div className="pt-2">
                <dt className="text-muted-foreground">Tracking</dt>
                <dd className="flex items-center gap-2">
                  <span className="font-mono text-sm">{result.trackingNumber}</span>
                  <a
                    href={result.trackingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-primary text-sm underline"
                  >
                    Track on Shiprocket
                    <ExternalLinkIcon className="size-3" />
                  </a>
                </dd>
              </div>
            )}
            {result.shiprocketError && !result.trackingNumber && (
              <div>
                <dt className="text-muted-foreground">Note</dt>
                <dd className="text-amber-600 dark:text-amber-500">
                  Shipment is being prepared. Tracking will be available soon.
                </dd>
              </div>
            )}
          </dl>
        </div>
      )}
    </>
  );
}
