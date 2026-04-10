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
    <section className="h-full px-3 py-3 lg:px-4 lg:py-4">
      <div className="grid h-full overflow-hidden rounded-[28px] border border-white/70 bg-white/90 shadow-[0_22px_56px_rgba(15,23,42,0.08)] backdrop-blur-[10px] lg:grid-cols-[260px_1fr]">
        <aside className="flex min-h-0 flex-col border-b border-slate-200/80 bg-[linear-gradient(180deg,rgba(248,250,252,0.98)_0%,rgba(241,245,249,0.92)_100%)] p-4 lg:border-b-0 lg:border-r">
          <div className="border-b border-slate-200/80 pb-4">
            <h2 className="text-xl font-bold tracking-tight text-slate-950">{panelLabelByRole[role]}</h2>
          </div>

          <nav className="custom-scrollbar mt-4 flex-1 space-y-1 overflow-y-auto pr-2">
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

          <div className="mt-10 border-t border-slate-100 pt-5">
            <SidebarActions />
          </div>
        </aside>

        <main className="relative flex min-h-0 flex-col overflow-hidden bg-white/82">
          <div className="custom-scrollbar flex-1 overflow-y-auto p-4 lg:p-6">
            {children}
          </div>
        </main>
      </div>
    </section>
  );
}
