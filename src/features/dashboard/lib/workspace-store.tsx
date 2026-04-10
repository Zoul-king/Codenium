"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

import { mockChangeRequests, mockDocuments, mockMessages, mockMilestones, mockPayments, mockProjects, mockQuotes, mockUsers } from "@/lib/mocks";
import type {
  ChangeRequestRecord,
  MessageRecord,
  PaymentRecord,
  ProjectDocumentRecord,
  ProjectMilestoneRecord,
  ProjectRecord,
  QuoteRecord,
  QuoteStatus,
  Role,
  UserRecord,
  UserState
} from "@/lib/types/domain";

const STORAGE_KEY = "codenium.dashboard-workspace";

export interface DashboardWorkspaceState {
  users: UserRecord[];
  quotes: QuoteRecord[];
  projects: ProjectRecord[];
  messages: MessageRecord[];
  milestones: ProjectMilestoneRecord[];
  payments: PaymentRecord[];
  documents: ProjectDocumentRecord[];
  changeRequests: ChangeRequestRecord[];
}

interface CreatePmAccountInput {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

interface DashboardWorkspaceContextValue {
  state: DashboardWorkspaceState;
  acceptQuote: (quoteId: string, pmId: string) => void;
  setQuoteStatus: (quoteId: string, status: QuoteStatus) => void;
  setUserState: (userId: string, nextState: UserState) => void;
  createPmAccount: (input: CreatePmAccountInput) => void;
  completeMilestone: (milestoneId: string) => void;
  addChangeRequest: (request: Omit<ChangeRequestRecord, "id" | "requestedAt" | "status">) => void;
  addProjectMessage: (projectId: string, senderId: string, role: Role, preview: string) => void;
  markPaymentAsPaid: (paymentId: string) => void;
}

const initialWorkspaceState: DashboardWorkspaceState = {
  users: mockUsers,
  quotes: mockQuotes,
  projects: mockProjects,
  messages: mockMessages,
  milestones: mockMilestones,
  payments: mockPayments,
  documents: mockDocuments,
  changeRequests: mockChangeRequests
};

const DashboardWorkspaceContext = createContext<DashboardWorkspaceContextValue | null>(null);

export function DashboardWorkspaceProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DashboardWorkspaceState>(initialWorkspaceState);

