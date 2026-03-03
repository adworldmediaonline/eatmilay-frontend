"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

type LoadMoreProductsProps = {
  currentCount: number;
  total: number;
  pageSize: number;
};

export function LoadMoreProducts({
  currentCount,
  total,
  pageSize,
}: LoadMoreProductsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const hasMore = currentCount < total;
  if (!hasMore) return null;

  const loadMore = () => {
    const params = new URLSearchParams(searchParams.toString());
    const nextLimit = currentCount + pageSize;
    params.set("limit", String(nextLimit));
    router.push(`/products?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="mt-8 flex justify-center">
      <Button
        variant="outline"
        size="lg"
        onClick={loadMore}
        className="min-h-[44px] min-w-[120px]"
      >
        Load more
      </Button>
    </div>
  );
}
