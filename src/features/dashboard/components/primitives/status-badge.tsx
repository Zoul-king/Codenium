"use client";

import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

const toneClass: Record<string, string> = {
  neutral: "bg-slate-100 text-slate-700",
  accent: "bg-[var(--role-soft,#ebf3f8)] text-[var(--role-strong,#224a78)]",
  success: "bg-success-50 text-success-700",
  warning: "bg-warning-50 text-warning-700",
  danger: "bg-error-50 text-error-700",
  info: "bg-info-50 text-info-700"
};

export function StatusBadge({
  children,
  tone = "neutral"
}: {
  children: ReactNode;
  tone?: "neutral" | "accent" | "success" | "warning" | "danger" | "info";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-[12px] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em]",
        toneClass[tone]
      )}
    >
      {children}
    </span>
  );
}
