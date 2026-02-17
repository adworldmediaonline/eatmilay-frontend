export type ProductImage = {
  url: string;
  publicId: string;
  filename?: string;
  title?: string;
  alt?: string;
};

export type ProductOption = { name: string; values: string[] };

export type VolumeTier = {
  minQuantity: number;
  maxQuantity?: number | null;
  price: number;
  compareAtPrice?: number | null;
  label?: "most_popular" | "best_seller" | "super_saver" | null;
};

export type ProductVariant = {
  optionValues: string[];
  sku?: string;
  price: number;
  compareAtPrice?: number | null;
  label?: "most_popular" | null;
  volumeTiers?: VolumeTier[];
  stockQuantity?: number;
  lowStockThreshold?: number | null;
  allowBackorder?: boolean;
};

export type BundleItem = {
  productId: string;
  quantity: number;
  priceOverride?: number | null;
  productName?: string;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  nutrients?: string;
  benefits?: string;
  shortDescription: string;
  categoryId: string | null;
  categoryName: string | null;
  categorySlug?: string | null;
  price: number;
  compareAtPrice: number | null;
  images: ProductImage[];
  sku: string | null;
  tags: string[];
  metaTitle?: string | null;
  metaDescription?: string | null;
  metaKeywords?: string | null;
  currency: string;
  vendor: string | null;
  productType: "simple" | "variable" | "bundle";
  options: ProductOption[];
  variants: ProductVariant[];
  bundleItems: BundleItem[];
  bundlePricing: "fixed" | "sum" | "discounted" | null;
  bundlePrice: number | null;
  bundleDiscountPercent: number | null;
  trackInventory?: boolean;
  stockQuantity?: number;
  lowStockThreshold?: number | null;
  allowBackorder?: boolean;
  relatedProductIds?: string[];
  relatedProducts?: Array<{
    id: string;
    slug: string;
    name: string;
    price: number;
    image: { url: string } | null;
  }>;
  volumeTiers: VolumeTier[];
};

export type ProductCategory = {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: ProductImage | null;
  createdAt?: string;
  updatedAt?: string;
};

export type ProductCollection = {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: ProductImage | null;
  productIds: string[];
  productCount?: number;
  createdAt?: string;
  updatedAt?: string;
};

export type OrderItem = {
  productId: string;
  productName: string;
  variantIndex?: number;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
};

export type CartItem = {
  productId: string;
  productName: string;
  productSlug: string;
  variantIndex?: number;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  image?: ProductImage | null;
};
