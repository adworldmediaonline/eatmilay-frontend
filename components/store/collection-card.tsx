import Link from "next/link";
import { CardContent } from "@/components/ui/card";
import { StoreCard } from "./store-card";
import { ProductImage } from "./product-image";
import type { ProductCollection } from "@/lib/store-types";

type CollectionCardProps = {
  collection: ProductCollection;
};

export function CollectionCard({ collection }: CollectionCardProps) {
  const productCount = collection.productCount ?? collection.productIds?.length ?? 0;

  return (
    <Link href={`/collections/${collection.slug}`} className="block group">
      <StoreCard>
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          <ProductImage
            image={collection.image}
            alt={collection.name}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <CardContent className="p-4 sm:p-5">
          <h3 className="font-semibold text-base sm:text-lg">{collection.name}</h3>
          <p className="text-muted-foreground mt-1 text-sm">
            {productCount} {productCount === 1 ? "product" : "products"}
          </p>
          {collection.description && (
            <p className="text-muted-foreground mt-1 line-clamp-2 text-sm">
              {collection.description}
            </p>
          )}
        </CardContent>
      </StoreCard>
    </Link>
  );
}
