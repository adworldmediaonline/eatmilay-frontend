"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

type HomeHeaderProps = {
  user?: {
    name: string;
    email: string;
    image?: string | null;
  } | null;
};

export function HomeHeader({ user }: HomeHeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center justify-between px-4 lg:px-6">
        <Link
          href="/"
          className="text-base font-semibold transition-opacity hover:opacity-80"
        >
          User Panel
        </Link>
        <nav className="flex items-center gap-2">
          {user ? (
            <Button size="sm" asChild>
              <Link href="/dashboard">Dashboard</Link>
            </Button>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/login">Sign in</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/sign-up">Sign up</Link>
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
