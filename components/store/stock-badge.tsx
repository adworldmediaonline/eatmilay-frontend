import { Badge } from "@/components/ui/badge";
import {
  getStockStatusLabel,
  type StockStatus,
} from "@/lib/stock-status";

const stockBadgeVariant: Record<
  StockStatus,
  "default" | "secondary" | "destructive" | "outline"
> = {
  in_stock: "default",
  low_stock: "outline",
  out_of_stock: "destructive",
  backorder: "secondary",
};

type StockBadgeProps = {
  status: StockStatus;
  className?: string;
};

export function StockBadge({ status, className }: StockBadgeProps) {
  return (
    <Badge variant={stockBadgeVariant[status]} className={className}>
      {getStockStatusLabel(status)}
    </Badge>
  );
}
