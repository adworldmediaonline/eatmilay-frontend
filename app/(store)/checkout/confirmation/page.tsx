import Link from "next/link";
import { Button } from "@/components/ui/button";
import { StoreContainer, StoreSection } from "@/components/store/store-layout";

type ConfirmationPageProps = {
  searchParams: Promise<{ order?: string }>;
};

export default async function CheckoutConfirmationPage({
  searchParams,
}: ConfirmationPageProps) {
  const params = await searchParams;
  const orderNumber = params.order ?? "your order";

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
