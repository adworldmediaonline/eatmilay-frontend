"use client";

import { useState } from "react";
import Link from "next/link";
import { ShoppingCartIcon, SlidersHorizontalIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PriceDisplay, formatPrice } from "./price-display";
import { StockBadge } from "./stock-badge";
import { ProductImage } from "./product-image";
import { ProductOptionsDialog } from "./product-options-dialog";
import { useCart } from "./cart-provider";
import {
  getProductStockStatus,
  getStockStatusLabel,
} from "@/lib/stock-status";
import { cn } from "@/lib/utils";
import type { Product } from "@/lib/store-types";
import type { ProductDiscount } from "@/lib/store-api";

type ProductCardProps = {
  product: Product;
  variantIndex?: number;
  discount?: ProductDiscount | null;
};

export function ProductCard({ product, discount }: ProductCardProps) {
  const { addItem } = useCart();
  const [optionsDialogOpen, setOptionsDialogOpen] = useState(false);

  const productType = product.productType ?? "simple";
  const isVariable = productType === "variable";
  const isBundle = productType === "bundle";
  const variants = product.variants ?? [];
  const bundleItems = product.bundleItems ?? [];
  const needsOptions = isVariable || isBundle;

  const stockStatus = getProductStockStatus(product);
  const isOutOfStock = stockStatus === "out_of_stock";

  const displayPrice =
    isBundle
      ? product.bundlePrice ?? product.price
      : isVariable && variants.length > 0
        ? Math.min(...variants.map((v) => v.price))
        : product.price;
  const displayCompareAt = product.compareAtPrice;
  const showFromPrice = isVariable && variants.length > 1;
  const hasSale = displayCompareAt != null && displayCompareAt > displayPrice;

  const canAddToCart =
    stockStatus === "in_stock" ||
    stockStatus === "low_stock" ||
    stockStatus === "backorder";

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!canAddToCart) return;
    addItem({
      productId: product.id,
      productName: product.name,
      productSlug: product.slug,
      variantIndex: undefined,
      quantity: 1,
      unitPrice: displayPrice,
      image: product.images?.[0] ?? null,
    });
  };

  const handleChooseOptions = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setOptionsDialogOpen(true);
  };

  const mainImage = product.images?.[0] ?? null;
  const secondaryImage = product.images?.[1] ?? null;

  return (
    <>
      <article
        className={cn(
          "group/card flex min-w-0 flex-col overflow-hidden rounded-xl border border-border/80 bg-card shadow-sm transition-all duration-300",
          "hover:border-border hover:shadow-lg hover:-translate-y-1",
          "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2"
        )}
      >
        {/* Image zone */}
        <Link
          href={`/products/${product.slug}`}
          className="relative block aspect-square overflow-hidden bg-muted focus:outline-none focus:ring-0"
          aria-label={`View ${product.name}`}
        >
          <ProductImage
            image={mainImage}
            secondaryImage={secondaryImage}
            alt={product.name}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="transition-transform duration-500 ease-out group-hover/card:scale-105"
          />

          {/* Badges */}
          <div className="absolute left-2 top-2 z-10 flex flex-col gap-1.5">
            {discount && (
              <span className="border-green-500/30 bg-green-500/10 text-green-700 dark:border-green-500/20 dark:bg-green-500/20 dark:text-green-400 inline-flex rounded-md border px-2 py-1 text-[10px] font-semibold uppercase tracking-wider">
                {discount.type === "percentage"
                  ? `${discount.value}% off`
                  : discount.description}
              </span>
            )}
            {hasSale && (
              <span className="bg-destructive text-destructive-foreground inline-flex rounded-md px-2 py-1 text-[10px] font-bold uppercase tracking-wider">
                Sale
              </span>
            )}
            {isBundle && bundleItems.length > 0 && (
              <span className="bg-primary text-primary-foreground inline-flex rounded-md px-2 py-1 text-[10px] font-semibold uppercase tracking-wider">
                Bundle
              </span>
            )}
          </div>

          {/* Out of stock overlay */}
          {isOutOfStock && (
            <div
              className="absolute inset-0 z-10 flex items-center justify-center bg-background/80 backdrop-blur-[2px]"
              aria-hidden
            >
              <span className="rounded-full border-2 border-border bg-card px-4 py-2 text-sm font-semibold">
                Out of stock
              </span>
            </div>
          )}
        </Link>

        {/* Content zone */}
        <div className="flex min-w-0 flex-1 flex-col p-3 sm:p-4">
          <div className="min-w-0 flex-1">
            {product.categoryName && (
              <p className="text-muted-foreground mb-0.5 truncate text-xs font-medium uppercase tracking-wider">
                {product.categoryName}
              </p>
            )}
            <Link
              href={`/products/${product.slug}`}
              className="mt-0.5 block min-w-0 focus:outline-none focus:ring-0"
            >
              <h3 className="wrap-break-word font-semibold leading-snug text-foreground transition-colors text-sm sm:text-base group-hover/card:text-foreground/90">
                {product.name}
              </h3>
            </Link>

            {/* Price & stock */}
            <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1">
              {showFromPrice ? (
                <span className="font-semibold text-sm">
                  From {formatPrice(displayPrice, product.currency)}
                </span>
              ) : (
                <PriceDisplay
                  amount={displayPrice}
                  currency={product.currency}
                  compareAt={hasSale ? displayCompareAt : null}
                  size="sm"
                />
              )}
              <StockBadge
                status={stockStatus}
                className={cn(
                  isOutOfStock && "opacity-70"
                )}
              />
            </div>
          </div>

          {/* Action zone - mt-auto pushes to bottom for aligned buttons across cards */}
          <div
            className="mt-auto flex min-w-0 flex-wrap gap-2 pt-3 sm:pt-4"
            onClick={(e) => e.stopPropagation()}
          >
            {needsOptions ? (
              <Button
                size="sm"
                variant="outline"
                onClick={handleChooseOptions}
                className="min-h-10 min-w-0 flex-1 gap-1.5 text-xs sm:min-h-11 sm:gap-2 sm:text-sm"
                aria-label={`Choose options for ${product.name}`}
              >
                <SlidersHorizontalIcon className="size-4 shrink-0" />
                Choose options
              </Button>
            ) : (
              <Button
                size="sm"
                onClick={handleAddToCart}
                disabled={!canAddToCart}
                className="min-h-10 min-w-0 flex-1 gap-1.5 text-xs sm:min-h-11 sm:gap-2 sm:text-sm"
                aria-label={
                  canAddToCart
                    ? `Add ${product.name} to cart`
                    : getStockStatusLabel(stockStatus)
                }
              >
                <ShoppingCartIcon className="size-4 shrink-0" />
                {canAddToCart ? "Add to cart" : getStockStatusLabel(stockStatus)}
              </Button>
            )}
          </div>
        </div>
      </article>

      <ProductOptionsDialog
        product={product}
        open={optionsDialogOpen}
        onOpenChange={setOptionsDialogOpen}
      />
    </>
  );
}
