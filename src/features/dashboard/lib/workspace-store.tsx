"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

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

const TODAY = new Date().toISOString().slice(0, 10);

export interface DashboardWorkspaceState {
  users: UserRecord[];
  quotes: QuoteRecord[];
  projects: ProjectRecord[];
  messages: MessageRecord[];
  milestones: ProjectMilestoneRecord[];
  payments: PaymentRecord[];
  documents: ProjectDocumentRecord[];
  changeRequests: ChangeRequestRecord[];
  selectedProjectIds: Partial<Record<Role, string>>;
  currentUserId: string | null;
}

interface CreatePmAccountInput {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

interface AddProjectDocumentInput {
  projectId: string;
  title: string;
  kind: string;
  href?: string;
  audience?: "client" | "shared";
}

interface UpsertMilestoneInput {
  id?: string;
  projectId: string;
  title: string;
  summary: string;
  date: string;
  status: ProjectMilestoneRecord["status"];
}

interface DashboardWorkspaceContextValue {
  state: DashboardWorkspaceState;
  selectProject: (role: Extract<Role, "client" | "pm">, projectId: string) => void;
  acceptQuote: (quoteId: string, pmId: string) => Promise<void>;
  setQuoteStatus: (quoteId: string, status: QuoteStatus) => Promise<void>;
  setUserState: (userId: string, nextState: UserState) => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
  createPmAccount: (input: CreatePmAccountInput) => Promise<{ emailed: boolean }>;
  completeMilestone: (milestoneId: string) => void;
  saveMilestone: (input: UpsertMilestoneInput) => void;
  addChangeRequest: (request: Omit<ChangeRequestRecord, "id" | "requestedAt" | "status">) => void;
  addProjectMessage: (projectId: string, senderId: string, role: Role, preview: string) => Promise<void>;
  markPaymentAsPaid: (paymentId: string) => void;
  addProjectDocument: (input: AddProjectDocumentInput) => void;
}

const initialWorkspaceState: DashboardWorkspaceState = createFallbackWorkspaceState();

const DashboardWorkspaceContext = createContext<DashboardWorkspaceContextValue | null>(null);

export function DashboardWorkspaceProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DashboardWorkspaceState>(initialWorkspaceState);

