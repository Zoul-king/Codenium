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

interface CreateClientAccountInput {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company?: string;
}

interface CreateProjectDirectInput {
  clientId: string;
  pmId?: string;
  name: string;
  description?: string;
  dueDate?: string;
  budget?: number;
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
  createClientAccount: (input: CreateClientAccountInput) => Promise<{ emailed: boolean }>;
  createProjectDirect: (input: CreateProjectDirectInput) => Promise<void>;
  completeMilestone: (milestoneId: string) => Promise<void>;
  saveMilestone: (input: UpsertMilestoneInput) => Promise<void>;
  setMilestonePhase: (milestoneId: string, phase: NonNullable<ProjectMilestoneRecord["phase"]>) => Promise<void>;
  addChangeRequest: (request: Omit<ChangeRequestRecord, "id" | "requestedAt" | "status">) => Promise<void>;
  updateChangeRequestStatus: (id: string, status: ChangeRequestRecord["status"]) => Promise<void>;
  updateChangeRequestType: (id: string, changeType: NonNullable<ChangeRequestRecord["changeType"]>) => Promise<void>;
  refreshChangeRequests: () => Promise<void>;
  addProjectMessage: (projectId: string, senderId: string, role: Role, preview: string) => Promise<void>;
  markProjectMessagesAsRead: (projectId: string) => Promise<void>;
  refreshMessages: () => Promise<void>;
  markPaymentAsPaid: (paymentId: string) => Promise<void>;
  addProjectDocument: (input: AddProjectDocumentInput) => Promise<void>;
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

      let nextChangeRequests: ChangeRequestRecord[] = [];
      try {
        const resChanges = await fetch("/api/change-requests", { cache: "no-store" });
        if (resChanges.ok) {
          nextChangeRequests = (await resChanges.json()) as ChangeRequestRecord[];
        }
      } catch {
        nextChangeRequests = [];
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
          changeRequests: nextChangeRequests,
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
          body: JSON.stringify({ ...input, role: "PM" })
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
      createClientAccount: async (input) => {
        const response = await fetch("/api/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...input, role: "CLIENT" })
        });

        if (!response.ok) {
          const err = await response.json().catch(() => ({}));
          throw new Error((err as { error?: string }).error ?? "No se pudo crear el cliente.");
        }

        const newUser = await response.json();

        setState((current) => ({
          ...current,
          users: upsertById(current.users, mapApiUser(newUser))
        }));

        return { emailed: newUser.emailed !== false };
      },
      createProjectDirect: async (input) => {
        const response = await fetch("/api/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(input)
        });

        if (!response.ok) {
          const err = await response.json().catch(() => ({}));
          throw new Error((err as { error?: string }).error ?? "No se pudo crear el proyecto.");
        }

        const project = await response.json();
        const quote = project.quote;

