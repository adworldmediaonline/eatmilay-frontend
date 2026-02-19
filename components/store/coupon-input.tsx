"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { validateStoreDiscount } from "@/lib/store-api";

type CouponInputProps = {
  subtotal: number;
  items: Array<{ productId: string; quantity: number; unitPrice: number }>;
  onApplied: (discountAmount: number, code: string) => void;
  appliedCode?: string | null;
  appliedAmount?: number;
  onRemove?: () => void;
};

export function CouponInput({
  subtotal,
  items,
  onApplied,
  appliedCode,
  appliedAmount,
  onRemove,
}: CouponInputProps) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleValidate = async () => {
    const trimmed = code.trim();
    if (!trimmed) return;
    setLoading(true);
    setError(null);
    try {
      const result = await validateStoreDiscount(trimmed, subtotal, items);
      if (result.valid) {
        onApplied(result.discountAmount, trimmed.toUpperCase());
        setCode("");
      } else {
        setError(result.message);
      }
    } catch {
      setError("Failed to validate coupon");
    } finally {
      setLoading(false);
    }
  };

  if (appliedCode && appliedAmount != null && appliedAmount > 0) {
    const savingsPercent =
      subtotal > 0 ? Math.round((appliedAmount / subtotal) * 100) : 0;
    return (
      <div className="flex items-center justify-between rounded-lg border border-green-500/30 bg-green-500/5 p-3">
        <div>
          <p className="text-sm font-medium text-green-700 dark:text-green-400">
            Coupon {appliedCode} applied
          </p>
          <Badge
            variant="outline"
            className="mt-1 border-green-500/30 bg-green-500/10 text-green-700 dark:bg-green-500/20 dark:text-green-400"
          >
            Save {savingsPercent}%
          </Badge>
        </div>
        {onRemove && (
          <Button variant="ghost" size="sm" onClick={onRemove}>
            Remove
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input
          placeholder="Coupon code"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          onKeyDown={(e) => e.key === "Enter" && handleValidate()}
          disabled={loading}
        />
        <Button
          variant="outline"
          onClick={handleValidate}
          disabled={loading || !code.trim()}
        >
          {loading ? "Checking..." : "Apply"}
        </Button>
      </div>
      {error && (
        <p className="text-destructive text-sm">{error}</p>
      )}
    </div>
  );
}
