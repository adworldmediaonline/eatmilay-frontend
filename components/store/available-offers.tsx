"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { getAvailableOffers, validateStoreDiscount } from "@/lib/store-api";
import type { AvailableOffer } from "@/lib/store-api";
import { Loader2Icon, TagIcon } from "lucide-react";

type AvailableOffersProps = {
  subtotal: number;
  items: Array<{ productId: string; quantity: number; unitPrice: number }>;
  onApplied: (discountAmount: number, code: string) => void;
  appliedCode?: string | null;
};

export function AvailableOffers({
  subtotal,
  items,
  onApplied,
  appliedCode,
}: AvailableOffersProps) {
  const [offers, setOffers] = useState<AvailableOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [applyingCode, setApplyingCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (items.length === 0 || subtotal <= 0) {
      setOffers([]);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    getAvailableOffers(subtotal, items)
      .then((data) => {
        if (!cancelled) setOffers(data);
      })
      .catch(() => {
        if (!cancelled) {
          setOffers([]);
          setError("Failed to load offers");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [subtotal, items]);

  const handleApply = async (offer: AvailableOffer) => {
    if (appliedCode) return;
    setApplyingCode(offer.code);
    setError(null);
    try {
      const result = await validateStoreDiscount(offer.code, subtotal, items);
      if (result.valid) {
        onApplied(result.discountAmount, offer.code);
      } else {
        setError(result.message ?? "Could not apply offer");
      }
    } catch {
      setError("Failed to apply offer");
    } finally {
      setApplyingCode(null);
    }
  };

  if (appliedCode) return null;
  if (loading) {
    return (
      <div className="space-y-2">
        <p className="text-muted-foreground text-sm font-medium">
          Available offers
        </p>
        <div className="flex items-center gap-2 rounded-lg border border-dashed p-4">
          <Loader2Icon className="size-4 animate-spin text-muted-foreground" />
          <span className="text-muted-foreground text-sm">
            Loading offers...
          </span>
        </div>
      </div>
    );
  }
  if (offers.length === 0) return null;

  return (
    <div className="space-y-2">
      <p className="text-muted-foreground text-sm font-medium">
        Available offers
      </p>
      <div className="space-y-2">
        {offers.map((offer) => (
          <div
            key={offer.code}
            className="flex items-center justify-between gap-3 rounded-lg border border-border bg-muted/30 p-3"
          >
            <div className="flex min-w-0 items-center gap-2">
              <TagIcon className="size-4 shrink-0 text-muted-foreground" />
              <div className="min-w-0">
                <p className="text-sm font-medium">{offer.description}</p>
              </div>
            </div>
            <Button
              size="sm"
              variant="outline"
              className="shrink-0 border-green-500/40 bg-green-500/10 text-green-700 hover:bg-green-500/20 hover:text-green-800 dark:border-green-500/30 dark:bg-green-500/20 dark:text-green-400 dark:hover:bg-green-500/30"
              onClick={() => handleApply(offer)}
              disabled={applyingCode !== null}
            >
              {applyingCode === offer.code ? (
                <Loader2Icon className="size-4 animate-spin" />
              ) : (
                "Apply"
              )}
            </Button>
          </div>
        ))}
      </div>
      {error && (
        <p className="text-destructive text-sm">{error}</p>
      )}
    </div>
  );
}
