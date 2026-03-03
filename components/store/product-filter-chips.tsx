"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { XIcon } from "lucide-react";

type Chip = { key: string; label: string };

function getChips(
  params: URLSearchParams,
  categories: Map<string, string>,
  collections: Map<string, string>
): Chip[] {
  const chips: Chip[] = [];
  const search = params.get("search")?.trim();
  if (search) chips.push({ key: "search", label: `Search: "${search}"` });
  const catId = params.get("categoryId");
  if (catId && categories.has(catId)) {
    chips.push({ key: "categoryId", label: categories.get(catId)! });
  }
  const collId = params.get("collectionId");
  if (collId && collections.has(collId)) {
    chips.push({ key: "collectionId", label: collections.get(collId)! });
  }
  const min = params.get("minPrice");
  const max = params.get("maxPrice");
  if (min || max) {
    chips.push({
      key: "price",
      label: min && max ? `${min} - ${max}` : min ? `From ${min}` : `Up to ${max}`,
    });
  }
  const tags = params.get("tags")?.trim();
  if (tags) chips.push({ key: "tags", label: tags });
  const vendor = params.get("vendor")?.trim();
  if (vendor) chips.push({ key: "vendor", label: vendor });
  const productType = params.get("productType");
  if (productType) {
    const labels: Record<string, string> = {
      simple: "Simple",
      variable: "Variable",
      bundle: "Bundle",
    };
    chips.push({ key: "productType", label: labels[productType] ?? productType });
  }
  if (params.get("inStock") === "true") {
    chips.push({ key: "inStock", label: "In stock" });
  }
  return chips;
}

type ProductFilterChipsProps = {
  categories: Array<{ id: string; name: string }>;
  collections: Array<{ id: string; name: string }>;
};

export function ProductFilterChips({
  categories,
  collections,
}: ProductFilterChipsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const catMap = new Map(categories.map((c) => [c.id, c.name]));
  const collMap = new Map(collections.map((c) => [c.id, c.name]));
  const chips = getChips(searchParams, catMap, collMap);

  if (chips.length === 0) return null;

  const remove = (key: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (key === "price") {
      params.delete("minPrice");
      params.delete("maxPrice");
    } else {
      params.delete(key);
    }
    const q = params.toString();
    router.push(q ? `/products?${q}` : "/products", { scroll: false });
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {chips.map((chip) => (
        <Badge
          key={chip.key}
          variant="secondary"
          className="gap-1 pr-1 text-xs"
        >
          {chip.label}
          <button
            type="button"
            onClick={() => remove(chip.key)}
            className="hover:bg-muted-foreground/20 rounded p-0.5 transition-colors"
            aria-label={`Remove ${chip.label} filter`}
          >
            <XIcon className="size-3" />
          </button>
        </Badge>
      ))}
    </div>
  );
}
