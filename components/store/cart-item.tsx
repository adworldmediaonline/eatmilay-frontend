"use client";

import { Button } from "@/components/ui/button";
import { ProductImage } from "./product-image";
import { PriceDisplay, formatPrice } from "./price-display";
import { MinusIcon, PlusIcon, Trash2Icon } from "lucide-react";
import type { CartItem as CartItemType } from "@/lib/store-types";

type CartItemProps = {
  item: CartItemType;
  onUpdateQuantity: (quantity: number) => void;
  onRemove: () => void;
};

export function CartItem({
  item,
  onUpdateQuantity,
  onRemove,
}: CartItemProps) {
  return (
    <div className="flex gap-3 border-b py-4 last:border-0 sm:gap-4">
      <div className="relative size-16 shrink-0 overflow-hidden rounded-lg bg-muted sm:size-20">
        <ProductImage
          image={item.image}
          alt={item.productName}
          fill
          sizes="80px"
        />
      </div>
      <div className="min-w-0 flex-1">
        <h4 className="font-medium line-clamp-2">{item.productName}</h4>
        <p className="text-muted-foreground mt-0.5 text-sm">
          {formatPrice(item.unitPrice, "USD")} × {item.quantity}
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <div className="flex items-center rounded-lg border">
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={() => onUpdateQuantity(Math.max(1, item.quantity - 1))}
              aria-label="Decrease quantity"
            >
              <MinusIcon className="size-3" />
            </Button>
            <span className="min-w-6 px-1 text-center text-sm">
              {item.quantity}
            </span>
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={() => onUpdateQuantity(item.quantity + 1)}
              aria-label="Increase quantity"
            >
              <PlusIcon className="size-3" />
            </Button>
          </div>
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={onRemove}
            className="text-destructive hover:bg-destructive/10 hover:text-destructive"
            aria-label="Remove item"
          >
            <Trash2Icon className="size-3" />
          </Button>
        </div>
      </div>
      <div className="shrink-0 text-right">
        <PriceDisplay amount={item.lineTotal} size="sm" />
      </div>
    </div>
  );
}
