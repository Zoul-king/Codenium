"use client";

import Link from "next/link";
import { CreditCard, FileText, FolderKanban, Home, LayoutDashboard, Menu, MessageSquare, PackageCheck, UserRound, Users, X } from "lucide-react";
import { useMemo, useState, type ReactNode } from "react";

import { DashboardChromeProvider } from "@/features/dashboard/components/dashboard-ui";
import { SidebarActions } from "@/features/dashboard/components/sidebar-actions";
import { getPendingMessages, getSelectedProject, getVisibleProjects, getVisibleQuotes } from "@/features/dashboard/lib/selectors";
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
  pm: "PM",
  admin: "Admin"
};

export function DashboardShell({ role, activeKey, children }: DashboardShellProps) {
  const { state } = useDashboardWorkspace();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const activeItem = dashboardNav[role].find((item) => item.key === activeKey);
  const visibleProjects = getVisibleProjects(state, role);
  const visibleQuotes = getVisibleQuotes(state, role);
  const unreadMessages = getPendingMessages(state, role).length;
  const selectedProject = role === "client" || role === "pm" ? getSelectedProject(state, role) : undefined;

  const summary = useMemo(() => {
    if (role === "client") {
      return {
        title: panelLabelByRole[role],
        subtitle: selectedProject?.name ?? "Selecciona un proyecto",
        helper: unreadMessages > 0 ? `${unreadMessages} mensajes pendientes` : `${visibleProjects.length} proyectos visibles`
      };
    }

    if (role === "pm") {
      const activeCount = visibleProjects.filter((project) => project.status !== "done").length;

      return {
        title: panelLabelByRole[role],
        subtitle: selectedProject?.name ?? "Selecciona un proyecto",
        helper: unreadMessages > 0 ? `${unreadMessages} conversaciones por revisar` : `${activeCount} proyectos en curso`
      };
    }

    return {
      title: panelLabelByRole[role],
      subtitle: `${visibleQuotes.length} cotizaciones`,
      helper: `${state.users.length} usuarios`
    };
  }, [role, selectedProject?.name, state.users.length, unreadMessages, visibleProjects, visibleQuotes.length]);

  const shellClassName = role === "client" ? "bg-[#f7fbfc]" : role === "pm" ? "bg-[#f4f7fb]" : "bg-[#f5f7fa]";
  const sidebarClassName = role === "client" ? "border-[#dbe7ee] bg-[#fdfefe]" : role === "pm" ? "border-[#dde3ec] bg-[#fbfcfe]" : "border-[#dbe0e8] bg-white";

  return (
    <DashboardChromeProvider role={role} activeKey={activeKey}>
      <section className={cn("h-dvh", shellClassName)}>
        <div className="grid h-full overflow-hidden bg-white lg:grid-cols-[260px_minmax(0,1fr)]">
          <aside
            className={cn(
              "fixed inset-y-2 left-2 z-40 w-[min(88vw,300px)] rounded-[22px] border p-4 shadow-[0_20px_50px_rgba(15,23,42,0.16)] transition-transform duration-300 lg:static lg:inset-auto lg:w-auto lg:rounded-none lg:border-0 lg:border-r lg:px-4 lg:py-5 lg:shadow-none",
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

            <div className="mt-3 rounded-[18px] border border-slate-200 bg-white px-4 py-4 lg:mt-0">
              <h2 className="text-[18px] font-semibold tracking-[-0.04em] text-slate-950">{summary.title}</h2>
              <p className="mt-2 text-sm leading-5 text-slate-600">{summary.subtitle}</p>
              <p className="mt-1.5 text-xs font-medium text-slate-500">{summary.helper}</p>
            </div>

            <nav className="custom-scrollbar mt-5 flex-1 space-y-1.5 overflow-y-auto pr-1">
              {dashboardNav[role].map((item) => {
                const Icon = getNavIcon(item.key);

                return (
                  <Link
                    key={item.key}
                    href={item.href}
                    className={cn(
                      "flex items-center justify-between gap-3 rounded-[15px] border px-3.5 py-2.5 text-sm font-semibold transition",
                      item.key === activeKey
                        ? "border-[#4f2f96] bg-[#4f2f96] text-white shadow-[0_14px_24px_rgba(79,47,150,0.16)]"
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

            <div className="mt-6 rounded-[18px] border border-slate-200 bg-white px-4 py-4">
              <SidebarActions />
            </div>
          </aside>

          {sidebarOpen ? <button type="button" className="fixed inset-0 z-30 bg-slate-950/20 lg:hidden" onClick={() => setSidebarOpen(false)} aria-label="Cerrar menu lateral" /> : null}

          <main className="custom-scrollbar min-w-0 overflow-y-auto bg-white">
            <div className="border-b border-slate-200/80 px-4 py-3 lg:px-6 lg:py-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 rounded-[12px] border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 lg:hidden"
                    onClick={() => setSidebarOpen(true)}
                  >
                    <Menu className="size-4" />
                    Menu
                  </button>
                  <p className="text-sm font-medium text-slate-900">{activeItem?.label ?? "Dashboard"}</p>
                </div>
                <p className="text-xs text-slate-500">{getRailText(role, visibleProjects.length, visibleQuotes.length, state.users.length)}</p>
              </div>
            </div>

            <div className="px-4 py-4 lg:px-6 lg:py-5">{children}</div>
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

function getRailText(role: Role, projectCount: number, quoteCount: number, userCount: number) {
  if (role === "client") {
    return `${projectCount} proyectos visibles`;
  }

  if (role === "pm") {
    return `${projectCount} proyectos asignados`;
  }

  return `${quoteCount} cotizaciones · ${userCount} usuarios`;
}
