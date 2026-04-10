import type { DashboardWorkspaceState } from "@/features/dashboard/lib/workspace-store";
import { getProjectById, getQuoteById, getUserById } from "@/features/dashboard/lib/selectors";

export function getUserEmailById(state: DashboardWorkspaceState, userId?: string) {
  return userId ? getUserById(state, userId)?.email ?? null : null;
}

export function getProjectClientEmail(state: DashboardWorkspaceState, projectId?: string) {
  const project = getProjectById(state, projectId);

  return project ? getUserEmailById(state, project.clientId) : null;
}

export function getProjectPmEmail(state: DashboardWorkspaceState, projectId?: string) {
  const project = getProjectById(state, projectId);

  return project ? getUserEmailById(state, project.pmId) : null;
}

export function getQuoteClientEmail(state: DashboardWorkspaceState, quoteId?: string) {
  const quote = getQuoteById(state, quoteId);

  return quote ? getUserEmailById(state, quote.clientId) : null;
}
