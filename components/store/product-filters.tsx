"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  getStoreCategories,
  getStoreCollections,
  getStoreProductFacets,
} from "@/lib/store-api";
import type { ProductCategory, ProductCollection } from "@/lib/store-types";
import {
  SearchIcon,
  SlidersHorizontalIcon,
  XIcon,
} from "lucide-react";

const DEBOUNCE_MS = 400;
const PRICE_MIN = 0;
const PRICE_MAX = 1000;
const PRICE_STEP = 10;

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "name-asc", label: "Name A–Z" },
  { value: "name-desc", label: "Name Z–A" },
] as const;

const PRODUCT_TYPE_OPTIONS = [
  { value: "simple", label: "Simple" },
  { value: "variable", label: "Variable" },
  { value: "bundle", label: "Bundle" },
] as const;

function getActiveFilterCount(params: URLSearchParams): number {
  let count = 0;
  if (params.get("search")?.trim()) count++;
  if (params.get("categoryId")) count++;
  if (params.get("collectionId")) count++;
  const sort = params.get("sortBy") || params.get("sortOrder");
  if (sort && sort !== "newest") count++;
  if (params.get("minPrice") || params.get("maxPrice")) count++;
  if (params.get("tags")?.trim()) count++;
  if (params.get("vendor")?.trim()) count++;
  if (params.get("productType")) count++;
  if (params.get("inStock") === "true") count++;
  return count;
}

function buildParams(updates: Record<string, string | undefined>): URLSearchParams {
  const params = new URLSearchParams();
  const keys = [
    "search",
    "categoryId",
    "collectionId",
    "sortBy",
    "sortOrder",
    "minPrice",
    "maxPrice",
    "tags",
    "vendor",
    "productType",
    "inStock",
    "limit",
  ] as const;
  for (const key of keys) {
    const v = updates[key];
    if (v !== undefined && v !== "" && v !== "all") {
      params.set(key, v);
    }
  }
  return params;
}

type FilterContentProps = {
  compact?: boolean;
  searchInput: string;
  setSearchInput: (v: string) => void;
  categoryId: string;
  collectionId: string;
  sortValue: string;
  setSort: (v: string) => void;
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
  tagsParam: string;
  vendor: string;
  productType: string;
  inStock: boolean;
  updateParams: (u: Record<string, string | undefined>) => void;
  categories: ProductCategory[];
  collections: ProductCollection[];
  facets: { tags: string[]; vendors: string[] };
  activeCount: number;
  clearAll: () => void;
};

