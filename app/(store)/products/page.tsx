import { Suspense } from "react";
import { connection } from "next/server";
import { StoreContainer, StoreSection } from "@/components/store/store-layout";
import { getStoreProducts } from "@/lib/store-api";
import { ProductGrid } from "@/components/store/product-grid";

type ProductsPageProps = {
  searchParams: Promise<{ categoryId?: string; collectionId?: string }>;
};

async function ProductsList({
  categoryId,
  collectionId,
}: {
  categoryId?: string;
  collectionId?: string;
}) {
  await connection();
  const products = await getStoreProducts({
    categoryId,
    collectionId,
    limit: 50,
  });
  return <ProductGrid products={products} />;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;
  const categoryId = params.categoryId;
  const collectionId = params.collectionId;

  return (
    <StoreSection>
      <StoreContainer>
        <h1 className="mb-6 text-2xl font-bold sm:text-3xl">All products</h1>
        <Suspense
          fallback={
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-square animate-pulse rounded-lg bg-muted"
                />
              ))}
            </div>
          }
        >
          <ProductsList
            categoryId={categoryId}
            collectionId={collectionId}
          />
        </Suspense>
      </StoreContainer>
    </StoreSection>
  );
}