  useEffect(() => {
    async function loadData() {
      const fallback = createFallbackWorkspaceState();

      let nextUsers = fallback.users;
      let nextQuotes = [] as QuoteRecord[];
      let nextProjects = [] as ProjectRecord[];
      let nextMessages = [] as MessageRecord[];
      let currentUserId: string | null = null;
      let sessionUserRecord: UserRecord | null = null;

      // Carga el ID real del usuario autenticado para que los selectores
      // funcionen correctamente con cuentas de DB (no solo con mocks).
      try {
        const resMe = await fetch("/api/auth/me");
        if (resMe.ok) {
          const me = await resMe.json();
          currentUserId = me.user?.id ?? null;
          if (me.user?.id) {
            sessionUserRecord = mapSessionUser(me.user);
          }
        }
      } catch {
        // Si falla, los selectores caen al modo mock por defecto.
      }

      try {
        const resUsers = await fetch("/api/users");

        if (resUsers.ok) {
          const users = await resUsers.json();
          nextUsers = mergeById(fallback.users, users.map(mapApiUser));
        }
      } catch {
        nextUsers = fallback.users;
      }

      // Garantiza que la cuenta autenticada (cliente recién registrado, etc.)
      // esté disponible en los selectores aunque /api/users no la haya devuelto
      // (los clientes reciben 403 en ese endpoint).
      if (sessionUserRecord) {
        nextUsers = upsertById(nextUsers, sessionUserRecord);
      }

      let nextMilestones: ProjectMilestoneRecord[] = [];
      let nextPayments: PaymentRecord[] = [];
      let nextDocuments: ProjectDocumentRecord[] = [];

      try {
        const resQuotes = await fetch("/api/quotes");

        if (resQuotes.ok) {
          const quotes = await resQuotes.json();
          nextQuotes = quotes.map((quote: any) => mapApiQuote(quote, nextUsers));
          nextProjects = quotes.flatMap((quote: any) => (quote.project ? [mapApiProject(quote.project, quote)] : []));

          const projectsRaw = quotes
            .map((quote: any) => quote.project)
            .filter((project: any) => project);

          // Asegura que el PM y el cliente asignado al proyecto queden en
          // `users` para que selectores como `getUserById` (chat, perfil)
          // funcionen aunque /api/users esté restringido para clientes.
          // No sobrescribimos a un usuario ya existente (p. ej. la cuenta
          // autenticada cargada desde /api/auth/me con datos completos).
          for (const project of projectsRaw) {
            if (project.pm) {
              const exists = nextUsers.some((u) => u.id === project.pm.id);
              if (!exists) {
                nextUsers = upsertById(nextUsers, mapApiUser({ ...project.pm, role: "PM" }));
              }
            }
            if (project.client) {
              const exists = nextUsers.some((u) => u.id === project.client.id);
              if (!exists) {
                nextUsers = upsertById(nextUsers, mapApiUser({ ...project.client, role: "CLIENT" }));
              }
            }
          }

          nextMilestones = projectsRaw.flatMap((project: any) =>
            (project.milestones ?? []).map(mapApiMilestone)
          );

          const builtPayments = projectsRaw.flatMap((project: any) =>
            (project.payments ?? []).map((payment: any) => mapApiPayment(payment))
          );
          nextPayments = linkPaymentsToMilestones(builtPayments, nextMilestones);

          nextDocuments = projectsRaw.flatMap((project: any) =>
            (project.documents ?? []).map(mapApiDocument)
          );
        }
      } catch {
        nextQuotes = [];
        nextProjects = [];
        nextMilestones = [];
        nextPayments = [];
        nextDocuments = [];
      }

      try {
        const resMessages = await fetch("/api/chat?scope=dashboard", { cache: "no-store" });

        if (resMessages.ok) {
          nextMessages = await resMessages.json();
        }
      } catch {
        nextMessages = [];
      }

      setState((current) => {
        const firstActiveProject = nextProjects.find((p) => p.status !== "done") ?? nextProjects[0];

        return {
          ...current,
          users: nextUsers,
          quotes: nextQuotes,
          projects: nextProjects,
          messages: nextMessages,
          milestones: nextMilestones.length > 0 ? nextMilestones : fallback.milestones,
          payments: nextPayments.length > 0 ? nextPayments : fallback.payments,
          documents: nextDocuments.length > 0 ? nextDocuments : fallback.documents,
          changeRequests: fallback.changeRequests,
          currentUserId,
          selectedProjectIds: {
            client: firstActiveProject?.id,
            pm: firstActiveProject?.id
          }
        };
      });
    }

    loadData();
  }, []);

