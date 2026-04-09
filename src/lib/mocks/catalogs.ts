import type { DashboardNavItem, PermissionKey, QuoteModuleOption, QuoteProjectTypeOption, Role } from "@/lib/types/domain";

export const quoteProjectTypes: QuoteProjectTypeOption[] = [
  {
    key: "landing",
    label: "Landing page",
    description: "Una página enfocada en captar leads, validar una oferta o impulsar una campaña puntual.",
    base: { min: 12000, max: 22000 },
    timelineWeeks: { min: 2, max: 4 }
  },
  {
    key: "corporate",
    label: "Sitio corporativo",
    description: "Un sitio institucional con varias secciones, servicios, contenido clave y contacto.",
    base: { min: 22000, max: 42000 },
    timelineWeeks: { min: 4, max: 7 }
  },
  {
    key: "ecommerce",
    label: "Ecommerce",
    description: "Una tienda en línea con catálogo, carrito, checkout y operación comercial.",
    base: { min: 50000, max: 120000 },
    timelineWeeks: { min: 8, max: 14 }
  },
  {
    key: "admin-system",
    label: "Sistema administrativo",
    description: "Una plataforma para organizar operaciones, información y procesos internos.",
    base: { min: 65000, max: 140000 },
    timelineWeeks: { min: 8, max: 16 }
  },
  {
    key: "web-app",
    label: "Aplicación web a medida",
    description: "Un producto digital con flujos personalizados, lógica propia y espacio para crecer.",
    base: { min: 80000, max: 220000 },
    timelineWeeks: { min: 10, max: 20 }
  },
  {
    key: "automation",
    label: "Automatización o integración",
    description: "Conexiones y automatizaciones entre herramientas para ahorrar tiempo operativo.",
    base: { min: 28000, max: 90000 },
    timelineWeeks: { min: 4, max: 10 }
  },
  {
    key: "redesign",
    label: "Rediseño o mejora",
    description: "Una evolución visual, funcional o estratégica sobre una plataforma existente.",
    base: { min: 18000, max: 70000 },
    timelineWeeks: { min: 3, max: 8 }
  }
];

export const quoteModules: QuoteModuleOption[] = [
  { key: "custom-design", group: "feature", label: "Diseño personalizado", description: "Dirección visual y pantallas alineadas con tu marca.", price: { min: 6000, max: 16000 }, timelineWeeks: { min: 1, max: 2 } },
  { key: "admin-panel", group: "feature", label: "Panel administrador", description: "Un espacio interno para gestionar contenido y operación diaria.", price: { min: 9000, max: 24000 }, timelineWeeks: { min: 1, max: 3 } },
  { key: "auth", group: "feature", label: "Login y usuarios", description: "Acceso con cuentas, recuperación de contraseña y perfiles básicos.", price: { min: 7000, max: 18000 }, timelineWeeks: { min: 1, max: 2 } },
  { key: "roles", group: "feature", label: "Roles y permisos", description: "Niveles de acceso para distintos tipos de usuario.", price: { min: 8000, max: 20000 }, timelineWeeks: { min: 1, max: 2 } },
  { key: "blog", group: "feature", label: "Blog", description: "Sección de artículos, novedades o contenido editorial.", price: { min: 4000, max: 12000 }, timelineWeeks: { min: 1, max: 1 } },
  { key: "catalog", group: "feature", label: "Catálogo", description: "Listado organizado de productos, servicios o inventario.", price: { min: 6000, max: 16000 }, timelineWeeks: { min: 1, max: 2 } },
  { key: "payments", group: "feature", label: "Pagos en línea", description: "Cobro con tarjeta, links de pago o pasarelas especializadas.", price: { min: 12000, max: 32000 }, timelineWeeks: { min: 1, max: 3 } },
  { key: "multilang", group: "feature", label: "Multi idioma", description: "Contenido y navegación disponibles en más de un idioma.", price: { min: 5000, max: 14000 }, timelineWeeks: { min: 1, max: 2 } },
  { key: "integrations", group: "feature", label: "Integraciones con terceros", description: "Conexión con CRM, ERP, APIs, pagos o herramientas externas.", price: { min: 10000, max: 30000 }, timelineWeeks: { min: 1, max: 3 } },
  { key: "reports", group: "feature", label: "Reportes", description: "Paneles, exportables y seguimiento con datos útiles para operar.", price: { min: 8000, max: 22000 }, timelineWeeks: { min: 1, max: 2 } },
  { key: "notifications", group: "feature", label: "Notificaciones", description: "Correos, alertas o avisos automáticos dentro del flujo.", price: { min: 5000, max: 12000 }, timelineWeeks: { min: 1, max: 2 } },
  { key: "chat", group: "feature", label: "Chat o mensajería", description: "Conversación dentro del producto para clientes o equipo.", price: { min: 9000, max: 26000 }, timelineWeeks: { min: 1, max: 3 } },
  { key: "maintenance", group: "service", label: "Mantenimiento mensual", description: "Acompañamiento continuo para soporte, ajustes y mejoras menores.", price: { min: 0, max: 0 }, monthly: { min: 3000, max: 10000 } }
];

export const dashboardNav: Record<Role, DashboardNavItem[]> = {
  client: [
    { key: "summary", label: "Resumen", href: "/dashboard/client" },
    { key: "quotes", label: "Mis cotizaciones", href: "/dashboard/client/quotes" },
    { key: "projects", label: "Mis proyectos", href: "/dashboard/client/projects" },
    { key: "messages", label: "Mensajes", href: "/dashboard/client/messages" },
    { key: "profile", label: "Perfil", href: "/dashboard/client/profile" }
  ],
  pm: [
    { key: "summary", label: "Resumen", href: "/dashboard/pm" },
    { key: "projects", label: "Proyectos asignados", href: "/dashboard/pm/projects" },
    { key: "timeline", label: "Avances", href: "/dashboard/pm/timeline" },
    { key: "messages", label: "Mensajes", href: "/dashboard/pm/messages" },
    { key: "tasks", label: "Pendientes", href: "/dashboard/pm/tasks" }
  ],
  admin: [
    { key: "summary", label: "Resumen general", href: "/dashboard/admin" },
    { key: "quotes", label: "Cotizaciones", href: "/dashboard/admin/quotes" },
    { key: "projects", label: "Proyectos", href: "/dashboard/admin/projects" },
    { key: "users", label: "Usuarios", href: "/dashboard/admin/users" },
    { key: "assignments", label: "Asignaciones", href: "/dashboard/admin/assignments" },
    { key: "settings", label: "Configuración", href: "/dashboard/admin/settings" }
  ]
};

export const rolePermissions: Record<Role, PermissionKey[]> = {
  client: ["quotes:read", "quotes:write", "projects:read", "messages:read", "messages:write"],
  pm: ["quotes:read", "projects:read", "projects:write", "messages:read", "messages:write"],
  admin: ["quotes:read", "quotes:write", "projects:read", "projects:write", "messages:read", "messages:write", "users:read", "users:write", "settings:read"]
};

export const dashboardHomeByRole: Record<Role, string> = {
  client: "/dashboard/client",
  pm: "/dashboard/pm",
  admin: "/dashboard/admin"
};
