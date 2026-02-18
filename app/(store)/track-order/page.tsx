"use client";

import { useState } from "react";
import Link from "next/link";
import { getOrderTracking } from "@/lib/store-api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StoreContainer, StoreSection } from "@/components/store/store-layout";
import { PackageIcon, TruckIcon, ExternalLinkIcon } from "lucide-react";

const STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  paid: "Paid",
  confirmed: "Confirmed",
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Awaited<ReturnType<typeof getOrderTracking>> | null>(null);

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

  return (
    <StoreSection>
      <StoreContainer size="compact">
        <div className="mx-auto max-w-md">
          <h1 className="text-2xl font-bold">Track your order</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Enter your order number and email to see tracking details.
          </p>

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
