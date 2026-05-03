import type { MessageRecord } from "@/lib/types/domain";

export const mockMessages: MessageRecord[] = [
  // ── project-1: Portal Valeria Capital ────────────────────────────────────
  {
    id: "msg-1-1",
    thread: "Portal Valeria Capital",
    senderId: "user-client-1",
    recipientId: "user-pm-1",
    projectId: "project-1",
    quoteId: "quote-1",
    senderName: "Valeria Ríos",
    role: "client",
    preview: "Ya revisamos el diseño con el equipo. Queremos priorizar la sección de inmuebles destacados en el primer scroll.",
    sentAt: "Hoy, 09:20",
    status: "unread"
  },
  {
    id: "msg-1-2",
    thread: "Portal Valeria Capital",
    senderId: "user-pm-1",
    recipientId: "user-client-1",
    projectId: "project-1",
    quoteId: "quote-1",
    senderName: "Miguel Santos",
    role: "pm",
    preview: "Perfecto. Ajustamos el orden hoy y mañana comparto la vista actualizada para validación.",
    sentAt: "Hoy, 10:05",
    status: "read"
  },
  {
    id: "msg-1-3",
    thread: "Portal Valeria Capital",
    senderId: "user-client-1",
    recipientId: "user-pm-1",
    projectId: "project-1",
    quoteId: "quote-1",
    senderName: "Valeria Ríos",
    role: "client",
    preview: "También necesitamos confirmar la fecha de entrega del módulo documental para alinear al equipo interno.",
    sentAt: "Hoy, 11:10",
    status: "read"
  },

  // ── project-2: Nutrition Lab Commerce ────────────────────────────────────
  {
    id: "msg-2-1",
    thread: "Nutrition Lab Commerce",
    senderId: "user-client-2",
    recipientId: "user-pm-1",
    projectId: "project-2",
    quoteId: "quote-2",
    senderName: "Daniel Ortega",
    role: "client",
    preview: "Comparto la lista priorizada del catálogo. La siguiente revisión ya debería salir con los 50 productos destacados arriba.",
    sentAt: "Ayer, 16:15",
    status: "unread"
  },
  {
    id: "msg-2-2",
    thread: "Nutrition Lab Commerce",
    senderId: "user-pm-1",
    recipientId: "user-client-2",
    projectId: "project-2",
    quoteId: "quote-2",
    senderName: "Miguel Santos",
    role: "pm",
    preview: "Recibido. Tomo el archivo y lo integro en el CMS esta tarde. Confirmo cuando esté listo para que revises.",
    sentAt: "Ayer, 17:00",
    status: "read"
  },
  {
    id: "msg-2-3",
    thread: "Nutrition Lab Commerce",
    senderId: "user-pm-1",
    recipientId: "user-client-2",
    projectId: "project-2",
    quoteId: "quote-2",
    senderName: "Miguel Santos",
    role: "pm",
    preview: "Necesito confirmar el acceso a la API de pagos para avanzar con el ambiente de pruebas este viernes.",
    sentAt: "Hoy, 08:30",
    status: "unread"
  },

  // ── project-4: Fuentes Arquitectos Portal ─────────────────────────────────
  {
    id: "msg-4-1",
    thread: "Fuentes Arquitectos Portal",
    senderId: "user-pm-1",
    recipientId: "user-client-4",
    projectId: "project-4",
    quoteId: "quote-4",
    senderName: "Miguel Santos",
    role: "pm",
    preview: "Estamos en la última revisión de QA. Encontramos un problema menor en móvil que resolvemos hoy. Para mañana todo listo.",
    sentAt: "Ayer, 14:20",
    status: "read"
  },
  {
    id: "msg-4-2",
    thread: "Fuentes Arquitectos Portal",
    senderId: "user-client-4",
    recipientId: "user-pm-1",
    projectId: "project-4",
    quoteId: "quote-4",
    senderName: "Rodrigo Fuentes",
    role: "client",
    preview: "Perfecto. Avisen cuando esté listo el ambiente de staging para que lo revise el equipo de marketing antes del lanzamiento.",
    sentAt: "Ayer, 15:00",
    status: "read"
  },

  // ── project-7: Alcántara Logística Dashboard ──────────────────────────────
  {
    id: "msg-7-1",
    thread: "Alcántara Logística Dashboard",
    senderId: "user-pm-2",
    recipientId: "user-client-6",
    projectId: "project-7",
    quoteId: "quote-7",
    senderName: "Andrea Ruiz",
    role: "pm",
    preview: "Terminé el diagrama de flujos. Quedaron 8 procesos principales mapeados. ¿Tienen disponibilidad el jueves para revisarlo?",
    sentAt: "Hace 2 días, 11:40",
    status: "read"
  },
  {
    id: "msg-7-2",
    thread: "Alcántara Logística Dashboard",
    senderId: "user-client-6",
    recipientId: "user-pm-2",
    projectId: "project-7",
    quoteId: "quote-7",
    senderName: "Fernando Alcántara",
    role: "client",
    preview: "Sí, el jueves a las 10 AM me funciona. Voy a traer al jefe de operaciones para que valide el flujo de rutas.",
    sentAt: "Hace 2 días, 13:00",
    status: "read"
  },
  {
    id: "msg-7-3",
    thread: "Alcántara Logística Dashboard",
    senderId: "user-pm-2",
    recipientId: "user-client-6",
    projectId: "project-7",
    quoteId: "quote-7",
    senderName: "Andrea Ruiz",
    role: "pm",
    preview: "Confirmado el jueves 10 AM. Les comparto el link de la reunión por correo. El diseño del panel principal ya va tomando forma.",
    sentAt: "Ayer, 09:15",
    status: "unread"
  },

  // ── project-6: Bloom Studio Branding Web ──────────────────────────────────
  {
    id: "msg-6-1",
    thread: "Bloom Studio Branding Web",
    senderId: "user-client-5",
    recipientId: "user-pm-3",
    projectId: "project-6",
    quoteId: "quote-6",
    senderName: "Sofía Castro",
    role: "client",
    preview: "Subí las fotos del portafolio nuevo. Son 18 imágenes en alta resolución. ¿Puedes revisarlas para integrarlas esta semana?",
    sentAt: "Ayer, 10:30",
    status: "unread"
  },
  {
    id: "msg-6-2",
    thread: "Bloom Studio Branding Web",
    senderId: "user-pm-3",
    recipientId: "user-client-5",
    projectId: "project-6",
    quoteId: "quote-6",
    senderName: "Carlos Méndez",
    role: "pm",
    preview: "Las recibí. Voy a optimizarlas y las tengo integradas para el viernes. El blog ya está funcionando con el primer post de prueba.",
    sentAt: "Ayer, 11:45",
    status: "read"
  },

  // ── project-10: Valeria Capital Analytics ────────────────────────────────
  {
    id: "msg-10-1",
    thread: "Valeria Capital Analytics",
    senderId: "user-pm-2",
    recipientId: "user-client-1",
    projectId: "project-10",
    quoteId: "quote-10",
    senderName: "Andrea Ruiz",
    role: "pm",
    preview: "Ya tenemos el primer prototipo del dashboard de captación. ¿Tienen tiempo esta semana para una sesión de revisión de 30 min?",
    sentAt: "Hoy, 08:00",
    status: "unread"
  },

  // ── project-3: Ops Control Suite (completado) ─────────────────────────────
  {
    id: "msg-3-1",
    thread: "Ops Control Suite",
    senderId: "user-pm-2",
    recipientId: "user-client-2",
    projectId: "project-3",
    quoteId: "quote-3",
    senderName: "Andrea Ruiz",
    role: "pm",
    preview: "El sistema está en producción. Acabo de enviarte el manual de usuario y los accesos definitivos. ¡Fue un gusto trabajar con tu equipo!",
    sentAt: "14 mar, 16:30",
    status: "read"
  },

  // ── Seguimiento ejecutivo (admin → pm) ────────────────────────────────────
  {
    id: "msg-admin-1",
    thread: "Seguimiento semanal",
    senderId: "user-admin-1",
    recipientId: "user-pm-1",
    projectId: "project-1",
    quoteId: "quote-1",
    senderName: "Equipo Dirección",
    role: "admin",
    preview: "Miguel, ¿cómo va el portal de Valeria Capital? El cliente preguntó por el avance del módulo documental.",
    sentAt: "Ayer, 09:00",
    status: "read"
  },
  {
    id: "msg-admin-2",
    thread: "Seguimiento semanal",
    senderId: "user-admin-1",
    recipientId: "user-pm-2",
    projectId: "project-7",
    quoteId: "quote-7",
    senderName: "Equipo Dirección",
    role: "admin",
    preview: "Andrea, confirma el estatus del dashboard de Alcántara antes del cierre semanal. El cliente quiere un reporte ejecutivo.",
    sentAt: "Ayer, 09:05",
    status: "unread"
  }
];
