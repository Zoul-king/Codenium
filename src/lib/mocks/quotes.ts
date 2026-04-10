import type { QuoteRecord } from "@/lib/types/domain";

export const mockQuotes: QuoteRecord[] = [
  {
    id: "quote-1",
    code: "CD-24001",
    title: "Portal comercial con panel operativo",
    intakeSource: "plan",
    selectionLabel: "Plan PYMES",
    quoteKind: "formal",
    role: "client",
    clientId: "user-client-1",
    clientName: "Valeria Rios",
    pmId: "user-pm-1",
    status: "approved",
    createdAt: "2026-04-02",
    acceptedAt: "2026-04-03",
    planProfile: "personal",
    planTitle: "Plan PYMES",
    projectType: "corporate",
    infrastructure: "existing",
    modules: ["custom-design", "admin-panel", "integrations", "maintenance"],
    estimate: {
      build: { min: 52000, max: 78000 },
      monthly: { min: 3000, max: 7000 },
      timelineWeeks: { min: 6, max: 9 }
    }
  },
  {
    id: "quote-2",
    code: "CD-24002",
    title: "Tienda con catalogo y pagos",
    intakeSource: "plan",
    selectionLabel: "Suite Commerce Enterprise",
    quoteKind: "formal",
    role: "client",
    clientId: "user-client-2",
    clientName: "Daniel Ortega",
    pmId: "user-pm-1",
    status: "approved",
    createdAt: "2026-03-28",
    acceptedAt: "2026-03-29",
    planProfile: "business",
    planTitle: "Suite Commerce Enterprise",
    projectType: "ecommerce",
    infrastructure: "cloud",
    modules: ["catalog", "payments", "admin-panel", "notifications"],
    estimate: {
      build: { min: 86000, max: 142000 },
      monthly: { min: 0, max: 0 },
      timelineWeeks: { min: 10, max: 14 }
    }
  },
  {
    id: "quote-3",
    code: "CD-24003",
    title: "Sistema interno de seguimiento comercial",
    intakeSource: "plan",
    selectionLabel: "Plataforma Operativa Corporativa",
    quoteKind: "formal",
    role: "client",
    clientId: "user-client-2",
    clientName: "Daniel Ortega",
    pmId: "user-pm-2",
    status: "approved",
    createdAt: "2026-03-17",
    acceptedAt: "2026-03-19",
    planProfile: "business",
    planTitle: "Plataforma Operativa Corporativa",
    projectType: "admin-system",
    infrastructure: "hybrid",
    modules: ["auth", "roles", "reports", "chat"],
    estimate: {
      build: { min: 94000, max: 155000 },
      monthly: { min: 0, max: 0 },
      timelineWeeks: { min: 11, max: 15 }
    }
  },
  {
    id: "quote-4",
    code: "CD-24004",
    title: "Rediseno del portal ejecutivo",
    intakeSource: "plan",
    selectionLabel: "Plan personalizado",
    quoteKind: "prequote",
    role: "client",
    clientId: "user-client-1",
    clientName: "Valeria Rios",
    status: "review",
    createdAt: "2026-04-07",
    planProfile: "personal",
    planTitle: "Plan personalizado",
    projectType: "redesign",
    infrastructure: "existing",
    modules: ["custom-design", "reports"],
    estimate: {
      build: { min: 36000, max: 58000 },
      monthly: { min: 0, max: 0 },
      timelineWeeks: { min: 4, max: 7 }
    }
  },
  {
    id: "quote-5",
    code: "CD-24005",
    title: "Control operativo integral",
    intakeSource: "plan",
    selectionLabel: "Operations Board Enterprise",
    quoteKind: "prequote",
    role: "client",
    clientId: "user-client-3",
    clientName: "Laura Medina",
    pmId: "user-pm-2",
    status: "sent",
    createdAt: "2026-04-10",
    planProfile: "business",
    planTitle: "Operations Board Enterprise",
    projectType: "web-app",
    infrastructure: "cloud",
    modules: ["auth", "roles", "reports", "integrations"],
    estimate: {
      build: { min: 98000, max: 164000 },
      monthly: { min: 0, max: 0 },
      timelineWeeks: { min: 10, max: 15 }
    }
  },
  {
    id: "quote-6",
    code: "CD-24006",
    title: "Sprint de automatizacion comercial",
    intakeSource: "service",
    selectionLabel: "Automatizacion e integraciones",
    quoteKind: "prequote",
    role: "client",
    clientId: "user-client-3",
    clientName: "Laura Medina",
    status: "review",
    createdAt: "2026-04-10",
    planProfile: "business",
    planTitle: "Servicio coordinado",
    projectType: "automation",
    infrastructure: "existing",
    modules: ["integrations", "reports", "maintenance"],
    estimate: {
      build: { min: 42000, max: 74000 },
      monthly: { min: 3000, max: 9000 },
      timelineWeeks: { min: 4, max: 8 }
    }
  }
];