  const value = useMemo<DashboardWorkspaceContextValue>(
    () => ({
      state,
      selectProject: (role, projectId) => {
        setState((current) => ({
          ...current,
          selectedProjectIds: {
            ...current.selectedProjectIds,
            [role]: projectId
          }
        }));
      },
      acceptQuote: async (quoteId, pmId) => {
        const response = await fetch("/api/quotes", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ quoteId, pmId, status: "accepted" })
        });

        if (!response.ok) {
          throw new Error("No se pudo aceptar la cotización.");
        }

        const quote = await response.json();

        setState((current) => ({
          ...current,
          quotes: upsertById(current.quotes, mapApiQuote(quote, current.users)),
          projects: quote.project ? upsertById(current.projects, mapApiProject(quote.project, quote)) : current.projects
        }));
      },
      setQuoteStatus: async (quoteId, status) => {
        const response = await fetch("/api/quotes", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ quoteId, status })
        });

        if (!response.ok) {
          throw new Error("No se pudo actualizar la cotización.");
        }

        const quote = await response.json();

        setState((current) => ({
          ...current,
          quotes: upsertById(current.quotes, mapApiQuote(quote, current.users)),
          projects: quote.project ? upsertById(current.projects, mapApiProject(quote.project, quote)) : current.projects
        }));
      },
      setUserState: async (userId, nextState) => {
        const apiStatus =
          nextState === "active" ? "active" : nextState === "banned" ? "suspended" : "inactive";

        const response = await fetch(`/api/users/${userId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: apiStatus })
        });

        if (!response.ok) {
          const err = await response.json().catch(() => ({}));
          throw new Error((err as { error?: string }).error ?? "No se pudo actualizar el usuario.");
        }

        setState((current) => ({
          ...current,
          users: current.users.map((user) => (user.id === userId ? { ...user, state: nextState } : user))
        }));
      },
      deleteUser: async (userId) => {
        const response = await fetch(`/api/users/${userId}`, { method: "DELETE" });

        if (!response.ok) {
          const err = await response.json().catch(() => ({}));
          throw new Error((err as { error?: string }).error ?? "No se pudo eliminar la cuenta.");
        }

        setState((current) => ({
          ...current,
          users: current.users.filter((user) => user.id !== userId),
          projects:
            // Si el usuario eliminado era cliente sus proyectos también se borran;
            // si era PM, sus proyectos quedan sin asignar.
            current.projects
              .filter((p) => p.clientId !== userId)
              .map((p) => (p.pmId === userId ? { ...p, pmId: "" } : p))
        }));
      },
      createPmAccount: async (input) => {
        const response = await fetch("/api/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(input)
        });

        if (!response.ok) {
          const err = await response.json().catch(() => ({}));
          throw new Error((err as { error?: string }).error ?? "No se pudo crear el PM.");
        }

        const newUser = await response.json();

        setState((current) => ({
          ...current,
          users: upsertById(current.users, mapApiUser(newUser))
        }));

        return { emailed: newUser.emailed !== false };
      },
      completeMilestone: (milestoneId) => {
        setState((current) => {
          const milestone = current.milestones.find((item) => item.id === milestoneId);

          if (!milestone) {
            return current;
          }

          // Calcula los hitos actualizados primero para contar correctamente
          const updatedMilestones = current.milestones.map((item) => {
            if (item.id === milestoneId) return { ...item, status: "done" as const };
            if (item.projectId === milestone.projectId && item.status === "next") return { ...item, status: "current" as const };
            return item;
          });

          // Progreso = done / total (no +18 fijo)
          const projectMilestones = updatedMilestones.filter((m) => m.projectId === milestone.projectId);
          const doneCount = projectMilestones.filter((m) => m.status === "done").length;
          const newProgress = projectMilestones.length > 0
            ? Math.round((doneCount / projectMilestones.length) * 100)
            : 0;

          return {
            ...current,
            milestones: updatedMilestones,
            payments: current.payments.map((payment) =>
              payment.id === milestone.unlocksPaymentId && payment.status === "scheduled"
                ? { ...payment, status: "pending" as const }
                : payment
            ),
            projects: current.projects.map((project) =>
              project.id === milestone.projectId
                ? { ...project, progress: newProgress }
                : project
            )
          };
        });
      },
      saveMilestone: (input) => {
        setState((current) => {
          if (input.id) {
            return {
              ...current,
              milestones: current.milestones.map((milestone) =>
                milestone.id === input.id
                  ? {
                      ...milestone,
                      projectId: input.projectId,
                      title: input.title,
                      summary: input.summary,
                      date: input.date,
                      status: input.status
                    }
                  : milestone
              )
            };
          }

          const projectPayments = current.payments.filter((payment) => payment.projectId === input.projectId);
          const nextScheduledPayment = projectPayments.find(
            (payment) => payment.status === "scheduled" && !current.milestones.some((milestone) => milestone.unlocksPaymentId === payment.id)
          );

          return {
            ...current,
            milestones: [
              ...current.milestones,
              {
                id: `milestone-${current.milestones.length + 1}`,
                projectId: input.projectId,
                title: input.title,
                summary: input.summary,
                date: input.date,
                status: input.status,
                unlocksPaymentId: nextScheduledPayment?.id
              }
            ]
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
      addProjectMessage: async (projectId, senderId, role, preview) => {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            projectId,
            senderId,
            role,
            message: preview
          })
        });

        if (!response.ok) {
          throw new Error("No se pudo guardar el mensaje.");
        }

        const message = await response.json();

        setState((current) => ({
          ...current,
          messages: upsertById(current.messages, message)
        }));
      },
      markPaymentAsPaid: (paymentId) => {
        setState((current) => ({
          ...current,
          payments: current.payments.map((payment) => {
            if (payment.id !== paymentId) {
              return payment;
            }

            const milestone = current.milestones.find((item) => item.id === payment.milestoneId);

            if (milestone && milestone.status !== "done") {
              return payment;
            }

            return { ...payment, status: "paid" };
          })
        }));
      },
      addProjectDocument: ({ projectId, title, kind, href, audience = "client" }) => {
        setState((current) => ({
          ...current,
          documents: [
            {
              id: `doc-${current.documents.length + 1}`,
              projectId,
              title,
              kind,
              updatedAt: TODAY,
              href: href?.trim() || `#document-${current.documents.length + 1}`,
              audience
            },
            ...current.documents
          ]
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

