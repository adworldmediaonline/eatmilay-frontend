import { StoreContainer, StoreSection } from "@/components/store/store-layout";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Eat Milay",
  description: "How Eat Milay collects, uses, and protects your personal information.",
};

export default function PrivacyPolicyPage() {
  return (
    <StoreSection>
      <StoreContainer size="narrow">
        <article className="space-y-6 text-foreground [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:sm:text-3xl [&_h2]:mt-8 [&_h2]:text-lg [&_h2]:font-semibold [&_h3]:mt-6 [&_h3]:text-base [&_h3]:font-semibold [&_p]:text-muted-foreground [&_p]:leading-relaxed [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1 [&_ul]:text-muted-foreground [&_li]:leading-relaxed [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2">
          <h1 className="text-2xl font-bold sm:text-3xl">Privacy Policy</h1>

          <p>
            This Privacy Policy describes how Eat Milay (the &quot;Site&quot; or &quot;we&quot;) collects, uses, and discloses your Personal Information when you visit or make a purchase from the Site.
          </p>

          <h2>Contact</h2>
          <p>
            If you have questions about this policy or wish to make a complaint, contact us at{" "}
            <a href="mailto:customercare@eatmilay.com" className="text-primary underline">
              customercare@eatmilay.com
            </a>
            .
          </p>

          <h2>Collecting Personal Information</h2>
          <p>
            When you visit the Site, we collect information about your device, how you interact with the Site, and information needed to process purchases. We may collect additional information if you contact us for support. We refer to any information about an identifiable individual as &quot;Personal Information.&quot;
          </p>

          <h3>Device Information</h3>
          <ul>
            <li><strong>Purpose:</strong> To load the Site correctly and improve your experience.</li>
            <li><strong>Source:</strong> Collected automatically via cookies, log files, and similar technologies.</li>
            <li><strong>Collected:</strong> Browser version, IP address, time zone, cookie data, pages and products viewed, search terms, and how you interact with the Site.</li>
          </ul>

          <h3>Order Information</h3>
          <ul>
            <li><strong>Purpose:</strong> To fulfill orders, process payments, arrange shipping, send confirmations, communicate with you, and screen for fraud.</li>
            <li><strong>Source:</strong> Provided by you at checkout.</li>
            <li><strong>Collected:</strong> Name, billing address, shipping address, payment information, email address, and phone number.</li>
          </ul>

          <h3>Customer Support Information</h3>
          <p>
            We collect information you provide when contacting us for support via the website or other channels.
          </p>

          <h2>Sharing Personal Information</h2>
          <p>
            We share your Personal Information with service providers who help us operate the Site and fulfill orders—including payment processors and logistics partners. We may also share information when required by law or to protect our rights.
          </p>

          <h2>Using Personal Information</h2>
          <p>
            We use your Personal Information to provide our services: selling products, processing payments, shipping orders, and keeping you informed about new products and offers.
          </p>

          <h2>Retention</h2>
          <p>
            We retain your Personal Information for our records unless you ask us to delete it. For more on your rights, see the &quot;Your rights&quot; section below.
          </p>

          <h2>Cookies</h2>
          <p>
            A cookie is a small file stored on your device when you visit our Site. We use cookies to remember your preferences, improve your experience, and understand how the Site is used. You can control cookies through your browser settings. Blocking cookies may affect how the Site works.
          </p>

          <h2>Changes</h2>
          <p>
            We may update this Privacy Policy from time to time. Changes will be posted on this page.
          </p>

          <h2>Complaints</h2>
          <p>
            If you are not satisfied with our response to a complaint, you may contact your local data protection authority.
          </p>

          <p className="text-muted-foreground text-sm mt-8">
            Questions? Contact us at{" "}
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
