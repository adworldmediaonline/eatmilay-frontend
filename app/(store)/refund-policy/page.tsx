import { StoreContainer, StoreSection } from "@/components/store/store-layout";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refund Policy | Eat Milay",
  description: "Eat Milay refund, cancellation, and return policy.",
};

export default function RefundPolicyPage() {
  return (
    <StoreSection>
      <StoreContainer size="narrow">
        <article className="space-y-6 text-foreground [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:sm:text-3xl [&_h2]:mt-8 [&_h2]:text-lg [&_h2]:font-semibold [&_h3]:mt-6 [&_h3]:text-base [&_h3]:font-semibold [&_p]:text-muted-foreground [&_p]:leading-relaxed [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1 [&_ul]:text-muted-foreground [&_li]:leading-relaxed [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2">
          <h1 className="text-2xl font-bold sm:text-3xl">Refund Policy</h1>

          <h2>Cancellation</h2>
          <p>
            Once you place an order and complete payment online, we dispatch products within 24 hours. To cancel your order, you must do so within 24 hours of placing it. If you cancel after 24 hours, or if the product has already left our warehouse, cancellation is not possible.
          </p>
          <p>
            To cancel, email us at{" "}
            <a href="mailto:customercare@eatmilay.com" className="text-primary underline">
              customercare@eatmilay.com
            </a>
            .
          </p>

          <h2>Refunds</h2>
          <p>
            If your order is eligible for cancellation and is cancelled, the amount will be refunded using the same payment method. Refunds typically take 7–10 working days to appear in your account.
          </p>

          <h2>COD Partial Refunds</h2>
          <p>
            For Cash on Delivery orders: if you cancel before dispatch, you may receive a partial refund. If the order has been dispatched and more than one hour has passed since placement, a non-refundable deduction of ₹100 may apply to cover processing and dispatch costs.
          </p>

          <h2>Returns</h2>
          <p>
            If your product arrives damaged, notify us at{" "}
            <a href="mailto:customercare@eatmilay.com" className="text-primary underline">
              customercare@eatmilay.com
            </a>{" "}
            within 2 days of delivery. We accept returns only for damaged items within this period. Once approved, we will provide instructions for the return process.
          </p>
          <p>
            Returns are accepted solely for damaged items within 2 days of delivery. For any questions, contact our support team.
          </p>

          <p className="text-muted-foreground text-sm mt-8">
            For refund or return inquiries, contact us at{" "}
            <a href="mailto:customercare@eatmilay.com" className="text-primary underline">
              customercare@eatmilay.com
            </a>
            .
          </p>
        </article>
      </StoreContainer>
    </StoreSection>
  );
}
