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
    <section className="mx-auto min-h-dvh max-w-[1600px] px-4 py-4 lg:h-[100dvh] lg:px-6 lg:py-6">
      <div className="grid gap-5 lg:h-full lg:grid-cols-[284px_minmax(0,1fr)]">
        <aside className="flex flex-col rounded-[30px] border border-white/70 bg-white/92 p-5 shadow-[0_20px_50px_rgba(15,23,42,0.08)] backdrop-blur-[10px] lg:h-full">
          <div className="border-b border-slate-200 pb-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Workspace</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-slate-950">{panelLabelByRole[role]}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">Secciones ordenadas por decisiones, seguimiento y acciones reales.</p>
          </div>

          <nav className="mt-6 flex-1 space-y-2">
            {dashboardNav[role].map((item) => (
              <Link
                key={item.key}
                href={item.href}
                className={`flex items-center rounded-[18px] px-4 py-3 text-sm font-semibold transition-all duration-200 ${
                  item.key === activeKey
                    ? "bg-[linear-gradient(135deg,#1f4d73_0%,#2f6f8d_48%,#4ca3a0_100%)] text-white shadow-[0_18px_30px_rgba(31,77,115,0.22)]"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="mt-6 border-t border-slate-200 pt-5">
            <SidebarActions />
          </div>
        </aside>

        <main className="rounded-[34px] border border-white/70 bg-white/82 p-5 shadow-[0_20px_50px_rgba(15,23,42,0.08)] backdrop-blur-[10px] lg:h-full lg:overflow-hidden lg:p-7">
          <div className="lg:h-full">{children}</div>
        </main>
      </div>
    </section>
  );
}
