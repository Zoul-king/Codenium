import type { ChangeRequestRecord } from "@/lib/types/domain";

export const mockChangeRequests: ChangeRequestRecord[] = [
  {
    id: "change-1",
    projectId: "project-1",
    clientId: "user-client-1",
    title: "Priorizar inmuebles destacados",
    detail: "El cliente quiere mover la seccion de inmuebles destacados al primer scroll y revisar copy comercial.",
    priority: "high",
    status: "in_review",
    requestedAt: "2026-04-09"
  },
  {
    id: "change-2",
    projectId: "project-2",
    clientId: "user-client-2",
    title: "Ajuste en filtros del catalogo",
    detail: "Se solicito incluir filtros por categoria y disponibilidad antes de cerrar QA.",
    priority: "medium",
    status: "planned",
    requestedAt: "2026-04-08"
  }
];
