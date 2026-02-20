"use client";

import { useState, useEffect } from "react";
import { XIcon } from "lucide-react";
import { getFeaturedOffer } from "@/lib/store-api";
import { Button } from "@/components/ui/button";

const PROMO_DISMISSED_KEY = "store-promo-dismissed";

export function PromoBanner() {
  const [offer, setOffer] = useState<{ code: string; description: string } | null>(null);
  const [dismissed, setDismissed] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const dismissedVal = localStorage.getItem(PROMO_DISMISSED_KEY);
    if (dismissedVal === "1") {
      setDismissed(true);
      return;
    }
    getFeaturedOffer()
      .then((data) => {
        if (data) {
          setOffer(data);
          setDismissed(false);
        }
      })
      .catch(() => {
        setDismissed(true);
      });
  }, [mounted]);

  const handleDismiss = () => {
    setDismissed(true);
    if (typeof window !== "undefined") {
      localStorage.setItem(PROMO_DISMISSED_KEY, "1");
    }
  };

  if (!mounted || dismissed || !offer) return null;

  return (
    <div className="relative flex items-center justify-center gap-2 bg-primary px-4 py-2 text-primary-foreground text-sm">
      <span>
        Use <strong>{offer.code}</strong> at checkout – {offer.description}
      </span>
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-2 h-7 w-7 shrink-0 text-primary-foreground hover:bg-primary-foreground/20"
        onClick={handleDismiss}
        aria-label="Dismiss promo"
      >
        <XIcon className="size-4" />
      </Button>
    </div>
  );
}
