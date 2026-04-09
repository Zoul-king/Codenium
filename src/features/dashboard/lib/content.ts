import { mockMessages, mockProjects, mockQuotes, mockUsers } from "@/lib/mocks";
import { formatShortDate, getProjectStatusLabel } from "@/lib/presenters";
import type { DashboardMetric, Role } from "@/lib/types/domain";

export function getDashboardMetrics(role: Role): DashboardMetric[] {
  if (role === "client") {
    return [
      {
        label: "Cotizaciones activas",
        value: String(mockQuotes.filter((item) => item.role === "client").length),
        helper: "Estimados y propuestas que siguen en movimiento"
      },
      {
        label: "Proyectos en curso",
        value: String(mockProjects.slice(0, 2).length),
        helper: "Frentes que ya están avanzando contigo"
      },
      {
        label: "Respuestas pendientes",
        value: String(mockMessages.filter((item) => item.role === "client" && item.status === "unread").length),
        helper: "Conversaciones que conviene atender hoy"
      }
    ];
  }

  if (role === "pm") {
    return [
      {
        label: "Proyectos asignados",
        value: String(mockProjects.length),
        helper: "Frentes que requieren seguimiento continuo"
      },
      {
        label: "Entregas cercanas",
        value: String(mockProjects.filter((item) => item.progress >= 60).length),
        helper: "Proyectos que ya entraron a fase de cierre"
      },
      {
        label: "Mensajes por revisar",
        value: String(mockMessages.filter((item) => item.role === "pm" && item.status === "unread").length),
        helper: "Conversaciones que necesitan una respuesta"
      }
    ];
  }

  return [
    {
      label: "Cotizaciones por atender",
      value: String(mockQuotes.filter((item) => item.status !== "approved").length),
      helper: "Solicitudes que requieren seguimiento o decisión"
    },
    {
      label: "Proyectos activos",
      value: String(mockProjects.length),
      helper: "Operación en curso dentro del estudio"
    },
    {
      label: "PM con carga activa",
      value: String(mockUsers.filter((item) => item.role === "pm").length),
      helper: "Responsables con proyectos asignados"
    }
  ];
}

export function getDashboardCopy(role: Role, section: string) {
  const sectionCopy = {
    client: {
      summary: {
        title: "Tu espacio de seguimiento",
        description: "Aquí puedes ver qué has solicitado, cómo avanzan tus proyectos y qué necesitas revisar para seguir avanzando."
      },
      quotes: {
        title: "Mis cotizaciones",
        description: "Consulta tus estimados activos, revisa su rango y ubica cuáles ya están en revisión."
      },
      projects: {
        title: "Mis proyectos",
        description: "Sigue el avance, las fechas estimadas y el estado actual de cada frente activo."
      },
      messages: {
        title: "Mensajes",
        description: "Revisa conversaciones recientes y detecta rápido lo que necesita respuesta."
      },
      profile: {
        title: "Perfil",
        description: "Mantén a la mano tus datos de contacto y la información principal de tu cuenta."
      }
    },
    pm: {
      summary: {
        title: "Resumen operativo",
        description: "Prioriza lo asignado, ubica riesgos y mantén claridad sobre lo que vence pronto."
      },
      projects: {
        title: "Proyectos asignados",
        description: "Consulta el estado actual, el avance y la próxima entrega de cada proyecto a tu cargo."
      },
      timeline: {
        title: "Avances",
        description: "Visualiza el progreso de los proyectos y detecta rápido cuáles requieren impulso."
      },
      messages: {
        title: "Mensajes",
        description: "Mantén ordenada la comunicación con clientes y equipo para evitar bloqueos."
      },
      tasks: {
        title: "Pendientes",
        description: "Ten claras las acciones que destraban entregas, validaciones y coordinación interna."
      }
    },
    admin: {
      summary: {
        title: "Resumen general",
        description: "Ten visibilidad de cotizaciones, proyectos y carga del equipo para tomar decisiones a tiempo."
      },
      quotes: {
        title: "Cotizaciones",
        description: "Revisa lo que entró, qué sigue en revisión y qué ya puede avanzar a la siguiente etapa."
      },
      projects: {
        title: "Proyectos",
        description: "Monitorea el portafolio activo con foco en estado, fechas y capacidad operativa."
      },
      users: {
        title: "Usuarios",
        description: "Consulta quiénes participan en la operación y cuántos frentes sostienen actualmente."
      },
      assignments: {
        title: "Asignaciones",
        description: "Ubica responsables, distribuye carga y detecta proyectos que requieren una decisión."
      },
      settings: {
        title: "Configuración",
        description: "Centraliza criterios visibles del servicio, operación y organización interna."
      }
    }
  }[role];

  return sectionCopy[section as keyof typeof sectionCopy] ?? sectionCopy.summary;
}

export function getSummaryCards(role: Role) {
  if (role === "client") {
    const nextProject = mockProjects[0];
    const pendingQuote = mockQuotes.find((item) => item.role === "client");

    return [
      {
        kicker: "Qué requiere tu atención",
        title: "Lo más importante para seguir avanzando",
        items: [
          `${pendingQuote?.code ?? "Tu cotización"} sigue en revisión comercial.`,
          "Tienes una conversación pendiente sobre prioridades del proyecto.",
          `La próxima fecha clave está proyectada para el ${formatShortDate(nextProject.dueDate)}.`
        ]
      },
      {
        kicker: "Qué sigue",
        title: "Tus siguientes pasos con nosotros",
        items: [
          "Confirmar ajustes de alcance si cambió alguna prioridad.",
          "Validar entregables de la siguiente etapa antes del cierre.",
          `Tu proyecto principal está en ${getProjectStatusLabel(nextProject.status).toLowerCase()}.`
        ]
      }
    ];
  }

  if (role === "pm") {
    const urgentProjects = mockProjects.filter((item) => item.progress >= 60);

    return [
      {
        kicker: "Prioridades de hoy",
        title: "Frentes que necesitan seguimiento inmediato",
        items: [
          "Confirmar accesos de integración pendientes con el cliente.",
          `Acompañar el cierre de ${urgentProjects[0]?.name ?? "los proyectos activos"} esta semana.`,
          "Responder mensajes operativos antes del siguiente corte interno."
        ]
      },
      {
        kicker: "Entregas cercanas",
        title: "Proyectos que conviene vigilar de cerca",
        items: urgentProjects.map((project) => `${project.name}: ${getProjectStatusLabel(project.status)} con entrega estimada para ${formatShortDate(project.dueDate)}.`)
      }
    ];
  }

  return [
    {
      kicker: "Decisiones por tomar",
      title: "Lo que requiere validación o seguimiento",
      items: [
        "Hay cotizaciones activas que todavía requieren una definición comercial.",
        "Conviene revisar proyectos con entregas cercanas y alto avance.",
        "La distribución de PM debe mantenerse balanceada esta semana."
      ]
    },
    {
      kicker: "Carga del equipo",
      title: "Vista rápida de responsables y portafolio",
      items: mockUsers
        .filter((user) => user.role === "pm")
        .map((user) => `${user.name}: ${user.activeProjects} proyectos activos.`)
    }
  ];
}
