import { Suspense } from "react";
import { connection } from "next/server";
import { StoreContainer, StoreSection } from "@/components/store/store-layout";
import {
  getStoreProducts,
  getStoreCategories,
  getStoreCollections,
} from "@/lib/store-api";
import { ProductGrid } from "@/components/store/product-grid";
import { ProductFilters } from "@/components/store/product-filters";
import { ProductFilterChips } from "@/components/store/product-filter-chips";
import { LoadMoreProducts } from "@/components/store/load-more-products";
import type { GetStoreProductsParams } from "@/lib/store-api";

type ProductsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const PAGE_SIZE = 48;

async function ProductsList({
  params,
  categories,
  collections,
}: {
  params: GetStoreProductsParams;
  categories: Array<{ id: string; name: string }>;
  collections: Array<{ id: string; name: string }>;
}) {
  await connection();
  const limit = params.limit ?? PAGE_SIZE;
  const { items, total } = await getStoreProducts({
    ...params,
    limit,
    offset: 0,
  });

  const hasFilters =
    params.search ||
    params.categoryId ||
    params.collectionId ||
    params.minPrice != null ||
    params.maxPrice != null ||
    params.tags ||
    params.vendor ||
    params.productType ||
    params.inStock;

  return (
    <>
      <ProductFilterChips categories={categories} collections={collections} />
      <p className="text-muted-foreground mb-4 mt-4 text-sm">
        Showing {items.length} of {total} products
      </p>
      <ProductGrid
        products={items}
        emptyTitle={hasFilters ? "No products match your filters" : "No products yet"}
        emptyDescription={
          hasFilters
            ? "Try adjusting your filters to see more results."
            : "Check back soon for new arrivals."
        }
        emptyLinkText={hasFilters ? "Clear filters" : "Browse all products"}
      />
      <LoadMoreProducts
        currentCount={items.length}
        total={total}
        pageSize={PAGE_SIZE}
      />
    </>
  );
}

function parseParams(
  raw: Record<string, string | string[] | undefined>
): GetStoreProductsParams {
  const str = (v: string | string[] | undefined) =>
    Array.isArray(v) ? v[0] : v;
  const num = (v: string | string[] | undefined) => {
    const s = str(v);
    if (!s) return undefined;
    const n = parseFloat(s);
    return Number.isNaN(n) ? undefined : n;
  };
  return {
    categoryId: str(raw.categoryId) || undefined,
    collectionId: str(raw.collectionId) || undefined,
    search: str(raw.search)?.trim() || undefined,
    sortBy:
      (str(raw.sortBy) as GetStoreProductsParams["sortBy"]) || undefined,
    sortOrder:
      (str(raw.sortOrder) as GetStoreProductsParams["sortOrder"]) || undefined,
    minPrice: num(raw.minPrice),
    maxPrice: num(raw.maxPrice),
    tags: str(raw.tags)?.trim() || undefined,
    vendor: str(raw.vendor)?.trim() || undefined,
    productType:
      (str(raw.productType) as GetStoreProductsParams["productType"]) ||
      undefined,
    inStock: str(raw.inStock) === "true" ? true : undefined,
    limit: num(raw.limit) ?? 48,
    offset: num(raw.offset) ?? 0,
  };
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const raw = await searchParams;
  const params = parseParams(raw);

  await connection();
  const [categories, collections] = await Promise.all([
    getStoreCategories(),
    getStoreCollections(),
  ]);

  return (
    <StoreSection>
      <StoreContainer>
        <div className="sticky top-0 z-10 mb-6 flex flex-col gap-4 bg-background py-4 lg:flex-row lg:items-start lg:justify-between lg:gap-6">
          <h1 className="shrink-0 text-2xl font-bold sm:text-3xl">All products</h1>
          <div className="min-w-0 flex-1">
            <ProductFilters />
          </div>
        </div>
        <Suspense
          key={JSON.stringify(params)}
          fallback={
            <div className="space-y-4">
              <div className="h-5 w-32 animate-pulse rounded bg-muted" />
              <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className="aspect-square animate-pulse rounded-lg bg-muted"
                  />
                ))}
              </div>
            </div>
          }
        >
          <ProductsList
            params={params}
            categories={categories}
            collections={collections}
          />
        </Suspense>
      </StoreContainer>
    </StoreSection>
  );
}
