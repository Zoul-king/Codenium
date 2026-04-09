import type { ProjectRecord } from "@/lib/types/domain";

// Replace these mocks with a Prisma-backed project repository in the next backend phase.
export const mockProjects: ProjectRecord[] = [
  {
    id: "project-1",
    name: "Portal Valhui Pro",
    clientName: "ValHui",
    status: "build",
    progress: 68,
    dueDate: "2026-05-08",
    pmId: "user-pm-1",
    quoteCode: "AX-24001",
    summary: "Sitio corporativo con módulo comercial, seguimiento interno y enfoque en captación."
  },
  {
    id: "project-2",
    name: "Nutrition Lab Commerce",
    clientName: "Nutrition Lab",
    status: "design",
    progress: 36,
    dueDate: "2026-05-28",
    pmId: "user-pm-1",
    quoteCode: "AX-24002",
    summary: "Experiencia ecommerce con catálogo, checkout y panel de administración."
  },
  {
    id: "project-3",
    name: "Sittycia Ops",
    clientName: "Sittycia",
    status: "qa",
    progress: 88,
    dueDate: "2026-04-22",
    pmId: "user-pm-2",
    quoteCode: "AX-24003",
    summary: "Plataforma operativa con reportes, trazabilidad y seguimiento interno."
  }
];
