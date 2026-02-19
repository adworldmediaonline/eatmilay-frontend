import Link from "next/link";
import { StoreContainer } from "./store-layout";
import { BRAND } from "@/lib/brand";

const navLinks = [
  { href: "/products", label: "Products" },
  { href: "/categories", label: "Categories" },
  { href: "/collections", label: "Collections" },
  { href: "/track-order", label: "Track order" },
];

const policyLinks = [
  { href: "/shipping-policy", label: "Shipping Policy" },
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/refund-policy", label: "Refund Policy" },
  { href: "/terms-of-service", label: "Terms of Service" },
];

export function StoreFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-border/60 bg-muted/30">
      <StoreContainer>
        <div className="flex flex-col gap-8 py-10 sm:py-12 lg:flex-row lg:items-center lg:justify-between lg:gap-12">
          <div className="flex flex-col gap-4">
            <Link
              href="/"
              className="text-lg font-bold tracking-tight text-foreground transition-opacity hover:opacity-80"
            >
              {BRAND.name}
            </Link>
            <p className="text-muted-foreground max-w-sm text-sm">
              {BRAND.tagline}
            </p>
          </div>

          <div className="flex flex-col gap-6 sm:flex-row sm:flex-wrap sm:gap-8">
            <nav className="flex flex-wrap gap-6 sm:gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-muted-foreground text-sm font-medium transition-colors hover:text-foreground"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <nav className="flex flex-wrap gap-6 sm:gap-8">
              {policyLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-muted-foreground text-sm font-medium transition-colors hover:text-foreground"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        <div className="border-t border-border/60 py-6">
          <p className="text-muted-foreground text-center text-xs sm:text-left">
            © {year} {BRAND.name}. All rights reserved.
          </p>
        </div>
      </StoreContainer>
    </footer>
  );
}
