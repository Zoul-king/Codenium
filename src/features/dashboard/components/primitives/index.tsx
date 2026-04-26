"use client";

import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export { DashboardCard, DashboardMutedCard } from "./dashboard-card";
export { SectionHeading } from "./section-heading";
export { StatusBadge } from "./status-badge";
export { ProgressBar } from "./progress-bar";
export { DashboardChromeProvider, useDashboardChrome } from "./chrome-context";

interface DataRowProps {
  label: string;
  value: ReactNode;
  className?: string;
}

export function DataRow({ label, value, className }: DataRowProps) {
  return (
    <div
      className={cn(
        "grid gap-2 border-b border-slate-200/80 py-3 sm:grid-cols-[180px_minmax(0,1fr)] sm:items-start",
        className
      )}
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">{label}</p>
      <div className="text-sm leading-6 text-slate-900">{value}</div>
    </div>
  );
}

interface MetricPillProps {
  label: string;
  value: string;
  tone?: "default" | "accent";
}

export function MetricPill({ label, value, tone = "default" }: MetricPillProps) {
  return (
    <div
      className={cn(
        "rounded-[18px] border px-4 py-3",
        tone === "accent"
          ? "border-[var(--role,#5e92c2)]/20 bg-[var(--role-soft,#eff6fb)]"
          : "border-slate-200 bg-white"
      )}
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">{label}</p>
      <p className="mt-2 text-lg font-semibold text-slate-900">{value}</p>
    </div>
  );
}

export function DashboardEmptyState({
  title,
  body,
  action
}: {
  title: string;
  body: string;
  action?: ReactNode;
}) {
  return (
    <div className="rounded-[20px] border border-dashed border-slate-300 bg-white px-4 py-5 text-center">
      <p className="text-base font-semibold text-slate-900">{title}</p>
      <p className="mt-2 text-sm leading-6 text-slate-600">{body}</p>
      {action ? <div className="mt-4 flex justify-center">{action}</div> : null}
    </div>
  );
}