function createFallbackWorkspaceState(): DashboardWorkspaceState {
  return {
    users: [],
    quotes: [],
    projects: [],
    messages: [],
    milestones: [],
    payments: [],
    documents: [],
    changeRequests: [],
    selectedProjectIds: {},
    currentUserId: null
  };
}

function mergeById<T extends { id: string }>(fallback: T[], incoming: T[]) {
  const merged = new Map<string, T>();

  fallback.forEach((item) => merged.set(item.id, item));
  incoming.forEach((item) => merged.set(item.id, item));

  return Array.from(merged.values());
}

function mapSessionUser(user: any): UserRecord {
  const role = String(user.role ?? "client").toLowerCase() as Role;
  const firstName = user.firstName ?? "";
  const lastName = user.lastName ?? "";
  const status = String(user.status ?? "active").toLowerCase();

  return {
    id: user.id,
    createdAt: user.createdAt ? String(user.createdAt).split("T")[0] : TODAY,
    firstName,
    lastName,
    name: user.name ?? `${firstName} ${lastName}`.trim(),
    email: user.email ?? "",
    phone: user.phone ?? "",
    company: user.company ?? undefined,
    role,
    title: role === "admin" ? "Administracion general" : role === "pm" ? "Project Manager" : "Cuenta cliente",
    activeProjects: 0,
    state: status === "active" ? "active" : status === "banned" ? "banned" : "inactive"
  };
}

function mapApiUser(user: any): UserRecord {
  return {
    id: user.id,
    createdAt: String(user.createdAt).split("T")[0],
    firstName: user.firstName,
    lastName: user.lastName,
    name: `${user.firstName} ${user.lastName}`,
    email: user.email,
    phone: user.phone ?? "",
    company: user.company ?? undefined,
    role: String(user.role ?? "CLIENT").toLowerCase() as Role,
    title: user.role === "ADMIN" ? "Administracion general" : user.role === "PM" ? "Project Manager" : "Usuario",
    activeProjects: 0,
    state: "active"
  };
}

function mapApiQuote(quote: any, users: UserRecord[]): QuoteRecord {
  const client = users.find((user) => user.id === quote.clientId) ?? (quote.client ? mapApiUser(quote.client) : undefined);
  const normalizedStatus = normalizeQuoteStatus(quote.status);
  const createdAt = String(quote.createdAt).split("T")[0];

  return {
    id: quote.id,
    code: quote.folio ?? `Q-${quote.id}`,
    title: quote.title ?? "Proyecto sin titulo",
    intakeSource: "plan",
    selectionLabel: quote.title ?? "Proyecto sin titulo",
    quoteKind: normalizedStatus === "accepted" ? "formal" : "prequote",
    role: "client",
    clientId: quote.clientId,
    clientName: client?.name ?? "Cliente",
    pmId: quote.project?.pmId ?? undefined,
    status: normalizedStatus,
    createdAt,
    acceptedAt: normalizedStatus === "accepted" ? createdAt : undefined,
    planProfile: quote.planCategory === "BUSINESS" ? "business" : "personal",
    planTitle: quote.title ?? "Proyecto",
    projectType: null,
    infrastructure: "existing",
    modules: [],
    estimate: {
      build: {
        min: quote.estimatedPrice ?? 0,
        max: quote.estimatedPrice ?? 0
      },
      monthly: {
        min: 0,
        max: 0
      },
      timelineWeeks: {
        min: 0,
        max: 0
      }
    }
  };
}

function mapDbProjectStatus(dbStatus: string): ProjectRecord["status"] {
  if (dbStatus === "COMPLETED") return "done";
  if (dbStatus === "ACTIVE") return "build";
  if (dbStatus === "PAUSED") return "qa";
  return "discovery"; // PENDING, CANCELLED, unknown
}

function mapApiProject(project: any, quote: any): ProjectRecord {
  return {
    id: project.id,
    name: project.name,
    clientId: project.clientId,
    clientName: quote.client?.firstName && quote.client?.lastName ? `${quote.client.firstName} ${quote.client.lastName}` : "Cliente",
    clientCompany: quote.client?.company ?? undefined,
    status: mapDbProjectStatus(project.status ?? "PENDING"),
    progress: project.progress ?? 0,
    dueDate: project.dueDate ? String(project.dueDate).split("T")[0] : getProjectedDate(String(quote.createdAt).split("T")[0], 42),
    pmId: project.pmId ?? "",
    quoteCode: quote.folio ?? `Q-${quote.id}`,
    quoteId: quote.id,
    intakeSource: "plan",
    selectionLabel: quote.title ?? "Proyecto",
    planProfile: quote.planCategory === "BUSINESS" ? "business" : "personal",
    planTitle: quote.title ?? "Proyecto",
    summary: quote.description ?? "Proyecto persistido desde la cotización."
  };
}

