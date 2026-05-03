"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { LogOut, UserRound } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { getDashboardRoute } from "@/features/auth/lib/auth-service";
import { logout } from "@/features/auth/lib/session-store";
import { cn } from "@/lib/utils";
import type { Role } from "@/lib/types/domain";

interface UserMenuProps {
  user: {
    name: string;
    email: string;
    role: Role;
  };
  variant?: "light" | "dark";
}

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const second = parts[1]?.[0] ?? "";
  return (first + second).toUpperCase() || "?";
}

export function UserMenu({ user, variant = "dark" }: UserMenuProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const dashboardRoute = getDashboardRoute(user.role);

  async function handleLogout() {
    await logout();
    startTransition(() => {
      router.push("/");
      router.refresh();
    });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label={`Abrir menú de ${user.name}`}
          className={cn(
            "inline-flex items-center gap-2 rounded-full border bg-white px-2 py-1 pr-3 text-sm font-semibold transition-colors",
            variant === "light"
              ? "border-white/40 bg-white/10 text-white hover:bg-white/20"
              : "border-black/10 text-body-color hover:border-primary-500/40 hover:text-primary-500"
          )}
        >
          <span
            className={cn(
              "flex size-8 items-center justify-center rounded-full text-xs font-extrabold",
              variant === "light" ? "bg-white text-primary-500" : "bg-primary-500 text-white"
            )}
          >
            {getInitials(user.name)}
          </span>
          <span className="hidden max-w-[140px] truncate sm:inline">{user.name}</span>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="flex flex-col gap-0.5">
          <span className="text-sm font-semibold text-body-color">{user.name}</span>
          <span className="truncate text-xs font-normal text-body-color/70">{user.email}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={dashboardRoute} className="flex items-center gap-2">
            <UserRound className="size-4" />
            Mi cuenta
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={handleLogout} disabled={isPending} className="flex items-center gap-2 text-destructive focus:text-destructive">
          <LogOut className="size-4" />
          Cerrar sesión
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
