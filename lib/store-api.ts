import type {
  Product,
  ProductCategory,
  ProductCollection,
  OrderItem,
} from "./store-types";

const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3005";

export async function getStoreProducts(params?: {
  categoryId?: string;
  collectionId?: string;
  limit?: number;
  offset?: number;
}): Promise<Product[]> {
  const search = new URLSearchParams();
  if (params?.categoryId) search.set("categoryId", params.categoryId);
  if (params?.collectionId) search.set("collectionId", params.collectionId);
  if (params?.limit) search.set("limit", String(params.limit));
  if (params?.offset) search.set("offset", String(params.offset));
  const query = search.toString();
  const url = `${apiUrl}/api/store/products${query ? `?${query}` : ""}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
}

export async function getStoreProductBySlug(slug: string): Promise<Product> {
  const res = await fetch(`${apiUrl}/api/store/products/slug/${encodeURIComponent(slug)}`);
  if (!res.ok) {
    if (res.status === 404) throw new Error("Product not found");
    throw new Error("Failed to fetch product");
  }
  return res.json();
}

export async function getStoreCategories(): Promise<ProductCategory[]> {
  const res = await fetch(`${apiUrl}/api/store/product-categories`);
  if (!res.ok) throw new Error("Failed to fetch categories");
  return res.json();
}

export async function getStoreCategoryBySlug(
  slug: string
): Promise<ProductCategory> {
  const res = await fetch(
    `${apiUrl}/api/store/product-categories/slug/${encodeURIComponent(slug)}`
  );
  if (!res.ok) {
    if (res.status === 404) throw new Error("Category not found");
    throw new Error("Failed to fetch category");
  }
  return res.json();
}

export async function getStoreCollections(): Promise<ProductCollection[]> {
  const res = await fetch(`${apiUrl}/api/store/product-collections`);
  if (!res.ok) throw new Error("Failed to fetch collections");
  return res.json();
}

export async function getStoreCollectionBySlug(
  slug: string
): Promise<ProductCollection> {
  const res = await fetch(
    `${apiUrl}/api/store/product-collections/slug/${encodeURIComponent(slug)}`
  );
  if (!res.ok) {
    if (res.status === 404) throw new Error("Collection not found");
    throw new Error("Failed to fetch collection");
  }
  return res.json();
}

export type ValidateDiscountResult =
  | { valid: true; discountAmount: number; message?: string }
  | { valid: false; message: string };

export async function validateStoreDiscount(
  code: string,
  subtotal: number,
  items: Array<{ productId: string; quantity: number; unitPrice: number }>
): Promise<ValidateDiscountResult> {
  const res = await fetch(`${apiUrl}/api/store/discounts/validate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code, subtotal, items }),
  });
  const data = await res.json();
  if (!res.ok) {
    return { valid: false, message: data.message ?? "Failed to validate coupon" };
  }
  return data;
}

export type ShippingAddress = {
  fullName: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
};

export type ShippingCourier = {
  courier_company_id: number;
  courier_name: string;
  rate: number;
  estimated_delivery_days: number;
  etd: string;
  company_name: string;
};

export type ShippingRatesResponse = {
  available_courier_companies: ShippingCourier[];
  recommended_courier_company_id: number;
};

export type CreateOrderPayload = {
  customerEmail: string;
  customerName?: string | null;
  customerId?: string | null;
  items: OrderItem[];
  subtotal: number;
  discountAmount?: number;
  total: number;
  currency?: string;
  couponCode?: string | null;
  notes?: string | null;
  shippingAddress: ShippingAddress;
  paymentMethod: "razorpay" | "cod";
  shippingAmount: number;
  courierId?: number;
  courierName?: string;
  estimatedDelivery?: string;
};

export type CreateOrderResult = {
  id: string;
  orderNumber: string;
  total: number;
  razorpayOrderId?: string;
  paymentMethod: string;
  paymentStatus: string;
  items: OrderItem[];
};

export type VerifyPaymentResult = {
  success: boolean;
  orderId: string;
  orderNumber: string;
};

export async function getShippingRates(params: {
  pickup_postcode: string;
  delivery_postcode: string;
  cod?: boolean;
  weight?: string;
  length?: number;
  breadth?: number;
  height?: number;
}): Promise<ShippingRatesResponse> {
  const search = new URLSearchParams({
    pickup_postcode: params.pickup_postcode,
    delivery_postcode: params.delivery_postcode,
  });
  if (params.cod !== undefined) search.set("cod", params.cod ? "1" : "0");
  if (params.weight) search.set("weight", params.weight);
  if (params.length != null) search.set("length", String(params.length));
  if (params.breadth != null) search.set("breadth", String(params.breadth));
  if (params.height != null) search.set("height", String(params.height));
  const res = await fetch(`${apiUrl}/api/store/shipping/rates?${search.toString()}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? "Failed to fetch shipping rates");
  return data;
}

export async function createStoreOrder(
  payload: CreateOrderPayload
): Promise<CreateOrderResult> {
  const res = await fetch(`${apiUrl}/api/store/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error ?? "Failed to create order");
  }
  return data;
}

export async function verifyPayment(payload: {
  orderId: string;
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}): Promise<VerifyPaymentResult> {
  const res = await fetch(`${apiUrl}/api/store/payments/verify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? "Payment verification failed");
  return data;
}
