"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import type { ProductImage as ProductImageType } from "@/lib/store-types";

type ProductImageProps = {
  image: ProductImageType | null | undefined;
  /** Secondary image shown on hover (e.g. product.images[1]) */
  secondaryImage?: ProductImageType | null | undefined;
  alt: string;
  fill?: boolean;
  sizes?: string;
  className?: string;
  priority?: boolean;
  /** How the image fits in the container. "contain" shows full image without cropping. */
  objectFit?: "cover" | "contain";
};

export function ProductImage({
  image,
  secondaryImage,
  alt,
  fill = true,
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
  className,
  priority = false,
  objectFit = "contain",
}: ProductImageProps) {
  if (!image?.url) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-muted text-muted-foreground text-sm",
          fill && "absolute inset-0",
          className
        )}
      >
        No image
      </div>
    );
  }

  const hasSecondary = secondaryImage?.url && secondaryImage.url !== image.url;

  return (
    <span
      className={cn(
        "relative block size-full overflow-hidden",
        fill && "absolute inset-0",
        hasSecondary && "group/product-image"
      )}
    >
      <Image
        src={image.url}
        alt={image.alt ?? image.title ?? alt}
        fill={fill}
        sizes={sizes}
        className={cn(
          "transition-opacity duration-300",
          objectFit === "contain" ? "object-contain" : "object-cover",
          hasSecondary && "group-hover/product-image:opacity-0",
          className
        )}
        priority={priority}
      />
      {hasSecondary && (
        <Image
          src={secondaryImage.url}
          alt={secondaryImage.alt ?? secondaryImage.title ?? `${alt} (alternate)`}
          fill={fill}
          sizes={sizes}
          className={cn(
            "opacity-0 transition-opacity duration-300 group-hover/product-image:opacity-100 absolute inset-0",
            objectFit === "contain" ? "object-contain" : "object-cover"
          )}
        />
      )}
    </span>
  );
}