function FilterContent({
  compact = false,
  searchInput,
  setSearchInput,
  categoryId,
  collectionId,
  sortValue,
  setSort,
  priceRange,
  onPriceRangeChange,
  tagsParam,
  vendor,
  productType,
  inStock,
  updateParams,
  categories,
  collections,
  facets,
  activeCount,
  clearAll,
}: FilterContentProps) {
  const gridClass = compact
    ? "grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 items-end"
    : "flex flex-col gap-4";
  const itemClass = compact ? "min-w-0" : "";

  return (
    <div className={gridClass}>
      <div className={compact ? "col-span-2 sm:col-span-1 min-w-0" : ""}>
        <Label htmlFor="filter-search" className="text-muted-foreground text-xs">
          Search
        </Label>
        <div className="relative mt-1">
          <SearchIcon className="text-muted-foreground absolute left-2.5 top-1/2 size-4 -translate-y-1/2" />
          <Input
            id="filter-search"
            type="search"
            placeholder="Search products..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-8 pr-8"
            minLength={2}
          />
          {searchInput && (
            <button
              type="button"
              onClick={() => setSearchInput("")}
              className="text-muted-foreground hover:text-foreground absolute right-2 top-1/2 -translate-y-1/2"
              aria-label="Clear search"
            >
              <XIcon className="size-4" />
            </button>
          )}
        </div>
      </div>

      <div className={itemClass}>
        <Label className="text-muted-foreground text-xs">Category</Label>
        <Select
          value={categoryId || "all"}
          onValueChange={(v) => updateParams({ categoryId: v === "all" ? undefined : v })}
        >
          <SelectTrigger className="mt-1 w-full">
            <SelectValue placeholder="All categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className={itemClass}>
        <Label className="text-muted-foreground text-xs">Collection</Label>
        <Select
          value={collectionId || "all"}
          onValueChange={(v) =>
            updateParams({ collectionId: v === "all" ? undefined : v })
          }
        >
          <SelectTrigger className="mt-1 w-full">
            <SelectValue placeholder="All collections" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All collections</SelectItem>
            {collections.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className={itemClass}>
        <Label className="text-muted-foreground text-xs">Sort by</Label>
        <Select value={sortValue} onValueChange={setSort}>
          <SelectTrigger className="mt-1 w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className={compact ? "col-span-2 min-w-[200px]" : ""}>
        <Label className="text-muted-foreground text-xs">
          Price range
        </Label>
        <div className="mt-2 space-y-2">
          <Slider
            min={PRICE_MIN}
            max={PRICE_MAX}
            step={PRICE_STEP}
            value={priceRange}
            onValueChange={(v) => onPriceRangeChange(v as [number, number])}
            className="w-full"
          />
          <p className="text-muted-foreground text-xs">
            {priceRange[0]} – {priceRange[1]}
            {priceRange[1] >= PRICE_MAX ? "+" : ""}
          </p>
        </div>
      </div>

      {facets.tags.length > 0 && (
        <div className={itemClass}>
          <Label className="text-muted-foreground text-xs">Tags</Label>
          <Select
            value={tagsParam || "all"}
            onValueChange={(v) =>
              updateParams({ tags: v === "all" ? undefined : v })
            }
          >
            <SelectTrigger className="mt-1 w-full">
              <SelectValue placeholder="All tags" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All tags</SelectItem>
              {facets.tags.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {facets.vendors.length > 0 && (
        <div className={itemClass}>
          <Label className="text-muted-foreground text-xs">Vendor</Label>
          <Select
            value={vendor || "all"}
            onValueChange={(v) =>
              updateParams({ vendor: v === "all" ? undefined : v })
            }
          >
            <SelectTrigger className="mt-1 w-full">
              <SelectValue placeholder="All vendors" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All vendors</SelectItem>
              {facets.vendors.map((v) => (
                <SelectItem key={v} value={v}>
                  {v}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div className={itemClass}>
        <Label className="text-muted-foreground text-xs">Product type</Label>
        <Select
          value={productType || "all"}
          onValueChange={(v) =>
            updateParams({ productType: v === "all" ? undefined : v })
          }
        >
          <SelectTrigger className="mt-1 w-full">
            <SelectValue placeholder="All types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All types</SelectItem>
            {PRODUCT_TYPE_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className={`flex items-center gap-2 ${itemClass}`}>
        <Checkbox
          id="in-stock"
          checked={inStock}
          onCheckedChange={(checked) =>
            updateParams({ inStock: checked ? "true" : undefined })
          }
        />
        <Label
          htmlFor="in-stock"
          className="text-sm font-normal cursor-pointer"
        >
          In stock only
        </Label>
      </div>

      {activeCount > 0 && (
        <Button
          variant="ghost"
          size="sm"
          onClick={clearAll}
          className={compact ? "col-span-full w-full sm:w-auto sm:justify-self-end" : "w-full"}
        >
          Clear all filters
        </Button>
      )}
    </div>
  );
}

type ProductFiltersProps = {
  className?: string;
};

export function ProductFilters({ className }: ProductFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [collections, setCollections] = useState<ProductCollection[]>([]);
  const [facets, setFacets] = useState<{ tags: string[]; vendors: string[] }>({
    tags: [],
    vendors: [],
  });
  const [searchInput, setSearchInput] = useState("");
  const [priceRange, setPriceRange] = useState<[number, number]>([PRICE_MIN, PRICE_MAX]);
  const [mobileOpen, setMobileOpen] = useState(false);

  const search = searchParams.get("search") ?? "";
  const categoryId = searchParams.get("categoryId") ?? "";
  const collectionId = searchParams.get("collectionId") ?? "";
  const sortBy = searchParams.get("sortBy") ?? "newest";
  const sortOrder = searchParams.get("sortOrder") ?? "desc";
  const minPrice = searchParams.get("minPrice") ?? "";
  const maxPrice = searchParams.get("maxPrice") ?? "";
  const tagsParam = searchParams.get("tags") ?? "";
  const vendor = searchParams.get("vendor") ?? "";
  const productType = searchParams.get("productType") ?? "";
  const inStock = searchParams.get("inStock") === "true";

  useEffect(() => {
    setSearchInput(search);
  }, [search]);

  useEffect(() => {
    const minVal = minPrice ? Number(minPrice) : PRICE_MIN;
    const maxVal = maxPrice ? Number(maxPrice) : PRICE_MAX;
    const min = Number.isNaN(minVal)
      ? PRICE_MIN
      : Math.min(PRICE_MAX, Math.max(PRICE_MIN, minVal));
    const max = Number.isNaN(maxVal)
      ? PRICE_MAX
      : Math.min(PRICE_MAX, Math.max(PRICE_MIN, maxVal));
    setPriceRange([min, Math.max(min, max)]);
  }, [minPrice, maxPrice]);

  useEffect(() => {
    Promise.all([
      getStoreCategories(),
      getStoreCollections(),
      getStoreProductFacets(),
    ])
      .then(([cats, colls, f]) => {
        setCategories(cats);
        setCollections(colls);
        setFacets(f);
      })
      .catch(() => {});
  }, []);

  const updateParams = useCallback(
    (updates: Record<string, string | undefined>) => {
      const current = Object.fromEntries(searchParams.entries());
      const merged = { ...current, ...updates };
      const params = buildParams(merged);
      const q = params.toString();
      const currentQ = searchParams.toString();
      if (q === currentQ) return;
      router.push(q ? `/products?${q}` : "/products", { scroll: false });
    },
    [router, searchParams]
  );

  useEffect(() => {
    const t = setTimeout(() => {
      const trimmed = searchInput.trim();
      const currentSearch = searchParams.get("search")?.trim() ?? "";
      if (trimmed === currentSearch) return;
      if (trimmed.length >= 2 || trimmed.length === 0) {
        updateParams({ search: trimmed || undefined });
      }
    }, DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [searchInput, searchParams, updateParams]);

  useEffect(() => {
    const t = setTimeout(() => {
      const [min, max] = priceRange;
      const currentMin = searchParams.get("minPrice");
      const currentMax = searchParams.get("maxPrice");
      const urlMin = currentMin ? Number(currentMin) : PRICE_MIN;
      const urlMax = currentMax ? Number(currentMax) : PRICE_MAX;
      if (min === urlMin && max === urlMax) return;
      const isFullRange = min === PRICE_MIN && max === PRICE_MAX;
      updateParams({
        minPrice: isFullRange ? undefined : String(min),
        maxPrice: isFullRange ? undefined : String(max),
      });
    }, DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [priceRange, searchParams, updateParams]);

  const clearAll = () => {
    setSearchInput("");
    setPriceRange([PRICE_MIN, PRICE_MAX]);
    router.push("/products", { scroll: false });
    setMobileOpen(false);
  };

  const sortValue =
    sortBy === "updatedAt" || sortBy === "newest"
      ? "newest"
      : `${sortBy}-${sortOrder}`;

  const setSort = (value: string) => {
    if (value === "newest") {
      updateParams({ sortBy: "newest", sortOrder: undefined });
      return;
    }
    const [field, order] = value.split("-");
    updateParams({
      sortBy: field === "price" ? "price" : "name",
      sortOrder: order as "asc" | "desc",
    });
  };

  const activeCount = getActiveFilterCount(searchParams);

  const filterContentProps = {
    searchInput,
    setSearchInput,
    categoryId,
    collectionId,
    sortValue,
    setSort,
    priceRange,
    onPriceRangeChange: setPriceRange,
    tagsParam,
    vendor,
    productType,
    inStock,
    updateParams,
    categories,
    collections,
    facets,
    activeCount,
    clearAll,
  };

  return (
    <div className={className}>
      <div className="hidden md:block">
        <FilterContent compact {...filterContentProps} />
      </div>

      <div className="flex md:hidden gap-2">
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="min-h-[44px] min-w-[44px]">
              <SlidersHorizontalIcon className="size-4" />
              Filters
              {activeCount > 0 && (
                <span className="ml-1 rounded-full bg-primary px-1.5 py-0.5 text-xs text-primary-foreground">
                  {activeCount}
                </span>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="flex w-[300px] flex-col sm:w-[340px]">
            <SheetHeader className="shrink-0">
              <SheetTitle>Filters</SheetTitle>
            </SheetHeader>
            <div className="min-h-0 flex-1 overflow-y-auto px-4 pt-2">
              <FilterContent {...filterContentProps} />
            </div>
            <SheetFooter className="border-t px-4 py-4 sm:flex-row">
              <Button
                className="min-h-[44px] w-full"
                onClick={() => setMobileOpen(false)}
              >
                Apply filters
              </Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
