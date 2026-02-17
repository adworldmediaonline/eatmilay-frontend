"use client";

import { createContext, useContext } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { toast } from "sonner";

export type Session = {
  user: {
    id: string;
    name: string;
    email: string;
    image?: string | null;
    role?: string;
  };
};

const SessionContext = createContext<Session | null>(null);

export function useDashboardSession() {
  const session = useContext(SessionContext);
  return session;
}

export function DashboardShell({
  session,
  children,
}: {
  session: Session;
  children: React.ReactNode;
}) {
  const router = useRouter();

  async function handleSignOut() {
    try {
      await authClient.signOut();
    } catch {
      toast.error("Could not reach server. Redirecting.");
    }
    router.push("/login");
    router.refresh();
  }

  return (
    <SessionContext.Provider value={session}>
      <SidebarProvider
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 72)",
            "--header-height": "calc(var(--spacing) * 12)",
          } as React.CSSProperties
        }
      >
        <AppSidebar
          user={{
            name: session.user.name ?? "User",
            email: session.user.email ?? "",
            avatar: session.user.image ?? "",
          }}
          onSignOut={handleSignOut}
        />
        <SidebarInset>
          <SiteHeader
            user={{
              name: session.user.name ?? "User",
              email: session.user.email ?? "",
              avatar: session.user.image ?? "",
            }}
            onSignOut={handleSignOut}
          />
          <div className="flex flex-1 flex-col">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </SessionContext.Provider>
  );
}
