import { Suspense } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/dashboard-shell";

async function getSession() {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3005";
  const headersList = await headers();
  const cookie = headersList.get("cookie") ?? "";

  const res = await fetch(`${baseUrl}/api/me`, {
    headers: cookie ? { cookie } : {},
    cache: "no-store",
  });

  if (!res.ok) return null;
  return res.json();
}

const ADMIN_ROLES = ["admin", "super_admin"];

async function DashboardLayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session?.user) {
    redirect("/login");
  }

  const role = session.user?.role ?? "user";
  if (ADMIN_ROLES.includes(role)) {
    redirect("/");
  }

  return <DashboardShell session={session}>{children}</DashboardShell>;
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<div className="flex min-h-svh items-center justify-center">Loading...</div>}>
      <DashboardLayoutContent>{children}</DashboardLayoutContent>
    </Suspense>
  );
}
