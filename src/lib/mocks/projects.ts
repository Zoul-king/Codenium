import type { ProjectRecord } from "@/lib/types/domain";

export const mockProjects: ProjectRecord[] = [
  {
    id: "project-1",
    name: "Portal Valeria Capital",
    clientId: "user-client-1",
    clientName: "Valeria Rios",
    status: "build",
    progress: 60,
    dueDate: "2026-05-08",
    pmId: "user-pm-1",
    quoteCode: "CD-24001",
    quoteId: "quote-1",
    summary: "Portal corporativo con flujo comercial, panel interno y una base documental activa."
  },
  {
    id: "project-2",
    name: "Nutrition Lab Commerce",
    clientId: "user-client-2",
    clientName: "Daniel Ortega",
    status: "design",
    progress: 40,
    dueDate: "2026-05-28",
    pmId: "user-pm-1",
    quoteCode: "CD-24002",
    quoteId: "quote-2",
    summary: "Ecommerce con catalogo, checkout y operacion comercial conectada a pagos."
  },
  {
    id: "project-3",
    name: "Ops Control Suite",
    clientId: "user-client-2",
    clientName: "Daniel Ortega",
    status: "done",
    progress: 100,
    dueDate: "2026-03-22",
    pmId: "user-pm-2",
    quoteCode: "CD-24003",
    quoteId: "quote-3",
    summary: "Plataforma operativa con trazabilidad, reportes y visibilidad para el equipo interno."
  }
];
