import { Suspense } from "react";
import { connection } from "next/server";
import { StoreContainer, StoreSection } from "@/components/store/store-layout";
import { getStoreCategories } from "@/lib/store-api";
import { CategoryCard } from "@/components/store/category-card";
import { EmptyState } from "@/components/store/empty-state";

async function CategoriesList() {
  await connection();
  const categories = await getStoreCategories();
  if (categories.length === 0) {
    return (
      <EmptyState
        title="No categories yet"
        description="Check back soon."
        href="/"
        linkText="Back to home"
      />
    );
  }
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {categories.map((cat) => (
        <CategoryCard key={cat.id} category={cat} />
      ))}
    </div>
  );
}

export default function CategoriesPage() {
  return (
    <StoreSection>
      <StoreContainer>
        <h1 className="mb-6 text-2xl font-bold sm:text-3xl">Categories</h1>
        <Suspense
          fallback={
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-[4/3] animate-pulse rounded-lg bg-muted"
                />
              ))}
            </div>
          }
        >
          <CategoriesList />
        </Suspense>
      </StoreContainer>
    </StoreSection>
  );
}
