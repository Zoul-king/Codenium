import { notFound } from "next/navigation";

import { DashboardShell } from "@/features/dashboard/components/shell/dashboard-shell";
import { getDefaultDashboardSection, isValidDashboardSection, resolveRole } from "@/features/dashboard/lib/routes";
import { renderDashboardSection } from "@/features/dashboard/lib/view";

interface DashboardPageProps {
  params: Promise<{
    role: string;
    section?: string[];
  }>;
}

export default async function DashboardPage({ params }: DashboardPageProps) {
  const { role: rawRole, section } = await params;
  const role = resolveRole(rawRole);

  if (!role) {
    notFound();
  }

  const activeSection = section?.[0] ?? getDefaultDashboardSection(role);

  if (!isValidDashboardSection(role, activeSection)) {
    notFound();
  }

  return <DashboardShell role={role} activeKey={activeSection}>{renderDashboardSection(role, activeSection)}</DashboardShell>;
}
