import { AdminOverviewPanel } from "@/features/dashboard/components/admin-overview-panel";
import { ChangeRequestPanel } from "@/features/dashboard/components/change-request-panel";
import { ClientDocumentsPanel } from "@/features/dashboard/components/client-documents-panel";
import { ClientMilestonesPanel } from "@/features/dashboard/components/client-milestones-panel";
import { ClientOverviewPanel } from "@/features/dashboard/components/client-overview-panel";
import { PaymentsPanel } from "@/features/dashboard/components/payments-panel";
import { PmStatusPanel } from "@/features/dashboard/components/pm-status-panel";
import { PmOverviewPanel } from "@/features/dashboard/components/pm-overview-panel";
import { ProfilePanel } from "@/features/dashboard/components/profile-panel";
import { ProjectChatPanel } from "@/features/dashboard/components/project-chat-panel";
import { AdminQuotePanel } from "@/features/dashboard/components/admin-quote-panel";
import { AdminTeamPanel } from "@/features/dashboard/components/admin-team-panel";
import { MessageList } from "@/features/messages/components/message-list";
import { ProjectList } from "@/features/projects/components/project-list";
import type { Role } from "@/lib/types/domain";

export function renderDashboardSection(role: Role, section: string) {
  if (section === "overview") {
    if (role === "client") {
      return <ClientOverviewPanel />;
    }

    if (role === "pm") {
      return <PmOverviewPanel />;
    }

    return <AdminOverviewPanel />;
  }

  if (section === "projects") {
    return <ProjectList role={role} />;
  }

  if (section === "quotes") {
    return role === "admin" ? <AdminQuotePanel /> : null;
  }

  if (section === "messages") {
    return <MessageList role={role} />;
  }

  if (section === "timeline" && role === "pm") {
    return <ClientMilestonesPanel role="pm" />;
  }

  if (section === "status" && role === "pm") {
    return <PmStatusPanel />;
  }

  if (section === "milestones" && role === "client") {
    return <ClientMilestonesPanel role="client" />;
  }

  if (section === "docs" && role === "client") {
    return <ClientDocumentsPanel />;
  }

  if (section === "changes" && role === "client") {
    return <ChangeRequestPanel />;
  }

  if (section === "chat" && role === "client") {
    return <ProjectChatPanel role={role} />;
  }

  if (section === "payments" && role === "client") {
    return <PaymentsPanel />;
  }

  if (section === "profile" && role === "client") {
    return <ProfilePanel role={role} />;
  }

  if (section === "team" && role === "admin") {
    return <AdminTeamPanel />;
  }

  return null;
}
