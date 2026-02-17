import { StoreContainer, StoreSection } from "@/components/store/store-layout";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shipping Policy | Eat Milay",
  description: "Eat Milay shipping and delivery policy. Free delivery across India on orders above Rs. 699.",
};

export default function ShippingPolicyPage() {
  return (
    <StoreSection>
      <StoreContainer size="narrow">
        <article className="space-y-6 text-foreground [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:sm:text-3xl [&_h2]:mt-8 [&_h2]:text-lg [&_h2]:font-semibold [&_h3]:mt-6 [&_h3]:text-base [&_h3]:font-semibold [&_p]:text-muted-foreground [&_p]:leading-relaxed [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1 [&_ul]:text-muted-foreground [&_li]:leading-relaxed [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2">
          <h1 className="text-2xl font-bold sm:text-3xl">Shipping Policy</h1>

          <p className="text-muted-foreground lead">
            Free delivery across India on orders above Rs. 699.
          </p>

          <h2>Dispatch and Processing</h2>
          <p>
            We ship 100% of orders within one business day. Orders placed on weekends are dispatched on the following Monday.
          </p>

          <h2>Delivery Times</h2>
          <p>
            <strong>Standard shipping:</strong> Orders placed before 12pm typically arrive within 5–7 working days across India. Local deliveries may arrive the same day or next day.
          </p>
          <p>
            Orders placed on Saturdays, Sundays, or public holidays are processed on the next working day. Working days exclude Sundays and public holidays.
          </p>

          <h2>Processing Delays</h2>
          <p>
            If we cannot process your order due to inaccurate or incomplete payment details, processing may be delayed by up to 2 business days. Orders containing out-of-stock items may take an additional 7–15 business days to process and ship.
          </p>

          <h2>Address Accuracy</h2>
          <p>
            If your package is returned to us due to an incorrect or incomplete address, you will be responsible for all delivery costs to reship to the corrected address. We are not liable for loss of orders when the address provided at checkout is incomplete or incorrect.
          </p>

          <h2>Damaged Parcels</h2>
          <p>
            If you receive a damaged parcel, we will arrange a refund or ship a replacement. Please contact us at{" "}
            <a href="mailto:customercare@eatmilay.com" className="text-primary underline">
              customercare@eatmilay.com
            </a>{" "}
            with details and photos.
          </p>

          <h2>Delayed Parcels</h2>
          <p>
            We cannot be held responsible for delays caused by the courier. Customers are asked to wait until the parcel is delivered. You can track your shipment using the link provided in your notification.
          </p>

          <h2>Shipment Notifications</h2>
          <p>
            Once your order has shipped, you will receive a notification via WhatsApp or SMS containing tracking information and a link to track your package online.
          </p>

          <p className="text-muted-foreground text-sm mt-8">
            For questions about shipping, contact us at{" "}
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
