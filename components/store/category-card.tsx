import Link from "next/link";
import { ProductImage } from "./product-image";
import { ChevronRightIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ProductCategory } from "@/lib/store-types";

type CategoryCardProps = {
  category: ProductCategory;
  /** Larger card for featured placement */
  featured?: boolean;
  className?: string;
};

export function CategoryCard({
  category,
  featured = false,
  className,
}: CategoryCardProps) {
  const productCount = category.productCount ?? 0;
  const countLabel =
    productCount === 1 ? "1 product" : `${productCount} products`;

  return (
    <Link
      href={`/categories/${category.slug}`}
      className={cn(
        "group relative block overflow-hidden rounded-xl border border-border/60 bg-muted/30 transition-all duration-300",
        "hover:border-border hover:shadow-lg hover:shadow-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        featured ? "aspect-[4/3] sm:aspect-[3/2]" : "aspect-[4/3]",
        className
      )}
    >
      <div className="absolute inset-0">
        <ProductImage
          image={category.image}
          alt={category.name}
          objectFit="cover"
          sizes={
            featured
              ? "(max-width: 640px) 100vw, 50vw"
              : "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          }
          className="size-full transition-transform duration-500 ease-out group-hover:scale-105"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"
          aria-hidden
        />
      </div>

      <div className="relative flex h-full flex-col justify-end p-4 sm:p-5">
        <h3
          className={cn(
            "font-semibold text-white drop-shadow-sm",
            featured ? "text-lg sm:text-xl" : "text-base sm:text-lg"
          )}
        >
          {category.name}
        </h3>
        <p className="text-white/90 mt-0.5 text-sm drop-shadow-sm">
          {countLabel}
        </p>
        <span
          className={cn(
            "mt-2 inline-flex items-center gap-1 text-sm font-medium text-white/95 opacity-0 transition-opacity duration-200 group-hover:opacity-100",
            featured && "sm:opacity-100"
          )}
        >
          Shop now
          <ChevronRightIcon className="size-4 transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}
