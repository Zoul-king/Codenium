import type { DashboardWorkspaceState } from "@/features/dashboard/lib/workspace-store";
import type {
  ChangeRequestRecord,
  MessageRecord,
  PaymentRecord,
  ProjectDocumentRecord,
  ProjectMilestoneRecord,
  ProjectRecord,
  QuoteRecord,
  Role,
  UserRecord
} from "@/lib/types/domain";

export function getPrimaryUser(state: DashboardWorkspaceState, role: Role): UserRecord | undefined {
  // Solo trabajamos con la sesión real (DB). Si el usuario autenticado no
  // coincide con el rol del dashboard, devolvemos undefined y el panel
  // muestra su estado vacío.
  if (!state.currentUserId) {
    return undefined;
  }

  const realUser = state.users.find((u) => u.id === state.currentUserId);

  return realUser && realUser.role === role ? realUser : undefined;
}

export function getUserById(state: DashboardWorkspaceState, userId?: string) {
  return userId ? state.users.find((user) => user.id === userId) : undefined;
}

export function getQuoteById(state: DashboardWorkspaceState, quoteId?: string) {
  return quoteId ? state.quotes.find((quote) => quote.id === quoteId) : undefined;
}

export function getProjectById(state: DashboardWorkspaceState, projectId?: string) {
  return projectId ? state.projects.find((project) => project.id === projectId) : undefined;
}

export function getVisibleQuotes(state: DashboardWorkspaceState, role: Role): QuoteRecord[] {
  if (role === "admin") {
    return state.quotes;
  }

  const user = getPrimaryUser(state, role);

  if (!user) {
    return [];
  }

  if (role === "client") {
    return state.quotes.filter((quote) => quote.clientId === user.id);
  }

  return state.quotes.filter((quote) => quote.pmId === user.id);
}

export function getVisibleProjects(state: DashboardWorkspaceState, role: Role): ProjectRecord[] {
  if (role === "admin") {
    return state.projects;
  }

  const user = getPrimaryUser(state, role);

  if (!user) {
    return [];
  }

  if (role === "client") {
    return state.projects.filter((project) => project.clientId === user.id);
  }

  return state.projects.filter((project) => project.pmId === user.id);
}

export function getVisibleMessages(state: DashboardWorkspaceState, role: Role): MessageRecord[] {
  if (role === "admin") {
    return state.messages;
  }

  const user = getPrimaryUser(state, role);

  if (!user) {
    return [];
  }

  const visibleProjectIds = new Set(getVisibleProjects(state, role).map((project) => project.id));

  return state.messages.filter(
    (message) =>
      (message.projectId ? visibleProjectIds.has(message.projectId) : false) ||
      message.senderId === user.id ||
      message.recipientId === user.id
  );
}

export function getPrimaryProject(state: DashboardWorkspaceState, role: Role) {
  return getVisibleProjects(state, role)[0];
}

export function getSelectedProject(state: DashboardWorkspaceState, role: Extract<Role, "client" | "pm">) {
  const visibleProjects = getVisibleProjects(state, role);
  const selectedId = state.selectedProjectIds[role];

  return visibleProjects.find((project) => project.id === selectedId);
}

export function getSelectedOrPrimaryProject(state: DashboardWorkspaceState, role: Extract<Role, "client" | "pm">) {
  return getSelectedProject(state, role) ?? getPrimaryProject(state, role);
}

export function getProjectMilestones(state: DashboardWorkspaceState, projectId?: string): ProjectMilestoneRecord[] {
  return projectId ? state.milestones.filter((item) => item.projectId === projectId) : [];
}

export function getLatestMilestone(state: DashboardWorkspaceState, projectId?: string) {
  return getProjectMilestones(state, projectId)
    .slice()
    .sort((left, right) => new Date(right.date).getTime() - new Date(left.date).getTime())[0];
}

export function getUpcomingMilestones(state: DashboardWorkspaceState, role: Role) {
  return getVisibleProjects(state, role)
    .flatMap((project) =>
      getProjectMilestones(state, project.id).map((milestone) => ({
        ...milestone,
        projectName: project.name,
        clientName: project.clientName
      }))
    )
    .sort((left, right) => new Date(left.date).getTime() - new Date(right.date).getTime());
}

export function getProjectDocuments(state: DashboardWorkspaceState, projectId?: string): ProjectDocumentRecord[] {
  return projectId ? state.documents.filter((item) => item.projectId === projectId) : [];
}

export function getProjectPayments(state: DashboardWorkspaceState, projectId?: string): PaymentRecord[] {
  return projectId ? state.payments.filter((item) => item.projectId === projectId) : [];
}

export function getProjectMessages(state: DashboardWorkspaceState, projectId?: string): MessageRecord[] {
  return projectId ? state.messages.filter((item) => item.projectId === projectId) : [];
}

export function getProjectChangeRequests(state: DashboardWorkspaceState, projectId?: string): ChangeRequestRecord[] {
  return projectId ? state.changeRequests.filter((item) => item.projectId === projectId) : [];
}

export function getMilestoneById(state: DashboardWorkspaceState, milestoneId?: string) {
  return milestoneId ? state.milestones.find((item) => item.id === milestoneId) : undefined;
}

export function getMilestonePayment(state: DashboardWorkspaceState, milestoneId?: string) {
  return milestoneId ? state.payments.find((payment) => payment.milestoneId === milestoneId) : undefined;
}

export function getPendingMessages(state: DashboardWorkspaceState, role: Role) {
  const currentUser = getPrimaryUser(state, role);

  return getVisibleMessages(state, role).filter((message) => message.status === "unread" && message.recipientId === currentUser?.id);
}

export function getPmUsers(state: DashboardWorkspaceState) {
  return state.users.filter((user) => user.role === "pm");
}

export function getClientUsers(state: DashboardWorkspaceState) {
  return state.users.filter((user) => user.role === "client");
}

export function getPmStats(state: DashboardWorkspaceState, pmId: string) {
  const projects = state.projects.filter((project) => project.pmId === pmId);

  return {
    activeProjects: projects.filter((project) => project.status !== "done").length,
    completedProjects: projects.filter((project) => project.status === "done").length
  };
}

export function getProjectsAtRisk(state: DashboardWorkspaceState) {
  const today = new Date();

  return state.projects.filter((project) => {
    if (project.status === "done") {
      return false;
    }

    const dueDate = new Date(`${project.dueDate}T12:00:00`);
    const daysToDue = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    return daysToDue <= 21 || project.progress <= 30;
  });
}
