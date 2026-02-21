import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { StoreContainer, StoreSection } from "@/components/store/store-layout";
import {
  getStoreCategoryBySlug,
  getStoreProducts,
} from "@/lib/store-api";
import { ProductGrid } from "@/components/store/product-grid";
import { ProductImage } from "@/components/store/product-image";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

type CategoryPageProps = {
  params: Promise<{ slug: string }>;
};

async function getCategory(slug: string) {
  await connection();
  try {
    return await getStoreCategoryBySlug(slug);
  } catch {
    return null;
  }
}

async function getCategoryProducts(categoryId: string) {
  await connection();
  const { items } = await getStoreProducts({ categoryId, limit: 50 });
  return items;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = await getCategory(slug);

  if (!category) notFound();

  const products = await getCategoryProducts(category.id);

  return (
    <>
      {/* Hero with category image */}
      <section className="relative overflow-hidden bg-muted/50">
        <div className="absolute inset-0">
          {category.image?.url && (
            <ProductImage
              image={category.image}
              alt={category.name}
              objectFit="cover"
              sizes="100vw"
              className="size-full opacity-40"
            />
          )}
          <div
            className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background"
            aria-hidden
          />
        </div>
        <StoreContainer className="relative py-10 sm:py-12">
          <Breadcrumb className="mb-4">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/categories">Categories</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{category.name}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            {category.name}
          </h1>
          {category.description && (
            <p className="text-muted-foreground mt-2 max-w-2xl text-sm sm:text-base">
              {category.description}
            </p>
          )}
          <p className="text-muted-foreground mt-1 text-sm">
            {products.length} {products.length === 1 ? "product" : "products"}
          </p>
        </StoreContainer>
      </section>

      <StoreSection>
        <StoreContainer>
          <ProductGrid
            products={products}
            emptyTitle={`No products in ${category.name}`}
            emptyDescription="Check back later for new arrivals."
          />
        </StoreContainer>
      </StoreSection>
    </>
  );
}
