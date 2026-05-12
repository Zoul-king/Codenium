"use client";

import Link from "next/link";
import {
  Bell,
  CreditCard,
  FileText,
  FolderKanban,
  Home,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  PackageCheck,
  Search,
  UserRound,
  Users
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { CommandPalette, useCommandPaletteState } from "@/features/dashboard/components/shell/command-palette";
import { DashboardChromeProvider } from "@/features/dashboard/components/primitives";
import { getPendingMessages, getPrimaryUser } from "@/features/dashboard/lib/selectors";
import { useDashboardWorkspace } from "@/features/dashboard/lib/workspace-store";
import { logout } from "@/features/auth/lib/session-store";
import { dashboardNav } from "@/lib/config/catalogs";
import type { Role } from "@/lib/types/domain";
import { cn } from "@/lib/utils";

interface DashboardShellProps {
  role: Role;
  activeKey: string;
  children: ReactNode;
}

const panelLabelByRole: Record<Role, string> = {
  client: "Cliente",
  pm: "Project Manager",
  admin: "Administración"
};

const fallbackUserByRole: Record<Role, { name: string; initials: string; email: string }> = {
  client: { name: "Cuenta cliente", initials: "C", email: "" },
  pm: { name: "Project Manager", initials: "PM", email: "" },
  admin: { name: "Administración", initials: "A", email: "" }
};

function deriveInitials(name: string): string {
  return (
    name
      .split(/\s+/)
      .filter(Boolean)
      .map((part) => part[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "?"
  );
}

export function DashboardShell({ role, activeKey, children }: DashboardShellProps) {
  const router = useRouter();
  const { state } = useDashboardWorkspace();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const commandPalette = useCommandPaletteState();

  // Diferimos el Sheet móvil hasta después del mount para evitar el mismatch de
  // IDs de Radix (useId) entre SSR y cliente: el sidebar se renderiza tanto en
  // el aside desktop como dentro del Sheet, y el portal de Radix puede asignar
  // ids distintos según el orden de montaje.
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const unreadMessages = getPendingMessages(state, role).length;
  const sessionUser = getPrimaryUser(state, role);
  const user = sessionUser
    ? {
        name: sessionUser.name,
        initials: deriveInitials(sessionUser.name),
        email: sessionUser.email
      }
    : fallbackUserByRole[role];

  async function handleLogout() {
    await logout();
    router.push("/");
  }

  const sidebar = (
    <SidebarContent
      role={role}
      activeKey={activeKey}
      unreadMessages={unreadMessages}
      onNavigate={() => setSidebarOpen(false)}
      onOpenSearch={() => {
        setSidebarOpen(false);
        commandPalette.setOpen(true);
      }}
      onLogout={handleLogout}
      user={user}
      onProfile={() => {
        setSidebarOpen(false);
        router.push(`/dashboard/${role}/profile`);
      }}
      onHome={() => {
        setSidebarOpen(false);
        router.push("/");
      }}
    />
  );

  return (
    <DashboardChromeProvider role={role} activeKey={activeKey}>
      <div className="role-themed min-h-dvh bg-slate-50/60" data-role={role}>
        <div className="grid h-dvh overflow-hidden lg:grid-cols-[280px_minmax(0,1fr)]">
          {/* Desktop sidebar */}
          <aside className="hidden border-r border-slate-200 bg-white lg:flex lg:flex-col">
            {sidebar}
          </aside>

          {/* Mobile sidebar — montado sólo después del hydration. */}
          {mounted ? (
            <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
              <SheetContent side="left" className="w-[300px] p-0 sm:w-[320px]">
                <SheetTitle className="sr-only">Menú lateral</SheetTitle>
                <SidebarContent
                  role={role}
                  activeKey={activeKey}
                  unreadMessages={unreadMessages}
                  onNavigate={() => setSidebarOpen(false)}
                  onOpenSearch={() => {
                    setSidebarOpen(false);
                    commandPalette.setOpen(true);
                  }}
                  onLogout={handleLogout}
                  user={user}
                  onProfile={() => {
                    setSidebarOpen(false);
                    router.push(`/dashboard/${role}/profile`);
                  }}
                  onHome={() => {
                    setSidebarOpen(false);
                    router.push("/");
                  }}
                />
              </SheetContent>
            </Sheet>
          ) : null}

          <main className="relative flex min-w-0 flex-col overflow-hidden">
            {/* Mobile-only floating menu trigger (replaces the removed topbar) */}
            <Button
              variant="outline"
              size="icon-sm"
              className="absolute left-2 top-2 z-20 size-9 border-slate-200 bg-white shadow-sm sm:left-3 sm:top-3 lg:hidden"
              onClick={() => setSidebarOpen(true)}
              aria-label="Abrir menú"
            >
              <Menu className="size-4" />
            </Button>

            <ScrollArea className="min-h-0 flex-1">
              <div className="px-4 py-6 lg:px-8 lg:py-8">{children}</div>
            </ScrollArea>
          </main>
        </div>

        <CommandPalette role={role} open={commandPalette.open} onOpenChange={commandPalette.setOpen} />
      </div>
    </DashboardChromeProvider>
  );
}

interface SidebarContentProps {
  role: Role;
  activeKey: string;
  unreadMessages: number;
  onNavigate: () => void;
  onOpenSearch: () => void;
  onLogout: () => void;
  onProfile: () => void;
  onHome: () => void;
  user: { name: string; initials: string; email: string };
}

function SidebarContent({
  role,
  activeKey,
  unreadMessages,
  onNavigate,
  onOpenSearch,
  onLogout,
  onProfile,
  onHome,
  user
}: SidebarContentProps) {
  return (
    <>
      <div className="border-b border-slate-200 px-5 py-5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <span className="grid size-9 shrink-0 place-items-center rounded-[12px] bg-[var(--role-strong,#224a78)] text-sm font-bold text-white">
              C
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-slate-950">Codenium</p>
              <p className="truncate text-[11px] font-medium text-slate-500">{panelLabelByRole[role]}</p>
            </div>
          </div>
          <NotificationsBell unreadMessages={unreadMessages} />
        </div>

        <button
          type="button"
          onClick={onOpenSearch}
          className="mt-4 flex w-full items-center gap-2 rounded-[12px] border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
        >
          <Search className="size-3.5" />
          Buscar
          <span className="ml-auto inline-flex items-center gap-0.5 rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[10px] font-semibold text-slate-500">
            ⌘K
          </span>
        </button>
      </div>

      <ScrollArea className="min-h-0 flex-1 px-3 py-4">
        <nav className="space-y-1">
          {dashboardNav[role].map((item) => {
            const Icon = getNavIcon(item.key);
            const isActive = item.key === activeKey;

            return (
              <Link
                key={item.key}
                href={item.href}
                onClick={onNavigate}
                className={cn(
                  "flex items-center justify-between gap-3 rounded-[12px] px-3 py-2.5 text-sm font-semibold transition",
                  isActive
                    ? "bg-[var(--role-strong,#224a78)] text-white shadow-[0_8px_18px_rgba(15,23,42,0.16)]"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                )}
              >
                <span className="flex items-center gap-3">
                  <Icon className="size-4" />
                  {item.label}
                </span>
                {item.key === "chat" && unreadMessages > 0 ? (
                  <Badge
                    variant="secondary"
                    className={cn(
                      "h-5 min-w-5 justify-center px-1.5 text-[10px]",
                      isActive ? "bg-white/20 text-white" : "bg-error-50 text-error-700"
                    )}
                  >
                    {unreadMessages}
                  </Badge>
                ) : null}
              </Link>
            );
          })}
        </nav>
      </ScrollArea>

      <div className="border-t border-slate-200 px-3 py-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="flex w-full items-center gap-3 rounded-[12px] border border-transparent px-2 py-2 text-left transition hover:border-slate-200 hover:bg-slate-50"
            >
              <Avatar className="size-8">
                <AvatarFallback className="bg-[var(--role-soft,#eff6fb)] text-xs font-semibold text-[var(--role-strong,#224a78)]">
                  {user.initials}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-slate-950">{user.name}</p>
                <p className="truncate text-[11px] text-slate-500">{user.email}</p>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" side="top" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-slate-950">{user.name}</span>
                <span className="text-xs text-slate-500">{user.email}</span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onProfile}>
              <UserRound className="size-4" />
              Mi perfil
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onHome}>
              <Home className="size-4" />
              Volver al inicio
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onLogout} variant="destructive">
              <LogOut className="size-4" />
              Cerrar sesión
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
}

function NotificationsBell({ unreadMessages }: { unreadMessages: number }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon-sm" className="relative shrink-0" aria-label="Notificaciones">
          <Bell className="size-4" />
          {unreadMessages > 0 ? (
            <span className="absolute right-1 top-1 inline-flex size-1.5 rounded-full bg-error-500" />
          ) : null}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-3">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-sm font-semibold text-slate-950">Notificaciones</p>
          {unreadMessages > 0 ? (
            <Badge variant="secondary" className="bg-error-50 text-error-700">
              {unreadMessages}
            </Badge>
          ) : null}
        </div>
        {unreadMessages > 0 ? (
          <div className="rounded-[12px] border border-slate-200 bg-white p-3 text-sm">
            <p className="font-medium text-slate-950">Tienes {unreadMessages} mensajes nuevos</p>
            <p className="mt-1 text-xs text-slate-500">Revisa la sección de chat para ponerte al día.</p>
          </div>
        ) : (
          <p className="rounded-[12px] bg-slate-50 p-3 text-xs text-slate-500">
            No tienes notificaciones pendientes.
          </p>
        )}
      </PopoverContent>
    </Popover>
  );
}

function getNavIcon(key: string) {
  if (key === "projects" || key === "metrics") return LayoutDashboard;
  if (key === "plans") return PackageCheck;
  if (key === "milestones") return FolderKanban;
  if (key === "chat") return MessageSquare;
  if (key === "payments") return CreditCard;
  if (key === "deliverables") return PackageCheck;
  if (key === "profile") return UserRound;
  if (key === "quotes") return FileText;
  if (key === "users") return Users;

  return Home;
}
