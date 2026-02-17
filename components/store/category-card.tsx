import Link from "next/link";
import { CardContent } from "@/components/ui/card";
import { StoreCard } from "./store-card";
import { ProductImage } from "./product-image";
import type { ProductCategory } from "@/lib/store-types";

type CategoryCardProps = {
  category: ProductCategory;
};

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link href={`/categories/${category.slug}`} className="block group">
      <StoreCard>
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          <ProductImage
            image={category.image}
            alt={category.name}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <CardContent className="p-4 sm:p-5">
          <h3 className="font-semibold text-base sm:text-lg">{category.name}</h3>
          {category.description && (
            <p className="text-muted-foreground mt-1 line-clamp-2 text-sm">
              {category.description}
            </p>
          )}
        </CardContent>
      </StoreCard>
    </Link>
  );
}
