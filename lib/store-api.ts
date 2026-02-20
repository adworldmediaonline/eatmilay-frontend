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

export type OrderTrackingResult = {
  orderNumber: string;
  status: string;
  trackingNumber: string | null;
  trackingUrl: string | null;
  courierName: string | null;
  estimatedDelivery: string | null;
  shiprocketError: string | null;
};

export type UserOrder = {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  currency: string;
  itemCount: number;
  createdAt: string;
  trackingNumber: string | null;
  trackingUrl: string | null;
  courierName: string | null;
  estimatedDelivery: string | null;
};

export type GetUserOrdersResponse = {
  items: UserOrder[];
  total: number;
};

export async function getUserOrderByNumber(orderNumber: string): Promise<{
  id: string;
  orderNumber: string;
  status: string;
  paymentMethod: string | null;
  paymentStatus: string | null;
  subtotal: number;
  discountAmount: number;
  shippingAmount: number;
  couponCode: string | null;
  total: number;
  currency: string;
  items: OrderItem[];
  notes: string | null;
  createdAt: string;
  trackingNumber: string | null;
  trackingUrl: string | null;
  courierName: string | null;
  estimatedDelivery: string | null;
  shippingAddress: Record<string, unknown> | null;
}> {
  const res = await fetch(
    `${apiUrl}/api/store/user/orders/by-number/${encodeURIComponent(orderNumber)}`,
    { credentials: "include" }
  );
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error ?? "Failed to fetch order");
  return data;
}

export async function getUserOrders(params?: {
  limit?: number;
  offset?: number;
}): Promise<GetUserOrdersResponse> {
  const search = new URLSearchParams();
  if (params?.limit != null) search.set("limit", String(params.limit));
  if (params?.offset != null) search.set("offset", String(params.offset));
  const query = search.toString();
  const res = await fetch(`${apiUrl}/api/store/user/orders${query ? `?${query}` : ""}`, {
    credentials: "include",
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error ?? "Failed to fetch orders");
  return data;
}

export async function getOrderTracking(
  orderNumber: string,
  email: string
): Promise<OrderTrackingResult> {
  const params = new URLSearchParams({
    orderNumber: orderNumber.trim(),
    email: email.trim(),
  });
  const res = await fetch(`${apiUrl}/api/store/orders/track?${params}`);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error ?? "Failed to fetch tracking");
  }
  return data;
}

export type AvailableOffer = {
  code: string;
  type: "percentage" | "fixed";
  value: number;
  minOrderAmount: number | null;
  discountAmount: number;
  description: string;
  allowAutoApply?: boolean;
  createdAt?: string | null;
  locked?: boolean;
  gapAmount?: number;
  expiresAt?: string | null;
  usesLeft?: number | null;
};

export type CouponBehaviorSettings = {
  autoApply: boolean;
  autoApplyStrategy: "best_savings" | "first_created" | "highest_percentage" | "customer_choice";
  showToastOnApply: boolean;
};

export type FeaturedOffer = { code: string; description: string } | null;

export type ProductDiscount = {
  code: string;
  value: number;
  type: "percentage" | "fixed";
  description: string;
};

export async function getDiscountsForProducts(
  productIds: string[]
): Promise<Record<string, ProductDiscount>> {
  if (productIds.length === 0) return {};
  const res = await fetch(`${apiUrl}/api/store/discounts/for-products`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ productIds }),
    cache: "no-store",
  });
  if (!res.ok) return {};
  const data = await res.json();
  return typeof data === "object" && data !== null ? data : {};
}

export async function getFeaturedOffer(): Promise<FeaturedOffer> {
  const res = await fetch(`${apiUrl}/api/store/discounts/featured`, {
    cache: "no-store",
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data;
}

export type ShippingSettings = {
  freeShippingThreshold: number | null;
};

export async function getStoreShippingSettings(): Promise<ShippingSettings> {
  const res = await fetch(`${apiUrl}/api/store/settings/shipping`, {
    cache: "no-store",
  });
  if (!res.ok) return { freeShippingThreshold: null };
  return res.json();
}

export async function getStoreCouponSettings(): Promise<CouponBehaviorSettings> {
  const res = await fetch(`${apiUrl}/api/store/settings/coupon`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch coupon settings");
  return res.json();
}

export async function getAvailableOffers(
  subtotal: number,
  items: Array<{ productId: string; quantity: number; unitPrice: number }>,
  options?: { customerEmail?: string; customerReferralCode?: string }
): Promise<AvailableOffer[]> {
  const res = await fetch(`${apiUrl}/api/store/discounts/available`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      subtotal,
      items,
      customerEmail: options?.customerEmail ?? undefined,
      customerReferralCode: options?.customerReferralCode ?? undefined,
    }),
    cache: "no-store",
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error ?? "Failed to fetch offers");
  }
  return Array.isArray(data) ? data : [];
}

export type ValidateDiscountResult =
  | { valid: true; discountAmount: number; message?: string }
  | { valid: false; message: string };

export async function validateStoreDiscount(
  code: string,
  subtotal: number,
  items: Array<{ productId: string; quantity: number; unitPrice: number }>,
  options?: { customerEmail?: string; customerReferralCode?: string }
): Promise<ValidateDiscountResult> {
  const res = await fetch(`${apiUrl}/api/store/discounts/validate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      code,
      subtotal,
      items,
      customerEmail: options?.customerEmail ?? undefined,
      customerReferralCode: options?.customerReferralCode ?? undefined,
    }),
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
  customerReferralCode?: string | null;
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
    const message =
      data.error === "COUPON_INVALID"
        ? (data.message ?? data.error ?? "Failed to create order")
        : (data.error ?? "Failed to create order");
    const err = new Error(message) as Error & { code?: string };
    err.code = data.error;
    throw err;
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
