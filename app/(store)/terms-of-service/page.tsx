import { StoreContainer, StoreSection } from "@/components/store/store-layout";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | Eat Milay",
  description: "Terms and conditions for using the Eat Milay website and services.",
};

export default function TermsOfServicePage() {
  return (
    <StoreSection>
      <StoreContainer size="narrow">
        <article className="space-y-6 text-foreground [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:sm:text-3xl [&_h2]:mt-8 [&_h2]:text-lg [&_h2]:font-semibold [&_h3]:mt-6 [&_h3]:text-base [&_h3]:font-semibold [&_p]:text-muted-foreground [&_p]:leading-relaxed [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1 [&_ul]:text-muted-foreground [&_li]:leading-relaxed [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2">
          <h1 className="text-2xl font-bold sm:text-3xl">Terms of Service</h1>

          <h2>Overview</h2>
          <p>
            This website is operated by Eat Milay. Throughout the site, the terms &quot;we&quot;, &quot;us&quot;, and &quot;our&quot; refer to Eat Milay. Eat Milay offers this website, including all information, tools, and services to you, the user, conditioned upon your acceptance of these terms.
          </p>
          <p>
            By visiting our site or purchasing from us, you agree to be bound by these Terms of Service. If you do not agree, you may not access the website or use any services. We reserve the right to update these terms at any time. Your continued use of the site following changes constitutes acceptance.
          </p>

          <h2>Online Store Terms</h2>
          <p>
            We reserve the right to refuse service to anyone for any reason at any time.
          </p>
          <p>
            You agree not to use our products for any illegal or unauthorized purpose. You must not transmit any harmful code. A breach of these terms will result in immediate termination of your access.
          </p>

          <h2>Accuracy of Information</h2>
          <p>
            We are not responsible if information on this site is inaccurate, incomplete, or outdated. The material is provided for general information only. We reserve the right to modify the contents of this site at any time, but we have no obligation to update information.
          </p>

          <h2>Modifications to Service and Prices</h2>
          <p>
            Prices are subject to change without notice. We reserve the right to modify or discontinue the service at any time. We shall not be liable for any modification, price change, suspension, or discontinuance.
          </p>

          <h2>Products and Services</h2>
          <p>
            Certain products may be available exclusively online. Products are subject to return or exchange only according to our{" "}
            <Link href="/refund-policy" className="text-primary underline">
              Refund Policy
            </Link>
            . We reserve the right to limit the sales of our products to any person, geographic region, or jurisdiction. We do not warrant that the quality of any products will meet your expectations.
          </p>

          <h2>Billing and Account Information</h2>
          <p>
            We reserve the right to refuse any order. You agree to provide current, complete, and accurate purchase and account information. For more details, see our{" "}
            <Link href="/refund-policy" className="text-primary underline">
              Refund Policy
            </Link>
            .
          </p>

          <h2>Personal Information</h2>
          <p>
            Your submission of personal information is governed by our{" "}
            <Link href="/privacy-policy" className="text-primary underline">
              Privacy Policy
            </Link>
            .
          </p>

          <h2>Prohibited Uses</h2>
          <p>
            You are prohibited from using the site: for any unlawful purpose; to violate any laws; to infringe upon intellectual property rights; to harass, abuse, or discriminate; to submit false information; to upload viruses or malicious code; to spam or scrape; or to interfere with the security of the service. We reserve the right to terminate your use for violating any prohibited uses.
          </p>

          <h2>Disclaimer of Warranties</h2>
          <p>
            We do not guarantee that your use of our service will be uninterrupted, timely, secure, or error-free. The service is provided &quot;as is&quot; and &quot;as available&quot; without warranties of any kind. Your use of the service is at your sole risk.
          </p>

          <h2>Limitation of Liability</h2>
          <p>
            Eat Milay shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the service or any products, including lost profits, lost revenue, or loss of data.
          </p>

          <h2>Indemnification</h2>
          <p>
            You agree to indemnify and hold harmless Eat Milay from any claims, demands, or damages arising from your breach of these terms or your violation of any law or third-party rights.
          </p>

          <h2>Governing Law</h2>
          <p>
            These Terms of Service shall be governed by and construed in accordance with the laws of India.
          </p>

          <h2>Contact</h2>
          <p>
            Questions about these Terms of Service should be sent to{" "}
            <a href="mailto:customercare@eatmilay.com" className="text-primary underline">
              customercare@eatmilay.com
            </a>
            .
          </p>

          <h2>Discount Codes</h2>
          <p>
            Discount codes may be subject to terms and conditions. Codes are typically for single use unless otherwise stated. They are non-transferable and hold no cash value. We reserve the right to amend or terminate discount codes at any time. Abuse of codes may result in account suspension.
          </p>

          <p className="text-muted-foreground text-sm mt-8">
            For questions, contact us at{" "}
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
