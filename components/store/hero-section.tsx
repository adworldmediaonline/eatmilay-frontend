import Link from "next/link";
import { Button } from "@/components/ui/button";
import { StoreContainer } from "./store-layout";
import { BRAND } from "@/lib/brand";
import { ArrowRightIcon, LayoutGridIcon } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      {/* Background: subtle gradient + geometric accent */}
      <div
        className="absolute inset-0 -z-10"
        aria-hidden
      >
        <div className="absolute inset-0 bg-gradient-to-b from-muted/50 via-background to-background" />
        <div
          className="absolute -right-40 -top-40 size-80 rounded-full bg-muted/30 blur-3xl"
          aria-hidden
        />
        <div
          className="absolute -left-20 top-1/2 size-60 rounded-full bg-muted/20 blur-3xl"
          aria-hidden
        />
      </div>

      <StoreContainer>
        <div className="flex flex-col items-center px-2 py-8 text-center sm:py-10 md:py-12">
          {/* Badge / eyebrow */}
          <p className="text-muted-foreground mb-2 text-xs font-medium uppercase tracking-[0.2em] animate-in fade-in slide-in-from-bottom-4 duration-500">
            Welcome to {BRAND.name}
          </p>

          {/* Headline */}
          <h1 className="max-w-4xl text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl animate-in fade-in slide-in-from-bottom-4 duration-700">
            {BRAND.tagline}
            <br />
            <span className="text-muted-foreground">curated for you</span>
          </h1>

          {/* Subheadline */}
          <p className="text-muted-foreground mx-auto mt-3 max-w-2xl text-sm leading-relaxed sm:text-base animate-in fade-in slide-in-from-bottom-4 duration-700">
            Browse our handpicked selection. Find what you need, from everyday
            essentials to special finds.
          </p>

          {/* CTAs */}
          <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center sm:gap-3 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Button asChild size="sm" className="min-h-10 gap-2 px-6 text-sm">
              <Link href="/products">
                Shop all products
                <ArrowRightIcon className="size-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="sm"
              className="min-h-10 gap-2 px-6 text-sm"
            >
              <Link href="/categories">
                <LayoutGridIcon className="size-4" />
                Browse categories
              </Link>
            </Button>
          </div>

          {/* Quick links */}
          <div className="mt-4 flex flex-wrap justify-center gap-2 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Link
              href="/categories"
              className="text-muted-foreground hover:text-foreground rounded-full border border-border/80 bg-background/80 px-4 py-2 text-sm font-medium transition-colors hover:border-border hover:bg-muted/50"
            >
              Categories
            </Link>
            <Link
              href="/collections"
              className="text-muted-foreground hover:text-foreground rounded-full border border-border/80 bg-background/80 px-4 py-2 text-sm font-medium transition-colors hover:border-border hover:bg-muted/50"
            >
              Collections
            </Link>
          </div>
        </div>
      </StoreContainer>
    </section>
  );
}
