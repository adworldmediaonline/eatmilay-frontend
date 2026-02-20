"use client";

import { StarIcon, BadgeCheckIcon } from "lucide-react";
import type { ProductReview } from "@/lib/store-api";

type ReviewCardProps = {
  review: ProductReview;
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function ReviewCard({ review }: ReviewCardProps) {
  return (
    <div className="rounded-lg border border-border/80 bg-card p-4">
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex gap-0.5">
          {[1, 2, 3, 4, 5].map((i) => (
            <StarIcon
              key={i}
              className={`size-4 ${
                i <= review.rating
                  ? "fill-amber-400 text-amber-400"
                  : "text-muted-foreground/40"
              }`}
            />
          ))}
        </div>
        {review.verifiedPurchase && (
          <span className="text-muted-foreground inline-flex items-center gap-1 text-xs">
            <BadgeCheckIcon className="size-3.5" />
            Verified purchase
          </span>
        )}
        <span className="text-muted-foreground text-xs">
          {formatDate(review.createdAt)}
        </span>
      </div>
      <p className="mt-2 font-medium text-sm">{review.customerName}</p>
      {review.title && (
        <p className="mt-1 font-medium text-sm">{review.title}</p>
      )}
      {review.body && (
        <p className="text-muted-foreground mt-1 whitespace-pre-wrap text-sm">
          {review.body}
        </p>
      )}
    </div>
  );
}