function normalizeQuoteStatus(status: unknown): QuoteStatus {
  if (status === "APPROVED" || status === "CONVERTED") return "accepted";
  if (status === "REJECTED") return "rejected";
  if (status === "REVIEWING") return "reviewed";
  return "pending";
}

function getProjectedDate(from: string, offsetDays: number) {
  const base = new Date(`${from}T12:00:00`);

  base.setDate(base.getDate() + offsetDays);

  return base.toISOString().slice(0, 10);
}

function upsertById<T extends { id: string }>(items: T[], nextItem: T) {
  const exists = items.some((item) => item.id === nextItem.id);

  if (!exists) {
    return [...items, nextItem];
  }

  return items.map((item) => (item.id === nextItem.id ? nextItem : item));
}

function mapMilestoneStatus(status: unknown): ProjectMilestoneRecord["status"] {
  if (status === "COMPLETED") return "done";
  if (status === "IN_PROGRESS") return "current";
  return "next"; // PENDING, BLOCKED
}

function mapApiMilestone(milestone: any): ProjectMilestoneRecord {
  const date = milestone.completedAt ?? milestone.dueDate ?? milestone.createdAt;
  return {
    id: milestone.id,
    projectId: milestone.projectId,
    title: milestone.title,
    summary: milestone.description ?? "",
    date: date ? String(date).split("T")[0] : TODAY,
    status: mapMilestoneStatus(milestone.status)
  };
}

function mapPaymentStatus(status: unknown): PaymentRecord["status"] {
  if (status === "PAID") return "paid";
  if (status === "PENDING" || status === "PARTIAL" || status === "OVERDUE") return "pending";
  return "scheduled"; // CANCELLED or unknown
}

function mapApiPayment(payment: any): PaymentRecord {
  const due = payment.dueDate ?? payment.paidAt ?? payment.createdAt;
  return {
    id: payment.id,
    projectId: payment.projectId,
    label: payment.concept ?? "Pago",
    amount: payment.amount ?? 0,
    dueDate: due ? String(due).split("T")[0] : TODAY,
    provider: "Mercado Pago",
    status: mapPaymentStatus(payment.status)
  };
}

// Asocia cada pago a un hito en orden secuencial: el primer pago al primer
// hito del proyecto, el segundo al segundo, etc. Esto permite que el panel de
// pagos del cliente muestre estado bloqueado/desbloqueado por hito sin
// requerir una FK explícita en la BD.
function linkPaymentsToMilestones(
  payments: PaymentRecord[],
  milestones: ProjectMilestoneRecord[]
): PaymentRecord[] {
  const byProject = new Map<string, ProjectMilestoneRecord[]>();
  for (const milestone of milestones) {
    const list = byProject.get(milestone.projectId) ?? [];
    list.push(milestone);
    byProject.set(milestone.projectId, list);
  }

  const cursor = new Map<string, number>();
  return payments.map((payment) => {
    const projectMilestones = byProject.get(payment.projectId) ?? [];
    const idx = cursor.get(payment.projectId) ?? 0;
    const milestone = projectMilestones[idx];
    cursor.set(payment.projectId, idx + 1);
    return milestone ? { ...payment, milestoneId: milestone.id } : payment;
  });
}

function mapDocumentKind(category: unknown): string {
  switch (category) {
    case "PROPOSAL":
      return "Propuesta";
    case "CONTRACT":
      return "Contrato";
    case "BRIEF":
      return "Brief";
    case "DELIVERABLE":
      return "Entregable";
    case "INVOICE":
      return "Factura";
    default:
      return "Documento";
  }
}

function mapApiDocument(document: any): ProjectDocumentRecord {
  return {
    id: document.id,
    projectId: document.projectId,
    title: document.name ?? "Documento",
    kind: mapDocumentKind(document.category),
    updatedAt: document.createdAt ? String(document.createdAt).split("T")[0] : TODAY,
    href: document.fileUrl ?? "#",
    audience: "client"
  };
}
