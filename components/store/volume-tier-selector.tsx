"use client";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "./price-display";
import type { VolumeTier } from "@/lib/store-types";

type VolumeTierSelectorProps = {
  tiers: VolumeTier[];
  selectedIndex: number;
  onSelect: (index: number) => void;
  currency?: string;
};

export function VolumeTierSelector({
  tiers,
  selectedIndex,
  onSelect,
  currency = "USD",
}: VolumeTierSelectorProps) {
  if (tiers.length === 0) return null;

  return (
    <div className="min-w-0 space-y-4">
      <div className="flex min-w-0 items-center gap-2 sm:gap-4">
        <div className="h-px min-w-0 flex-1 bg-border" />
        <span className="text-muted-foreground shrink-0 text-xs font-semibold uppercase tracking-wider">
          Bundle & Save
        </span>
        <div className="h-px min-w-0 flex-1 bg-border" />
      </div>
      <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2">
        {tiers.map((tier, i) => {
          const qty = tier.minQuantity;
          const packName = qty === 1 ? "Buy 1" : `Pack of ${qty}`;
          const savings =
            tier.compareAtPrice != null && tier.compareAtPrice > tier.price
              ? tier.compareAtPrice - tier.price
              : 0;
          const savingsPercent =
            tier.compareAtPrice != null &&
            tier.compareAtPrice > 0 &&
            savings > 0
              ? Math.round((savings / tier.compareAtPrice) * 100)
              : 0;
          const isSelected = selectedIndex === i;
          return (
            <button
              key={i}
              type="button"
              onClick={() => onSelect(i)}
              className={cn(
                "flex min-h-[88px] min-w-0 flex-col items-start rounded-xl border-2 p-3 text-left transition-colors sm:p-4",
                isSelected
                  ? "border-primary bg-primary/5"
                  : "border-border bg-muted/20 hover:border-primary/30"
              )}
            >
              <div className="flex w-full items-start justify-between gap-2">
                <span className="font-medium">{packName}</span>
                {tier.label === "most_popular" && (
                  <span className="bg-destructive/90 text-destructive-foreground shrink-0 rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase">
                    Most Popular
                  </span>
                )}
                {tier.label === "best_seller" && (
                  <span className="bg-emerald-600 text-white shrink-0 rounded px-1.5 py-0.5 text-[10px] font-semibold">
                    Best seller
                  </span>
                )}
                {tier.label === "super_saver" && (
                  <span className="bg-primary text-primary-foreground shrink-0 rounded px-1.5 py-0.5 text-[10px] font-semibold">
                    Super saver
                  </span>
                )}
              </div>
              {savingsPercent > 0 && (
                <Badge
                  variant="outline"
                  className="mt-1 border-green-500/30 bg-green-500/10 text-green-700 dark:bg-green-500/20 dark:text-green-400"
                >
                  Save {savingsPercent}%
                </Badge>
              )}
              <div className="mt-2 flex items-baseline gap-2">
                <span className="font-semibold">
                  {formatPrice(tier.price, currency)}
                </span>
                {tier.compareAtPrice != null &&
                  tier.compareAtPrice > tier.price && (
                    <span className="text-muted-foreground text-sm line-through">
                      {formatPrice(tier.compareAtPrice, currency)}
                    </span>
                  )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
