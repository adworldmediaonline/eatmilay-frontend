import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type StoreCardProps = React.ComponentProps<typeof Card>;

/** Composable card for store catalog items with consistent hover behavior */
export function StoreCard({ className, ...props }: StoreCardProps) {
  return (
    <Card
      className={cn(
        "overflow-hidden rounded-xl border-border/80 bg-card shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md",
        className
      )}
      {...props}
    />
  );
}
