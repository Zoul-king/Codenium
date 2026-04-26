"use client";

import { useDashboardChrome } from "@/features/dashboard/components/primitives";
import type { Role } from "@/lib/types/domain";

interface RoleTheme {
  role: Role;
  activeKey: string;
  vars: {
    role: string;
    roleSoft: string;
    roleStrong: string;
  };
  hex: {
    role: string;
    roleSoft: string;
    roleStrong: string;
  };
}

const HEX_BY_ROLE: Record<Role, RoleTheme["hex"]> = {
  client: { role: "#5e92c2", roleSoft: "#eff6fb", roleStrong: "#224a78" },
  pm: { role: "#68b8b2", roleSoft: "#eafaf7", roleStrong: "#4f9792" },
  admin: { role: "#4f2f96", roleSoft: "#efe9fb", roleStrong: "#3f237a" }
};

export function useDashboardTheme(): RoleTheme | null {
  const chrome = useDashboardChrome();

  if (!chrome) {
    return null;
  }

  return {
    role: chrome.role,
    activeKey: chrome.activeKey,
    vars: {
      role: "var(--role)",
      roleSoft: "var(--role-soft)",
      roleStrong: "var(--role-strong)"
    },
    hex: HEX_BY_ROLE[chrome.role]
  };
}
