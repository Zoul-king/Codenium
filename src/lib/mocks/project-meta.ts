import type { PaymentRecord, ProjectDocumentRecord, ProjectMilestoneRecord } from "@/lib/types/domain";

export const mockMilestones: ProjectMilestoneRecord[] = [
  // ── project-1: Portal Valeria Capital (build 62%) ────────────────────────
  { id: "m1-1", projectId: "project-1", title: "Kickoff y arquitectura aprobada", summary: "Revisión del alcance, accesos y estructura técnica confirmada con el equipo.", date: "2026-02-03", status: "done" },
  { id: "m1-2", projectId: "project-1", title: "Diseño aprobado por cliente", summary: "Maquetas de las vistas principales revisadas y aprobadas con correcciones menores.", date: "2026-02-24", status: "done", unlocksPaymentId: "pay-1-2" },
  { id: "m1-3", projectId: "project-1", title: "Vista comercial en desarrollo", summary: "Panel de propiedades e inmuebles con filtros activos. Integrando el módulo documental.", date: "2026-04-14", status: "current", unlocksPaymentId: "pay-1-3" },
  { id: "m1-4", projectId: "project-1", title: "QA y revisión con cliente", summary: "Validación funcional completa, pruebas de carga y sesión de retroalimentación.", date: "2026-04-28", status: "next", unlocksPaymentId: "pay-1-4" },
  { id: "m1-5", projectId: "project-1", title: "Lanzamiento", summary: "Despliegue a producción, configuración de dominio y entrega de accesos.", date: "2026-05-16", status: "next" },

  // ── project-2: Nutrition Lab Commerce (design 38%) ───────────────────────
  { id: "m2-1", projectId: "project-2", title: "Definición de catálogo y checkout", summary: "Estructura del catálogo y flujo de compra definidos con el equipo de producto.", date: "2026-02-14", status: "done" },
  { id: "m2-2", projectId: "project-2", title: "Diseño del sistema de pago", summary: "Prototipo de checkout con Stripe y validación del flujo de órdenes.", date: "2026-03-07", status: "done", unlocksPaymentId: "pay-2-2" },
  { id: "m2-3", projectId: "project-2", title: "Integración de catálogo completo", summary: "1,200 SKUs cargados, filtros activos por categoría y disponibilidad.", date: "2026-04-18", status: "current", unlocksPaymentId: "pay-2-3" },
  { id: "m2-4", projectId: "project-2", title: "QA de conversión y pagos", summary: "Pruebas end-to-end del flujo de compra con tarjeta y OXXO.", date: "2026-05-05", status: "next", unlocksPaymentId: "pay-2-4" },
  { id: "m2-5", projectId: "project-2", title: "Lanzamiento a producción", summary: "Go-live con monitoreo activo los primeros 5 días.", date: "2026-06-04", status: "next" },

  // ── project-4: Fuentes Arquitectos Portal (qa 88%) ───────────────────────
  { id: "m4-1", projectId: "project-4", title: "Kickoff y wireframes", summary: "Estructura del sitio definida. Wireframes aprobados sin cambios mayores.", date: "2026-02-25", status: "done" },
  { id: "m4-2", projectId: "project-4", title: "Diseño y maquetación completa", summary: "100% de vistas diseñadas. Galería de proyectos lista con lazy loading.", date: "2026-03-18", status: "done", unlocksPaymentId: "pay-4-2" },
  { id: "m4-3", projectId: "project-4", title: "Desarrollo completado", summary: "CMS configurado, formulario de propuestas funcional y SEO básico.", date: "2026-04-08", status: "done", unlocksPaymentId: "pay-4-3" },
  { id: "m4-4", projectId: "project-4", title: "QA y ajustes finales", summary: "Revisión en dispositivos móviles y correcciones de accesibilidad.", date: "2026-04-22", status: "current" },
  { id: "m4-5", projectId: "project-4", title: "Entrega y lanzamiento", summary: "Despliegue a producción con traspaso de credenciales.", date: "2026-04-28", status: "next" },

  // ── project-6: Bloom Studio Branding Web (build 54%) ─────────────────────
  { id: "m6-1", projectId: "project-6", title: "Brief de marca aprobado", summary: "Identidad visual, paleta y lineamientos de tono confirmados.", date: "2026-03-10", status: "done" },
  { id: "m6-2", projectId: "project-6", title: "Diseño de portafolio interactivo", summary: "Vista principal con galería de proyectos animada. Aprobada.", date: "2026-04-01", status: "done", unlocksPaymentId: "pay-6-2" },
  { id: "m6-3", projectId: "project-6", title: "Sección de blog y contacto", summary: "Blog editorial funcional y formulario de contacto para proyectos.", date: "2026-04-22", status: "current", unlocksPaymentId: "pay-6-3" },
  { id: "m6-4", projectId: "project-6", title: "Revisión final y publicación", summary: "Revisión SEO, velocidad de carga y go-live.", date: "2026-05-22", status: "next" },

  // ── project-7: Alcántara Logística Dashboard (design 29%) ─────────────────
  { id: "m7-1", projectId: "project-7", title: "Levantamiento de procesos", summary: "Mapa de flujos logísticos documentado y validado por el cliente.", date: "2026-03-18", status: "done" },
  { id: "m7-2", projectId: "project-7", title: "Arquitectura de datos aprobada", summary: "Modelo de entidades, integraciones con ERP y esquema de permisos.", date: "2026-04-04", status: "done", unlocksPaymentId: "pay-7-2" },
  { id: "m7-3", projectId: "project-7", title: "Diseño del panel principal", summary: "Dashboard de rutas activas, KPIs de entrega y mapa en tiempo real.", date: "2026-04-25", status: "current", unlocksPaymentId: "pay-7-3" },
  { id: "m7-4", projectId: "project-7", title: "Integración con ERP", summary: "Sincronización bidireccional con el sistema SAP del cliente.", date: "2026-05-20", status: "next" },
  { id: "m7-5", projectId: "project-7", title: "QA y entrenamiento del equipo", summary: "Capacitación de 12 operadores y pruebas de carga.", date: "2026-06-10", status: "next" },

  // ── project-10: Valeria Capital Analytics (build 44%) ─────────────────────
  { id: "m10-1", projectId: "project-10", title: "Definición de KPIs y fuentes", summary: "Inventario de métricas clave e identificación de fuentes de datos.", date: "2026-04-02", status: "done" },
  { id: "m10-2", projectId: "project-10", title: "Dashboard de captación", summary: "Visualizaciones de leads, conversión y canales en tiempo real.", date: "2026-04-28", status: "current", unlocksPaymentId: "pay-10-2" },
  { id: "m10-3", projectId: "project-10", title: "Módulo de cartera activa", summary: "Tabla dinámica de proyectos, pagos y estado por cliente.", date: "2026-05-26", status: "next", unlocksPaymentId: "pay-10-3" },
  { id: "m10-4", projectId: "project-10", title: "Reportes exportables y alertas", summary: "PDF automático mensual y sistema de alertas por umbral.", date: "2026-06-18", status: "next" },

  // ── project-12: Bloom Studio E-commerce (qa 78%) ──────────────────────────
  { id: "m12-1", projectId: "project-12", title: "Catálogo y CMS configurados", summary: "30 productos cargados, categorías definidas y fotos optimizadas.", date: "2026-03-20", status: "done" },
  { id: "m12-2", projectId: "project-12", title: "Checkout y pagos integrados", summary: "Stripe configurado. Pruebas con tarjeta completadas.", date: "2026-04-08", status: "done", unlocksPaymentId: "pay-12-2" },
  { id: "m12-3", projectId: "project-12", title: "QA de inventario y órdenes", summary: "Flujo de compra end-to-end verificado. Ajustes en notificaciones.", date: "2026-04-24", status: "current" },
  { id: "m12-4", projectId: "project-12", title: "Lanzamiento", summary: "Go-live con dominio propio y campaña de apertura.", date: "2026-05-08", status: "next" },

  // ── project-3: Ops Control Suite (done 100%) ──────────────────────────────
  { id: "m3-1", projectId: "project-3", title: "Arquitectura y base de datos", summary: "Esquema relacional completo con roles y permisos.", date: "2026-01-05", status: "done" },
  { id: "m3-2", projectId: "project-3", title: "Panel de seguimiento", summary: "Vista principal de oportunidades comerciales con filtros.", date: "2026-01-26", status: "done" },
  { id: "m3-3", projectId: "project-3", title: "Módulo de reportes", summary: "Exportación PDF y Excel con rangos de fecha configurables.", date: "2026-02-16", status: "done" },
  { id: "m3-4", projectId: "project-3", title: "Entrega y capacitación", summary: "Sesión de 2h con el equipo comercial. Documentación entregada.", date: "2026-03-10", status: "done" },

  // ── project-9: TecHub MX API Platform (done 100%) ─────────────────────────
  { id: "m9-1", projectId: "project-9", title: "Especificación de endpoints", summary: "OpenAPI 3.0 con 24 endpoints documentados.", date: "2025-12-05", status: "done" },
  { id: "m9-2", projectId: "project-9", title: "Implementación y autenticación", summary: "OAuth2 + JWT. Rate limiting por plan implementado.", date: "2025-12-22", status: "done" },
  { id: "m9-3", projectId: "project-9", title: "Panel de monitoreo", summary: "Dashboard de uso por API key, errores y latencia.", date: "2026-01-20", status: "done" },
  { id: "m9-4", projectId: "project-9", title: "Entrega final", summary: "Documentación publicada en Swagger UI. Traspaso completado.", date: "2026-02-28", status: "done" },

  // ── Discovery projects: milestones iniciales ───────────────────────────────
  { id: "m4b-1", projectId: "project-4b", title: "Diagnóstico de procesos actuales", summary: "Mapeo de flujos CRM, herramientas existentes y puntos de automatización.", date: "2026-04-15", status: "current" },
  { id: "m4b-2", projectId: "project-4b", title: "Prototipo de automatizaciones", summary: "Primeras reglas automáticas para seguimiento de oportunidades.", date: "2026-05-10", status: "next", unlocksPaymentId: "pay-4b-2" },

  { id: "m8-1", projectId: "project-8", title: "Levantamiento de requerimientos", summary: "Sesión de discovery con el equipo jurídico. Flujos documentados.", date: "2026-04-20", status: "current" },
  { id: "m8-2", projectId: "project-8", title: "Arquitectura del CRM", summary: "Modelo de datos para expedientes, clientes y actividades.", date: "2026-05-15", status: "next" },

  { id: "m11-1", projectId: "project-11", title: "Investigación UX móvil", summary: "Benchmarking de apps de nutrición y entrevistas con usuarios.", date: "2026-04-28", status: "current" },
  { id: "m11-2", projectId: "project-11", title: "Wireframes aprobados", summary: "Flujo principal de la app definido y validado.", date: "2026-05-26", status: "next" }
];

