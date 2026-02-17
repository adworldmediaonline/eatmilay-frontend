"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PriceDisplay } from "@/components/store/price-display";
import { StockBadge } from "@/components/store/stock-badge";
import { VariantSelector } from "@/components/store/variant-selector";
import { VolumeTierSelector } from "@/components/store/volume-tier-selector";
import { RelatedProducts } from "@/components/store/related-products";
import { ProductDetailAccordion } from "@/components/store/product-detail-accordion";
import { useCart } from "@/components/store/cart-provider";
import {
  getStockStatus,
  getStockStatusLabel,
} from "@/lib/stock-status";
import type { Product } from "@/lib/store-types";

type ProductDetailClientProps = {
  product: Product;
};

export function ProductDetailClient({ product }: ProductDetailClientProps) {
  const { addItem } = useCart();
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [selectedPackIndex, setSelectedPackIndex] = useState(0);

  const currency = product.currency ?? "USD";
  const productType = product.productType ?? "simple";
  const options = product.options ?? [];
  const variants = product.variants ?? [];
  const bundleItems = product.bundleItems ?? [];
  const isVariable = productType === "variable";
  const selectedVariant = variants[selectedVariantIndex];
  const volumeTiers = isVariable && selectedVariant
    ? selectedVariant.volumeTiers ?? []
    : product.volumeTiers ?? [];
  const isBundle = productType === "bundle";
  const selectedPack = volumeTiers[selectedPackIndex];

  const displayPrice =
    isVariable && volumeTiers.length > 0 && selectedPack
      ? selectedPack.price
      : isVariable && variants.length > 0
        ? selectedVariant?.price ?? Math.min(...variants.map((v) => v.price))
        : product.price;
  const displayCompareAt =
    isVariable && volumeTiers.length > 0 && selectedPack
      ? selectedPack.compareAtPrice ?? null
      : product.compareAtPrice;

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
    const quantity =
      isBundle
        ? 1
        : volumeTiers.length > 0 && selectedPack
          ? selectedPack.minQuantity
          : 1;
    const unitPrice =
      isBundle
        ? displayPrice
        : volumeTiers.length > 0 && selectedPack
          ? selectedPack.price / selectedPack.minQuantity
          : displayPrice;
    addItem({
      productId: product.id,
      productName: product.name,
      productSlug: product.slug,
      variantIndex: isVariable ? selectedVariantIndex : undefined,
      quantity,
      unitPrice,
      image: product.images?.[0] ?? null,
    });
  };

  return (
    <div className="flex min-w-0 flex-col gap-6">
      <div className="flex min-w-0 flex-wrap items-baseline gap-2">
        {isVariable &&
        volumeTiers.length === 0 &&
        variants.length > 0 ? (
          <span className="text-2xl font-semibold">
            From <PriceDisplay amount={displayPrice} currency={currency} />
          </span>
        ) : (
          <>
            <PriceDisplay
              amount={displayPrice}
              currency={currency}
              compareAt={
                displayCompareAt != null && displayCompareAt > displayPrice
                  ? displayCompareAt
                  : null
              }
              size="lg"
            />
            <StockBadge status={stockStatus} />
          </>
        )}
      </div>

      <VariantSelector
        variants={variants}
        selectedIndex={selectedVariantIndex}
        onSelect={(i) => {
          setSelectedVariantIndex(i);
          setSelectedPackIndex(0);
        }}
        currency={currency}
      />

      <VolumeTierSelector
        tiers={volumeTiers}
        selectedIndex={selectedPackIndex}
        onSelect={setSelectedPackIndex}
        currency={currency}
      />

      {isBundle && bundleItems.length > 0 && (
        <div className="min-w-0 overflow-hidden rounded-lg border bg-muted/20 p-3 sm:p-4">
          <h3 className="mb-3 text-sm font-medium">What&apos;s included</h3>
          <ul className="space-y-2">
            {bundleItems.map((item) => (
              <li
                key={item.productId}
                className="flex items-center justify-between text-sm"
              >
                <span>{item.productName ?? item.productId}</span>
                <span className="text-muted-foreground">×{item.quantity}</span>
              </li>
            ))}
          </ul>
          <div className="mt-3 flex items-center justify-between border-t pt-3">
            <span className="text-sm font-medium">Bundle total</span>
            <PriceDisplay amount={product.price} currency={currency} />
          </div>
        </div>
      )}

      <Button
        size="lg"
        onClick={handleAddToCart}
        disabled={!canAddToCart}
        className="min-h-12 w-full text-base sm:min-w-[200px] sm:w-auto"
      >
        {canAddToCart ? "Add to cart" : getStockStatusLabel(stockStatus)}
      </Button>

      <ProductDetailAccordion
        description={product.description}
        nutrients={product.nutrients}
        benefits={product.benefits}
      />

      {product.relatedProducts && product.relatedProducts.length > 0 && (
        <div className="mt-8">
          <RelatedProducts
            products={product.relatedProducts}
            currency={currency}
          />
        </div>
      )}

      {(product.vendor || product.sku) && (
        <div className="text-muted-foreground flex flex-wrap gap-4 text-xs">
          {product.vendor && <span>Vendor: {product.vendor}</span>}
          {product.sku && <span>SKU: {product.sku}</span>}
        </div>
      )}
    </div>
  );
}
