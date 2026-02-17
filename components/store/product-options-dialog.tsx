"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PriceDisplay } from "./price-display";
import { StockBadge } from "./stock-badge";
import { VariantSelector } from "./variant-selector";
import { VolumeTierSelector } from "./volume-tier-selector";
import { useCart } from "./cart-provider";
import {
  getStockStatus,
  getStockStatusLabel,
} from "@/lib/stock-status";
import type { Product } from "@/lib/store-types";

type ProductOptionsDialogProps = {
  product: Product;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function ProductOptionsDialog({
  product,
  open,
  onOpenChange,
}: ProductOptionsDialogProps) {
  const { addItem } = useCart();
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [selectedTierIndex, setSelectedTierIndex] = useState(0);

  const currency = product.currency ?? "USD";
  const productType = product.productType ?? "simple";
  const variants = product.variants ?? [];
  const bundleItems = product.bundleItems ?? [];
  const isVariable = productType === "variable";
  const isBundle = productType === "bundle";
  const selectedVariant = variants[selectedVariantIndex];
  const volumeTiers = isVariable && selectedVariant
    ? selectedVariant.volumeTiers ?? []
    : product.volumeTiers ?? [];
  const selectedTier = volumeTiers[selectedTierIndex];
  const optionName = product.options?.[0]?.name ?? "Size";

  const displayPrice =
    isVariable && volumeTiers.length > 0 && selectedTier
      ? selectedTier.price
      : isVariable && variants.length > 0
        ? selectedVariant?.price ?? Math.min(...variants.map((v) => v.price))
        : isBundle
          ? product.bundlePrice ?? product.price
          : product.price;

  const displayCompareAt =
    isVariable && volumeTiers.length > 0 && selectedTier
      ? selectedTier.compareAtPrice ?? null
      : isVariable && selectedVariant
        ? selectedVariant.compareAtPrice ?? product.compareAtPrice
        : product.compareAtPrice;

  const quantity =
    isBundle
      ? 1
      : volumeTiers.length > 0 && selectedTier
        ? selectedTier.minQuantity
        : 1;
  const unitPrice =
    isBundle
      ? displayPrice
      : volumeTiers.length > 0 && selectedTier
        ? selectedTier.price / selectedTier.minQuantity
        : displayPrice;

  const stockStatus = isVariable
    ? getStockStatus(
        product.trackInventory ?? true,
        selectedVariant?.stockQuantity ?? 0,
        selectedVariant?.lowStockThreshold,
        selectedVariant?.allowBackorder ?? false
      )
    : getStockStatus(
        product.trackInventory ?? true,
        product.stockQuantity ?? 0,
        product.lowStockThreshold,
        product.allowBackorder ?? false
      );

  const canAddToCart =
    stockStatus === "in_stock" ||
    stockStatus === "low_stock" ||
    stockStatus === "backorder";

  const handleAddToCart = () => {
    if (!canAddToCart) return;
    addItem({
      productId: product.id,
      productName: product.name,
      productSlug: product.slug,
      variantIndex: isVariable ? selectedVariantIndex : undefined,
      quantity,
      unitPrice,
      image: product.images?.[0] ?? null,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{product.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {isVariable && variants.length > 0 && (
            <VariantSelector
              variants={variants}
              selectedIndex={selectedVariantIndex}
              onSelect={(i) => {
                setSelectedVariantIndex(i);
                setSelectedTierIndex(0);
              }}
              currency={currency}
              optionName={optionName}
            />
          )}

          <VolumeTierSelector
            tiers={volumeTiers}
            selectedIndex={selectedTierIndex}
            onSelect={setSelectedTierIndex}
            currency={currency}
          />

          {isBundle && bundleItems.length > 0 && (
            <div className="rounded-lg border bg-muted/20 p-3">
              <h3 className="mb-2 text-sm font-medium">What&apos;s included</h3>
              <ul className="space-y-1.5 text-sm">
                {bundleItems.map((item) => (
                  <li
                    key={item.productId}
                    className="flex items-center justify-between"
                  >
                    <span>{item.productName ?? item.productId}</span>
                    <span className="text-muted-foreground">×{item.quantity}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-2">
            <PriceDisplay
              amount={displayPrice}
              currency={currency}
              compareAt={
                displayCompareAt != null && displayCompareAt > displayPrice
                  ? displayCompareAt
                  : null
              }
              size="default"
            />
            <StockBadge status={stockStatus} />
          </div>

          <Button
            size="lg"
            onClick={handleAddToCart}
            disabled={!canAddToCart}
            className="w-full"
          >
            {canAddToCart
              ? quantity > 1
                ? `Add ${quantity} to cart`
                : "Add to cart"
              : getStockStatusLabel(stockStatus)}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
