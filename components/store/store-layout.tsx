import { cn } from "@/lib/utils";

type StoreContainerProps = {
  children: React.ReactNode;
  className?: string;
  /** Constrain max-width: "default" (7xl), "narrow" (4xl), "tight" (2xl), "compact" (xl) */
  size?: "default" | "narrow" | "tight" | "compact";
};

const sizeClasses = {
  default: "max-w-7xl",
  narrow: "max-w-4xl",
  tight: "max-w-2xl",
  compact: "max-w-xl",
};

export function StoreContainer({
  children,
  className,
  size = "default",
}: StoreContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-4 sm:px-6 lg:px-8",
        sizeClasses[size],
        className
      )}
    >
      {children}
    </div>
  );
}

type StoreSectionProps = {
  children: React.ReactNode;
  className?: string;
};

export function StoreSection({ children, className }: StoreSectionProps) {
  return (
    <section
      className={cn("py-8 sm:py-10 lg:py-12", className)}
    >
      {children}
    </section>
  );
}
