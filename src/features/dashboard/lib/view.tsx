import { AdminDeliverablesPanel } from "@/features/dashboard/components/admin/deliverables-panel";
import { AdminOverviewPanel } from "@/features/dashboard/components/admin/overview-panel";
import { AdminPlanPanel } from "@/features/dashboard/components/admin/plan-panel";
import { AdminPaymentsPanel } from "@/features/dashboard/components/admin/payments-panel";
import { AdminQuotePanel } from "@/features/dashboard/components/admin/quote-panel";
import { AdminTeamPanel } from "@/features/dashboard/components/admin/team-panel";
import { ClientDocumentsPanel } from "@/features/dashboard/components/client/documents-panel";
import { ClientMilestonesPanel } from "@/features/dashboard/components/client/milestones-panel";
import { ClientOverviewPanel } from "@/features/dashboard/components/client/overview-panel";
import { PaymentsPanel } from "@/features/dashboard/components/shared/payments-panel";
import { PmOverviewPanel } from "@/features/dashboard/components/pm/overview-panel";
import { PmStatusPanel } from "@/features/dashboard/components/pm/status-panel";
import { ProfilePanel } from "@/features/dashboard/components/shared/profile-panel";
import { ProjectChatPanel } from "@/features/dashboard/components/shared/project-chat-panel";
import type { Role } from "@/lib/types/domain";

export function renderDashboardSection(role: Role, section: string) {
  if (role === "client") {
    if (section === "projects") return <ClientOverviewPanel />;
    if (section === "milestones") return <ClientMilestonesPanel />;
    if (section === "chat") return <ProjectChatPanel role="client" />;
    if (section === "payments") return <PaymentsPanel />;
    if (section === "deliverables") return <ClientDocumentsPanel role="client" />;
    if (section === "profile") return <ProfilePanel role="client" />;
  }

  if (role === "pm") {
    if (section === "projects") return <PmOverviewPanel />;
    if (section === "milestones") return <PmStatusPanel />;
    if (section === "deliverables") return <ClientDocumentsPanel role="pm" />;
    if (section === "chat") return <ProjectChatPanel role="pm" />;
    if (section === "profile") return <ProfilePanel role="pm" />;
  }

  if (role === "admin") {
    if (section === "metrics") return <AdminOverviewPanel />;
    if (section === "plans") return <AdminPlanPanel />;
    if (section === "quotes") return <AdminQuotePanel />;
    if (section === "users") return <AdminTeamPanel />;
    if (section === "payments") return <AdminPaymentsPanel />;
    if (section === "deliverables") return <AdminDeliverablesPanel />;
  }

  return null;
}
