import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PackageIcon } from "lucide-react";

type EmptyStateProps = {
  title: string;
  description?: string;
  href?: string;
  linkText?: string;
  icon?: React.ReactNode;
};

export function EmptyState({
  title,
  description,
  href,
  linkText,
  icon,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/80 bg-muted/30 p-8 text-center sm:p-12">
      <div className="text-muted-foreground mb-4">
        {icon ?? <PackageIcon className="size-12 sm:size-14" />}
      </div>
      <h3 className="text-base font-semibold sm:text-lg">{title}</h3>
      {description && (
        <p className="text-muted-foreground mt-1 max-w-sm text-sm">
          {description}
        </p>
      )}
      {href && linkText && (
        <Button asChild variant="outline" className="mt-4 min-h-11">
          <Link href={href}>{linkText}</Link>
        </Button>
      )}
    </div>
  );
}
