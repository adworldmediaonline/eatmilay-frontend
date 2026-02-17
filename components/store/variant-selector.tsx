"use client";

import { cn } from "@/lib/utils";
import { formatPrice } from "./price-display";
import type { ProductVariant } from "@/lib/store-types";

type VariantSelectorProps = {
  variants: ProductVariant[];
  selectedIndex: number;
  onSelect: (index: number) => void;
  currency?: string;
  optionName?: string;
};

export function VariantSelector({
  variants,
  selectedIndex,
  onSelect,
  currency = "USD",
  optionName = "Size",
}: VariantSelectorProps) {
  if (variants.length === 0) return null;

  return (
    <div className="min-w-0 space-y-3">
      <h3 className="text-sm font-medium">{optionName}</h3>
      <div className="flex min-w-0 flex-wrap gap-2">
        {variants.map((v, i) => (
          <button
            key={i}
            type="button"
            onClick={() => onSelect(i)}
            className={cn(
              "relative flex min-h-11 min-w-0 shrink-0 items-center rounded-full border-2 px-4 py-2 text-sm transition-colors",
              selectedIndex === i
                ? "border-primary bg-primary/10 text-primary"
                : "border-border bg-muted/30 hover:border-primary/50"
            )}
          >
            <span className="min-w-0 truncate font-medium">{v.optionValues.join(" / ")}</span>
            <span className="text-muted-foreground shrink-0 pl-2">
              — {formatPrice(v.price, currency)}
            </span>
            {v.label === "most_popular" && (
              <span className="bg-destructive/90 text-destructive-foreground ml-2 rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase">
                Most Popular
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
