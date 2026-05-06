import type { PaymentRecord, ProjectDocumentRecord, ProjectMilestoneRecord } from "@/lib/types/domain";

// Los hitos, documentos y pagos reales viven en la base de datos.
// Estos arreglos quedan vacíos para que los dashboards muestren estados vacíos
// hasta que se generen datos a partir de cotizaciones aceptadas.
export const mockMilestones: ProjectMilestoneRecord[] = [];

export const mockDocuments: ProjectDocumentRecord[] = [];

export const mockPayments: PaymentRecord[] = [];
