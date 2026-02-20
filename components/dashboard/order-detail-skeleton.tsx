import { Skeleton } from "@/components/ui/skeleton";

export function OrderDetailSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-4 w-24" />
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-2">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-32" />
          </div>
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
      </div>

      <div className="rounded-lg border bg-card p-6">
        <Skeleton className="mb-4 h-5 w-16" />
        <ul className="space-y-3">
          {[1, 2, 3].map((i) => (
            <li key={i} className="flex justify-between">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-4 w-16" />
            </li>
          ))}
        </ul>
        <div className="mt-4 flex justify-between border-t pt-4">
          <Skeleton className="h-5 w-12" />
          <Skeleton className="h-5 w-20" />
        </div>
      </div>

      <div className="rounded-lg border bg-card p-6">
        <div className="mb-4 flex items-center gap-2">
          <Skeleton className="size-5 rounded" />
          <Skeleton className="h-5 w-24" />
        </div>
        <Skeleton className="mb-2 h-4 w-full" />
        <Skeleton className="mb-4 h-4 w-3/4" />
        <Skeleton className="h-9 w-36" />
      </div>
    </div>
  );
}
