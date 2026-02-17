"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { StoreContainer } from "./store-layout";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  ShoppingCartIcon,
  MenuIcon,
  LayoutGridIcon,
  FolderIcon,
  LayersIcon,
  LayoutDashboardIcon,
  LogInIcon,
  UserPlusIcon,
  LogOutIcon,
} from "lucide-react";
import { CartDrawer } from "./cart-drawer";
import { useCart } from "./cart-provider";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { BRAND } from "@/lib/brand";

type StoreHeaderProps = {
  user?: {
    name: string;
    email: string;
    image?: string | null;
  } | null;
};

const navLinks = [
  { href: "/products", label: "Products", icon: LayoutGridIcon },
  { href: "/categories", label: "Categories", icon: FolderIcon },
  { href: "/collections", label: "Collections", icon: LayersIcon },
];

export function StoreHeader({ user }: StoreHeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { itemCount } = useCart();
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const displayName = user?.name ?? "Account";
  const initials = displayName.slice(0, 2).toUpperCase();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/95 backdrop-blur-md supports-backdrop-filter:bg-background/90">
        <StoreContainer>
          <div className="flex h-16 items-center justify-between gap-4">
            {/* Left: Mobile menu + Logo + Desktop nav */}
            <div className="flex min-w-0 flex-1 items-center gap-4 lg:gap-8">
              <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="shrink-0 md:hidden"
                    aria-label="Open menu"
                  >
                    <MenuIcon className="size-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="left"
                  className="flex w-[min(300px,85vw)] flex-col gap-6"
                >
                  <SheetHeader className="space-y-1">
                    <SheetTitle className="text-lg">Menu</SheetTitle>
                  </SheetHeader>
                  <nav className="flex flex-col gap-1">
                    <p className="text-muted-foreground mb-2 px-3 text-xs font-semibold uppercase tracking-wider">
                      Browse
                    </p>
                    {navLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setMobileNavOpen(false)}
                        className={cn(
                          "flex min-h-12 items-center gap-3 rounded-lg px-3 text-base font-medium transition-colors",
                          isActive(link.href)
                            ? "bg-muted text-foreground"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        )}
                      >
                        <link.icon className="size-5 shrink-0" />
                        {link.label}
                      </Link>
                    ))}
                  </nav>
                  <div className="my-2 border-t" />
                  <nav className="flex flex-col gap-1">
                    <p className="text-muted-foreground mb-2 px-3 text-xs font-semibold uppercase tracking-wider">
                      Account
                    </p>
                    {user ? (
                      <>
                        <Link
                          href="/dashboard"
                          onClick={() => setMobileNavOpen(false)}
                          className="flex min-h-12 items-center gap-3 rounded-lg px-3 text-base font-medium transition-colors hover:bg-muted"
                        >
                          <LayoutDashboardIcon className="size-5 shrink-0" />
                          Dashboard
                        </Link>
                      </>
                    ) : (
                      <>
                        <Link
                          href="/login"
                          onClick={() => setMobileNavOpen(false)}
                          className="flex min-h-12 items-center gap-3 rounded-lg px-3 text-base font-medium transition-colors hover:bg-muted"
                        >
                          <LogInIcon className="size-5 shrink-0" />
                          Sign in
                        </Link>
                        <Link
                          href="/sign-up"
                          onClick={() => setMobileNavOpen(false)}
                          className="flex min-h-12 items-center gap-3 rounded-lg px-3 text-base font-medium transition-colors hover:bg-muted"
                        >
                          <UserPlusIcon className="size-5 shrink-0" />
                          Sign up
                        </Link>
                      </>
                    )}
                  </nav>
                </SheetContent>
              </Sheet>

              <Link
                href="/"
                className="shrink-0 text-xl font-bold tracking-tight transition-opacity hover:opacity-80"
              >
                {BRAND.name}
              </Link>

              <nav className="hidden md:flex md:items-center md:gap-1">
                {navLinks.map((link) => (
                  <Button
                    key={link.href}
                    variant="ghost"
                    size="sm"
                    asChild
                    className={cn(
                      "h-9 px-3 font-medium",
                      isActive(link.href)
                        ? "bg-muted text-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <Link href={link.href}>{link.label}</Link>
                  </Button>
                ))}
              </nav>
            </div>

            {/* Right: Cart + Auth */}
            <div className="flex shrink-0 items-center gap-1 sm:gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCartOpen(true)}
                className="relative h-10 gap-2 px-3"
                aria-label={`Cart (${itemCount} items)`}
              >
                <ShoppingCartIcon className="size-5" />
                <span className="hidden sm:inline">Cart</span>
                {itemCount > 0 && (
                  <span className="bg-primary text-primary-foreground absolute -right-0.5 -top-0.5 flex size-5 items-center justify-center rounded-full text-[10px] font-semibold">
                    {itemCount > 99 ? "99+" : itemCount}
                  </span>
                )}
              </Button>

              <div className="h-5 w-px bg-border" />

              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="h-10 gap-2 px-2 hover:bg-muted"
                      aria-label="Account menu"
                    >
                      <Avatar className="size-8">
                        <AvatarImage
                          src={user.image ?? undefined}
                          alt={displayName}
                        />
                        <AvatarFallback className="text-xs font-medium">
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                      <span className="hidden max-w-24 truncate text-sm font-medium sm:block">
                        {displayName}
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    sideOffset={8}
                    className="w-56"
                  >
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col gap-0.5">
                        <p className="text-sm font-medium">{displayName}</p>
                        {user.email && (
                          <p className="text-muted-foreground truncate text-xs">
                            {user.email}
                          </p>
                        )}
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem asChild>
                        <Link href="/dashboard" className="flex items-center gap-2">
                          <LayoutDashboardIcon className="size-4" />
                          Dashboard
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={async () => {
                        await authClient.signOut();
                        router.push("/");
                        router.refresh();
                      }}
                      className="flex cursor-pointer items-center gap-2 text-destructive focus:text-destructive"
                    >
                      <LogOutIcon className="size-4" />
                      Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="sm" asChild className="h-9">
                    <Link href="/login">Sign in</Link>
                  </Button>
                  <Button size="sm" asChild className="h-9">
                    <Link href="/sign-up">Sign up</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </StoreContainer>
      </header>
      <CartDrawer open={cartOpen} onOpenChange={setCartOpen} />
    </>
  );
}
