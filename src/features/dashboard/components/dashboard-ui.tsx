import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface CardProps {
  className?: string;
  children: ReactNode;
}

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}

interface MetricPillProps {
  label: string;
  value: string;
  tone?: "default" | "accent";
}

export function DashboardCard({ className, children }: CardProps) {
  return <article className={cn("dashboard-card", className)}>{children}</article>;
}

export function DashboardMutedCard({ className, children }: CardProps) {
  return <article className={cn("dashboard-muted-card", className)}>{children}</article>;
}

export function SectionHeading({ eyebrow, title, description, action }: SectionHeadingProps) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        {eyebrow ? <p className="dashboard-eyebrow">{eyebrow}</p> : null}
        <h1 className="dashboard-title mt-2">{title}</h1>
        {description ? <p className="dashboard-copy mt-3 max-w-2xl">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}

export function StatusBadge({
  children,
  tone = "neutral"
}: {
  children: ReactNode;
  tone?: "neutral" | "accent" | "success" | "warning" | "danger";
}) {
  const toneClassName =
    tone === "accent"
      ? "text-primary-700"
      : tone === "success"
        ? "text-emerald-700"
        : tone === "warning"
          ? "text-amber-700"
          : tone === "danger"
            ? "text-rose-700"
            : "text-slate-700";

  return (
    <span className={cn("inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em]", toneClassName)}>
      <span className="inline-block h-2 w-2 rounded-full bg-current" />
      {children}
    </span>
  );
}

export function ProgressBar({ value }: { value: number }) {
  return (
    <div className="h-2 rounded-full bg-slate-200">
      <div
        className="h-full rounded-full bg-[linear-gradient(90deg,#224a78_0%,#3f7aa3_48%,#68b8b2_100%)] transition-[width] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      />
    </div>
  );
}

export function MetricPill({ label, value, tone = "default" }: MetricPillProps) {
  return (
    <div className={cn("rounded-[18px] border px-4 py-3", tone === "accent" ? "border-primary-100 bg-primary-50" : "border-slate-200 bg-white")}>
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">{label}</p>
      <p className="mt-2 text-lg font-semibold text-slate-900">{value}</p>
    </div>
  );
}
