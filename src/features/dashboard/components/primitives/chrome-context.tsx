"use client";

import { createContext, useContext, type ReactNode } from "react";

import type { Role } from "@/lib/types/domain";

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
  return (
    <DashboardChromeContext.Provider value={{ role, activeKey }}>
      {children}
    </DashboardChromeContext.Provider>
  );
}

export function useDashboardChrome() {
  return useContext(DashboardChromeContext);
}
