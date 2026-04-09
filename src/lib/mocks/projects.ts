import type { ProjectRecord } from "@/lib/types/domain";

// Replace these mocks with a Prisma-backed project repository in the next backend phase.
export const mockProjects: ProjectRecord[] = [
  {
    id: "project-1",
    name: "Portal Codenium Client",
    clientId: "user-client-1",
    clientName: "Valeria Ríos",
    status: "build",
    progress: 68,
    dueDate: "2026-05-08",
    pmId: "user-pm-1",
    quoteCode: "CD-24001",
    quoteId: "quote-1",
    summary: "Sitio corporativo con módulo comercial, seguimiento interno y enfoque en captación."
  },
  {
    id: "project-2",
    name: "Nutrition Lab Commerce",
    clientId: "user-client-1",
    clientName: "Valeria Ríos",
    status: "design",
    progress: 36,
    dueDate: "2026-05-28",
    pmId: "user-pm-1",
    quoteCode: "CD-24002",
    quoteId: "quote-2",
    summary: "Experiencia ecommerce con catálogo, checkout y panel de administración."
  },
  {
    id: "project-3",
    name: "Ops Control Suite",
    clientId: "user-client-1",
    clientName: "Valeria Ríos",
    status: "qa",
    progress: 88,
    dueDate: "2026-04-22",
    pmId: "user-pm-2",
    quoteCode: "CD-24003",
    quoteId: "quote-3",
    summary: "Plataforma operativa con reportes, trazabilidad y seguimiento interno."
  }
];
