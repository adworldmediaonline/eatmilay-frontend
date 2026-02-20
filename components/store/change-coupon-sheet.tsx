"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { AvailableOffers } from "./available-offers";
import { CouponInput } from "./coupon-input";

type ChangeCouponSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  subtotal: number;
  items: Array<{ productId: string; quantity: number; unitPrice: number }>;
  onApplied: (discountAmount: number, code: string) => void;
  appliedCode: string | null;
  appliedAmount: number;
  onRemove: () => void;
};

export function ChangeCouponSheet({
  open,
  onOpenChange,
  subtotal,
  items,
  onApplied,
  appliedCode,
  appliedAmount,
  onRemove,
}: ChangeCouponSheetProps) {
  const handleApplied = (amount: number, code: string) => {
    onApplied(amount, code);
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Change coupon</SheetTitle>
        </SheetHeader>
        <div className="mt-6 space-y-6">
          <AvailableOffers
            subtotal={subtotal}
            items={items}
            onApplied={handleApplied}
            appliedCode={appliedCode}
            changeMode
          />
          <div className="space-y-2">
            <p className="text-muted-foreground text-sm font-medium">
              Have a different code?
            </p>
            <CouponInput
              subtotal={subtotal}
              items={items}
              onApplied={handleApplied}
              appliedCode={appliedCode}
              appliedAmount={appliedAmount}
              onRemove={() => {
                onRemove();
                onOpenChange(false);
              }}
            />
          </div>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => onOpenChange(false)}
          >
            Done
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
