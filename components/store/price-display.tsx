import { cn } from "@/lib/utils";

const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  INR: "₹",
};

export function formatPrice(amount: number, currency: string): string {
  const sym = CURRENCY_SYMBOLS[currency] ?? currency + " ";
  return `${sym}${amount.toFixed(2)}`;
}

type PriceDisplayProps = {
  amount: number;
  currency?: string;
  compareAt?: number | null;
  size?: "sm" | "default" | "lg";
  className?: string;
};

export function PriceDisplay({
  amount,
  currency = "USD",
  compareAt,
  size = "default",
  className,
}: PriceDisplayProps) {
  const hasDiscount = compareAt != null && compareAt > amount;
  const sizeClass =
    size === "sm"
      ? "text-sm"
      : size === "lg"
        ? "text-2xl md:text-3xl"
        : "text-lg md:text-xl";

  return (
    <div className={cn("flex flex-wrap items-baseline gap-2", className)}>
      <span className={cn("font-semibold", sizeClass)}>
        {formatPrice(amount, currency)}
      </span>
      {hasDiscount && (
        <span
          className={cn(
            "text-muted-foreground line-through",
            size === "sm" ? "text-xs" : "text-base"
          )}
        >
          {formatPrice(compareAt, currency)}
        </span>
      )}
    </div>
  );
}
