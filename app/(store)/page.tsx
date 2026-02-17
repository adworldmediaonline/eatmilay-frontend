import { Suspense } from "react";
import Link from "next/link";
import { cacheLife, cacheTag } from "next/cache";
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
  "use cache";
  cacheLife("hours");
  cacheTag("store-products");
  const products = await getStoreProducts({ limit: 8 });
  return (
    <section className="space-y-4 sm:space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl font-semibold sm:text-2xl">Featured products</h2>
        <Button variant="outline" size="sm" asChild className="w-fit">
          <Link href="/products">View all</Link>
        </Button>
      </div>
      <ProductGrid products={products} />
    </section>
  );
}

async function CategoriesSection() {
  "use cache";
  cacheLife("hours");
  cacheTag("store-categories");
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
  "use cache";
  cacheLife("hours");
  cacheTag("store-collections");
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
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
