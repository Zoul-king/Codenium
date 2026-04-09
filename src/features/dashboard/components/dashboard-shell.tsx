import Link from "next/link";
import type { ReactNode } from "react";

import { dashboardNav } from "@/lib/mocks";
import type { Role } from "@/lib/types/domain";

const roleLabels: Record<Role, string> = {
  client: "Cliente",
  pm: "Project Manager",
  admin: "Admin"
};

interface DashboardShellProps {
  role: Role;
  activeKey: string;
  title: string;
  description: string;
  metrics: Array<{ label: string; value: string; helper: string }>;
  children: ReactNode;
}

export function DashboardShell({ role, activeKey, title, description, metrics, children }: DashboardShellProps) {
  return (
    <section className="section soft-section pt-[130px]">
      <div className="site-shell py-10">
        <div className="mb-8" data-animate="fadeInFromTop">
          <span className="type-kicker">Espacio {roleLabels[role]}</span>
          <h1 className="type-section-title mt-4">{title}</h1>
          <p className="type-body mt-4 max-w-3xl">{description}</p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[280px_1fr]">
          <aside className="rounded-[28px] bg-white p-6 shadow-[0_16px_40px_rgba(14,20,36,0.08)]" data-animate="fadeInFromLeft">
            <nav className="flex flex-col gap-3">
              {dashboardNav[role].map((item) => (
                <Link
                  key={item.key}
                  href={item.href}
                  className={`rounded-[16px] px-4 py-3 text-sm font-semibold transition-colors ${
                    item.key === activeKey ? "bg-primary-50 text-primary-500" : "bg-foreground text-body-color hover:bg-primary-50"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </aside>

          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3" data-animate="fadeIn">
              {metrics.map((metric) => (
                <article key={metric.label} className="rounded-[24px] bg-white p-5 shadow-[0_16px_40px_rgba(14,20,36,0.08)]">
                  <span className="text-sm font-semibold text-primary-500">{metric.label}</span>
                  <strong className="mt-2 block text-[28px] font-bold text-body-color">{metric.value}</strong>
                  <p className="mt-2 text-sm text-gray-600">{metric.helper}</p>
                </article>
              ))}
            </div>
            <div data-animate="fadeInFromRight">{children}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
