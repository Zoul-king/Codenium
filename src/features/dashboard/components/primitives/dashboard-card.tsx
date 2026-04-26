"use client";

import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface CardProps {
  className?: string;
  children: ReactNode;
}

export function DashboardCard({ className, children }: CardProps) {
  return (
    <article
      className={cn(
        "rounded-[var(--radius-card)] border border-slate-200 bg-white p-5 shadow-[var(--shadow-card)] lg:p-6",
        className
      )}
    >
      {children}
    </article>
  );
}

export function DashboardMutedCard({ className, children }: CardProps) {
  return (
    <article
      className={cn(
        "rounded-[var(--radius-card)] border border-slate-200 bg-[linear-gradient(180deg,var(--color-surface-muted)_0%,var(--role-soft,#eef2ff)_100%)] p-5 shadow-[var(--shadow-card)] lg:p-6",
        className
      )}
    >
      {children}
    </article>
  );
}
