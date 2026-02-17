import { Suspense } from "react";
import Link from "next/link";
import { connection } from "next/server";
import { Button } from "@/components/ui/button";
import { StoreContainer, StoreSection } from "@/components/store/store-layout";
import { HeroSection } from "@/components/store/hero-section";
import { ProductGrid } from "@/components/store/product-grid";
import { CategoryCard } from "@/components/store/category-card";
import { CollectionCard } from "@/components/store/collection-card";
import {
  getStoreProducts,
  getStoreCategories,
  getStoreCollections,
} from "@/lib/store-api";

async function FeaturedProducts() {
  await connection();
  const products = await getStoreProducts({ limit: 8 });
  return (
    <section className="space-y-4 sm:space-y-6">
      <div className="flex flex-row flex-wrap items-center justify-between gap-2">
        <h2 className="min-w-0 shrink text-xl font-semibold sm:text-2xl">Featured products</h2>
        <Button variant="outline" size="sm" asChild className="shrink-0">
          <Link href="/products">View all</Link>
        </Button>
      </div>
      <ProductGrid products={products} />
    </section>
  );
}

async function CategoriesSection() {
  await connection();
  const categories = await getStoreCategories();
  if (categories.length === 0) return null;
  return (
    <section className="space-y-4 sm:space-y-6">
      <h2 className="text-xl font-semibold sm:text-2xl">Categories</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((cat) => (
          <CategoryCard key={cat.id} category={cat} />
        ))}
      </div>
    </section>
  );
}

async function CollectionsSection() {
  await connection();
  const collections = await getStoreCollections();
  if (collections.length === 0) return null;
  return (
    <section className="space-y-4 sm:space-y-6">
      <h2 className="text-xl font-semibold sm:text-2xl">Collections</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {collections.map((col) => (
          <CollectionCard key={col.id} collection={col} />
        ))}
      </div>
    </section>
  );
}

export default function StoreHomePage() {
  return (
    <StoreSection>
      <StoreContainer className="space-y-12 sm:space-y-16 lg:space-y-20">
        <HeroSection />

        <Suspense
          fallback={
            <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-square animate-pulse rounded-xl bg-muted"
                />
              ))}
            </div>
          }
        >
          <FeaturedProducts />
        </Suspense>

        <Suspense fallback={null}>
          <CategoriesSection />
        </Suspense>

        <Suspense fallback={null}>
          <CollectionsSection />
        </Suspense>
      </StoreContainer>
    </StoreSection>
  );
}
