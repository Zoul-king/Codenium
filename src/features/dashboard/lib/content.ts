import { getPrimaryUser, getPmUsers, getVisibleMessages, getVisibleProjects, getVisibleQuotes } from "@/features/dashboard/lib/selectors";
import { formatShortDate } from "@/lib/presenters";
import type { Role } from "@/lib/types/domain";

interface DashboardMetric {
  label: string;
  value: string;
  helper: string;
}

interface SummaryCard {
  kicker: string;
  title: string;
  items: string[];
}

interface DashboardHeader {
  title: string;
  description: string;
  metrics: DashboardMetric[];
}

export function getDashboardContent(role: Role, activeKey: string): DashboardHeader {
  const quotes = getVisibleQuotes(role);
  const projects = getVisibleProjects(role);
  const messages = getVisibleMessages(role);
  const user = getPrimaryUser(role);

  if (role === "client") {
    const nextProject = projects.slice().sort((a, b) => a.dueDate.localeCompare(b.dueDate))[0];

    return {
      title: activeKey === "summary" ? "Tu espacio de seguimiento" : getClientSectionTitle(activeKey),
      description:
        activeKey === "summary"
          ? "Consulta tu estimado inicial, revisa en qué va cada proyecto y detecta rápido qué necesita tu atención."
          : "Toda la información visible aquí está organizada para ayudarte a seguir el proceso sin perder contexto.",
      metrics: [
        { label: "Cotizaciones", value: String(quotes.length), helper: "Solicitudes activas o recientes" },
        { label: "Proyectos", value: String(projects.length), helper: "Frentes en curso para tu cuenta" },
        { label: "Próximo hito", value: nextProject ? formatShortDate(nextProject.dueDate) : "Sin fecha", helper: nextProject ? nextProject.name : "Aún no hay proyecto activo" }
      ]
    };
  }

  if (role === "pm") {
    const blocked = projects.filter((project) => project.progress < 45).length;
    const unread = messages.filter((message) => message.status === "unread").length;

    return {
      title: activeKey === "summary" ? "Panel de coordinación" : getPmSectionTitle(activeKey),
      description:
        activeKey === "summary"
          ? "Prioriza entregables, revisa qué está por vencer y responde rápido a los mensajes que pueden frenar el avance."
          : "Esta vista concentra lo que necesitas para mover proyectos y mantener claridad con clientes y dirección.",
      metrics: [
        { label: "Asignados", value: String(projects.length), helper: "Proyectos activos bajo tu coordinación" },
        { label: "Requieren atención", value: String(blocked), helper: "Frentes que todavía necesitan definición o desbloqueo" },
        { label: "Mensajes pendientes", value: String(unread), helper: "Conversaciones por revisar hoy" }
      ]
    };
  }

  const pmUsers = getPmUsers();
  const approvedQuotes = quotes.filter((quote) => quote.status === "approved").length;
  const maxLoad = Math.max(...pmUsers.map((pm) => pm.activeProjects));

  return {
    title: activeKey === "summary" ? "Visión general del negocio" : getAdminSectionTitle(activeKey),
    description:
      activeKey === "summary"
        ? "Observa lo que está entrando, qué proyectos necesitan decisión y cómo está distribuida la carga del equipo."
        : "Aquí se concentra la operación visible para revisar demanda, carga interna y continuidad del servicio.",
    metrics: [
      { label: "Cotizaciones activas", value: String(quotes.length), helper: `${approvedQuotes} ya están aprobadas` },
      { label: "Proyectos en curso", value: String(projects.length), helper: "Frentes visibles en operación" },
      { label: "Carga más alta", value: `${maxLoad}`, helper: user ? `${user.name} monitorea la distribución` : "Seguimiento general" }
    ]
  };
}

export function getSummaryCards(role: Role): SummaryCard[] {
  const quotes = getVisibleQuotes(role);
  const projects = getVisibleProjects(role);
  const messages = getVisibleMessages(role);

  if (role === "client") {
    return [
      {
        kicker: "Qué ya pediste",
        title: "Tus solicitudes siguen el mismo hilo",
        items: quotes.map((quote) => `${quote.code} · ${quote.title}`)
      },
      {
        kicker: "Qué sigue",
        title: "Tus próximos pasos visibles",
        items: [
          projects[0] ? `${projects[0].name}: entrega estimada ${formatShortDate(projects[0].dueDate)}` : "Aún no hay proyecto activo.",
          messages[0] ? `Responder conversación: ${messages[0].thread}` : "No tienes mensajes pendientes.",
          "Si necesitas ajustar alcance, puedes retomarlo desde tu cotización."
        ]
      }
    ];
  }

  if (role === "pm") {
    return [
      {
        kicker: "Prioridades",
        title: "Lo que más presión tiene hoy",
        items: projects.map((project) => `${project.name} · ${project.progress}% de avance`)
      },
      {
        kicker: "Seguimiento",
        title: "Atención inmediata",
        items: [
          messages[0] ? `Responder: ${messages[0].thread}` : "No hay conversaciones urgentes.",
          projects[0] ? `Revisar entregable de ${projects[0].name}` : "Sin entregables urgentes.",
          "Mantén visibles bloqueos, dependencias y próximos hitos."
        ]
      }
    ];
  }

  return [
    {
      kicker: "Entrada comercial",
      title: "Lo que está entrando al pipeline",
      items: quotes.map((quote) => `${quote.code} · ${quote.clientName}`)
    },
    {
      kicker: "Operación",
      title: "Decisiones por tomar",
      items: [
        projects[0] ? `Confirmar siguiente fase de ${projects[0].name}` : "Sin proyectos activos.",
        messages[0] ? `Responder hilo: ${messages[0].thread}` : "Sin mensajes abiertos.",
        "Distribuir carga y revisar riesgo antes del próximo corte."
      ]
    }
  ];
}

function getClientSectionTitle(section: string) {
  if (section === "quotes") return "Tus cotizaciones";
  if (section === "projects") return "Tus proyectos";
  if (section === "messages") return "Tus mensajes";
  return "Tu perfil";
}

function getPmSectionTitle(section: string) {
  if (section === "projects") return "Proyectos asignados";
  if (section === "timeline") return "Avances y entregables";
  if (section === "messages") return "Mensajes del equipo y clientes";
  return "Pendientes del día";
}

function getAdminSectionTitle(section: string) {
  if (section === "quotes") return "Cotizaciones activas";
  if (section === "projects") return "Proyectos en curso";
  if (section === "users") return "Usuarios y roles";
  if (section === "assignments") return "Asignaciones del equipo";
  return "Configuración visible";
}
