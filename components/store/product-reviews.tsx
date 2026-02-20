"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ReviewCard } from "./review-card";
import {
  getProductReviews,
  canReviewProduct,
  submitProductReview,
} from "@/lib/store-api";
import type { ProductReview, ProductReviewsResponse } from "@/lib/store-api";
import { StarIcon, PenLineIcon } from "lucide-react";
import { toast } from "sonner";

type ProductReviewsProps = {
  productId: string;
};

export function ProductReviews({ productId }: ProductReviewsProps) {
  const [data, setData] = useState<ProductReviewsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [canReview, setCanReview] = useState<{
    canReview: boolean;
    reason: string;
    orderId?: string;
  } | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const loadReviews = useCallback(
    async (cursor?: string) => {
      if (cursor) setLoadingMore(true);
      else setLoading(true);
      try {
        const res = await getProductReviews(productId, {
          cursor,
          limit: 10,
        });
        if (cursor) {
          setData((prev) =>
            prev ? { ...res, items: [...prev.items, ...res.items] } : res
          );
        } else {
          setData(res);
        }
      } catch {
        toast.error("Failed to load reviews");
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [productId]
  );

  const loadCanReview = useCallback(async () => {
    try {
      const res = await canReviewProduct(productId);
      setCanReview({
        canReview: res.canReview,
        reason: res.reason,
        orderId: res.orderId,
      });
    } catch {
      setCanReview({ canReview: false, reason: "sign_in" });
    }
  }, [productId]);

  useEffect(() => {
    loadReviews();
  }, [productId]);

  useEffect(() => {
    loadCanReview();
  }, [loadCanReview]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canReview?.canReview || !canReview?.orderId || rating < 1) return;
    setSubmitting(true);
    try {
      await submitProductReview({
        productId,
        orderId: canReview.orderId,
        rating,
        title: title.trim() || null,
        body: body.trim() || null,
      });
      toast.success("Review submitted");
      setShowForm(false);
      setRating(0);
      setTitle("");
      setBody("");
      loadReviews();
      loadCanReview();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to submit");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="mt-8 rounded-lg border border-border/80 bg-card p-6">
        <div className="flex min-h-[120px] items-center justify-center">
          <p className="text-muted-foreground text-sm">Loading reviews...</p>
        </div>
      </div>
    );
  }

  const avg = data?.averageRating ?? null;
  const total = data?.totalCount ?? 0;
  const items = data?.items ?? [];

  return (
    <div className="mt-8 rounded-lg border border-border/80 bg-card p-6">
      <h2 className="text-lg font-semibold">Customer Reviews</h2>
      {total > 0 && (
        <div className="mt-2 flex items-center gap-3">
          <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((i) => (
              <StarIcon
                key={i}
                className={`size-5 ${
                  avg && i <= Math.round(avg)
                    ? "fill-amber-400 text-amber-400"
                    : "text-muted-foreground/40"
                }`}
              />
            ))}
          </div>
          <span className="text-muted-foreground text-sm">
            {avg?.toFixed(1)} · {total} review{total !== 1 ? "s" : ""}
          </span>
        </div>
      )}

      {!showForm && (
        <div className="mt-4">
          {canReview?.canReview ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowForm(true)}
              className="gap-2"
            >
              <PenLineIcon className="size-4" />
              {canReview.reason === "update" ? "Edit your review" : "Write a review"}
            </Button>
          ) : canReview?.reason === "sign_in" ? (
            <p className="text-muted-foreground text-sm">
              Sign in to write a review.
            </p>
          ) : canReview?.reason === "purchase_required" ? (
            <p className="text-muted-foreground text-sm">
              Purchase this product to write a review.
            </p>
          ) : null}
        </div>
      )}

      {showForm && canReview?.canReview && canReview?.orderId && (
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <p className="text-muted-foreground mb-2 text-sm">Your rating</p>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setRating(i)}
                  onMouseEnter={() => setHoverRating(i)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="rounded p-0.5 transition-colors hover:bg-muted"
                >
                  <StarIcon
                    className={`size-8 ${
                      i <= (hoverRating || rating)
                        ? "fill-amber-400 text-amber-400"
                        : "text-muted-foreground/40"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
          <div>
            <label htmlFor="review-title" className="text-muted-foreground mb-1 block text-sm">
              Title (optional)
            </label>
            <Input
              id="review-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={100}
              placeholder="Summarize your experience"
              className="max-w-md"
            />
          </div>
          <div>
            <label htmlFor="review-body" className="text-muted-foreground mb-1 block text-sm">
              Review (optional)
            </label>
            <Textarea
              id="review-body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              maxLength={2000}
              placeholder="Share your thoughts..."
              rows={4}
              className="max-w-md"
            />
          </div>
          <div className="flex gap-2">
            <Button type="submit" disabled={submitting || rating < 1}>
              {submitting ? "Submitting..." : "Submit review"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setShowForm(false);
                setRating(0);
                setTitle("");
                setBody("");
              }}
            >
              Cancel
            </Button>
          </div>
        </form>
      )}

      <div className="mt-6 space-y-4">
        {items.length === 0 && !loading ? (
          <p className="text-muted-foreground text-sm">No reviews yet.</p>
        ) : (
          items.map((r) => <ReviewCard key={r.id} review={r} />)
        )}
        {data?.nextCursor && (
          <Button
            variant="ghost"
            size="sm"
            disabled={loadingMore}
            onClick={() => loadReviews(data.nextCursor!)}
          >
            {loadingMore ? "Loading..." : "Load more"}
          </Button>
        )}
      </div>
    </div>
  );
}
