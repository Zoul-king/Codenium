import { mockDocuments, mockMessages, mockMilestones, mockPayments, mockProjects, mockQuotes, mockUsers } from "@/lib/mocks";
import type {
  MessageRecord,
  PaymentRecord,
  ProjectDocumentRecord,
  ProjectMilestoneRecord,
  ProjectRecord,
  QuoteRecord,
  Role,
  UserRecord
} from "@/lib/types/domain";

const primaryUserByRole: Record<Role, string> = {
  client: "user-client-1",
  pm: "user-pm-1",
  admin: "user-admin-1"
};

export function getPrimaryUser(role: Role): UserRecord | undefined {
  return mockUsers.find((user) => user.id === primaryUserByRole[role]);
}

export function getUserById(userId?: string) {
  return userId ? mockUsers.find((user) => user.id === userId) : undefined;
}

export function getQuoteById(quoteId?: string) {
  return quoteId ? mockQuotes.find((quote) => quote.id === quoteId) : undefined;
}

export function getProjectById(projectId?: string) {
  return projectId ? mockProjects.find((project) => project.id === projectId) : undefined;
}

export function getVisibleQuotes(role: Role): QuoteRecord[] {
  if (role === "admin") {
    return mockQuotes;
  }

  const user = getPrimaryUser(role);

  if (!user) {
    return [];
  }

  if (role === "client") {
    return mockQuotes.filter((quote) => quote.clientId === user.id);
  }

  return mockQuotes.filter((quote) => quote.pmId === user.id);
}

export function getVisibleProjects(role: Role): ProjectRecord[] {
  if (role === "admin") {
    return mockProjects;
  }

  const user = getPrimaryUser(role);

  if (!user) {
    return [];
  }

  if (role === "client") {
    return mockProjects.filter((project) => project.clientId === user.id);
  }

  return mockProjects.filter((project) => project.pmId === user.id);
}

export function getVisibleMessages(role: Role): MessageRecord[] {
  if (role === "admin") {
    return mockMessages;
  }

  const user = getPrimaryUser(role);

  if (!user) {
    return [];
  }

  const visibleProjectIds = new Set(getVisibleProjects(role).map((project) => project.id));

  return mockMessages.filter(
    (message) =>
      (message.projectId ? visibleProjectIds.has(message.projectId) : false) ||
      message.senderId === user.id ||
      message.recipientId === user.id
  );
}

export function getPrimaryProject(role: Role) {
  return getVisibleProjects(role)[0];
}

export function getProjectMilestones(projectId?: string): ProjectMilestoneRecord[] {
  return projectId ? mockMilestones.filter((item) => item.projectId === projectId) : [];
}

export function getLatestMilestone(projectId?: string) {
  return getProjectMilestones(projectId)
    .slice()
    .sort((left, right) => new Date(right.date).getTime() - new Date(left.date).getTime())[0];
}

export function getUpcomingMilestones(role: Role) {
  return getVisibleProjects(role)
    .flatMap((project) =>
      getProjectMilestones(project.id).map((milestone) => ({
        ...milestone,
        projectName: project.name,
        clientName: project.clientName
      }))
    )
    .sort((left, right) => new Date(left.date).getTime() - new Date(right.date).getTime());
}

export function getProjectDocuments(projectId?: string): ProjectDocumentRecord[] {
  return projectId ? mockDocuments.filter((item) => item.projectId === projectId) : [];
}

export function getProjectPayments(projectId?: string): PaymentRecord[] {
  return projectId ? mockPayments.filter((item) => item.projectId === projectId) : [];
}

export function getProjectMessages(projectId?: string): MessageRecord[] {
  return projectId ? mockMessages.filter((item) => item.projectId === projectId) : [];
}

export function getPendingMessages(role: Role) {
  const currentUser = getPrimaryUser(role);

  return getVisibleMessages(role).filter((message) => message.status === "unread" && message.recipientId === currentUser?.id);
}

export function getPmUsers() {
  return mockUsers.filter((user) => user.role === "pm");
}

export function getPmStats(pmId: string) {
  const projects = mockProjects.filter((project) => project.pmId === pmId);

  return {
    activeProjects: projects.filter((project) => project.status !== "done").length,
    completedProjects: projects.filter((project) => project.status === "done").length
  };
}

export function getClientUsers() {
  return mockUsers.filter((user) => user.role === "client");
}

export function getProjectsAtRisk() {
  const today = new Date("2026-04-09T12:00:00");

  return mockProjects.filter((project) => {
    if (project.status === "done") {
      return false;
    }

    const dueDate = new Date(`${project.dueDate}T12:00:00`);
    const daysToDue = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    return daysToDue <= 21 || project.progress <= 45;
  });
}
