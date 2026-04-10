import type {
  DashboardNavItem,
  InfrastructureOption,
  PermissionKey,
  QuoteModuleOption,
  QuoteProjectTypeOption,
  Role
} from "@/lib/types/domain";

export const quoteProjectTypes: QuoteProjectTypeOption[] = [
  {
    key: "landing",
    label: "Landing page",
    description: "Una pagina enfocada en captar leads, validar una oferta o impulsar una campana puntual.",
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
    description: "Una tienda en linea con catalogo, carrito, checkout y operacion comercial.",
    base: { min: 50000, max: 120000 },
    timelineWeeks: { min: 8, max: 14 }
  },
  {
    key: "admin-system",
    label: "Sistema administrativo",
    description: "Una plataforma para organizar operaciones, informacion y procesos internos.",
    base: { min: 65000, max: 140000 },
    timelineWeeks: { min: 8, max: 16 }
  },
  {
    key: "web-app",
    label: "Aplicacion web a medida",
    description: "Un producto digital con flujos personalizados, logica propia y espacio para crecer.",
    base: { min: 80000, max: 220000 },
    timelineWeeks: { min: 10, max: 20 }
  },
  {
    key: "automation",
    label: "Automatizacion o integracion",
    description: "Conexiones y automatizaciones entre herramientas para ahorrar tiempo operativo.",
    base: { min: 28000, max: 90000 },
    timelineWeeks: { min: 4, max: 10 }
  },
  {
    key: "redesign",
    label: "Rediseno o mejora",
    description: "Una evolucion visual, funcional o estrategica sobre una plataforma existente.",
    base: { min: 18000, max: 70000 },
    timelineWeeks: { min: 3, max: 8 }
  }
];

export const quoteModules: QuoteModuleOption[] = [
  { key: "custom-design", group: "feature", label: "Diseno personalizado", description: "Direccion visual y pantallas alineadas con tu marca.", price: { min: 6000, max: 16000 }, timelineWeeks: { min: 1, max: 2 } },
  { key: "admin-panel", group: "feature", label: "Panel administrador", description: "Un espacio interno para gestionar contenido y operacion diaria.", price: { min: 9000, max: 24000 }, timelineWeeks: { min: 1, max: 3 } },
  { key: "auth", group: "feature", label: "Login y usuarios", description: "Acceso con cuentas, recuperacion de contrasena y perfiles basicos.", price: { min: 7000, max: 18000 }, timelineWeeks: { min: 1, max: 2 } },
  { key: "roles", group: "feature", label: "Roles y permisos", description: "Niveles de acceso para distintos tipos de usuario.", price: { min: 8000, max: 20000 }, timelineWeeks: { min: 1, max: 2 } },
  { key: "blog", group: "feature", label: "Blog", description: "Seccion de articulos, novedades o contenido editorial.", price: { min: 4000, max: 12000 }, timelineWeeks: { min: 1, max: 1 } },
  { key: "catalog", group: "feature", label: "Catalogo", description: "Listado organizado de productos, servicios o inventario.", price: { min: 6000, max: 16000 }, timelineWeeks: { min: 1, max: 2 } },
  { key: "payments", group: "feature", label: "Pagos en linea", description: "Cobro con tarjeta, links de pago o pasarelas especializadas.", price: { min: 12000, max: 32000 }, timelineWeeks: { min: 1, max: 3 } },
  { key: "multilang", group: "feature", label: "Multi idioma", description: "Contenido y navegacion disponibles en mas de un idioma.", price: { min: 5000, max: 14000 }, timelineWeeks: { min: 1, max: 2 } },
  { key: "integrations", group: "feature", label: "Integraciones con terceros", description: "Conexion con CRM, ERP, APIs, pagos o herramientas externas.", price: { min: 10000, max: 30000 }, timelineWeeks: { min: 1, max: 3 } },
  { key: "reports", group: "feature", label: "Reportes", description: "Paneles, exportables y seguimiento con datos utiles para operar.", price: { min: 8000, max: 22000 }, timelineWeeks: { min: 1, max: 2 } },
  { key: "notifications", group: "feature", label: "Notificaciones", description: "Correos, alertas o avisos automaticos dentro del flujo.", price: { min: 5000, max: 12000 }, timelineWeeks: { min: 1, max: 2 } },
  { key: "chat", group: "feature", label: "Chat o mensajeria", description: "Conversacion dentro del producto para clientes o equipo.", price: { min: 9000, max: 26000 }, timelineWeeks: { min: 1, max: 3 } },
  { key: "maintenance", group: "service", label: "Mantenimiento mensual", description: "Acompanamiento continuo para soporte, ajustes y mejoras menores.", price: { min: 0, max: 0 }, monthly: { min: 3000, max: 10000 } }
];

export const quoteInfrastructureOptions: Array<{
  key: InfrastructureOption;
  label: string;
  description: string;
}> = [
  {
    key: "new",
    label: "Nueva infraestructura",
    description: "Partimos desde cero para definir base tecnica, ambientes y despliegue."
  },
  {
    key: "existing",
    label: "Infraestructura existente",
    description: "Trabajamos sobre servidores, dominios o flujos ya operando en tu negocio."
  },
  {
    key: "cloud",
    label: "Arquitectura en nube",
    description: "El proyecto se prepara para operar con servicios cloud y escalabilidad controlada."
  },
  {
    key: "hybrid",
    label: "Infraestructura hibrida",
    description: "Combinamos sistemas existentes con nuevas piezas en nube o integraciones dedicadas."
  }
];

export const dashboardNav: Record<Role, DashboardNavItem[]> = {
  client: [
    { key: "projects", label: "Proyectos", href: "/dashboard/client" },
    { key: "milestones", label: "Hitos y cambios", href: "/dashboard/client/milestones" },
    { key: "chat", label: "Chat con PM", href: "/dashboard/client/chat" },
    { key: "payments", label: "Pagos", href: "/dashboard/client/payments" },
    { key: "deliverables", label: "Entregables", href: "/dashboard/client/deliverables" },
    { key: "profile", label: "Perfil", href: "/dashboard/client/profile" }
  ],
  pm: [
    { key: "projects", label: "Proyectos", href: "/dashboard/pm" },
    { key: "milestones", label: "Hitos", href: "/dashboard/pm/milestones" },
    { key: "deliverables", label: "Entregables", href: "/dashboard/pm/deliverables" },
    { key: "chat", label: "Chat con cliente", href: "/dashboard/pm/chat" },
    { key: "profile", label: "Perfil", href: "/dashboard/pm/profile" }
  ],
  admin: [
    { key: "metrics", label: "Metricas", href: "/dashboard/admin" },
    { key: "quotes", label: "Cotizaciones", href: "/dashboard/admin/quotes" },
    { key: "users", label: "Usuarios", href: "/dashboard/admin/users" },
    { key: "payments", label: "Pagos", href: "/dashboard/admin/payments" },
    { key: "deliverables", label: "Entregables", href: "/dashboard/admin/deliverables" }
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
