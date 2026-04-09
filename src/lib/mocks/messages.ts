import type { MessageRecord } from "@/lib/types/domain";

// Replace these mocks with a Prisma-backed message repository in the next backend phase.
export const mockMessages: MessageRecord[] = [
  {
    id: "msg-1",
    thread: "Kickoff ValHui",
    senderName: "Paola Hernandez",
    role: "client",
    preview: "Ya revisamos el alcance, nos gustaria priorizar la seccion de inmuebles destacados.",
    sentAt: "Hoy, 09:20",
    status: "unread"
  },
  {
    id: "msg-2",
    thread: "Bloqueos de integracion",
    senderName: "Javier PM",
    role: "pm",
    preview: "Necesito confirmar el acceso a la API de pagos para avanzar con el ambiente de pruebas.",
    sentAt: "Ayer, 18:40",
    status: "read"
  },
  {
    id: "msg-3",
    thread: "Seguimiento ejecutivo",
    senderName: "Direccion AxolotlCode",
    role: "admin",
    preview: "Compartan el estatus de entregables activos antes del cierre semanal.",
    sentAt: "Ayer, 11:05",
    status: "read"
  }
];
