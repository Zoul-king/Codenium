import { describe, it, expect } from "vitest";

import {
  getPrimaryUser,
  getUserById,
  getVisibleProjects,
  getVisibleQuotes,
  getPmStats
} from "@/features/dashboard/lib/selectors";
import type { DashboardWorkspaceState } from "@/features/dashboard/lib/workspace-store";
import type { ProjectRecord, QuoteRecord, UserRecord } from "@/lib/types/domain";

const clientUser: UserRecord = {
  id: "user-client-1",
  createdAt: "2026-04-01",
  firstName: "Daniel",
  lastName: "Ortega",
  name: "Daniel Ortega",
  email: "d@x.com",
  phone: "+52",
  role: "client",
  title: "Cuenta cliente",
  activeProjects: 0,
  state: "active"
};

const pmUser: UserRecord = {
  ...clientUser,
  id: "user-pm-1",
  firstName: "Carolina",
  lastName: "Rivera",
  name: "Carolina Rivera",
  email: "c@x.com",
  role: "pm",
  title: "Project Manager"
};

const adminUser: UserRecord = {
  ...clientUser,
  id: "user-admin-1",
  firstName: "Admin",
  lastName: "Codenium",
  name: "Admin Codenium",
  email: "a@x.com",
  role: "admin",
  title: "Administración"
};

const project: ProjectRecord = {
  id: "p1",
  name: "Portal X",
  clientId: clientUser.id,
  clientName: clientUser.name,
  status: "build",
  progress: 50,
  dueDate: "2026-06-01",
  pmId: pmUser.id,
  quoteCode: "Q1",
  quoteId: "q1",
  intakeSource: "plan",
  selectionLabel: "Plan",
  planProfile: "personal",
  planTitle: "Plan",
  summary: "x"
};

const completedProject: ProjectRecord = { ...project, id: "p2", status: "done", progress: 100 };

const quote: QuoteRecord = {
  id: "q1",
  code: "Q1",
  title: "Plan",
  intakeSource: "plan",
  selectionLabel: "Plan",
  quoteKind: "formal",
  role: "client",
  clientId: clientUser.id,
  clientName: clientUser.name,
  pmId: pmUser.id,
  status: "accepted",
  createdAt: "2026-04-01",
  acceptedAt: "2026-04-02",
  planProfile: "personal",
  planTitle: "Plan",
  projectType: null,
  infrastructure: "existing",
  modules: [],
  estimate: { build: { min: 0, max: 0 }, monthly: { min: 0, max: 0 }, timelineWeeks: { min: 0, max: 0 } }
};

function buildState(currentUserId: string | null): DashboardWorkspaceState {
  return {
    users: [clientUser, pmUser, adminUser],
    quotes: [quote],
    projects: [project, completedProject],
    messages: [],
    milestones: [],
    payments: [],
    documents: [],
    changeRequests: [],
    selectedProjectIds: {},
    currentUserId
  };
}

describe("getPrimaryUser", () => {
  it("regresa undefined si no hay sesión", () => {
    expect(getPrimaryUser(buildState(null), "client")).toBeUndefined();
  });

  it("regresa el usuario sólo si su rol coincide con el dashboard", () => {
    const state = buildState(clientUser.id);
    expect(getPrimaryUser(state, "client")?.id).toBe(clientUser.id);
    expect(getPrimaryUser(state, "pm")).toBeUndefined();
  });

  it("ignora datos mock — sólo devuelve la sesión real", () => {
    const state = buildState(pmUser.id);
    expect(getPrimaryUser(state, "pm")?.role).toBe("pm");
  });
});

describe("getUserById", () => {
  it("encuentra al usuario por id", () => {
    expect(getUserById(buildState(null), pmUser.id)?.role).toBe("pm");
  });
  it("regresa undefined si no existe", () => {
    expect(getUserById(buildState(null), "nope")).toBeUndefined();
  });
});

describe("getVisibleProjects", () => {
  it("admin ve todos los proyectos", () => {
    expect(getVisibleProjects(buildState(adminUser.id), "admin")).toHaveLength(2);
  });

  it("cliente sólo ve los proyectos donde es clientId", () => {
    const visible = getVisibleProjects(buildState(clientUser.id), "client");
    expect(visible.map((p) => p.id).sort()).toEqual(["p1", "p2"]);
  });

  it("cliente no autenticado no ve nada", () => {
    expect(getVisibleProjects(buildState(null), "client")).toEqual([]);
  });
});

describe("getVisibleQuotes", () => {
  it("admin ve todas las cotizaciones", () => {
    expect(getVisibleQuotes(buildState(adminUser.id), "admin")).toHaveLength(1);
  });

  it("pm sólo ve cotizaciones asignadas", () => {
    expect(getVisibleQuotes(buildState(pmUser.id), "pm").map((q) => q.id)).toEqual(["q1"]);
  });
});

describe("getPmStats", () => {
  it("cuenta proyectos activos vs cerrados", () => {
    const stats = getPmStats(buildState(adminUser.id), pmUser.id);
    expect(stats).toEqual({ activeProjects: 1, completedProjects: 1 });
  });
});
