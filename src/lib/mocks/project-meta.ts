import type { PaymentRecord, ProjectDocumentRecord, ProjectMilestoneRecord } from "@/lib/types/domain";

export const mockMilestones: ProjectMilestoneRecord[] = [
  {
    id: "milestone-1",
    projectId: "project-1",
    title: "Arquitectura aprobada",
    summary: "Se confirmo la estructura del portal y el alcance de la primera fase.",
    date: "2026-04-09",
    status: "done"
  },
  {
    id: "milestone-2",
    projectId: "project-1",
    title: "Vista comercial en desarrollo",
    summary: "Estamos construyendo la seccion principal y el panel operativo inicial.",
    date: "2026-04-18",
    status: "current",
    unlocksPaymentId: "payment-2"
  },
  {
    id: "milestone-3",
    projectId: "project-1",
    title: "Revision con cliente",
    summary: "Se validara navegacion, prioridades y materiales antes del siguiente sprint.",
    date: "2026-04-24",
    status: "next",
    unlocksPaymentId: "payment-3"
  },
  {
    id: "milestone-4",
    projectId: "project-2",
    title: "Mapa de catalogo listo",
    summary: "La estructura del catalogo y checkout ya quedo definida.",
    date: "2026-04-10",
    status: "done"
  },
  {
    id: "milestone-5",
    projectId: "project-2",
    title: "Diseno de checkout",
    summary: "Se esta aterrizando la experiencia de compra y el flujo de pagos.",
    date: "2026-04-19",
    status: "current",
    unlocksPaymentId: "payment-5"
  },
  {
    id: "milestone-6",
    projectId: "project-2",
    title: "QA de catalogo y conversion",
    summary: "Revision integral antes de habilitar el siguiente pago de implementacion.",
    date: "2026-04-30",
    status: "next",
    unlocksPaymentId: "payment-6"
  }
];

export const mockDocuments: ProjectDocumentRecord[] = [
  {
    id: "doc-1",
    projectId: "project-1",
    title: "Alcance aprobado",
    kind: "PDF",
    updatedAt: "2026-04-08",
    href: "#scope",
    audience: "shared"
  },
  {
    id: "doc-2",
    projectId: "project-1",
    title: "Mapa de pantallas",
    kind: "Figma",
    updatedAt: "2026-04-12",
    href: "#figma",
    audience: "client"
  },
  {
    id: "doc-3",
    projectId: "project-1",
    title: "Checklist de lanzamiento",
    kind: "Documento",
    updatedAt: "2026-04-16",
    href: "#launch",
    audience: "pm"
  },
  {
    id: "doc-4",
    projectId: "project-2",
    title: "Catalogo priorizado",
    kind: "Sheet",
    updatedAt: "2026-04-11",
    href: "#catalog",
    audience: "shared"
  },
  {
    id: "doc-5",
    projectId: "project-2",
    title: "Plantilla de handoff comercial",
    kind: "Plantilla",
    updatedAt: "2026-04-14",
    href: "#handoff",
    audience: "admin",
    template: true
  },
  {
    id: "doc-6",
    projectId: "project-3",
    title: "Plantilla de entregable final",
    kind: "Plantilla",
    updatedAt: "2026-03-19",
    href: "#final-template",
    audience: "admin",
    template: true
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
    status: "pending",
    milestoneId: "milestone-2"
  },
  {
    id: "payment-3",
    projectId: "project-1",
    label: "Entrega final",
    amount: 16000,
    dueDate: "2026-05-08",
    provider: "Mercado Pago",
    status: "scheduled",
    milestoneId: "milestone-3"
  },
  {
    id: "payment-4",
    projectId: "project-2",
    label: "Kickoff enterprise",
    amount: 32000,
    dueDate: "2026-04-08",
    provider: "Mercado Pago",
    status: "paid"
  },
  {
    id: "payment-5",
    projectId: "project-2",
    label: "Integracion comercial",
    amount: 28000,
    dueDate: "2026-04-25",
    provider: "Mercado Pago",
    status: "scheduled",
    milestoneId: "milestone-5"
  },
  {
    id: "payment-6",
    projectId: "project-2",
    label: "Salida a produccion",
    amount: 35000,
    dueDate: "2026-05-12",
    provider: "Mercado Pago",
    status: "scheduled",
    milestoneId: "milestone-6"
  }
];
