"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  canReviewOrder,
  getOrderReview,
  submitOrderReview,
} from "@/lib/store-api";
import type { OrderReview } from "@/lib/store-api";
import { StarIcon, MessageCircleIcon } from "lucide-react";
import { toast } from "sonner";

type OrderReviewFormProps = {
  orderId: string;
  orderNumber: string;
  orderStatus: string;
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function OrderReviewForm({
  orderId,
  orderNumber,
  orderStatus,
}: OrderReviewFormProps) {
  const [eligibility, setEligibility] = useState<{
    canReview: boolean;
    reason: string;
  } | null>(null);
  const [existingReview, setExistingReview] = useState<OrderReview | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const isDelivered = orderStatus === "delivered";

  useEffect(() => {
    if (!orderNumber || !isDelivered) {
      setLoading(false);
      return;
    }
    Promise.all([
      canReviewOrder(orderNumber),
      getOrderReview(orderId),
    ])
      .then(([canRes, review]) => {
        setEligibility({
          canReview: canRes.canReview,
          reason: canRes.reason,
        });
        setExistingReview(review);
      })
      .catch(() => setEligibility({ canReview: false, reason: "not_found" }))
      .finally(() => setLoading(false));
  }, [orderNumber, orderId, isDelivered]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eligibility?.canReview || rating < 1) return;
    setSubmitting(true);
    try {
      await submitOrderReview({
        orderId,
        rating,
        title: title.trim() || null,
        body: body.trim() || null,
      });
      toast.success("Thanks for your feedback!");
      setExistingReview({
        id: "",
        rating,
        title: title.trim() || null,
        body: body.trim() || null,
        createdAt: new Date().toISOString(),
      });
      setEligibility((prev) =>
        prev ? { ...prev, canReview: false, reason: "already_reviewed" } : prev
      );
      setRating(0);
      setTitle("");
      setBody("");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to submit");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isDelivered || loading) return null;

  if (existingReview) {
    return (
      <div className="rounded-lg border border-border/80 bg-muted/30 p-6">
        <div className="flex items-center gap-2 mb-2">
          <MessageCircleIcon className="size-5 text-muted-foreground" />
          <h3 className="font-semibold">Thanks for your feedback</h3>
        </div>
        <div className="flex gap-0.5 mb-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <StarIcon
              key={i}
              className={`size-4 ${
                i <= existingReview.rating
                  ? "fill-amber-400 text-amber-400"
                  : "text-muted-foreground/40"
              }`}
            />
          ))}
        </div>
        {existingReview.title && (
          <p className="font-medium text-sm">{existingReview.title}</p>
        )}
        {existingReview.body && (
          <p className="text-muted-foreground mt-1 whitespace-pre-wrap text-sm">
            {existingReview.body}
          </p>
        )}
        <p className="text-muted-foreground mt-2 text-xs">
          Submitted on {formatDate(existingReview.createdAt)}
        </p>
      </div>
    );
  }

  if (!eligibility?.canReview) return null;

  return (
    <div className="rounded-lg border border-border/80 bg-card p-6">
      <h3 className="font-semibold mb-2">How was your experience?</h3>
      <p className="text-muted-foreground text-sm mb-4">
        Share your feedback about this order.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
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
          <label htmlFor="order-review-title" className="text-muted-foreground mb-1 block text-sm">
            Title (optional)
          </label>
          <Input
            id="order-review-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={100}
            placeholder="Summarize your experience"
            className="max-w-md"
          />
        </div>
        <div>
          <label htmlFor="order-review-body" className="text-muted-foreground mb-1 block text-sm">
            Review (optional)
          </label>
          <Textarea
            id="order-review-body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            maxLength={2000}
            placeholder="Share your thoughts..."
            rows={4}
            className="max-w-md"
          />
        </div>
        <Button type="submit" disabled={submitting || rating < 1}>
          {submitting ? "Submitting..." : "Submit feedback"}
        </Button>
      </form>
    </div>
  );
}