export const mockDocuments: ProjectDocumentRecord[] = [
  // project-1
  { id: "doc-1-1", projectId: "project-1", title: "Alcance aprobado", kind: "PDF", updatedAt: "2026-02-03", href: "#scope-1", audience: "shared" },
  { id: "doc-1-2", projectId: "project-1", title: "Mapa de pantallas (Figma)", kind: "Figma", updatedAt: "2026-02-20", href: "#figma-1", audience: "client" },
  { id: "doc-1-3", projectId: "project-1", title: "Guía de marca entregada", kind: "PDF", updatedAt: "2026-03-04", href: "#brand-1", audience: "shared" },
  // project-2
  { id: "doc-2-1", projectId: "project-2", title: "Catálogo priorizado", kind: "Sheet", updatedAt: "2026-02-14", href: "#cat-2", audience: "shared" },
  { id: "doc-2-2", projectId: "project-2", title: "Flujo de checkout aprobado", kind: "Figma", updatedAt: "2026-03-07", href: "#checkout-2", audience: "client" },
  // project-3 (completado)
  { id: "doc-3-1", projectId: "project-3", title: "Manual de usuario v1.0", kind: "PDF", updatedAt: "2026-03-08", href: "#manual-3", audience: "client" },
  { id: "doc-3-2", projectId: "project-3", title: "Código fuente entregado", kind: "Zip", updatedAt: "2026-03-10", href: "#code-3", audience: "client" },
  { id: "doc-3-3", projectId: "project-3", title: "Acta de entrega firmada", kind: "PDF", updatedAt: "2026-03-14", href: "#acta-3", audience: "shared" },
  // project-4
  { id: "doc-4-1", projectId: "project-4", title: "Brief de contenidos", kind: "Documento", updatedAt: "2026-02-25", href: "#brief-4", audience: "shared" },
  { id: "doc-4-2", projectId: "project-4", title: "Prototipo Figma aprobado", kind: "Figma", updatedAt: "2026-03-18", href: "#figma-4", audience: "client" },
  // project-6
  { id: "doc-6-1", projectId: "project-6", title: "Manual de identidad visual", kind: "PDF", updatedAt: "2026-03-12", href: "#brand-6", audience: "client" },
  { id: "doc-6-2", projectId: "project-6", title: "Diseño web aprobado", kind: "Figma", updatedAt: "2026-04-01", href: "#figma-6", audience: "client" },
  // project-7
  { id: "doc-7-1", projectId: "project-7", title: "Mapa de procesos logísticos", kind: "PDF", updatedAt: "2026-03-18", href: "#proc-7", audience: "shared" },
  { id: "doc-7-2", projectId: "project-7", title: "Esquema de base de datos", kind: "Documento", updatedAt: "2026-04-04", href: "#db-7", audience: "pm" },
  // project-9 (completado)
  { id: "doc-9-1", projectId: "project-9", title: "Documentación API (Swagger)", kind: "URL", updatedAt: "2026-02-20", href: "#swagger-9", audience: "client" },
  { id: "doc-9-2", projectId: "project-9", title: "Acta de entrega", kind: "PDF", updatedAt: "2026-02-28", href: "#acta-9", audience: "shared" },
  // project-10
  { id: "doc-10-1", projectId: "project-10", title: "Inventario de KPIs", kind: "Sheet", updatedAt: "2026-04-02", href: "#kpi-10", audience: "shared" },
  // project-12
  { id: "doc-12-1", projectId: "project-12", title: "Catálogo de productos cargado", kind: "Sheet", updatedAt: "2026-03-22", href: "#cat-12", audience: "shared" },
  { id: "doc-12-2", projectId: "project-12", title: "Flujo de compra aprobado", kind: "Figma", updatedAt: "2026-04-08", href: "#flow-12", audience: "client" }
];

