import { notFound } from "next/navigation";
import { connection } from "next/server";
import { StoreContainer, StoreSection } from "@/components/store/store-layout";
import {
  getStoreCategoryBySlug,
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
  return getStoreProducts({ categoryId, limit: 50 });
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = await getCategory(slug);

  if (!category) notFound();

  const products = await getCategoryProducts(category.id);

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
              <BreadcrumbLink href="/categories">Categories</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{category.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="mb-6">
          <h1 className="text-2xl font-bold">{category.name}</h1>
          {category.description && (
            <p className="text-muted-foreground mt-1">{category.description}</p>
          )}
        </div>

        <ProductGrid
          products={products}
          emptyTitle={`No products in ${category.name}`}
          emptyDescription="Check back later for new arrivals."
        />
      </StoreContainer>
    </StoreSection>
  );
}
