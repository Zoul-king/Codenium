"use client";

import { createContext, useContext, type ReactNode } from "react";

import { cn } from "@/lib/utils";
import type { Role } from "@/lib/types/domain";

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

interface DataRowProps {
  label: string;
  value: ReactNode;
  className?: string;
}

interface DashboardChromeContextValue {
  role: Role;
  activeKey: string;
}

const DashboardChromeContext = createContext<DashboardChromeContextValue | null>(null);

export function DashboardChromeProvider({
  role,
  activeKey,
  children
}: DashboardChromeContextValue & { children: ReactNode }) {
  return <DashboardChromeContext.Provider value={{ role, activeKey }}>{children}</DashboardChromeContext.Provider>;
}

function useDashboardChrome() {
  return useContext(DashboardChromeContext);
}

function getRoleCardTone(role?: Role) {
  if (role === "client") {
    return {
      card: "border-[#d9e4eb] bg-white shadow-[0_18px_42px_rgba(15,23,42,0.05)]",
      muted: "border-[#dbe7ee] bg-[#f7fbfc] shadow-[0_18px_42px_rgba(15,23,42,0.035)]",
      eyebrow: "text-[#5b7a88]",
      title: "text-[#102033]",
      copy: "text-[#5c6b78]"
    };
  }

  if (role === "pm") {
    return {
      card: "border-[#d8dee9] bg-[#fcfdff] shadow-[0_18px_40px_rgba(15,23,42,0.06)]",
      muted: "border-[#dce3ec] bg-[#f4f7fb] shadow-[0_18px_40px_rgba(15,23,42,0.04)]",
      eyebrow: "text-[#4f6076]",
      title: "text-[#132238]",
      copy: "text-[#526173]"
    };
  }

  return {
    card: "border-[#d7dce5] bg-white shadow-[0_20px_44px_rgba(15,23,42,0.07)]",
    muted: "border-[#d9dee8] bg-[#f5f7fa] shadow-[0_18px_40px_rgba(15,23,42,0.05)]",
    eyebrow: "text-[#556273]",
    title: "text-[#111b2e]",
    copy: "text-[#566273]"
  };
}

export function DashboardCard({ className, children }: CardProps) {
  const chrome = useDashboardChrome();
  const tone = getRoleCardTone(chrome?.role);

  return <article className={cn("rounded-[28px] border p-5 lg:p-6", tone.card, className)}>{children}</article>;
}

export function DashboardMutedCard({ className, children }: CardProps) {
  const chrome = useDashboardChrome();
  const tone = getRoleCardTone(chrome?.role);

  return <article className={cn("rounded-[28px] border p-5 lg:p-6", tone.muted, className)}>{children}</article>;
}

export function SectionHeading({ eyebrow, title, description, action }: SectionHeadingProps) {
  const chrome = useDashboardChrome();
  const tone = getRoleCardTone(chrome?.role);

  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        {eyebrow ? <p className={cn("text-[11px] font-semibold uppercase tracking-[0.18em]", tone.eyebrow)}>{eyebrow}</p> : null}
        <h1 className={cn("mt-2 text-[24px] font-semibold leading-[1.02] tracking-[-0.045em] lg:text-[32px]", tone.title)}>{title}</h1>
        {description ? <p className={cn("mt-3 max-w-2xl text-sm leading-7", tone.copy)}>{description}</p> : null}
      </div>
      {action}
    </div>
  );
}

export function DataRow({ label, value, className }: DataRowProps) {
  return (
    <div className={cn("grid gap-2 border-b border-slate-200/80 py-3 sm:grid-cols-[180px_minmax(0,1fr)] sm:items-start", className)}>
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">{label}</p>
      <div className="text-sm leading-6 text-slate-900">{value}</div>
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
      ? "bg-[#ebf3f8] text-primary-700"
      : tone === "success"
        ? "bg-emerald-50 text-emerald-700"
        : tone === "warning"
          ? "bg-amber-50 text-amber-700"
          : tone === "danger"
            ? "bg-rose-50 text-rose-700"
            : "bg-slate-100 text-slate-700";

  return <span className={cn("inline-flex items-center rounded-[12px] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em]", toneClassName)}>{children}</span>;
}

export function ProgressBar({ value }: { value: number }) {
  return (
    <div className="h-2.5 rounded-full bg-slate-200">
      <div
        className="h-full rounded-full bg-[linear-gradient(90deg,#224a78_0%,#4a88ae_55%,#68b8b2_100%)] transition-[width] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      />
    </div>
  );
}

export function MetricPill({ label, value, tone = "default" }: MetricPillProps) {
  return (
    <div className={cn("rounded-[20px] border px-4 py-4", tone === "accent" ? "border-primary-100 bg-primary-50" : "border-slate-200 bg-white")}>
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">{label}</p>
      <p className="mt-2 text-lg font-semibold text-slate-900">{value}</p>
    </div>
  );
}
