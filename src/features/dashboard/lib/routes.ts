import { dashboardNav } from "@/lib/config/catalogs";
import type { Role } from "@/lib/types/domain";

export const validRoles: Role[] = ["client", "pm", "admin"];

export function resolveRole(role: string): Role | null {
  return validRoles.includes(role as Role) ? (role as Role) : null;
}

export function isValidDashboardSection(role: Role, section: string) {
  if (section === "profile") return true;
  return dashboardNav[role].some((item) => item.key === section);
}

export function getDefaultDashboardSection(role: Role) {
  return dashboardNav[role][0]?.key ?? "projects";
}
