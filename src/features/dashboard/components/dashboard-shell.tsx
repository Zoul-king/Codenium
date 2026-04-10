import Link from "next/link";
import type { ReactNode } from "react";

import { SidebarActions } from "@/features/dashboard/components/sidebar-actions";
import { dashboardNav } from "@/lib/mocks";
import type { Role } from "@/lib/types/domain";

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
  const activeItem = dashboardNav[role].find((item) => item.key === activeKey);

  return (
    <section className="min-h-screen bg-[#0b1020] px-3 py-3 lg:px-4 lg:py-4">
      <div className="grid min-h-[calc(100vh-1.5rem)] overflow-hidden rounded-[28px] border border-white/10 bg-[#0f172a] shadow-[0_30px_80px_rgba(2,8,23,0.45)] lg:grid-cols-[276px_minmax(0,1fr)]">
        <aside className="flex min-h-0 flex-col border-b border-white/10 bg-[linear-gradient(180deg,#0f172a_0%,#111b31_100%)] px-4 py-5 lg:border-b-0 lg:border-r lg:px-5">
          <div className="border-b border-white/10 pb-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">Workspace</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-white">{panelLabelByRole[role]}</h2>
          </div>

          <nav className="custom-scrollbar mt-5 flex-1 space-y-1 overflow-y-auto pr-1">
            {dashboardNav[role].map((item) => (
              <Link
                key={item.key}
                href={item.href}
                className={`dashboard-sidebar-link ${item.key === activeKey ? "is-active" : ""}`}
              >
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          <div className="mt-8 border-t border-white/10 pt-5">
            <SidebarActions />
          </div>
        </aside>

        <main className="min-w-0 bg-[linear-gradient(180deg,#f8fafc_0%,#eef2ff_100%)]">
          <div className="border-b border-slate-200 bg-white/72 px-5 py-4 backdrop-blur-xl lg:px-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">{panelLabelByRole[role]}</p>
                <h1 className="mt-2 text-xl font-semibold tracking-[-0.04em] text-slate-950">{activeItem?.label ?? "Dashboard"}</h1>
              </div>
              <div className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                Vista operativa
              </div>
            </div>
          </div>

          <div className="px-4 py-5 lg:px-8 lg:py-7">{children}</div>
        </main>
      </div>
    </section>
  );
}