  useEffect(() => {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);

    if (!raw) {
      return;
    }

    try {
      setState(JSON.parse(raw) as DashboardWorkspaceState);
    } catch {
      window.sessionStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const value = useMemo<DashboardWorkspaceContextValue>(
    () => ({
      state,
      acceptQuote: (quoteId, pmId) => {
        setState((current) => {
          const quote = current.quotes.find((item) => item.id === quoteId);

          if (!quote) {
            return current;
          }

          const nextQuotes = current.quotes.map((item) =>
            item.id === quoteId ? { ...item, pmId, quoteKind: "formal" as const, status: "approved" as const } : item
          );
          const alreadyCreated = current.projects.some((project) => project.quoteId === quoteId);
          const client = current.users.find((user) => user.id === quote.clientId);
          const pm = current.users.find((user) => user.id === pmId);
          const nextProjects: ProjectRecord[] = alreadyCreated
            ? current.projects
            : [
                ...current.projects,
                {
                  id: `project-${current.projects.length + 1}`,
                  name: quote.title,
                  clientId: quote.clientId,
                  clientName: quote.clientName,
                  clientCompany: client?.company,
                  status: "discovery",
                  progress: 12,
                  dueDate: getProjectedDate(quote.createdAt, 42),
                  pmId,
                  quoteCode: quote.code,
                  quoteId: quote.id,
                  planProfile: quote.planProfile,
                  planTitle: quote.planTitle,
                  summary: `Proyecto convertido desde ${quote.code} para ${quote.clientName}, con ${pm?.name ?? "PM por confirmar"} como responsable operativo.`
                }
              ];

          const nextUsers: UserRecord[] = current.users.map((user) => {
            if (user.id === quote.clientId || user.id === pmId) {
              return { ...user, activeProjects: user.activeProjects + (alreadyCreated ? 0 : 1), state: "active" as const };
            }

            return user;
          });

          return {
            ...current,
            quotes: nextQuotes,
            projects: nextProjects,
            users: nextUsers
          };
        });
      },
      setQuoteStatus: (quoteId, status) => {
        setState((current) => ({
          ...current,
          quotes: current.quotes.map((quote) => (quote.id === quoteId ? { ...quote, status } : quote))
        }));
      },
      setUserState: (userId, nextState) => {
        setState((current) => ({
          ...current,
          users: current.users.map((user) => (user.id === userId ? { ...user, state: nextState } : user))
        }));
      },
      createPmAccount: (input) => {
        setState((current) => ({
          ...current,
          users: [
            ...current.users,
            {
              id: `user-pm-${current.users.filter((user) => user.role === "pm").length + 1}`,
              firstName: input.firstName,
              lastName: input.lastName,
              name: `${input.firstName} ${input.lastName}`,
              email: input.email,
              phone: input.phone,
              role: "pm",
              title: "Project Manager",
              activeProjects: 0,
              state: "active"
            }
          ]
        }));
      },
      completeMilestone: (milestoneId) => {
        setState((current) => {
          const milestone = current.milestones.find((item) => item.id === milestoneId);

          if (!milestone) {
            return current;
          }

          const nextMilestones = current.milestones.map((item) => {
            if (item.id === milestoneId) {
              return { ...item, status: "done" as const };
            }

            if (item.projectId === milestone.projectId && item.status === "next") {
              return { ...item, status: "current" as const };
            }

            return item;
          });

          const nextPayments = current.payments.map((payment) =>
            payment.id === milestone.unlocksPaymentId && payment.status === "scheduled"
              ? { ...payment, status: "pending" as const }
              : payment
          );

          const nextProjects = current.projects.map((project) =>
            project.id === milestone.projectId ? { ...project, progress: Math.min(project.progress + 18, 100) } : project
          );

          return {
            ...current,
            milestones: nextMilestones,
            payments: nextPayments,
            projects: nextProjects
          };
        });
      },
      addChangeRequest: (request) => {
        setState((current) => ({
          ...current,
          changeRequests: [
            {
              id: `change-${current.changeRequests.length + 1}`,
              requestedAt: "2026-04-09",
              status: "new",
              ...request
            },
            ...current.changeRequests
          ]
        }));
      },
      addProjectMessage: (projectId, senderId, role, preview) => {
        setState((current) => {
          const project = current.projects.find((item) => item.id === projectId);
          const sender = current.users.find((item) => item.id === senderId);

          if (!project || !sender) {
            return current;
          }

          return {
            ...current,
            messages: [
              ...current.messages,
              {
                id: `msg-${current.messages.length + 1}`,
                thread: project.name,
                senderId,
                recipientId: role === "client" ? project.pmId : project.clientId,
                projectId,
                quoteId: project.quoteId,
                senderName: sender.name,
                role,
                preview,
                sentAt: "Ahora",
                status: "read"
              }
            ]
          };
        });
      },
      markPaymentAsPaid: (paymentId) => {
        setState((current) => ({
          ...current,
          payments: current.payments.map((payment) => (payment.id === paymentId ? { ...payment, status: "paid" } : payment))
        }));
      }
    }),
    [state]
  );

  return <DashboardWorkspaceContext.Provider value={value}>{children}</DashboardWorkspaceContext.Provider>;
}

export function useDashboardWorkspace() {
  const context = useContext(DashboardWorkspaceContext);

  if (!context) {
    throw new Error("useDashboardWorkspace must be used within DashboardWorkspaceProvider");
  }

  return context;
}

function getProjectedDate(from: string, offsetDays: number) {
  const base = new Date(`${from}T12:00:00`);

  base.setDate(base.getDate() + offsetDays);

  return base.toISOString().slice(0, 10);
}
