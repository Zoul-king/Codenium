import type { DashboardNavItem, PermissionKey, QuoteModuleOption, QuoteProjectTypeOption, Role } from "@/lib/types/domain";

export const quoteProjectTypes: QuoteProjectTypeOption[] = [
  {
    key: "landing",
    label: "Landing page",
    description: "Sitio de una sola vista para captacion, campañas o validacion temprana.",
    base: { min: 12000, max: 22000 },
    timelineWeeks: { min: 2, max: 4 }
  },
  {
    key: "corporate",
    label: "Sitio corporativo",
    description: "Presencia institucional con varias secciones, servicios y formulario.",
    base: { min: 22000, max: 42000 },
    timelineWeeks: { min: 4, max: 7 }
  },
  {
    key: "ecommerce",
    label: "Ecommerce",
    description: "Catalogo, carrito, checkout y gestion operativa orientada a ventas.",
    base: { min: 50000, max: 120000 },
    timelineWeeks: { min: 8, max: 14 }
  },
  {
    key: "admin-system",
    label: "Sistema administrativo",
    description: "Panel interno para operaciones, control de informacion y procesos.",
    base: { min: 65000, max: 140000 },
    timelineWeeks: { min: 8, max: 16 }
  },
  {
    key: "web-app",
    label: "Aplicacion web a medida",
    description: "Producto digital con flujos personalizados, logica propia y escalabilidad.",
    base: { min: 80000, max: 220000 },
    timelineWeeks: { min: 10, max: 20 }
  },
  {
    key: "automation",
    label: "Automatizacion o integracion",
    description: "Conectores, procesos internos y automatizaciones entre herramientas.",
    base: { min: 28000, max: 90000 },
    timelineWeeks: { min: 4, max: 10 }
  },
  {
    key: "redesign",
    label: "Rediseno o mejora",
    description: "Evolucion visual o funcional de una plataforma ya existente.",
    base: { min: 18000, max: 70000 },
    timelineWeeks: { min: 3, max: 8 }
  }
];

export const quoteModules: QuoteModuleOption[] = [
  { key: "custom-design", label: "Diseno personalizado", description: "Direccion visual y pantallas con identidad propia.", price: { min: 6000, max: 16000 }, timelineWeeks: { min: 1, max: 2 } },
  { key: "admin-panel", label: "Panel administrador", description: "Backoffice para gestion de contenido y operacion.", price: { min: 9000, max: 24000 }, timelineWeeks: { min: 1, max: 3 } },
  { key: "auth", label: "Login y usuarios", description: "Acceso con cuentas, recuperacion y perfiles.", price: { min: 7000, max: 18000 }, timelineWeeks: { min: 1, max: 2 } },
  { key: "roles", label: "Roles y permisos", description: "Control granular por tipo de usuario.", price: { min: 8000, max: 20000 }, timelineWeeks: { min: 1, max: 2 } },
  { key: "blog", label: "Blog", description: "Publicacion y gestion de articulos o novedades.", price: { min: 4000, max: 12000 }, timelineWeeks: { min: 1, max: 1 } },
  { key: "catalog", label: "Catalogo", description: "Listado estructurado de productos o servicios.", price: { min: 6000, max: 16000 }, timelineWeeks: { min: 1, max: 2 } },
  { key: "payments", label: "Pagos en linea", description: "Cobro por tarjeta, links o pasarelas.", price: { min: 12000, max: 32000 }, timelineWeeks: { min: 1, max: 3 } },
  { key: "multilang", label: "Multi idioma", description: "Contenido y navegacion en varios idiomas.", price: { min: 5000, max: 14000 }, timelineWeeks: { min: 1, max: 2 } },
  { key: "integrations", label: "Integraciones con terceros", description: "CRM, ERP, pagos, APIs y herramientas externas.", price: { min: 10000, max: 30000 }, timelineWeeks: { min: 1, max: 3 } },
  { key: "reports", label: "Reportes", description: "Paneles, exportables y seguimiento operativo.", price: { min: 8000, max: 22000 }, timelineWeeks: { min: 1, max: 2 } },
  { key: "notifications", label: "Notificaciones", description: "Correo, alertas internas o avisos automaticos.", price: { min: 5000, max: 12000 }, timelineWeeks: { min: 1, max: 2 } },
  { key: "chat", label: "Chat o mensajeria", description: "Conversacion con clientes o equipo dentro del producto.", price: { min: 9000, max: 26000 }, timelineWeeks: { min: 1, max: 3 } },
  { key: "maintenance", label: "Mantenimiento mensual", description: "Bolsa mensual para soporte y mejoras menores.", price: { min: 0, max: 0 }, monthly: { min: 3000, max: 10000 } }
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
    { key: "timeline", label: "Timeline", href: "/dashboard/pm/timeline" },
    { key: "messages", label: "Mensajes", href: "/dashboard/pm/messages" },
    { key: "tasks", label: "Pendientes", href: "/dashboard/pm/tasks" }
  ],
  admin: [
    { key: "summary", label: "Resumen general", href: "/dashboard/admin" },
    { key: "quotes", label: "Cotizaciones", href: "/dashboard/admin/quotes" },
    { key: "projects", label: "Proyectos", href: "/dashboard/admin/projects" },
    { key: "users", label: "Usuarios", href: "/dashboard/admin/users" },
    { key: "assignments", label: "Asignaciones", href: "/dashboard/admin/assignments" },
    { key: "settings", label: "Configuracion", href: "/dashboard/admin/settings" }
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
