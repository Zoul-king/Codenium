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
  client: "Panel de cliente",
  pm: "Panel de PM",
  admin: "Panel de admin"
};

export function DashboardShell({ role, activeKey, children }: DashboardShellProps) {
  return (
    <section className="mx-auto h-screen max-w-[1680px] overflow-hidden p-3 lg:p-4">
      <div className="grid h-full gap-4 lg:grid-cols-[260px_1fr]">
        <aside className="flex flex-col rounded-[24px] border border-white/70 bg-white/92 p-4 shadow-sm backdrop-blur-[10px] lg:h-full">
          <div className="border-b border-slate-100 pb-4">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Workspace</span>
            <h2 className="mt-2 text-xl font-bold tracking-tight text-slate-950">{panelLabelByRole[role]}</h2>
          </div>

          <nav className="mt-4 flex-1 space-y-1 overflow-y-auto pr-2 custom-scrollbar">
            {dashboardNav[role].map((item) => (
              <Link
                key={item.key}
                href={item.href}
                className={`flex items-center rounded-xl px-3 py-2.5 text-sm font-bold transition-all duration-200 ${
                  item.key === activeKey
                    ? "bg-primary-500 text-white shadow-md shadow-primary-500/20"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="mt-4 border-t border-slate-100 pt-4">
            <SidebarActions />
          </div>
        </aside>

        <main className="relative flex flex-col overflow-hidden rounded-[28px] border border-white/70 bg-white/82 shadow-sm backdrop-blur-[10px] lg:h-full">
          <div className="flex-1 overflow-y-auto p-4 lg:p-6 custom-scrollbar">
            {children}
          </div>
        </main>
      </div>
    </section>

  );
}
