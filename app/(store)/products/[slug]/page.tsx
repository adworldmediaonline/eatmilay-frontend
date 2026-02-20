import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { connection } from "next/server";
import { StoreContainer, StoreSection } from "@/components/store/store-layout";
import { ProductReviews } from "@/components/store/product-reviews";
import { getStoreProductBySlug } from "@/lib/store-api";
import { ProductDetailClient } from "./product-detail-client";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

async function getProduct(slug: string) {
  await connection();
  try {
    return await getStoreProductBySlug(slug);
  } catch {
    return null;
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) notFound();

  const images = product.images ?? [];
  const mainImage = images[0];

  return (
    <StoreSection className="overflow-x-hidden">
      <StoreContainer className="min-w-0">
        <Breadcrumb className="mb-4 sm:mb-6">
          <BreadcrumbList className="min-w-0 flex-wrap">
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/products">Products</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{product.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="min-w-0 overflow-hidden rounded-xl border border-border/80 bg-card shadow-md">
          <div className="grid min-w-0 grid-cols-1 gap-4 p-4 sm:gap-6 sm:p-6 md:grid-cols-2 md:gap-10 md:p-10">
            <div className="min-w-0 space-y-4">
              <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
                {mainImage?.url ? (
                  <Image
                    src={mainImage.url}
                    alt={mainImage.alt ?? mainImage.title ?? product.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                  />
                ) : (
                  <div className="flex aspect-square items-center justify-center text-muted-foreground">
                    <span className="text-sm">No image</span>
                  </div>
                )}
              </div>
              {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {images.map((img, idx) => (
                    <div
                      key={img.publicId}
                      className="relative size-16 shrink-0 overflow-hidden rounded-md border-2 border-transparent"
                    >
                      <Image
                        src={img.url}
                        alt={img.alt ?? img.title ?? `${product.name} ${idx + 1}`}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex min-w-0 flex-col">
              {product.categoryName && (product.categorySlug ?? product.categoryId) && (
                <Link
                  href={
                    product.categorySlug
                      ? `/categories/${product.categorySlug}`
                      : `/products?category=${product.categoryId}`
                  }
                  className="text-muted-foreground mb-1 text-sm font-medium uppercase tracking-wider hover:underline"
                >
                  {product.categoryName}
                </Link>
              )}
              <h1 className="wrap-break-word text-xl font-semibold tracking-tight sm:text-2xl md:text-3xl">
                {product.name}
              </h1>
              {product.shortDescription && (
                <p className="text-muted-foreground mt-3 text-sm">
                  {product.shortDescription}
                </p>
              )}
              <ProductDetailClient product={product} />
            </div>
          </div>
        </div>

        <ProductReviews productId={product.id} />
      </StoreContainer>
    </StoreSection>
  );
}
