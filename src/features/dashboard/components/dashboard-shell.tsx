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
  return (
    <section className="h-full bg-[linear-gradient(180deg,#f8fafc_0%,#eef2ff_100%)] px-3 py-3 lg:px-4 lg:py-4">
      <div className="grid h-full overflow-hidden rounded-[24px] border border-slate-200/90 bg-white/80 shadow-[0_18px_44px_rgba(15,23,42,0.06)] lg:grid-cols-[240px_1fr]">
        <aside className="flex min-h-0 flex-col border-b border-slate-200/90 bg-[linear-gradient(180deg,rgba(255,255,255,0.96)_0%,rgba(248,250,252,0.98)_100%)] p-4 lg:border-b-0 lg:border-r">
          <div className="border-b border-slate-200/90 pb-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Panel</p>
            <h2 className="mt-2 text-xl font-bold tracking-tight text-slate-950">{panelLabelByRole[role]}</h2>
          </div>

          <nav className="custom-scrollbar mt-4 flex-1 space-y-1 overflow-y-auto pr-2">
            {dashboardNav[role].map((item) => (
              <Link
                key={item.key}
                href={item.href}
                className={`flex items-center border-l-2 px-3 py-3 text-sm font-bold transition-all duration-200 ${
                  item.key === activeKey
                    ? "border-primary-500 bg-primary-50 text-primary-700"
                    : "border-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="mt-10 border-t border-slate-100 pt-5">
            <SidebarActions />
          </div>
        </aside>

        <main className="relative flex min-h-0 flex-col overflow-hidden bg-[linear-gradient(180deg,rgba(255,255,255,0.74)_0%,rgba(248,250,252,0.92)_100%)]">
          <div className="custom-scrollbar flex-1 overflow-y-auto p-4 lg:p-6">
            {children}
          </div>
        </main>
      </div>
    </section>
  );
}
