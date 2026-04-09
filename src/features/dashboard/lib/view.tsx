import { AssignmentsPanel } from "@/features/dashboard/components/assignments-panel";
import { ProfilePanel } from "@/features/dashboard/components/profile-panel";
import { SettingsPanel } from "@/features/dashboard/components/settings-panel";
import { SummaryPanels } from "@/features/dashboard/components/summary-panels";
import { TasksPanel } from "@/features/dashboard/components/tasks-panel";
import { TimelinePanel } from "@/features/dashboard/components/timeline-panel";
import { MessageList } from "@/features/messages/components/message-list";
import { ProjectList } from "@/features/projects/components/project-list";
import { QuoteList } from "@/features/quotes/components/quote-list";
import { UserList } from "@/features/users/components/user-list";
import type { Role } from "@/lib/types/domain";

export function renderDashboardSection(role: Role, section: string) {
  if (section === "quotes") {
    return <QuoteList role={role} />;
  }

  if (section === "projects") {
    return <ProjectList role={role} />;
  }

  if (section === "messages") {
    return <MessageList role={role} />;
  }

  if (section === "profile" && role === "client") {
    return <ProfilePanel role={role} />;
  }

  if (section === "timeline" && role === "pm") {
    return <TimelinePanel />;
  }

  if (section === "tasks" && role === "pm") {
    return <TasksPanel />;
  }

  if (section === "users" && role === "admin") {
    return <UserList />;
  }

  if (section === "assignments" && role === "admin") {
    return <AssignmentsPanel />;
  }

  if (section === "settings" && role === "admin") {
    return <SettingsPanel />;
  }

  return <SummaryPanels role={role} />;
}
