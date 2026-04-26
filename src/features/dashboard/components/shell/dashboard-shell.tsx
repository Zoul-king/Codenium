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
import { useMemo, useState, type ReactNode } from "react";

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
import { DashboardChromeProvider } from "@/features/dashboard/components/primitives";
import {
  getPendingMessages,
  getSelectedProject,
  getVisibleProjects,
  getVisibleQuotes
} from "@/features/dashboard/lib/selectors";
import { useDashboardWorkspace } from "@/features/dashboard/lib/workspace-store";
import { clearSession } from "@/features/auth/lib/session-store";
import { dashboardNav } from "@/lib/mocks";
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

const userByRole: Record<Role, { name: string; initials: string; email: string }> = {
  client: { name: "Carolina Rivera", initials: "CR", email: "client@codenium.com" },
  pm: { name: "Mateo Fuentes", initials: "MF", email: "pm@codenium.com" },
  admin: { name: "Equipo Codenium", initials: "EC", email: "admin@codenium.com" }
};

export function DashboardShell({ role, activeKey, children }: DashboardShellProps) {
  const router = useRouter();
  const { state } = useDashboardWorkspace();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const visibleProjects = getVisibleProjects(state, role);
  const visibleQuotes = getVisibleQuotes(state, role);
  const unreadMessages = getPendingMessages(state, role).length;
  const selectedProject =
    role === "client" || role === "pm" ? getSelectedProject(state, role) : undefined;
  const activeItem = dashboardNav[role].find((item) => item.key === activeKey);

  const summary = useMemo(() => {
    if (role === "client") {
      return {
        title: panelLabelByRole[role],
        subtitle: selectedProject?.name ?? "Selecciona un proyecto",
        helper:
          unreadMessages > 0
            ? `${unreadMessages} mensajes pendientes`
            : `${visibleProjects.length} proyectos visibles`
      };
    }

    if (role === "pm") {
      const activeCount = visibleProjects.filter((project) => project.status !== "done").length;

      return {
        title: panelLabelByRole[role],
        subtitle: selectedProject?.name ?? "Selecciona un proyecto",
        helper:
          unreadMessages > 0
            ? `${unreadMessages} conversaciones por revisar`
            : `${activeCount} proyectos en curso`
      };
    }

    return {
      title: panelLabelByRole[role],
      subtitle: `${visibleQuotes.length} cotizaciones`,
      helper: `${state.users.length} usuarios`
    };
  }, [
    role,
    selectedProject?.name,
    state.users.length,
    unreadMessages,
    visibleProjects,
    visibleQuotes.length
  ]);

  function handleLogout() {
    clearSession();
    router.push("/");
  }

  const user = userByRole[role];

  const sidebar = (
    <SidebarContent
      role={role}
      activeKey={activeKey}
      summary={summary}
      unreadMessages={unreadMessages}
      onNavigate={() => setSidebarOpen(false)}
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

          {/* Mobile sidebar */}
          <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetContent side="left" className="w-[300px] p-0 sm:w-[320px]">
              <SheetTitle className="sr-only">Menú lateral</SheetTitle>
              {sidebar}
            </SheetContent>
          </Sheet>

          <main className="flex min-w-0 flex-col overflow-hidden">
            {/* Topbar */}
            <header className="flex items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 py-3 lg:px-8">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="lg:hidden"
                  onClick={() => setSidebarOpen(true)}
                  aria-label="Abrir menú"
                >
                  <Menu className="size-4" />
                </Button>
                <div className="flex flex-col">
                  <p className="text-xs font-medium text-slate-500">{panelLabelByRole[role]}</p>
                  <p className="text-sm font-semibold text-slate-950">
                    {activeItem?.label ?? "Dashboard"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button type="button" className="cmd-trigger hidden md:inline-flex" disabled>
                  <Search className="size-3.5" />
                  Buscar
                  <span className="cmd-kbd ml-2">⌘K</span>
                </button>

                <NotificationsBell unreadMessages={unreadMessages} />

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      className="flex items-center gap-2 rounded-[12px] border border-slate-200 bg-white p-1 pr-3 transition hover:border-slate-300"
                    >
                      <Avatar className="size-7">
                        <AvatarFallback className="bg-[var(--role-soft,#eff6fb)] text-xs font-semibold text-[var(--role-strong,#224a78)]">
                          {user.initials}
                        </AvatarFallback>
                      </Avatar>
                      <span className="hidden text-xs font-medium text-slate-700 sm:inline">
                        {user.name}
                      </span>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-slate-950">{user.name}</span>
                        <span className="text-xs text-slate-500">{user.email}</span>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => router.push(`/dashboard/${role}/profile`)}>
                      <UserRound className="size-4" />
                      Mi perfil
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push("/")}>
                      <Home className="size-4" />
                      Volver al inicio
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} variant="destructive">
                      <LogOut className="size-4" />
                      Cerrar sesión
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </header>

            <ScrollArea className="flex-1">
              <div className="px-4 py-6 lg:px-8 lg:py-8">{children}</div>
            </ScrollArea>
          </main>
        </div>
      </div>
    </DashboardChromeProvider>
  );
}

interface SidebarContentProps {
  role: Role;
  activeKey: string;
  summary: { title: string; subtitle: string; helper: string };
  unreadMessages: number;
  onNavigate: () => void;
}

function SidebarContent({ role, activeKey, summary, unreadMessages, onNavigate }: SidebarContentProps) {
  return (
    <>
      <div className="border-b border-slate-200 px-5 py-5">
        <div className="flex items-center gap-3">
          <span className="grid size-9 place-items-center rounded-[12px] bg-[var(--role-strong,#224a78)] text-sm font-bold text-white">
            C
          </span>
          <div className="min-w-0">
            <p className="text-sm font-bold text-slate-950">Codenium</p>
            <p className="text-[11px] font-medium text-slate-500">{summary.title}</p>
          </div>
        </div>
        <div className="mt-4 rounded-[16px] border border-slate-200 bg-[var(--role-soft,#f8fafc)] p-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--role-strong,#224a78)]">
            Contexto
          </p>
          <p className="mt-1 truncate text-sm font-semibold text-slate-950">{summary.subtitle}</p>
          <p className="mt-1 text-[11px] font-medium text-slate-500">{summary.helper}</p>
        </div>
      </div>

      <ScrollArea className="flex-1 px-3 py-4">
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

      <div className="border-t border-slate-200 px-5 py-4">
        <Link
          href={`/dashboard/${role}/profile`}
          className="flex items-center gap-3 rounded-[12px] border border-transparent px-2 py-2 transition hover:border-slate-200 hover:bg-slate-50"
        >
          <Avatar className="size-8">
            <AvatarFallback className="bg-[var(--role-soft,#eff6fb)] text-xs font-semibold text-[var(--role-strong,#224a78)]">
              {userByRole[role].initials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-950">{userByRole[role].name}</p>
            <p className="truncate text-[11px] text-slate-500">{userByRole[role].email}</p>
          </div>
        </Link>
      </div>
    </>
  );
}

function NotificationsBell({ unreadMessages }: { unreadMessages: number }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon-sm" className="relative" aria-label="Notificaciones">
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
