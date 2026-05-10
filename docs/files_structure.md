En este archivo se definen a detalle lo que contienen los archivos dentro
de las carpetas. A su vez, se determinan aspectos a mejorar.

Última revisión: tras el refactor estructural y rediseño de los 3 dashboards
(PRs #1 y #2 en main).

## Qué ya está bien

### 1. Separación general del proyecto
La base ya está sólida. El proyecto separa:

- `src/app` para rutas y endpoints de Next.js
- `src/components` para componentes transversales (ui shadcn, layout, common)
- `src/features` para módulos de negocio y UI por dominio
- `src/lib` para utilidades, datos mock, tipos y clientes (api, db, utils, types)
- `src/config` para variables de entorno tipadas
- `src/server` para correo, repositorios y servicios
- `src/hooks` para hooks globales
- `prisma` para la capa de datos

Eso significa que la app ya está organizada como producto, no como landing
improvisada.

### 2. Base de datos con visión de plataforma
`prisma/schema.prisma` no modela solo leads o cotizaciones. Ya contempla:

- usuarios
- sesiones
- recuperación de contraseña
- leads
- cotizaciones y partidas
- proyectos
- hitos
- mensajes
- documentos
- pagos
- solicitudes de cambio

Técnicamente eso está bien pensado porque cubre el ciclo completo:
captación, venta, ejecución y seguimiento.

### 3. Módulo de marketing bastante ordenado
`src/features/marketing` está bien encapsulado. Tiene:

- componentes visuales
- data estática por página
- lib (metadata, plan-catalog, plan-profile-store)
- tipos propios

Eso hace que la parte pública sea mantenible y fácil de escalar.

### 4. Dashboard modular por rol
El dashboard ya no son 17 archivos planos sino subcarpetas por rol:

- `client/` (overview, milestones, documents)
- `pm/` (overview, status)
- `admin/` (overview, quote, team, plan, payments, deliverables)
- `shared/` (payments, project-chat, profile)
- `shell/` (dashboard-shell, sidebar-actions, command-palette)
- `primitives/` (DashboardCard, SectionHeading, StatusBadge, ProgressBar,
  ChromeProvider)

La resolución de vista se hace con `routes.ts` y `view.tsx`, lo cual es
correcto porque evita meter condicionales gigantes en las páginas.

### 5. Sistema de correos relativamente limpio
La parte de email es de lo más sano del proyecto:

- `config.ts` resuelve remitentes y bandejas
- `send-email.ts` encapsula Resend
- `templates/` separa plantillas por contexto
- `index.ts` centraliza funciones públicas
- `types.ts` (movido desde `lib/email-payloads.ts`) define payloads

Eso ya parece backend serio.

### 6. UI accesible y consistente
`src/components/ui/` ahora tiene 25 primitivas de shadcn/ui (Radix por
debajo) con variantes y accesibilidad cubierta. `Form` integra
react-hook-form + zod. `Sonner` para toasts. `Command` para el palette
⌘K.

### 7. Tematización por rol con CSS vars
`globals.css` define `--role`, `--role-soft`, `--role-strong` por
`data-role`. El shell envuelve el dashboard en `<div className="role-themed"
data-role={role}>` y todos los descendientes pueden usar las vars sin
saber el rol explícitamente. Reemplaza el `getRoleCardTone()` con hex
hardcoded que existía antes.

---

## Qué está frágil

### 1. Auth real y mock al mismo tiempo
Aquí sigue una de las fracturas más claras.

Por un lado:
- `src/app/api/auth/login/route.ts`
- `src/app/api/auth/register/route.ts`

ya usan Prisma y la base real.

Pero por otro:
- `src/features/auth/lib/auth-service.ts`
- `src/features/auth/lib/session-store.ts`
- `src/lib/mocks/auth.ts`

siguen sosteniendo lógica tipo demo.

Eso provoca dos fuentes de verdad. En proyectos pequeños parece tolerable,
pero cuando empieces a conectar dashboard, usuarios y permisos reales,
te va a pegar.

### 2. Cotizador con cálculo útil, pero todavía acoplado a mocks
La UI del cotizador está bien armada:

- `quote-builder.tsx`
- `quote-estimator.tsx`
- `quote-summary-card.tsx`

Pero el motor usa catálogos mock en `src/lib/mocks/catalogs.ts`. Hoy el
cálculo vive más como comportamiento de interfaz que como motor de
dominio.

### 3. Dashboard visualmente avanzado, pero con estado híbrido
`workspace-store.tsx` mezcla:

- datos levantados desde `/api/users`, `/api/quotes`, `/api/chat`
- estado guardado en `sessionStorage`
- transformaciones locales
- acciones que fabrican proyectos, mensajes, milestones y cambios en cliente

Eso significa que el dashboard no es todavía una capa real contra base
de datos. Es una simulación avanzada con partes conectadas.

### 4. Endpoints con lógica metida directamente en la ruta
Varios endpoints usan Prisma directo dentro del route handler:

- `/api/auth/login`
- `/api/auth/register`
- `/api/quotes`
- `/api/users`

Eso funciona, pero rompe el patrón que ya empezaste a construir con
`src/server/repositories` y `src/server/services`.

---

## Qué está mal o peligrosamente incompleto

### 1. Contraseñas sin hash real
En login y register, el campo se llama `passwordHash`, pero realmente
guarda y compara texto plano.

Eso no es un detalle. Eso está mal.

Si mañana esto sale de entorno controlado, ya tienes una falla básica
de seguridad.

### 2. Inconsistencia entre frontend y modelo Prisma
El modelo Prisma define enums cerrados para:

- `ProjectType`
- `PlanCategory`
- `PlanTier`
- `BillingModel`
- `QuotePriority`
- `QuoteStatus`

Pero el frontend del cotizador maneja claves y labels propias en
`src/lib/types/domain.ts` y `src/lib/mocks/catalogs.ts`.

Eso genera el riesgo de que la UI construya valores que la base no
entiende, o que la base espere estados que la UI nunca manda.

### 3. `/api/quotes` está demasiado crudo
`src/app/api/quotes/route.ts` crea una cotización con validación mínima.

Problemas:

- crea `new PrismaClient()` local (debería usar `@/lib/db`)
- no usa servicio ni repositorio
- no valida enums ni shape con esquema formal (zod ya está disponible
  pero no se usa aquí)
- depende de que el frontend mande datos perfectamente compatibles

### 4. La capa `server` existe, pero no gobierna todo
La intención está clara pero no completada. La lógica backend todavía
está partida entre:

- route handlers
- utilidades de `lib`
- servicios en `server`
- estado local en `features`

---

## Qué conviene arreglar primero

### Prioridad 1, cerrar auth
Haz esto primero:

- hashear contraseñas con `bcrypt` o `argon2`
- dejar de comparar texto plano
- centralizar login y register en `server/services/auth/`
- decidir si el estado de sesión va a ser real o mock, pero no ambos

### Prioridad 2, unificar el dominio de cotización
Necesitas una sola definición para:

- tipo de proyecto
- perfil de plan
- categoría de plan
- tier
- billing model
- prioridad
- estados de quote

Ahora mismo esos conceptos viven repartidos entre:
- Prisma
- `lib/types/domain.ts`
- `lib/mocks/catalogs.ts`
- UI del quote builder

### Prioridad 3, sacar lógica de negocio de las API routes
Las rutas deberían hacer solo esto:

- recibir request
- validar (con zod ya disponible)
- delegar a servicio
- responder

### Prioridad 4, reducir el peso de los mocks
Los mocks hoy no son solo apoyo visual. También determinan
comportamiento. Eso está bien para arrancar, pero no para seguir
creciendo.

### Prioridad 5, convertir dashboard en consumidor real de datos
No necesitas migrar todo de golpe. Empieza por:

- usuarios
- cotizaciones
- proyectos

Después:

- hitos
- documentos
- pagos
- mensajes
- cambios

---

# Estructura detallada del proyecto

## Relación general entre carpetas

La relación real del sistema es esta:

- `prisma/` define el contrato de datos
- `src/app/api/` expone endpoints HTTP
- `src/server/` contiene la lógica backend reutilizable (parcialmente)
- `src/features/` contiene módulos visuales y parte de la lógica de dominio
- `src/components/` contiene primitivas reutilizables (shadcn/ui), layout
  y componentes comunes
- `src/lib/` contiene utilidades, tipos, mocks, cliente API y cliente DB
- `src/config/` contiene env tipado
- `src/hooks/` contiene hooks globales
- `public/` guarda assets consumidos por componentes visuales
- `scripts/` automatiza tareas locales de build y arranque

---

## `prisma/`

### `prisma/schema.prisma`
Define toda la estructura de base de datos con Prisma y PostgreSQL.

Qué hace:
- configura el generador Prisma Client
- apunta a `DATABASE_URL`
- modela usuarios, auth, leads, quotes, projects, payments, docs, chat y cambios
- define enums de negocio

Cómo se relaciona:
- lo consumen los endpoints que usan `@prisma/client`
- lo debería consumir cualquier servicio backend serio vía `src/lib/db`
- condiciona qué valores son válidos al guardar cotizaciones, usuarios y proyectos

---

## `public/`

Esta carpeta no tiene lógica. Son recursos estáticos servidos tal cual
por Next.js. Los consumen `next/image`, íconos SVG y branding de
marketing.

### `public/fonts/poppins/`
Fuentes locales Poppins usadas por la app mediante `next/font/local`.
Pesos 300, 400, 500, 600, 700, 800.

Cómo se relaciona:
- `src/app/layout.tsx` registra la familia tipográfica global
- `globals.css` y componentes heredan esa fuente
- intacto tras el refactor (la tipografía no se tocó)

### `public/icons/`

#### `public/icons/whatsapp.svg`
Ícono de WhatsApp del botón flotante.

#### `public/icons/contact/`
- `location.svg`, `mail.svg`, `phone.svg`
- los usa `src/components/common/icons.tsx`
- aparecen en `contact-form.tsx` y secciones de contacto

#### `public/icons/services/`
- `code.svg`, `consulting.svg`, `idea.svg`, `spark.svg`, `support.svg`,
  `team.svg`
- `src/components/common/icons.tsx` los convierte en componentes
- `src/features/marketing/components/services.tsx` los renderiza

#### `public/icons/social/`
- `facebook.svg`, `instagram.svg`, `linkedin.svg`, `tiktok.svg`, `x.svg`
- `Footer` y `Header` usan `SocialIcon`
- la info viene de `src/features/marketing/data/site.ts`

### `public/images/`

#### `public/images/brand/`
Branding, logos, clientes y marcas tecnológicas. Los consume
`BrandLogo` y la sección de logos.

#### `public/images/marketing/`
Imágenes de páginas públicas (about, contact, hero, FAQ, gallery,
timeline).

#### `public/images/portfolio/`
Assets para portafolio (`portfolio-showcase.tsx`).

---

## `scripts/`

Scripts Node/TypeScript para automatizar tareas locales.

- `build-next.ts` — wrapper de build
- `clear-build-cache.ts` — limpia caché antes de build
- `free-port-3000.ts` — libera el puerto 3000 (Windows-friendly)
- `start-next.ts` — wrapper de arranque

---

## `src/`

---

## `src/app/`

Es la capa de enrutamiento de Next.js App Router.

### `src/app/globals.css`
Hoja de estilos global con Tailwind v4.

Qué hace:
- `@theme` con paleta de marca, tokens de estado (success/warning/error/
  info), acentos por rol (role-client/pm/admin), radii y sombras
- `@theme inline` con tokens shadcn (background, foreground, card,
  popover, primary-foreground, secondary, muted, accent, destructive,
  border, input, ring) mapeados a la paleta
- Clases utilitarias: `.role-themed[data-role="…"]`, `.warm-card`,
  `.ops-card`, `.kpi-card`, `.btn-role`, `.btn-role-outline`,
  `.badge-status-*`, `.cmd-trigger`, `.cmd-kbd`, `.kpi-value`,
  `.kpi-label`, `.kpi-delta-*`
- Conserva todas las clases legacy (.dashboard-card, .primary-button,
  .accent-button, .secondary-button, .type-*, .portfolio-*) intactas
- `--color-foreground` legacy renombrado a `--color-surface-soft`

### `src/app/layout.tsx`
Layout raíz de toda la aplicación.

Qué hace:
- registra metadata global
- carga tipografía local Poppins
- monta `TooltipProvider` (shadcn) y `Toaster` (sonner) globales
- envuelve toda la app

---

### `src/app/(auth)/`

Grupo de rutas para autenticación.

#### `(auth)/layout.tsx`
Layout exclusivo de auth.

#### `(auth)/forgot-password/page.tsx`
Página para recuperar contraseña. Monta `MarketingShell` + `AuthPanel`.

#### `(auth)/login/page.tsx`
Página de login. Usa `bg-surface-soft` (renombrado).

#### `(auth)/register/page.tsx`
Página de registro.

---

### `src/app/(marketing)/`

Grupo de rutas públicas.

#### `(marketing)/layout.tsx`
Layout público con `MarketingShell`.

#### `(marketing)/page.tsx`
Home pública. Hero, servicios, logos, beneficios y strip de contacto.

#### `(marketing)/about/page.tsx`
About: historia, misión, visión, timeline.

#### `(marketing)/contact/page.tsx`
Contact: formulario y datos de contacto.

#### `(marketing)/legals/privacy/page.tsx`
Reexport de privacidad legal.

#### `(marketing)/plans/page.tsx`
Planes: hero, pricing, servicios por plan, CTA.

#### `(marketing)/portfolio/page.tsx`
Portafolio: tarjetas de trabajo.

#### `(marketing)/privacy/page.tsx`
Página de privacidad.

#### `(marketing)/quote/page.tsx`
Cotizador público: hero + builder.

---

### `src/app/api/`

Endpoints HTTP.

#### `api/auth/login/route.ts`
Endpoint de login.

Qué hace:
- recibe email y password
- busca usuario en Prisma
- devuelve `userId`, `role`, `name`, `email`

Problemas (sin resolver):
- compara contraseña en texto plano
- instancia `PrismaClient` directo

#### `api/auth/register/route.ts`
Endpoint de registro.

Qué hace:
- valida datos mínimos
- crea usuario en Prisma con rol cliente

Problemas (sin resolver):
- guarda password sin hash real
- crea `PrismaClient` local

#### `api/chat/route.ts`
Endpoint del chatbot público. Llama a Groq con `chatbotContext`.

#### `api/dashboard/notify/route.ts`
Endpoint de notificaciones del dashboard.

Qué hace:
- recibe payload tipado de `@/server/email/types` (vía
  `@/lib/types/api`)
- delega en `@/server/email`
- dispara correos según evento

#### `api/forms/route.ts`
Endpoint para leads públicos. Recibe formularios públicos y delega en
`@/server/email`.

#### `api/health/route.ts`
Healthcheck. Usa `@/config/env` (antes `@/lib/env`).

#### `api/plans/route.ts`
CRUD del catálogo de planes. Lo consume `AdminPlanPanel`.

#### `api/quotes/route.ts`
Endpoint para crear cotizaciones.

Qué hace:
- recibe body con datos de quote
- crea registro `Quote` en Prisma

Problemas (sin resolver):
- validación mínima
- cliente Prisma local
- no usa `@/lib/db`
- no crea items
- no alinea todavía bien UI y enums de base

#### `api/users/route.ts`
Endpoint para listar usuarios. Lo usa `workspace-store.tsx` para
hidratar el dashboard.

---

### `src/app/dashboard/`

Rutas del panel interno.

#### `dashboard/layout.tsx`
Layout del dashboard. Envuelve la zona privada y monta el provider
del workspace.

#### `dashboard/[role]/[[...section]]/page.tsx`
Página dinámica principal del dashboard.

Qué hace:
- resuelve rol con `resolveRole`
- valida sección con `isValidDashboardSection`
- renderiza el panel correcto vía `renderDashboardSection`

---

## `src/components/`

Componentes transversales, no de un dominio específico.

### `src/components/layout/`

#### `footer.tsx`
Footer global. Consume `site.ts` y muestra navegación secundaria,
contacto y redes.

#### `header.tsx`
Header global público. Navegación principal, menú móvil y overlay de
acceso con `AuthPanel`.

### `src/components/ui/` (shadcn/ui)

25 primitivas Radix-based estilizadas con Tailwind. Todas usan `cn`
desde `@/lib/utils` (clsx + tailwind-merge).

- `alert.tsx` — banners contextuales
- `avatar.tsx` — avatar con fallback (usado en sidebar, dropdowns,
  mensajes)
- `badge.tsx` — badges con variantes
- `button.tsx` — botón con variantes (default, outline, ghost,
  destructive, link, secondary) y tamaños (xs/sm/default/lg/icon)
- `card.tsx` — wrapper Card + Header/Title/Description/Content/Footer
- `checkbox.tsx`
- `command.tsx` — palette cmdk
- `dialog.tsx` — modal con overlay
- `dropdown-menu.tsx` — menú con items, separadores, labels, sub-menús
- `form.tsx` — integración con react-hook-form (FormField, FormItem,
  FormLabel, FormControl, FormMessage)
- `input.tsx`
- `label.tsx`
- `popover.tsx`
- `progress.tsx`
- `scroll-area.tsx` — scroll customizable usado en sidebar y main del
  shell, y en chat
- `select.tsx`
- `separator.tsx`
- `sheet.tsx` — drawer lateral usado para mobile sidebar y para
  Sheet de edición (PM milestones, admin plan, admin quote)
- `skeleton.tsx`
- `sonner.tsx` — toaster (montado en root layout)
- `switch.tsx`
- `table.tsx` — Table + Header/Body/Row/Cell/Head usado en admin
- `tabs.tsx` — TabsList + TabsTrigger + TabsContent (variantes default
  y line)
- `textarea.tsx`
- `tooltip.tsx`

### `src/components/common/`

#### `form-field.tsx`
Wrapper de shadcn `Input`/`Textarea`/`Label` que preserva la API
`TextField`/`TextAreaField` legacy. Permite migrar consumidores
gradualmente.

#### `icons.tsx`
Capa de abstracción para íconos. Mezcla SVG propios, logos y algunos
de `lucide-react` (Close, Check, Wrench, ArrowRight). Expone iconos de
menú, cierre, marca, contacto, servicio y social.

---

## `src/features/`

Módulos por dominio.

---

### `src/features/auth/`

#### `components/auth-fields.tsx`
Wrapper legacy `AuthField` que delega en `TextField`. Mantiene
`AuthMessage` (banner inline para errores no de validación).

#### `components/auth-panel.tsx`
Panel unificado de autenticación que cambia entre login, register y
recuperación. Lo usa el overlay del `Header`.

#### `components/forgot-password-form.tsx`
Formulario de recuperación con react-hook-form + zod. Valida email y
muestra mensaje de resultado.

#### `components/login-form.tsx`
Formulario de login con react-hook-form + zod. Captura credenciales,
navega según rol y escribe sesión local.

#### `components/register-form.tsx`
Formulario de registro con react-hook-form + zod. Valida confirmación
de contraseña y longitudes mínimas.

#### `components/session-status.tsx`
Pequeño estado visual de sesión que lee la sesión guardada.

#### `lib/auth-pages.ts`
Centraliza textos, hero o contenido relacionado a auth.

#### `lib/auth-service.ts`
Servicio de auth del lado cliente, todavía híbrido. Resuelve ruta de
dashboard por rol.

#### `lib/session-store.ts`
Persistencia local de sesión mock en `localStorage`.

---

### `src/features/dashboard/`

#### `components/shell/dashboard-shell.tsx`
Marco del dashboard reescrito.

Qué hace:
- envuelve todo en `<div className="role-themed" data-role={role}>`
- sidebar desktop + Sheet mobile (shadcn)
- topbar con stub de búsqueda ⌘K, notificaciones (Popover) y user menu
  (DropdownMenu)
- monta `CommandPalette`
- ScrollArea principal

#### `components/shell/sidebar-actions.tsx`
Acciones laterales (volver al inicio, cerrar sesión).

#### `components/shell/command-palette.tsx`
Command palette ⌘K basado en cmdk + Dialog. Lista navegación por rol y
acciones globales.

#### `components/primitives/index.tsx`
Barrel + DataRow + MetricPill + DashboardEmptyState. Reexporta el resto
de primitives.

#### `components/primitives/dashboard-card.tsx`
DashboardCard y DashboardMutedCard. Usan `var(--role-soft)` para el
gradient muted.

#### `components/primitives/section-heading.tsx`
SectionHeading con eyebrow/title/description/action. Sin tematización
hardcoded — usa color slate y deja que el contexto resuelva el rol.

#### `components/primitives/status-badge.tsx`
StatusBadge con tonos neutral/accent/success/warning/danger/info.
Mapea a clases Tailwind con tokens de estado.

#### `components/primitives/progress-bar.tsx`
ProgressBar con gradiente que usa `var(--role-strong)` y
`var(--color-secondary-500)`.

#### `components/primitives/chrome-context.tsx`
React Context con `role` y `activeKey`. `DashboardChromeProvider` lo
inyecta y `useDashboardChrome` lo lee.

---

#### `components/client/overview-panel.tsx`
Panel principal del cliente. Hero "warm" con gradiente role-client +
anillo SVG de progreso + microcopy + CTAs. Grid con MilestoneTimeline
y WarmStatCards (próxima entrega, próximo pago, mensajes).

#### `components/client/milestones-panel.tsx`
Hero warm + tabs Todos/En curso/Próximos/Completados + lista detallada
de hitos con iconos por estado. Diálogo modal "Solicitar cambio" con
react-hook-form-style state, Select y Textarea de shadcn, sonner para
feedback.

#### `components/client/documents-panel.tsx`
Hero warm + filtros (Input búsqueda + Select tipo) + grid de cards de
documentos. Cuando role="pm" muestra Dialog "Registrar entregable".

---

#### `components/pm/overview-panel.tsx`
Panel principal del PM. 4 KPIs operativos + tabs Kanban/Lista/
Bloqueados. Kanban en 5 columnas (discovery/design/build/qa/done) con
cards densas y barra de avance teal.

#### `components/pm/status-panel.tsx`
Status board del PM. Lista de hitos con iconos, dropdown de acciones
(completar/editar) y Sheet lateral para crear/editar hitos. Lateral
con cambios del cliente.

---

#### `components/admin/overview-panel.tsx`
Panel principal del admin. Fila de 6 KPIs con sparklines SVG inline
(precotizaciones, aceptadas, conversión, usuarios, proyectos,
pagos pendientes). Tabs Recientes/Pipeline/Atención con Table de
shadcn. Panel lateral con capacidad del equipo, ingresos del mes,
activity feed.

#### `components/admin/quote-panel.tsx`
Header con búsqueda + filtro por estado. Tabla densa con dropdown por
fila (asignar PM, revisar, rechazar). Sheet lateral con detalle +
asignación de PM con stats de carga + acciones (aceptar y crear
proyecto, marcar revisada, rechazar).

#### `components/admin/team-panel.tsx`
Tabs PMs/Clientes con tablas. Cada fila muestra avatar, datos,
carga (PM) o empresa (cliente), estado y dropdown de acciones
(banear/reactivar). Dialog "Nuevo PM" con sonner.

#### `components/admin/plan-panel.tsx`
Tabs Personal/Empresarial. Grid de cards con switch de visibilidad
inline + Sheet lateral para edición detallada (setup, mensual,
descuento, activo). Botones Recargar/Publicar con sonner.

#### `components/admin/payments-panel.tsx`
4 KPIs (cobrado/pendiente/programado/vencido). Tabs por estado.
Tabla con dropdown para marcar cobrado y badge de vencimiento.

#### `components/admin/deliverables-panel.tsx`
Tabs Todos/Plantillas/Compartidos. Búsqueda + filtro por tipo. Grid
de cards con badges de plantilla y tipo, enlace abrir.

---

#### `components/shared/payments-panel.tsx`
Panel de pagos por hito visible para cliente y PM. Tematización por
rol (warm para cliente / neutro para PM via `useDashboardChrome`).
Totales pendiente/pagado, lista de hitos con badge según estado del
pago (bloqueado/en espera/realizado). Botón "Confirmar pago" solo
para cliente cuando el hito está completado.

Exporta también `resolvePaymentMilestoneState`, función pura que
calcula el estado del pago según el estado del hito.

#### `components/shared/project-chat-panel.tsx`
Chat moderno con avatares. Dos columnas: sidebar con switcher de
proyectos (avatares + badge unread) y conversación con burbujas tipo
chat con autoscroll al final. Atajo ⌘+↵ para enviar. Composer con
Textarea de shadcn. Sonner para errores.

#### `components/shared/profile-panel.tsx`
Hero warm con avatar grande + 2 cards: Datos de contacto y Relación
operativa (proyecto activo, contraparte, origen).

---

#### `lib/recipients.ts`
Resolvedor de correos por usuario, proyecto o quote. Ayuda a saber a
quién enviar notificaciones.

#### `lib/routes.ts`
Mapa y validación de roles y secciones. Valida rol, valida sección,
calcula sección por defecto.

#### `lib/selectors.ts`
Selectores de datos del dashboard. Filtra por rol, obtiene quote,
proyecto, usuario y colecciones visibles, calcula métricas derivadas.
Opera sobre el estado del `workspace-store`.

#### `lib/view.tsx`
Router de componentes del dashboard. Dado un rol y una sección, decide
qué panel renderizar. Importa desde las nuevas subcarpetas
(`./client/...`, `./pm/...`, `./admin/...`, `./shared/...`).

#### `lib/workspace-store.tsx`
Store principal del dashboard.

Qué hace:
- mantiene usuarios, quotes, projects, messages, milestones, payments,
  documents y changeRequests
- hidrata usuarios desde `/api/users`, quotes desde `/api/quotes` y
  mensajes desde `/api/chat`
- guarda estado en `sessionStorage`
- ejecuta acciones de negocio en cliente:
  - aceptar quote
  - crear proyecto
  - marcar hitos
  - agregar mensajes
  - agregar documentos
  - cambiar estados

Problema (sin resolver): es una simulación avanzada, no un backend
real.

#### `hooks/use-dashboard-theme.ts`
Hook que lee el chrome context y devuelve `{ role, activeKey, vars,
hex }`. `vars` son las CSS variables (`var(--role)`, etc.) y `hex` es
el equivalente literal por rol. Útil para gráficas o sparklines que
necesitan el color en JS.

---

### `src/features/marketing/`

#### `components/benefits.tsx`
Sección visual de beneficios.

#### `components/contact-form.tsx`
Formulario público reutilizable migrado a react-hook-form + zod.
Sirve tanto para contacto como para cotización. Arma payload con
hidden fields y envía a `/api/forms`. Es la puerta de entrada de
leads públicos.

#### `components/cta.tsx`
Bloque CTA.

#### `components/faq.tsx`
Preguntas frecuentes visuales.

#### `components/hero.tsx`
Hero reutilizable para páginas públicas.

#### `components/logos.tsx`
Muestra logos o social proof.

#### `components/marketing-shell.tsx`
Shell completo del sitio público (header + page-shell + footer +
WhatsApp button).

#### `components/page-shell.tsx`
Wrapper cliente para animaciones de aparición. Ejecuta `useReveal()`.

#### `components/portfolio-highlights.tsx`
Bloque corto de highlights de portafolio.

#### `components/portfolio-showcase.tsx`
Muestra tarjetas o piezas del portafolio.

#### `components/pricing.tsx`
Tarjetas de pricing. Permite iniciar el flujo hacia cotización con
contexto de plan. Usa `plan-profile-store.ts` y `quote-selection.ts`.

#### `components/privacy-copy.tsx`
Contenido textual de privacidad.

#### `components/services-pricing.tsx`
Tabla o tarjetas de servicios con acción hacia cotización o contacto.

#### `components/services.tsx`
Bloque de servicios. Renderiza servicios y permite seleccionar uno
para iniciar flujo.

#### `components/story.tsx`
Bloque de historia o relato de marca.

#### `components/timeline.tsx`
Timeline visual.

#### `components/whatsapp-button.tsx`
Botón flotante de WhatsApp o contacto rápido.

---

#### `data/about.ts`, `data/chatbot-context.ts`, `data/contact.ts`,
#### `data/home.ts`, `data/plans.ts`, `data/portfolio.ts`,
#### `data/privacy.ts`, `data/quote.ts`, `data/site.ts`
Contenido estático y config central del sitio (nav, footer, contacto,
redes, branding textual). `chatbot-context.ts` da contexto comercial
a Groq.

#### `lib/metadata.ts`
Factory de metadata para páginas.

#### `lib/plan-catalog.ts`
Catálogo gestionado de planes. Antes en `src/lib/`. Define
`ManagedPlanCatalog`, `ManagedPlanRecord`, `defaultManagedPlans`,
`fetchManagedPlanCatalog`, `saveManagedPlanCatalog`,
`cloneManagedPlanCatalog`. Lo consume `AdminPlanPanel`.

#### `lib/plan-profile-store.ts`
Persistencia del perfil de plan (personal/business). Antes era
`plan-profile.ts` en `src/lib/`. Lo usan pricing y quote-builder.

#### `types/index.ts`
Tipos de marketing. Centraliza iconos, variantes de header, links y
shapes de contenido.

---

### `src/features/messages/`

#### `components/message-list.tsx`
Lista visual de mensajes. Usa el store del dashboard y selectors.

---

### `src/features/projects/`

#### `components/project-list.tsx`
Lista visual de proyectos. Usa selectors del dashboard y presenta
proyectos filtrados por rol.

---

### `src/features/quotes/`

#### `components/quote-builder.tsx`
Orquestador del cotizador.

Qué hace:
- lee selección de plan o servicio desde URL/localStorage usando
  `quote-selection.ts`
- arma el draft de quote
- calcula estimado
- genera hidden fields
- monta `QuoteEstimator`, `QuoteSummaryCard`, `ContactForm`

Es el archivo más importante del flujo público de cotización.

#### `components/quote-estimator.tsx`
Formulario técnico del cotizador. Usa `estimate.ts`, `content.ts` y
mocks de catálogo.

#### `components/quote-list.tsx`
Lista visual de quotes, más ligada al dashboard.

#### `components/quote-summary-card.tsx`
Resumen lateral o final del draft. Consume `estimate.ts` y `content.ts`.

#### `lib/content.ts`
Capa de traducción del cotizador. Define secciones del quote, mapea
módulos y traduce infraestructura.

#### `lib/estimate.ts`
Motor actual del cotizador. Calcula rangos de build, mensual, tiempo;
da viabilidad básica; formatea moneda. Depende de `quoteProjectTypes`
y `quoteModules` en mocks. Lo usan builder, estimator, summary y
panels de dashboard.

#### `lib/quote-selection.ts`
Persistencia y parsing de selección inicial de quote. Antes en
`src/lib/`. Genera hrefs hacia `/quote` o `/contact`, guarda y
recupera la selección de plan o servicio, interpreta query params.

---

### `src/features/users/`

#### `components/user-list.tsx`
Lista visual de usuarios. Vista derivada del panel de equipo admin.

---

## `src/hooks/`

### `src/hooks/use-reveal.ts`
Hook de animaciones de aparición con GSAP. Lo ejecuta `PageShell` en
páginas públicas.

---

## `src/lib/`

Capa de utilidades, datos mock, tipos y clientes. Antes era cajón
desastre, ahora segmentada en subcarpetas.

### `src/lib/api/`

#### `client.ts`
Cliente HTTP del frontend. Encapsula POST a `/api/forms` y
`/api/dashboard/notify`. Antes era `src/lib/client-api.ts`. Importa
los tipos públicos desde `@/lib/types/api`.

#### `index.ts`
Barrel.

### `src/lib/db/`

#### `client.ts`
Singleton de Prisma Client. Antes era `src/lib/db.ts`. Crea un cliente
compartido y evita múltiples instancias en desarrollo. Debería ser la
única puerta a Prisma desde código backend.

#### `index.ts`
Barrel.

### `src/lib/types/`

#### `domain.ts`
Tipos del dominio frontend. Define roles, draft de quote, records de
proyecto, mensaje, pago, documento, usuario, cambio. Claves internas
de módulo y proyecto. Sigue habiendo el problema de que representa
una realidad frontend que no coincide del todo con Prisma.

#### `api.ts`
Re-export público de los payloads que viven en
`@/server/email/types`. Sirve para que el cliente no tenga que
importar de `@/server/`.

#### `index.ts`
Barrel.

### `src/lib/utils/`

#### `cn.ts`
Combina clases CSS con `clsx` + `tailwind-merge`. Reescrita en el
refactor (antes era un join trivial).

#### `presenters.ts`
Funciones de presentación de estados y fechas. Formatea fechas con
`Intl.DateTimeFormat` y traduce estados a labels legibles. Antes
`src/lib/presenters.ts`.

#### `index.ts`
Barrel que reexporta `cn`. Los `presenters` se importan por su path
específico para no inflar el barrel.

### `src/lib/mocks/`

Esta carpeta hoy sigue sosteniendo mucho comportamiento.

#### `auth.ts`
Cuentas mock para auth demo. Las cuentas reales de prueba (admin, PM,
cliente) viven en `scripts/reset-test-accounts.ts` con los correos
`gzcm.manuel+admin@gmail.com`, `gzcm.manuel+pm@gmail.com` y
`gzcm.manuel+cliente@gmail.com`.

#### `catalogs.ts`
Catálogos clave del sistema:
- tipos de proyecto
- módulos del cotizador
- opciones de infraestructura
- navegación del dashboard
- permisos por rol

Es uno de los archivos más influyentes del proyecto actual.

#### `change-requests.ts`
Solicitudes de cambio simuladas.

#### `messages.ts`
Mensajes simulados.

#### `project-meta.ts`
Metadatos de proyecto simulados (milestones, documents, payments).

#### `projects.ts`
Proyectos simulados.

#### `quotes.ts`
Cotizaciones simuladas.

#### `users.ts`
Usuarios simulados.

#### `index.ts`
Barrel file de mocks.

---

## `src/config/`

### `src/config/env.ts`
Reader tipado de variables de entorno. Antes era `src/lib/env.ts`. Da
defaults razonables y expone `requireServerEnv`. Lo usan `db/client.ts`,
healthcheck y `server/email/config.ts`.

---

## `src/server/`

Es la semilla de una capa backend ordenada.

### `src/server/email/`

#### `config.ts`
Configuración de correo. Resuelve remitente, inboxes de empresa, email
visible al público y valida variables mínimas.

#### `index.ts`
Barrel y capa pública del módulo de correo. Expone confirmaciones de
contacto, confirmaciones de quote, notificaciones internas y
notificaciones del dashboard.

#### `send-email.ts`
Adaptador de envío. Inicializa Resend, intenta enviar, aplica fallback
si falla el remitente principal.

#### `types.ts`
Contratos de payload de email y notificaciones internas. Antes era
`src/lib/email-payloads.ts`. Reexportado públicamente desde
`@/lib/types/api` para que el cliente no toque `@/server/`.

#### `templates/dashboard-events.ts`
Plantillas para eventos internos del dashboard (mensajes, cambios,
entregables, asignaciones, cuentas PM).

#### `templates/public-leads.ts`
Plantillas para formularios públicos (correo a empresa, correo de
confirmación al lead).

#### `templates/shared.ts`
Helpers HTML y text para correos. Escapa HTML, arma tablas key-value,
envuelve layout base de email.

---

### `src/server/repositories/`

#### `contact-repository.ts`
Repositorio de leads de contacto. Usa `db.ts` y encapsula acceso a
datos de leads.

#### `index.ts`
Barrel file.

---

### `src/server/services/`

#### `contact-service.ts`
Servicio del dominio contacto. Delega a repositorio para listar leads.

#### `index.ts`
Barrel file.

---

# Cómo se relaciona todo el flujo principal

## Flujo de marketing y cotización
1. El usuario entra a una página pública en `src/app/(marketing)`.
2. Selecciona un plan o servicio desde `pricing.ts` o `services.ts`.
3. Esa selección se guarda en `features/quotes/lib/quote-selection.ts`
   y `features/marketing/lib/plan-profile-store.ts`.
4. Entra a `/quote`.
5. `quote-builder.tsx` reconstruye el contexto.
6. `quote-estimator.tsx` arma el draft técnico.
7. `estimate.ts` calcula rangos con base en `lib/mocks/catalogs.ts`.
8. `quote-summary-card.tsx` muestra el resumen.
9. `contact-form.tsx` (con react-hook-form + zod) envía el lead a
   `/api/forms`.
10. `/api/forms` usa `src/server/email` para mandar correos.

## Flujo de auth
1. Login y register se presentan desde páginas en `(auth)`.
2. Los formularios (con react-hook-form + zod) llaman a
   `/api/auth/login` o `/api/auth/register`.
3. Esos endpoints persisten en Prisma (sin hash real todavía).
4. La sesión se guarda con `session-store.ts` en `localStorage`
   (mock).
5. `auth-service.ts` resuelve el dashboard route según rol.

## Flujo de dashboard
1. El usuario entra a `/dashboard/[role]/...`.
2. `page.tsx` resuelve la sección con `routes.ts` y delega en
   `view.tsx`.
3. `DashboardShell` monta sidebar + topbar + CommandPalette y envuelve
   en `<div data-role={role}>` para tematización.
4. `workspace-store.tsx` hidrata usuarios desde `/api/users`,
   cotizaciones desde `/api/quotes` y mensajes desde `/api/chat`.
5. El resto de entidades sigue del lado mock o sessionStorage.
6. Los paneles (uno por rol y sección) usan `selectors.ts` para
   derivar vistas y `useDashboardWorkspace` para acciones.
7. Algunas acciones disparan `/api/dashboard/notify` para enviar
   correos.
8. `useDashboardTheme` está disponible para componentes que necesitan
   el color del rol en JS (sparklines, etc.).

---

# Qué mejoraría en la estructura, sin rehacer todo

## 1. Unificar dominio entre Prisma y frontend
Necesitas que estos conceptos existan una sola vez:

- `Role`
- `ProjectType`
- `PlanCategory`
- `PlanTier`
- `BillingModel`
- `QuoteStatus`
- `Priority`

Hoy están duplicados o divergentes.

## 2. Mover quotes a una capa de dominio real
Crea algo como:

- `src/server/services/quotes/`
- `src/server/repositories/quotes/`
- `src/server/contracts/quotes.ts`

Y deja que:
- frontend arme draft
- backend valide y calcule definitivo
- Prisma persista

## 3. Dejar `lib/mocks` como soporte, no como motor
Mientras `catalogs.ts` defina negocio real, sigues en modo híbrido.

## 4. Dejar de instanciar Prisma en rutas
Todo debería pasar por `src/lib/db`.

## 5. Completar `src/server/`
Ya tienes la intención correcta. Solo falta que auth, quotes y users
la usen de verdad.

## 6. Reducir estado de negocio en `workspace-store.tsx`
Ese store debería terminar siendo:
- cache de UI
- selección local
- optimistic state

No la fábrica principal de proyectos y operaciones.

## 7. Cablear zod en API routes
Ya está disponible para los formularios. Falta usarlo también para
validar `request.json()` en `/api/quotes`, `/api/auth/*`,
`/api/dashboard/notify` (que hoy hace su propio switch sobre
`type`).
