import type { QuoteRecord } from "@/lib/types/domain";

// Replace these mocks with a Prisma-backed quote repository in the next backend phase.
export const mockQuotes: QuoteRecord[] = [
  {
    id: "quote-1",
    code: "CD-24001",
    title: "Portal comercial con panel operativo",
    role: "client",
    clientId: "user-client-1",
    clientName: "Valeria Ríos",
    pmId: "user-pm-1",
    status: "review",
    createdAt: "2026-04-02",
    projectType: "corporate",
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
    title: "Tienda con catálogo y pagos",
    role: "client",
    clientId: "user-client-1",
    clientName: "Valeria Ríos",
    pmId: "user-pm-1",
    status: "sent",
    createdAt: "2026-03-28",
    projectType: "ecommerce",
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
    role: "client",
    clientId: "user-client-1",
    clientName: "Valeria Ríos",
    pmId: "user-pm-2",
    status: "approved",
    createdAt: "2026-03-17",
    projectType: "admin-system",
    modules: ["auth", "roles", "reports", "chat"],
    estimate: {
      build: { min: 94000, max: 155000 },
      monthly: { min: 0, max: 0 },
      timelineWeeks: { min: 11, max: 15 }
    }
  }
];
