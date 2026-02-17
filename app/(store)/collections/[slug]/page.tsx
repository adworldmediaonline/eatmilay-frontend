import { notFound } from "next/navigation";
import { connection } from "next/server";
import { StoreContainer, StoreSection } from "@/components/store/store-layout";
import {
  getStoreCollectionBySlug,
  getStoreProducts,
} from "@/lib/store-api";
import { ProductGrid } from "@/components/store/product-grid";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

type CollectionPageProps = {
  params: Promise<{ slug: string }>;
};

async function getCollection(slug: string) {
  await connection();
  try {
    return await getStoreCollectionBySlug(slug);
  } catch {
    return null;
  }
}

async function getCollectionProducts(collectionId: string) {
  await connection();
  return getStoreProducts({ collectionId, limit: 50 });
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  const { slug } = await params;
  const collection = await getCollection(slug);

  if (!collection) notFound();

  const products = await getCollectionProducts(collection.id);

  return (
    <StoreSection>
      <StoreContainer>
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/collections">Collections</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{collection.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="mb-6">
          <h1 className="text-2xl font-bold">{collection.name}</h1>
          {collection.description && (
            <p className="text-muted-foreground mt-1">
              {collection.description}
            </p>
          )}
        </div>

        <ProductGrid
          products={products}
          emptyTitle={`No products in ${collection.name}`}
          emptyDescription="Check back later for new arrivals."
        />
      </StoreContainer>
    </StoreSection>
  );
}
