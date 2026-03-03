"use client";

import { useState, useEffect } from "react";
import { ProductCard } from "./product-card";
import { EmptyState } from "./empty-state";
import { getDiscountsForProducts } from "@/lib/store-api";
import type { Product } from "@/lib/store-types";
import type { ProductDiscount } from "@/lib/store-api";

type ProductGridProps = {
  products: Product[];
  emptyTitle?: string;
  emptyDescription?: string;
  emptyHref?: string;
  emptyLinkText?: string;
};

export function ProductGrid({
  products,
  emptyTitle = "No products yet",
  emptyDescription = "Check back soon for new arrivals.",
  emptyHref = "/products",
  emptyLinkText = "Browse all products",
}: ProductGridProps) {
  const [discounts, setDiscounts] = useState<Record<string, ProductDiscount>>({});

  useEffect(() => {
    if (products.length === 0) return;
    const ids = products.map((p) => p.id);
    getDiscountsForProducts(ids)
      .then(setDiscounts)
      .catch(() => setDiscounts({}));
  }, [products]);

  if (products.length === 0) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        href={emptyHref}
        linkText={emptyLinkText}
      />
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          discount={discounts[product.id]}
        />
      ))}
    </div>
  );
}
