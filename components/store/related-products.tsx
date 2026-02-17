import Link from "next/link";
import { ProductImage } from "./product-image";
import { PriceDisplay } from "./price-display";
import type { ProductImage as ProductImageType } from "@/lib/store-types";

type RelatedProduct = {
  id: string;
  slug: string;
  name: string;
  price: number;
  image: { url: string } | null;
};

type RelatedProductsProps = {
  products: RelatedProduct[];
  currency?: string;
};

export function RelatedProducts({
  products,
  currency = "USD",
}: RelatedProductsProps) {
  if (products.length === 0) return null;

  return (
    <div className="min-w-0 space-y-4">
      <div className="flex items-center gap-4">
        <div className="h-px flex-1 bg-border" />
        <span className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">
          You may also like
        </span>
        <div className="h-px flex-1 bg-border" />
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
        {products.map((rp) => (
          <Link
            key={rp.id}
            href={`/products/${rp.slug}`}
            className="flex flex-col overflow-hidden rounded-lg border border-border bg-muted/20 transition-colors hover:border-primary/30 hover:bg-muted/40"
          >
            <div className="relative aspect-square bg-muted">
              <ProductImage
                image={
                  rp.image
                    ? ({ url: rp.image.url, publicId: "" } as ProductImageType)
                    : null
                }
                alt={rp.name}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            </div>
            <div className="flex min-w-0 flex-1 flex-col p-3">
              <span className="wrap-break-word font-medium">{rp.name}</span>
              <PriceDisplay amount={rp.price} currency={currency} size="sm" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
