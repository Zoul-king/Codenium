import type { PaymentRecord, ProjectDocumentRecord, ProjectMilestoneRecord } from "@/lib/types/domain";

export const mockMilestones: ProjectMilestoneRecord[] = [
  {
    id: "milestone-1",
    projectId: "project-1",
    title: "Arquitectura aprobada",
    summary: "Se confirmó la estructura del portal y el alcance de la primera fase.",
    date: "2026-04-09",
    status: "done"
  },
  {
    id: "milestone-2",
    projectId: "project-1",
    title: "Vista comercial en desarrollo",
    summary: "Estamos construyendo la sección principal y el panel operativo inicial.",
    date: "2026-04-18",
    status: "current"
  },
  {
    id: "milestone-3",
    projectId: "project-1",
    title: "Revisión con cliente",
    summary: "Se validará navegación, prioridades y materiales antes del siguiente sprint.",
    date: "2026-04-24",
    status: "next"
  },
  {
    id: "milestone-4",
    projectId: "project-2",
    title: "Mapa de catálogo listo",
    summary: "La estructura del catálogo y checkout ya quedó definida.",
    date: "2026-04-10",
    status: "done"
  },
  {
    id: "milestone-5",
    projectId: "project-2",
    title: "Diseño de checkout",
    summary: "Se está aterrizando la experiencia de compra y el flujo de pagos.",
    date: "2026-04-19",
    status: "current"
  }
];

export const mockDocuments: ProjectDocumentRecord[] = [
  {
    id: "doc-1",
    projectId: "project-1",
    title: "Alcance aprobado",
    kind: "PDF",
    updatedAt: "2026-04-08",
    href: "#scope"
  },
  {
    id: "doc-2",
    projectId: "project-1",
    title: "Mapa de pantallas",
    kind: "Figma",
    updatedAt: "2026-04-12",
    href: "#figma"
  },
  {
    id: "doc-3",
    projectId: "project-1",
    title: "Checklist de lanzamiento",
    kind: "Documento",
    updatedAt: "2026-04-16",
    href: "#launch"
  },
  {
    id: "doc-4",
    projectId: "project-2",
    title: "Catálogo priorizado",
    kind: "Sheet",
    updatedAt: "2026-04-11",
    href: "#catalog"
  }
];

export const mockPayments: PaymentRecord[] = [
  {
    id: "payment-1",
    projectId: "project-1",
    label: "Anticipo del proyecto",
    amount: 18000,
    dueDate: "2026-04-12",
    provider: "Mercado Pago",
    status: "paid"
  },
  {
    id: "payment-2",
    projectId: "project-1",
    label: "Segundo avance",
    amount: 14000,
    dueDate: "2026-04-26",
    provider: "Mercado Pago",
    status: "pending"
  },
  {
    id: "payment-3",
    projectId: "project-1",
    label: "Entrega final",
    amount: 16000,
    dueDate: "2026-05-08",
    provider: "Mercado Pago",
    status: "scheduled"
  }
];
