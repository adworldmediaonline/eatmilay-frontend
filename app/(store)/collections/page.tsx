import { Suspense } from "react";
import { connection } from "next/server";
import { StoreContainer, StoreSection } from "@/components/store/store-layout";
import { getStoreCollections } from "@/lib/store-api";
import { CollectionCard } from "@/components/store/collection-card";
import { EmptyState } from "@/components/store/empty-state";

async function CollectionsList() {
  await connection();
  const collections = await getStoreCollections();
  if (collections.length === 0) {
    return (
      <EmptyState
        title="No collections yet"
        description="Check back soon."
        href="/"
        linkText="Back to home"
      />
    );
  }
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {collections.map((col) => (
        <CollectionCard key={col.id} collection={col} />
      ))}
    </div>
  );
}

export default function CollectionsPage() {
  return (
    <StoreSection>
      <StoreContainer>
        <h1 className="mb-6 text-2xl font-bold sm:text-3xl">Collections</h1>
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
          <CollectionsList />
        </Suspense>
      </StoreContainer>
    </StoreSection>
  );
}
