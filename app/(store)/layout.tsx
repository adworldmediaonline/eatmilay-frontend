import { CartProvider } from "@/components/store/cart-provider";
import { StoreHeader } from "@/components/store/store-header";
import { StoreFooter } from "@/components/store/store-footer";
import { PromoBanner } from "@/components/store/promo-banner";
import { ReferralTracker } from "@/components/store/referral-tracker";

async function getSession() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3005";
    const { headers } = await import("next/headers");
    const headersList = await headers();
    const cookie = headersList.get("cookie") ?? "";

    const res = await fetch(`${baseUrl}/api/me`, {
      headers: cookie ? { cookie } : {},
      cache: "no-store",
    });

    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  return (
    <CartProvider>
      <ReferralTracker />
      <div className="flex min-h-svh flex-col">
        <PromoBanner />
        <StoreHeader user={session?.user} />
        <main className="flex-1">{children}</main>
        <StoreFooter />
      </div>
    </CartProvider>
  );
}
