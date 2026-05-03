import type { ChangeRequestRecord } from "@/lib/types/domain";

export const mockChangeRequests: ChangeRequestRecord[] = [
  {
    id: "change-1",
    projectId: "project-1",
    clientId: "user-client-1",
    milestoneId: "m1-3",
    title: "Priorizar inmuebles destacados en hero",
    detail: "El cliente solicita mover la sección de inmuebles destacados al primer scroll y revisar el copy comercial con el tono aprobado en el brief.",
    priority: "high",
    status: "in_review",
    requestedAt: "2026-04-09"
  },
  {
    id: "change-2",
    projectId: "project-2",
    clientId: "user-client-2",
    title: "Agregar filtros por disponibilidad al catálogo",
    detail: "Se solicita incluir filtros por categoría, disponibilidad y rango de precio antes de cerrar el QA del catálogo.",
    priority: "medium",
    status: "planned",
    requestedAt: "2026-04-08"
  },
  {
    id: "change-3",
    projectId: "project-4",
    clientId: "user-client-4",
    title: "Agregar sección de testimonios",
    detail: "El equipo de marketing solicita una sección adicional con 3 testimonios de clientes. Incluye foto, nombre y texto corto.",
    priority: "low",
    status: "planned",
    requestedAt: "2026-04-10"
  },
  {
    id: "change-4",
    projectId: "project-7",
    clientId: "user-client-6",
    milestoneId: "m7-3",
    title: "Incluir vista de incidencias por ruta",
    detail: "El jefe de operaciones solicita un módulo adicional para registrar y visualizar incidencias por ruta (retraso, accidente, cierre vial).",
    priority: "high",
    status: "new",
    requestedAt: "2026-04-11"
  },
  {
    id: "change-5",
    projectId: "project-12",
    clientId: "user-client-5",
    title: "Añadir opción de gift wrapping al checkout",
    detail: "Sofía quiere ofrecer empaque de regalo en el checkout con un cargo adicional de $150 MXN. Incluye checkbox y mensaje personalizado.",
    priority: "medium",
    status: "in_review",
    requestedAt: "2026-04-09"
  }
];
