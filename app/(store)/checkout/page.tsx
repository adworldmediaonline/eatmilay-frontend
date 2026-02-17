import { CheckoutForm } from "@/components/store/checkout-form";
import { StoreContainer, StoreSection } from "@/components/store/store-layout";

export default function CheckoutPage() {
  return (
    <StoreSection>
      <StoreContainer size="narrow">
        <h1 className="mb-6 text-2xl font-bold sm:text-3xl">Checkout</h1>
        <CheckoutForm />
      </StoreContainer>
    </StoreSection>
  );
}
