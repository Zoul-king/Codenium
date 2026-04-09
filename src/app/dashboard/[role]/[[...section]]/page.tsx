import { notFound } from "next/navigation";

import { DashboardShell } from "@/features/dashboard/components/dashboard-shell";
import { getDashboardCopy, getDashboardMetrics } from "@/features/dashboard/lib/content";
import { isValidDashboardSection, resolveRole } from "@/features/dashboard/lib/routes";
import { renderDashboardSection } from "@/features/dashboard/lib/view";
import { MarketingShell } from "@/features/marketing/components/marketing-shell";

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

  const activeSection = section?.[0] ?? "summary";

  if (!isValidDashboardSection(role, activeSection)) {
    notFound();
  }

  const copy = getDashboardCopy(role, activeSection);
  const metrics = getDashboardMetrics(role);

  return (
    <MarketingShell headerVariant="pink">
      <DashboardShell role={role} activeKey={activeSection} title={copy.title} description={copy.description} metrics={metrics}>
        {renderDashboardSection(role, activeSection)}
      </DashboardShell>
    </MarketingShell>
  );
}
