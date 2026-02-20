"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const SEGMENT_LABELS: Record<string, string> = {
  dashboard: "Dashboard",
  orders: "My Orders",
  profile: "Profile",
  settings: "Settings",
};

export function DashboardBreadcrumb() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length === 0 || segments[0] !== "dashboard") return null;

  const isOrderDetail =
    segments.length >= 3 &&
    segments[1] === "orders" &&
    !["orders"].includes(segments[2]);

  const items: { href?: string; label: string }[] = [
    { href: "/dashboard", label: "Dashboard" },
  ];

  if (segments.length >= 2) {
    if (segments[1] === "orders") {
      items.push({
        href: "/dashboard/orders",
        label: SEGMENT_LABELS.orders ?? "My Orders",
      });
      if (isOrderDetail && segments[2]) {
        items.push({
          label: `Order #${segments[2]}`,
        });
      }
    } else if (segments[1] === "profile") {
      items.push({ label: SEGMENT_LABELS.profile ?? "Profile" });
    } else if (segments[1] === "settings") {
      items.push({ label: SEGMENT_LABELS.settings ?? "Settings" });
    }
  }

  if (items.length <= 1) return null;

  return (
    <Breadcrumb className="px-4 lg:px-6 pt-4 lg:pt-6">
      <BreadcrumbList>
        {items.map((item, i) => (
          <BreadcrumbItem key={i}>
            {i > 0 && <BreadcrumbSeparator />}
            {item.href ? (
              <BreadcrumbLink asChild>
                <Link href={item.href}>{item.label}</Link>
              </BreadcrumbLink>
            ) : (
              <BreadcrumbPage>{item.label}</BreadcrumbPage>
            )}
          </BreadcrumbItem>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