export const mockPayments: PaymentRecord[] = [
  // project-1
  { id: "pay-1-1", projectId: "project-1", label: "Anticipo inicial (40%)", amount: 22000, dueDate: "2026-01-22", provider: "Mercado Pago", status: "paid" },
  { id: "pay-1-2", projectId: "project-1", label: "Avance — diseño aprobado", amount: 16000, dueDate: "2026-02-28", provider: "Mercado Pago", status: "paid", milestoneId: "m1-2" },
  { id: "pay-1-3", projectId: "project-1", label: "Avance — desarrollo", amount: 14000, dueDate: "2026-04-20", provider: "Mercado Pago", status: "pending", milestoneId: "m1-3" },
  { id: "pay-1-4", projectId: "project-1", label: "Entrega final", amount: 18000, dueDate: "2026-05-16", provider: "Mercado Pago", status: "scheduled", milestoneId: "m1-4" },
  // project-2
  { id: "pay-2-1", projectId: "project-2", label: "Anticipo (35%)", amount: 38000, dueDate: "2026-02-05", provider: "Mercado Pago", status: "paid" },
  { id: "pay-2-2", projectId: "project-2", label: "Hito checkout completado", amount: 32000, dueDate: "2026-03-14", provider: "Mercado Pago", status: "paid", milestoneId: "m2-2" },
  { id: "pay-2-3", projectId: "project-2", label: "Integración catálogo", amount: 28000, dueDate: "2026-04-25", provider: "Mercado Pago", status: "scheduled", milestoneId: "m2-3" },
  { id: "pay-2-4", projectId: "project-2", label: "Lanzamiento", amount: 36000, dueDate: "2026-06-06", provider: "Mercado Pago", status: "scheduled", milestoneId: "m2-4" },
  // project-3 (completado)
  { id: "pay-3-1", projectId: "project-3", label: "Anticipo", amount: 44000, dueDate: "2025-12-17", provider: "Mercado Pago", status: "paid" },
  { id: "pay-3-2", projectId: "project-3", label: "Segundo avance", amount: 38000, dueDate: "2026-02-04", provider: "Mercado Pago", status: "paid" },
  { id: "pay-3-3", projectId: "project-3", label: "Entrega final", amount: 44000, dueDate: "2026-03-12", provider: "Mercado Pago", status: "paid" },
  // project-4
  { id: "pay-4-1", projectId: "project-4", label: "Anticipo (40%)", amount: 22000, dueDate: "2026-02-24", provider: "Mercado Pago", status: "paid" },
  { id: "pay-4-2", projectId: "project-4", label: "Hito diseño", amount: 18000, dueDate: "2026-03-22", provider: "Mercado Pago", status: "paid", milestoneId: "m4-2" },
  { id: "pay-4-3", projectId: "project-4", label: "Entrega final", amount: 20000, dueDate: "2026-04-28", provider: "Mercado Pago", status: "pending", milestoneId: "m4-3" },
  // project-6
  { id: "pay-6-1", projectId: "project-6", label: "Anticipo", amount: 14000, dueDate: "2026-03-05", provider: "Mercado Pago", status: "paid" },
  { id: "pay-6-2", projectId: "project-6", label: "Diseño portafolio", amount: 12000, dueDate: "2026-04-06", provider: "Mercado Pago", status: "paid", milestoneId: "m6-2" },
  { id: "pay-6-3", projectId: "project-6", label: "Desarrollo blog y contacto", amount: 10000, dueDate: "2026-04-28", provider: "Mercado Pago", status: "pending", milestoneId: "m6-3" },
  // project-7
  { id: "pay-7-1", projectId: "project-7", label: "Anticipo (30%)", amount: 34000, dueDate: "2026-03-10", provider: "Mercado Pago", status: "paid" },
  { id: "pay-7-2", projectId: "project-7", label: "Arquitectura aprobada", amount: 28000, dueDate: "2026-04-08", provider: "Mercado Pago", status: "paid", milestoneId: "m7-2" },
  { id: "pay-7-3", projectId: "project-7", label: "Panel principal entregado", amount: 30000, dueDate: "2026-05-02", provider: "Mercado Pago", status: "scheduled", milestoneId: "m7-3" },
  // project-9 (completado)
  { id: "pay-9-1", projectId: "project-9", label: "Anticipo", amount: 28000, dueDate: "2025-11-28", provider: "Mercado Pago", status: "paid" },
  { id: "pay-9-2", projectId: "project-9", label: "Implementación completada", amount: 24000, dueDate: "2026-01-24", provider: "Mercado Pago", status: "paid" },
  { id: "pay-9-3", projectId: "project-9", label: "Entrega final", amount: 24000, dueDate: "2026-02-28", provider: "Mercado Pago", status: "paid" },
  // project-10
  { id: "pay-10-1", projectId: "project-10", label: "Anticipo", amount: 16000, dueDate: "2026-03-27", provider: "Mercado Pago", status: "paid" },
  { id: "pay-10-2", projectId: "project-10", label: "Dashboard captación", amount: 14000, dueDate: "2026-05-02", provider: "Mercado Pago", status: "scheduled", milestoneId: "m10-2" },
  { id: "pay-10-3", projectId: "project-10", label: "Módulo cartera", amount: 14000, dueDate: "2026-05-30", provider: "Mercado Pago", status: "scheduled", milestoneId: "m10-3" },
  // project-12
  { id: "pay-12-1", projectId: "project-12", label: "Anticipo", amount: 18000, dueDate: "2026-03-08", provider: "Mercado Pago", status: "paid" },
  { id: "pay-12-2", projectId: "project-12", label: "Checkout integrado", amount: 16000, dueDate: "2026-04-12", provider: "Mercado Pago", status: "paid", milestoneId: "m12-2" },
  { id: "pay-12-3", projectId: "project-12", label: "Lanzamiento", amount: 18000, dueDate: "2026-05-10", provider: "Mercado Pago", status: "scheduled" }
];
