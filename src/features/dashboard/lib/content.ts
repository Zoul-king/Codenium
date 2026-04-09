import { mockMessages, mockProjects, mockQuotes, mockUsers } from "@/lib/mocks";
import type { DashboardMetric, Role } from "@/lib/types/domain";

export function getDashboardMetrics(role: Role): DashboardMetric[] {
  if (role === "client") {
    return [
      { label: "Cotizaciones activas", value: String(mockQuotes.filter((item) => item.role === "client").length), helper: "Pre cotizaciones y propuestas en curso" },
      { label: "Proyectos activos", value: "2", helper: "Iniciativas que siguen en ejecucion" },
      { label: "Mensajes pendientes", value: "1", helper: "Conversaciones por responder" }
    ];
  }

  if (role === "pm") {
    return [
      { label: "Proyectos asignados", value: "3", helper: "Frentes activos dentro del equipo" },
      { label: "Entregables esta semana", value: "5", helper: "Items planeados en el corte actual" },
      { label: "Bloqueos abiertos", value: "2", helper: "Puntos que requieren seguimiento" }
    ];
  }

  return [
    { label: "Cotizaciones", value: String(mockQuotes.length), helper: "Visibilidad total del funnel comercial" },
    { label: "Proyectos", value: String(mockProjects.length), helper: "Ejecuciones activas o recientes" },
    { label: "Usuarios", value: String(mockUsers.length), helper: "Actores mock listos para backend real" }
  ];
}

export function getDashboardCopy(role: Role, section: string) {
  const base = {
    client: {
      title: "Panel cliente",
      description: "Consulta tu informacion comercial y de seguimiento sin salir del ecosistema actual del sitio."
    },
    pm: {
      title: "Panel PM",
      description: "Organiza proyectos, revisa avances y mantente al dia con entregables y mensajes."
    },
    admin: {
      title: "Panel admin",
      description: "Centraliza operacion, seguimiento de cotizaciones y asignaciones internas."
    }
  }[role];

  const sectionTitles: Record<string, string> = {
    summary: base.title,
    quotes: role === "client" ? "Mis cotizaciones" : "Cotizaciones",
    projects: role === "client" ? "Mis proyectos" : role === "pm" ? "Proyectos asignados" : "Proyectos",
    messages: "Mensajes",
    profile: "Perfil",
    timeline: "Timeline",
    tasks: "Pendientes",
    users: "Usuarios",
    assignments: "Asignaciones",
    settings: "Configuracion"
  };

  return {
    title: sectionTitles[section] ?? base.title,
    description: base.description
  };
}
