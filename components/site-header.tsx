"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
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
  SearchIcon,
  BellIcon,
  ChevronDownIcon,
  CircleUserRoundIcon,
  Settings2Icon,
  LogOutIcon,
} from "lucide-react";

type SiteHeaderProps = {
  user?: {
    name: string;
    email: string;
    avatar: string;
  };
  onSignOut?: () => void;
};

export function SiteHeader({ user, onSignOut }: SiteHeaderProps) {
  const displayName = user?.name ?? "User";
  const initials = displayName.slice(0, 2).toUpperCase();

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b px-4 transition-[width,height] ease-linear lg:px-6 group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-2 sm:gap-4">
        {/* Sidebar trigger + brand */}
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <SidebarTrigger className="-ml-1 shrink-0" />
          <Separator
            orientation="vertical"
            className="mx-1 hidden h-4 shrink-0 sm:block"
          />
          <Link
            href="/dashboard"
            className="truncate text-base font-semibold transition-opacity hover:opacity-80"
          >
            User Panel
          </Link>
        </div>

        {/* Search (hidden on xs, visible from sm) */}
        <div className="hidden w-full max-w-xs flex-1 sm:block md:max-w-sm">
          <div className="relative">
            <SearchIcon className="text-muted-foreground pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2" />
            <Input
              type="search"
              placeholder="Search..."
              className="h-8 pl-8"
              aria-label="Search"
            />
          </div>
        </div>

        {/* Right section: notifications + profile */}
        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="size-8 shrink-0"
            aria-label="Notifications"
          >
            <BellIcon className="size-4" />
          </Button>

          <Separator
            orientation="vertical"
            className="mx-1 hidden h-4 sm:block"
          />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex h-8 shrink-0 items-center gap-2 px-2 hover:bg-muted"
                aria-label="Open user menu"
              >
                <Avatar className="size-7 shrink-0">
                  <AvatarImage src={user?.avatar} alt={displayName} />
                  <AvatarFallback className="text-xs font-medium">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden max-w-24 truncate text-sm font-medium sm:block">
                  {displayName}
                </span>
                <ChevronDownIcon className="hidden size-4 shrink-0 text-muted-foreground sm:block" />
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
                  {user?.email && (
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
                    <CircleUserRoundIcon className="size-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard" className="flex items-center gap-2">
                    <Settings2Icon className="size-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={onSignOut}
                className="text-destructive focus:text-destructive"
              >
                <LogOutIcon className="size-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