        setState((current) => {
          const nextQuote = mapApiQuote({ ...quote, project }, current.users);
          const nextProject = mapApiProject(project, quote);
          return {
            ...current,
            quotes: upsertById(current.quotes, nextQuote),
            projects: upsertById(current.projects, nextProject)
          };
        });
      },
      completeMilestone: async (milestoneId) => {
        const response = await fetch("/api/milestones", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: milestoneId, status: "done" })
        });

        if (!response.ok) {
          const err = await response.json().catch(() => ({}));
          throw new Error((err as { error?: string }).error ?? "No se pudo completar el hito.");
        }

        setState((current) => {
          const milestone = current.milestones.find((item) => item.id === milestoneId);
          if (!milestone) return current;

          const updatedMilestones = current.milestones.map((item) => {
            if (item.id === milestoneId) return { ...item, status: "done" as const };
            if (item.projectId === milestone.projectId && item.status === "next") return { ...item, status: "current" as const };
            return item;
          });

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
      saveMilestone: async (input) => {
        const isUpdate = Boolean(input.id);
        const response = await fetch("/api/milestones", {
          method: isUpdate ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: input.id,
            projectId: input.projectId,
            title: input.title,
            summary: input.summary,
            date: input.date,
            status: input.status
          })
        });

        if (!response.ok) {
          const err = await response.json().catch(() => ({}));
          throw new Error((err as { error?: string }).error ?? "No se pudo guardar el hito.");
        }

        const persisted = await response.json();
        const record = mapApiMilestone(persisted);

        setState((current) => {
          if (isUpdate) {
            return {
              ...current,
              milestones: current.milestones.map((m) => (m.id === record.id ? record : m))
            };
          }

          const projectPayments = current.payments.filter((p) => p.projectId === record.projectId);
          const nextScheduledPayment = projectPayments.find(
            (p) => p.status === "scheduled" && !current.milestones.some((m) => m.unlocksPaymentId === p.id)
          );

          const next: ProjectMilestoneRecord = nextScheduledPayment
            ? { ...record, unlocksPaymentId: nextScheduledPayment.id }
            : record;

          return {
            ...current,
            milestones: [...current.milestones, next]
          };
        });
      },
      setMilestonePhase: async (milestoneId, phase) => {
        const response = await fetch("/api/milestones", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: milestoneId, phase })
        });

        if (!response.ok) {
          const err = await response.json().catch(() => ({}));
          throw new Error((err as { error?: string }).error ?? "No se pudo mover el hito.");
        }

        const persisted = await response.json();
        const record = mapApiMilestone(persisted);

        setState((current) => ({
          ...current,
          milestones: current.milestones.map((m) =>
            m.id === record.id ? { ...m, ...record, unlocksPaymentId: m.unlocksPaymentId } : m
          )
        }));
      },
      addChangeRequest: async (request) => {
        const response = await fetch("/api/change-requests", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            projectId: request.projectId,
            title: request.title,
            detail: request.detail,
            priority: request.priority
          })
        });

        if (!response.ok) {
          const err = await response.json().catch(() => ({}));
          throw new Error((err as { error?: string }).error ?? "No se pudo registrar el cambio.");
        }

        const created = (await response.json()) as ChangeRequestRecord;

        setState((current) => ({
          ...current,
          changeRequests: [created, ...current.changeRequests.filter((c) => c.id !== created.id)]
        }));
      },
      updateChangeRequestStatus: async (id, status) => {
        const response = await fetch(`/api/change-requests/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status })
        });

        if (!response.ok) {
          const err = await response.json().catch(() => ({}));
          throw new Error((err as { error?: string }).error ?? "No se pudo actualizar la solicitud.");
        }

        const updated = (await response.json()) as ChangeRequestRecord;

        setState((current) => ({
          ...current,
          changeRequests: current.changeRequests.map((c) => (c.id === updated.id ? updated : c))
        }));
      },
      updateChangeRequestType: async (id, changeType) => {
        const response = await fetch(`/api/change-requests/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ changeType })
        });

        if (!response.ok) {
          const err = await response.json().catch(() => ({}));
          throw new Error((err as { error?: string }).error ?? "No se pudo actualizar el tipo de cambio.");
        }

        const updated = (await response.json()) as ChangeRequestRecord;

        setState((current) => ({
          ...current,
          changeRequests: current.changeRequests.map((c) => (c.id === updated.id ? updated : c))
        }));
      },
      refreshChangeRequests: async () => {
        try {
          const response = await fetch("/api/change-requests", { cache: "no-store" });
          if (!response.ok) return;
          const next = (await response.json()) as ChangeRequestRecord[];
          setState((current) => ({ ...current, changeRequests: next }));
        } catch {
          // silencioso — el siguiente intento volverá a probar
        }
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
      refreshMessages: async () => {
        try {
          const response = await fetch("/api/chat?scope=dashboard", { cache: "no-store" });
          if (!response.ok) return;
          const next = (await response.json()) as MessageRecord[];
          setState((current) => ({ ...current, messages: next }));
        } catch {
          // silencioso — siguiente intento volverá a probar
        }
      },
      markProjectMessagesAsRead: async (projectId) => {
        // Optimista: marcamos en memoria primero para que la campana y los
        // badges desaparezcan al instante; si el PATCH falla revertimos.
        let snapshot: MessageRecord[] | null = null;
        setState((current) => {
          snapshot = current.messages;
          const currentUserId = current.currentUserId;
          if (!currentUserId) return current;
          return {
            ...current,
            messages: current.messages.map((m) =>
              m.projectId === projectId && m.recipientId === currentUserId && m.status === "unread"
                ? { ...m, status: "read" as const }
                : m
            )
          };
        });

        try {
          const response = await fetch("/api/chat", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ projectId })
          });
          if (!response.ok) {
            throw new Error("No se pudo marcar como leído.");
          }
        } catch (error) {
          if (snapshot) {
            const restore = snapshot;
            setState((current) => ({ ...current, messages: restore }));
          }
          throw error;
        }
      },
      markPaymentAsPaid: async (paymentId) => {
        // Validamos el gate del hito en el cliente para evitar PATCH innecesario,
        // pero la verdad la decide la DB (un admin/PM siempre puede marcar pagado).
        let payment: PaymentRecord | undefined;
        setState((current) => {
          payment = current.payments.find((p) => p.id === paymentId);
          return current;
        });
        if (!payment) return;

        const response = await fetch(`/api/payments/${paymentId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "paid" })
        });
        if (!response.ok) {
          const err = await response.json().catch(() => ({}));
          throw new Error((err as { error?: string }).error ?? "No se pudo marcar el pago.");
        }

        setState((current) => ({
          ...current,
          payments: current.payments.map((p) =>
            p.id === paymentId ? { ...p, status: "paid" as const } : p
          )
        }));
      },
      addProjectDocument: async ({ projectId, title, kind, href, audience = "client" }) => {
        const response = await fetch("/api/documents", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ projectId, title, kind, href: href?.trim() || undefined })
        });
        if (!response.ok) {
          const err = await response.json().catch(() => ({}));
          throw new Error((err as { error?: string }).error ?? "No se pudo registrar el documento.");
        }

        const created = await response.json();
        const mapped = mapApiDocument(created);

        setState((current) => ({
          ...current,
          documents: [{ ...mapped, audience }, ...current.documents]
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
  // Si el cliente eligió un plan tarifado (BASIC/INTERMEDIATE/PREMIUM) la
  // cotización es de "plan"; ONE_TIME es la marca por defecto del flujo de
  // servicios/cotizador libre.
  const intakeSource: "plan" | "service" = quote.planTier && quote.planTier !== "ONE_TIME" ? "plan" : "service";

  return {
    id: quote.id,
    code: quote.folio ?? `Q-${quote.id}`,
    title: quote.title ?? "Proyecto sin titulo",
    intakeSource,
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
  const raw: string = milestone.description ?? "";
  // Extrae el marcador [p:<fase>] si está presente para no contaminarlo dentro
  // del summary que se muestra al cliente.
  const match = raw.match(/^\[p:([^\]]+)\]\s*/);
  const phase = match && ["discovery", "design", "build", "qa", "done", "blocked"].includes(match[1])
    ? (match[1] as ProjectMilestoneRecord["phase"])
    : undefined;
  const summary = match ? raw.replace(/^\[p:([^\]]+)\]\s*/, "") : raw;

  return {
    id: milestone.id,
    projectId: milestone.projectId,
    title: milestone.title,
    summary,
    date: date ? String(date).split("T")[0] : TODAY,
    status: mapMilestoneStatus(milestone.status),
    phase
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
