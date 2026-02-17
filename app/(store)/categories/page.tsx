import Link from "next/link";
import { Suspense } from "react";
import { connection } from "next/server";
import { StoreContainer, StoreSection } from "@/components/store/store-layout";
import { getStoreCategories } from "@/lib/store-api";
import { CategoryCard } from "@/components/store/category-card";
import { EmptyState } from "@/components/store/empty-state";
import { Button } from "@/components/ui/button";

async function CategoriesList() {
  await connection();
  const categories = await getStoreCategories();
  if (categories.length === 0) {
    return (
      <EmptyState
        title="No categories yet"
        description="Check back soon for new categories."
        href="/"
        linkText="Back to home"
      />
    );
  }
  const [featured, ...rest] = categories;
  return (
    <div className="space-y-8">
      {featured && (
        <div>
          <p className="text-muted-foreground mb-3 text-xs font-medium uppercase tracking-wider">
            Featured
          </p>
          <CategoryCard category={featured} featured />
        </div>
      )}
      {rest.length > 0 && (
        <div>
          <p className="text-muted-foreground mb-3 text-xs font-medium uppercase tracking-wider">
            {featured ? "All categories" : "Categories"}
          </p>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
            {rest.map((cat) => (
              <CategoryCard key={cat.id} category={cat} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function CategoriesPage() {
  return (
    <StoreSection>
      <StoreContainer>
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Categories
          </h1>
          <p className="text-muted-foreground mt-2 max-w-2xl text-sm sm:text-base">
            Explore our products by category. Find snacks, essentials, and more.
          </p>
          <Button variant="outline" size="sm" asChild className="mt-4">
            <Link href="/products">View all products</Link>
          </Button>
        </div>

        <Suspense
          fallback={
            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-[4/3] animate-pulse rounded-xl bg-muted"
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
