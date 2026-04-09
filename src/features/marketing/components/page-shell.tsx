"use client";

import type { ReactNode } from "react";

import { useReveal } from "@/hooks/use-reveal";

interface PageShellProps {
  children: ReactNode;
}

export function PageShell({ children }: PageShellProps) {
  useReveal();

  return <>{children}</>;
}
