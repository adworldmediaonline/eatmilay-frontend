import { CartProvider } from "@/components/store/cart-provider";
import { StoreHeader } from "@/components/store/store-header";
import { StoreFooter } from "@/components/store/store-footer";

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

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  return (
    <CartProvider>
      <div className="flex min-h-svh flex-col">
        <StoreHeader user={session?.user} />
        <main className="flex flex-1 flex-col items-center justify-center bg-muted/30 px-4 py-6">
          <div className="w-full max-w-sm">{children}</div>
        </main>
        <StoreFooter />
      </div>
    </CartProvider>
  );
}
