import Link from "next/link";
import { headers } from "next/headers";
import { Button } from "@/components/ui/button";
import { StoreContainer, StoreSection } from "@/components/store/store-layout";

async function getSession() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3005";
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

type ConfirmationPageProps = {
  searchParams: Promise<{ order?: string }>;
};

export default async function CheckoutConfirmationPage({
  searchParams,
}: ConfirmationPageProps) {
  const params = await searchParams;
  const orderNumber = params.order ?? "your order";
  const session = await getSession();
  const trackOrderHref =
    session?.user && orderNumber !== "your order"
      ? `/dashboard/orders/${encodeURIComponent(orderNumber)}`
      : "/track-order";

  return (
    <StoreSection>
      <StoreContainer size="compact" className="text-center">
        <h1 className="text-2xl font-bold">Thank you for your order</h1>
        <p className="text-muted-foreground mt-2">
          Order <strong>{orderNumber}</strong> has been placed successfully.
        </p>
        <p className="text-muted-foreground mt-1 text-sm">
          You will receive an email confirmation shortly.
        </p>
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Button asChild size="lg">
            <Link href={trackOrderHref}>Track your order</Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/products">Continue shopping</Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/">Back to home</Link>
          </Button>
        </div>
      </StoreContainer>
    </StoreSection>
  );
}
