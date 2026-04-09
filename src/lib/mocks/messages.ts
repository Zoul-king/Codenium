import type { MessageRecord } from "@/lib/types/domain";

export const mockMessages: MessageRecord[] = [
  {
    id: "msg-1",
    thread: "Portal Valeria Capital",
    senderId: "user-client-1",
    recipientId: "user-pm-1",
    projectId: "project-1",
    quoteId: "quote-1",
    senderName: "Valeria Rios",
    role: "client",
    preview: "Ya revisamos el alcance y queremos priorizar la seccion de inmuebles destacados en la siguiente etapa.",
    sentAt: "Hoy, 09:20",
    status: "unread"
  },
  {
    id: "msg-2",
    thread: "Portal Valeria Capital",
    senderId: "user-pm-1",
    recipientId: "user-client-1",
    projectId: "project-1",
    quoteId: "quote-1",
    senderName: "Miguel Santos",
    role: "pm",
    preview: "Perfecto. Hoy dejamos listo el flujo de prioridad y manana comparto la nueva vista para validacion.",
    sentAt: "Hoy, 10:05",
    status: "read"
  },
  {
    id: "msg-3",
    thread: "Portal Valeria Capital",
    senderId: "user-client-1",
    recipientId: "user-pm-1",
    projectId: "project-1",
    quoteId: "quote-1",
    senderName: "Valeria Rios",
    role: "client",
    preview: "Tambien necesitamos confirmar la fecha de entrega del modulo documental para alinear al equipo interno.",
    sentAt: "Hoy, 11:10",
    status: "read"
  },
  {
    id: "msg-4",
    thread: "Bloqueos de integracion",
    senderId: "user-pm-1",
    recipientId: "user-admin-1",
    projectId: "project-2",
    quoteId: "quote-2",
    senderName: "Miguel Santos",
    role: "pm",
    preview: "Necesito confirmar el acceso a la API de pagos para avanzar con el ambiente de pruebas.",
    sentAt: "Ayer, 18:40",
    status: "unread"
  },
  {
    id: "msg-5",
    thread: "Nutrition Lab Commerce",
    senderId: "user-client-2",
    recipientId: "user-pm-1",
    projectId: "project-2",
    quoteId: "quote-2",
    senderName: "Daniel Ortega",
    role: "client",
    preview: "Comparto la lista priorizada del catalogo para que la siguiente revision ya salga con productos destacados.",
    sentAt: "Ayer, 16:15",
    status: "unread"
  },
  {
    id: "msg-6",
    thread: "Seguimiento ejecutivo",
    senderId: "user-admin-1",
    recipientId: "user-pm-2",
    projectId: "project-3",
    quoteId: "quote-3",
    senderName: "Equipo Direccion",
    role: "admin",
    preview: "Compartan el estatus de entregables activos antes del cierre semanal.",
    sentAt: "Ayer, 11:05",
    status: "read"
  }
];
