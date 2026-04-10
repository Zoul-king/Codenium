"use client";

import Link from "next/link";
import { CreditCard, FileText, FolderKanban, Home, LayoutDashboard, Menu, MessageSquare, PackageCheck, UserRound, Users, X } from "lucide-react";
import { useMemo, useState, type ReactNode } from "react";

import { DashboardChromeProvider } from "@/features/dashboard/components/dashboard-ui";
import { SidebarActions } from "@/features/dashboard/components/sidebar-actions";
import { getPendingMessages, getVisibleProjects, getVisibleQuotes } from "@/features/dashboard/lib/selectors";
import { useDashboardWorkspace } from "@/features/dashboard/lib/workspace-store";
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
  admin: "Admin"
};

export function DashboardShell({ role, activeKey, children }: DashboardShellProps) {
  const { state } = useDashboardWorkspace();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const activeItem = dashboardNav[role].find((item) => item.key === activeKey);
  const visibleProjects = getVisibleProjects(state, role);
  const visibleQuotes = getVisibleQuotes(state, role);
  const unreadMessages = getPendingMessages(state, role).length;
  const summary = useMemo(() => {
    if (role === "client") {
      const activeProject = visibleProjects[0];

      return {
        title: "Cliente",
        subtitle: activeProject ? `${activeProject.name} · ${activeProject.progress}%` : "Sin proyecto activo",
        helper: unreadMessages > 0 ? `${unreadMessages} mensajes pendientes` : "Todo al dia"
      };
    }

    if (role === "pm") {
      const activeCount = visibleProjects.filter((project) => project.status !== "done").length;

      return {
        title: "Project Manager",
        subtitle: `${activeCount} proyectos en curso`,
        helper: unreadMessages > 0 ? `${unreadMessages} conversaciones por revisar` : "Carga estable"
      };
    }

    const pendingPayments = state.payments.filter((payment) => payment.status !== "paid").length;

    return {
      title: "Admin",
      subtitle: `${visibleQuotes.length} cotizaciones · ${state.users.length} usuarios`,
      helper: `${pendingPayments} pagos por revisar`
    };
  }, [role, state.payments, state.users.length, unreadMessages, visibleProjects, visibleQuotes.length]);
  const shellClassName =
    role === "client"
      ? "bg-[#f7fbfc]"
      : role === "pm"
        ? "bg-[#f4f7fb]"
        : "bg-[#f5f7fa]";
  const sidebarClassName =
    role === "client"
      ? "border-[#dbe7ee] bg-[#fdfefe]"
      : role === "pm"
        ? "border-[#dde3ec] bg-[#fbfcfe]"
        : "border-[#dbe0e8] bg-white";

  return (
    <DashboardChromeProvider role={role} activeKey={activeKey}>
      <section className={cn("min-h-screen px-3 py-3 lg:px-4 lg:py-4", shellClassName)}>
        <div className="grid min-h-[calc(100vh-1.5rem)] overflow-hidden rounded-[32px] border border-white/80 bg-white shadow-[0_24px_64px_rgba(15,23,42,0.08)] lg:grid-cols-[288px_minmax(0,1fr)]">
          <aside
            className={cn(
              "fixed inset-y-3 left-3 z-40 w-[min(88vw,320px)] rounded-[28px] border p-5 shadow-[0_20px_50px_rgba(15,23,42,0.16)] transition-transform duration-300 lg:static lg:inset-auto lg:w-auto lg:rounded-none lg:border-0 lg:border-r lg:shadow-none",
              sidebarClassName,
              sidebarOpen ? "translate-x-0" : "-translate-x-[115%] lg:translate-x-0"
            )}
          >
            <div className="flex items-center justify-between gap-3 lg:hidden">
              <p className="text-sm font-semibold text-slate-900">{summary.title}</p>
              <button type="button" onClick={() => setSidebarOpen(false)} className="rounded-[12px] border border-slate-200 p-2 text-slate-600">
                <X className="size-4" />
              </button>
            </div>

            <div className="mt-4 rounded-[24px] border border-slate-200 bg-white px-4 py-4 lg:mt-0">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Workspace</p>
              <h2 className="mt-3 text-[26px] font-semibold tracking-[-0.05em] text-slate-950">{panelLabelByRole[role]}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">{summary.subtitle}</p>
              <p className="mt-2 text-sm font-medium text-slate-500">{summary.helper}</p>
            </div>

            <nav className="custom-scrollbar mt-6 flex-1 space-y-2 overflow-y-auto pr-1">
              {dashboardNav[role].map((item) => {
                const Icon = getNavIcon(item.key);

                return (
                  <Link
                    key={item.key}
                    href={item.href}
                    className={cn(
                      "flex items-center justify-between gap-3 rounded-[18px] border px-4 py-3 text-sm font-semibold transition",
                      item.key === activeKey
                        ? "border-slate-900 bg-slate-950 text-white shadow-[0_14px_24px_rgba(15,23,42,0.16)]"
                        : "border-transparent bg-transparent text-slate-600 hover:border-slate-200 hover:bg-white hover:text-slate-950"
                    )}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <span className="flex items-center gap-3">
                      <Icon className="size-4" />
                      {item.label}
                    </span>
                    {item.key === "chat" && unreadMessages > 0 ? <span className="rounded-[10px] bg-white/16 px-2 py-1 text-[10px] font-semibold">{unreadMessages}</span> : null}
                  </Link>
                );
              })}
            </nav>

            <div className="mt-8 rounded-[24px] border border-slate-200 bg-white px-4 py-4">
              <SidebarActions />
            </div>
          </aside>

          {sidebarOpen ? <button type="button" className="fixed inset-0 z-30 bg-slate-950/20 lg:hidden" onClick={() => setSidebarOpen(false)} aria-label="Cerrar menu lateral" /> : null}

          <main className="min-w-0 bg-white">
            <div className="border-b border-slate-200/80 px-4 py-4 lg:px-8 lg:py-5">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 rounded-[14px] border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 lg:hidden"
                    onClick={() => setSidebarOpen(true)}
                  >
                    <Menu className="size-4" />
                    Menu
                  </button>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">{panelLabelByRole[role]}</p>
                    <p className="mt-1 text-sm font-medium text-slate-900">{activeItem?.label ?? "Dashboard"}</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {getTopRail(role, visibleProjects.length, visibleQuotes.length, state.users.length).map((item) => (
                    <span key={item.label} className="rounded-[14px] border border-slate-200 bg-slate-50 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-600">
                      {item.label}: {item.value}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="px-4 py-5 lg:px-8 lg:py-8">{children}</div>
          </main>
        </div>
      </section>
    </DashboardChromeProvider>
  );
}

function getNavIcon(key: string) {
  if (key === "projects" || key === "metrics") return LayoutDashboard;
  if (key === "milestones") return FolderKanban;
  if (key === "chat") return MessageSquare;
  if (key === "payments") return CreditCard;
  if (key === "deliverables") return PackageCheck;
  if (key === "profile") return UserRound;
  if (key === "quotes") return FileText;
  if (key === "users") return Users;

  return Home;
}

function getTopRail(role: Role, projectCount: number, quoteCount: number, userCount: number) {
  if (role === "client") {
    return [
      { label: "Proyectos", value: String(projectCount) },
      { label: "Vista", value: "Seguimiento" }
    ];
  }

  if (role === "pm") {
    return [
      { label: "Operando", value: String(projectCount) },
      { label: "Vista", value: "Pipeline" }
    ];
  }

  return [
    { label: "Cotizaciones", value: String(quoteCount) },
    { label: "Usuarios", value: String(userCount) },
    { label: "Vista", value: "Control" }
  ];
}
