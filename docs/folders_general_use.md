En este archivo se define aún más lo antes mencionado en el archivo
folders_structure.

Última revisión: tras el refactor estructural y rediseño de los 3 dashboards.
Cambios mayores frente a la versión anterior de este documento:

- `src/lib/` dejó de ser cajón desastre y ahora segmenta utilidades, datos,
  cliente API, tipos y cliente DB en subcarpetas.
- `src/components/` ya no está vacío: ahora aloja primitivas accesibles
  (shadcn/ui + Radix) y wrappers comunes.
- `src/features/dashboard/components/` reorganizado por rol y rol de
  componente (shell/primitives/client/pm/admin/shared) en lugar de 17
  archivos planos.
- Nuevo `src/config/env.ts` (antes en `lib/`).
- Nuevos `src/lib/{api,db,utils,types/api.ts,types/index.ts}`.
- Nueva carpeta `src/features/dashboard/hooks/` para hooks de tema y similares.



# .next

Técnicamente no es parte del código fuente, es el resultado de compilación de
Next.js. Ahí se guarda el servidor compilado, assets optimizados, caché y
metadatos del build. Sirve para levantar la app ya procesada, no para
desarrollar.

Cómo mejorarlo: no se toca. Solo asegúrate de no versionarlo y de limpiar
caché cuando el build se corrompa. Ya tienes `scripts/clear-build-cache.ts`
para eso.

```

# node_modules

Es el árbol de dependencias instalado. Aquí viven Next 15, React 19,
Prisma 6, Tailwind 4 (vía PostCSS), Radix (a través de shadcn/ui),
react-hook-form 7, zod 4, sonner, lucide-react, gsap y resend.

Cómo mejorarlo: el set de deps ya cubre lo necesario para el producto. Lo
que falta no es agregar más, sino añadir tooling de calidad: lint estricto
(ESLint v9 + flat config), tests (Vitest o Playwright), `tsc --noEmit` en CI
y scripts más completos para `prisma generate`/`db push`/`seed`.

```

# prisma

Aquí está la capa de datos real. Es la definición formal del negocio en
base de datos. En tu caso, esta carpeta ya no modela solo una landing,
modela una plataforma completa.

`schema.prisma` define usuarios, sesiones, tokens de recuperación, leads,
cotizaciones, items de cotización, proyectos, hitos, mensajes, documentos,
pagos y solicitudes de cambio. Eso significa que el proyecto está pensado
en tres etapas: captación, venta, ejecución.

Cómo mejorarlo (sigue pendiente):

- Dejar de usar strings sueltos en frontend para cosas que en Prisma son
  enums. `projectType`, `planTier`, `billingModel` y `planCategory` siguen
  manejándose con claves UI distintas a las del schema.
- Meter semillas reales para planes, tipos de proyecto y catálogos.
- Separar mejor el modelo actual de lo que todavía es idea futura, marcando
  como "etapa siguiente" lo que aún no se usa.

```

# public

Recursos estáticos servidos directamente por Next. Imágenes, íconos,
fuentes Poppins (cargadas con `next/font/local`).

Cómo mejorarlo: ordenar mejor por dominio funcional cuando crezca
(`public/images/marketing`, `public/images/dashboard`, `public/icons/brand`).
Hoy ya está bastante segmentado pero el dashboard apenas tiene assets
propios.

```

# scripts

Scripts de entorno y operación: liberar puerto 3000, limpiar caché,
construir y arrancar Next. Cumplen una función de orquestación local.

Cómo mejorarlo:

- Añadir scripts para `prisma generate`, `db push`, `migrate dev`, `seed`,
  y un `check` que ejecute `tsc --noEmit` + lint cuando este se agregue.
- Centralizar mejor las tareas de desarrollo para que otra persona no
  dependa de memoria o de pasos manuales.

```

# components.json

Configuración de shadcn/ui adaptada a Tailwind v4: `cssVariables: true`,
`tailwind.config: ""` (no hay archivo). Aliases:
`components → @/components`, `utils → @/lib/utils`, `ui → @/components/ui`,
`lib → @/lib`, `hooks → @/hooks`. Estilo `new-york`, library `lucide`.

```

# src

Aquí está el sistema real. Esta carpeta es la que sí importa. Y ahora sí
sigue una sola arquitectura coherente:

- App Router en `src/app/`
- Componentes transversales en `src/components/`
- Módulos por dominio en `src/features/`
- Capa utilitaria/transversal en `src/lib/` y `src/config/`
- Backend en `src/server/`
- Hooks globales en `src/hooks/`

Antes había mezcla y mucho contenido en `src/lib/` raíz. Ese desorden ya
está cerrado.

## src/app

Esta es la capa de entrada de Next.js. Aquí defines rutas, layouts y
endpoints.

Tienes rutas agrupadas por dominios visibles: `(auth)`, `(marketing)`,
`dashboard`, y además `api`. Eso técnicamente está bien porque separa el
acceso público del autenticado y del backend HTTP.

`src/app/api` es donde está la capa HTTP real. Tus endpoints reciben
requests, validan de forma básica y ejecutan lógica. El problema es que
parte de esa lógica la hacen directo ahí mismo, sin pasar siempre por
servicios ni por repositorios.

Ejemplo claro: en `/api/auth/login` y `/api/auth/register` se crea un
PrismaClient directo dentro del endpoint y se consulta la base ahí mismo.
Eso funciona, pero no escala bien. Ya tienes un `src/lib/db/` con cliente
compartido, así que esos endpoints siguen rompiendo su propia convención.

Otro problema técnico fuerte (sin resolver) es que el login compara
`user.passwordHash !== password`. Eso significa que no estás usando hash
real, aunque el campo se llame passwordHash. A nivel técnico y de
seguridad, eso está mal. Es funcional para demo, no para producción.

Cómo mejorarlo:

- Usar siempre `db` desde `@/lib/db` (no `new PrismaClient()` en cada route).
- Sacar la lógica de negocio del endpoint. El route handler debe recibir,
  validar, delegar y responder.
- Validación formal con Zod ya está disponible a nivel app (la usamos en
  formularios). Falta cablearla en los endpoints.
- Hashear contraseñas con bcrypt o argon2.
- Unificar la capa auth: hoy `api/auth/*` usa Prisma, pero
  `features/auth/lib/auth-service.ts` todavía usa mocks. Esa convivencia
  rompe la arquitectura.

`src/app/dashboard/[role]/[[...section]]/page.tsx` sigue siendo la única
página dinámica que resuelve los 3 dashboards. Internamente delega en
`features/dashboard/lib/view.tsx`, que ahora referencia componentes
organizados por subcarpeta de rol.

## src/components

Antes esta carpeta estaba casi vacía. Hoy tiene tres roles claros:

- `ui/` — 25 primitivas de shadcn/ui (Button, Dialog, Sheet, DropdownMenu,
  Popover, Tabs, Tooltip, Table, Form, Sonner, Command, etc.). Todas son
  Radix por debajo y se estilan con Tailwind 4 + tokens en globals.css.
- `layout/` — header y footer del sitio público.
- `common/` — componentes propios que no son primitivas básicas pero se
  usan en varios features:
    * `icons.tsx` (set de íconos brand + lucide envuelto)
    * `form-field.tsx` (TextField/TextAreaField wrapper sobre Input/
      Textarea/Label de shadcn — preserva la API anterior para no romper
      consumidores).

Cómo mejorarlo:

- Si crece, considera mover los íconos a `common/icons/` con sub-archivos
  por dominio (services, contact, social).
- A medida que aparezcan más patrones, ir extrayendo a `common/` antes
  de que se duplique código entre features.

## src/features

Aquí intentas trabajar por dominio de negocio. Eso es bueno. Es, de hecho,
la parte más sana de la estructura.

Tienes `auth`, `dashboard`, `marketing`, `messages`, `projects`, `quotes`,
`users`. Cada uno con su carpeta `components/` y la lógica que le
corresponde en `lib/` o `hooks/` cuando aplica.

### features/auth

Tiene componentes (login/register/forgot panels y campos) y lib (sesión
mock + servicio + páginas). Los formularios fueron migrados a
react-hook-form + zod para validación inline.

Sigue siendo una capa de transición. El problema es que no está claro si
auth ya es real o no, porque una parte sí consulta Prisma y otra sigue
funcionando sobre mocks. El frontend puede creer una cosa y la API otra.

Cómo mejorarlo: decidir una sola verdad. Si auth ya usa base real,
`auth-service.ts` y `session-store.ts` deben dejar de ser la fuente
primaria. Si todavía estás en demo, no mezcles Prisma en login hasta
terminar la migración.

### features/dashboard

Aquí está el dashboard por rol. Es el módulo que más cambió en el último
refactor:

- `components/shell/` — `dashboard-shell.tsx` (sidebar + topbar + Sheet
  móvil + DropdownMenu de usuario + Popover de notificaciones), `command-
  palette.tsx` (cmdk + Dialog, atajo ⌘K) y `sidebar-actions.tsx`.
- `components/primitives/` — DashboardCard, SectionHeading, StatusBadge,
  ProgressBar, ChromeProvider. Antes estos 5 vivían en un `dashboard-ui.tsx`
  monolítico con tematización por hex hardcoded. Ahora son piezas
  separadas y consumen variables CSS por rol (`var(--role)`,
  `var(--role-soft)`, `var(--role-strong)`).
- `components/client/` — overview (warm hero + progress ring + timeline +
  warm stat cards), milestones (timeline expandido + tabs por estado +
  diálogo de cambios) y documents (library con filtros).
- `components/pm/` — overview (4 KPIs operativos + tabs Kanban/Lista/
  Bloqueados) y status (status board + Sheet de edición de hitos).
- `components/admin/` — overview (6 KPIs con sparklines SVG inline +
  tabs Recientes/Pipeline/Atención + capacity + activity feed), quote
  (tabla densa + Sheet detalle + asignación de PM), team (tabs PMs/
  Clientes con dropdown de acciones), plan (tabs Personal/Empresarial
  con Sheet de edición), payments (4 KPIs + tabs por estado) y
  deliverables (tabs Todos/Plantillas/Compartidos con grid de cards).
- `components/shared/` — payments, project-chat (chat moderno con
  avatares y autoscroll) y profile.

`hooks/use-dashboard-theme.ts` es nuevo: lectura tipada del rol activo y
los tokens del tema (vars CSS y hex equivalentes).

`lib/` mantiene `routes`, `view`, `workspace-store`, `selectors` y
`recipients`. El store sigue siendo una simulación avanzada con partes
conectadas a `/api/users`, `/api/quotes`, `/api/chat`, y fallback a
mocks.

Cómo mejorarlo: separar presentación de datos. Los paneles aún son
"dashboard maquetado" en buena parte. Empieza migrando overview, quotes
y proyectos a fuentes reales, después hitos, documentos, pagos y
mensajes.

### features/marketing

Aquí está la landing, secciones informativas, planes, portfolio,
privacidad, etc. Esto sigue bien encapsulado.

Movimientos del refactor:
- `lib/plan-catalog.ts` y `lib/plan-profile-store.ts` ahora viven aquí
  (antes en `src/lib/`).
- `contact-form.tsx` fue migrado a react-hook-form + zod conservando
  todas sus props (summary/embedded/quotePayload/etc.).

Lo técnico importante sigue siendo que el contact-form participa en dos
flujos (contacto general y cotización), por las mismas razones que antes.

Cómo mejorarlo: separar mejor formulario de contacto general y formulario
de quote. Sigue siendo una buena oportunidad de simplificación.

### features/quotes

La parte más importante del negocio ahora mismo. Aquí tienes
`quote-builder`, `quote-estimator`, `quote-summary-card` y la librería
de estimación.

Movimiento del refactor: `quote-selection.ts` ahora vive en
`features/quotes/lib/` (antes en `src/lib/`).

Técnicamente el cálculo sigue ocurriendo en frontend con
`calculateQuoteEstimate()`. El cálculo toma el tipo de proyecto,
infraestructura y módulos, suma rangos mock y produce precio,
mensualidad y tiempo estimado.

Sigue habiendo el choque: Prisma dice que hay un modelo formal de quote,
pero el cálculo se basa en catálogos mock. Eso es útil al inicio, pero
si no lo corriges pronto, va a crear desalineación entre lo que ve el
usuario, lo que se guarda y lo que luego opera el equipo.

Cómo mejorarlo:

- Mover el motor de cotización a una capa de dominio (probablemente
  `src/server/services/quotes/`).
- No usar labels visibles como valores de negocio. Usa claves internas,
  luego traduce a labels para UI.
- Guardar además del total, el desglose técnico de la cotización.
- Separar claramente cotización preliminar, lead y quote formal.

### features/{messages,projects,users}

Cada uno con un solo componente que es vista derivada del workspace
store. No se modificaron en el refactor.

## src/hooks

`use-reveal.ts` (animaciones de aparición con GSAP) sigue siendo el
único hook global. Los hooks de dominio del dashboard ahora viven en
`features/dashboard/hooks/`.

## src/lib

Antes esta carpeta hacía demasiado. Ahora está reducida a utilidades
transversales puras y datos mock. El cambio principal fue partirla en
subcarpetas:

- `api/` — cliente HTTP (POST a `/api/forms`, `/api/dashboard/notify`).
- `db/` — singleton de Prisma Client. Es la única puerta que debe usar
  cualquier código backend.
- `mocks/` — fixtures runtime (no son tests). Cuentas de auth, usuarios,
  proyectos, cotizaciones, mensajes, change requests, catálogos. Sigue
  siendo el motor del producto en partes que faltan migrar a DB real.
- `types/` — `domain.ts` (frontend), `api.ts` (re-export de payloads
  desde `server/email/types`), `index.ts` (barrel).
- `utils/` — `cn` (clsx + tailwind-merge) y `presenters` (formato de
  fechas y labels de status).

Cómo mejorarlo (sigue pendiente):

- Reducir `mocks/` al mínimo o moverlos a una capa temporal claramente
  marcada conforme se migra a DB.
- Centralizar tipos de dominio sin mezclar tipos mock y tipos persistidos.

## src/config

Carpeta nueva (antes `src/lib/env.ts`). Hoy contiene únicamente
`env.ts` — reader tipado de variables de entorno con `requireServerEnv`
para validar que las requeridas existan en runtime. La consume Prisma
client, healthcheck y email config.

## src/server

Esta es la capa backend más limpia del proyecto. Hoy tiene email,
repositorios, servicios y los tipos públicos de payload de email
(`types.ts`, antes `lib/email-payloads.ts`). Conceptualmente es la
dirección correcta.

Las plantillas de correo y el envío con Resend están bien organizados:
config, templates y función de envío separados.

El problema es que esta capa todavía no gobierna todo el backend. Varias
rutas API siguen resolviendo cosas directamente en el route handler en
vez de usar servicios de aquí.

Cómo mejorarlo:

- Consolidar `server/` como única capa de negocio backend. Que las API
  routes deleguen a `server/services` y `server/repositories`.
- Mover también la lógica de quotes y auth a server.



# Sistema de diseño

`globals.css` ahora define en `@theme`:

- Paleta de marca (primary, accent, secondary, body-color)
- Tokens de estado (success/warning/error/info en escalas 50/100/500/600/700)
- Acentos por rol (`role-client`, `role-pm`, `role-admin` en escalas
  50/100/500/600)
- Radii estándar (`--radius-card`, `--radius-card-dense`)
- Sombras estándar (`--shadow-card`, `--shadow-card-dense`)
- Tokens shadcn (background, foreground, card, popover, primary-foreground,
  secondary, muted, accent, destructive, border, input, ring) vía
  `@theme inline`

Tematización por rol: el shell del dashboard envuelve todo en
`<div className="role-themed" data-role={role}>` y los tokens
`--role`, `--role-soft`, `--role-strong` se resuelven automáticamente
para todos los descendientes. Esto reemplaza el `getRoleCardTone()` con
hex hardcoded que existía antes en `dashboard-ui.tsx`.

Clases utilitarias añadidas:
- `.warm-card`, `.ops-card`, `.kpi-card`
- `.btn-role`, `.btn-role-outline`
- `.badge-status-{success,warning,error,info,neutral}`
- `.cmd-trigger`, `.cmd-kbd`
- `.kpi-value`, `.kpi-label`, `.kpi-delta-{up,down,flat}`

Renombre importante: `--color-foreground` (antes off-white legacy) →
`--color-surface-soft`, para liberar `--color-foreground` y mapearlo a
texto oscuro como espera shadcn. 16 archivos marketing/auth/quote ya
usan `bg-surface-soft`.

Tipografía: Poppins se mantiene intacta (cargada con `next/font/local`
desde `/public/fonts/poppins/`, expuesta como `--font-sans`). No se
modificó ni la jerarquía ni las clases `.type-*` existentes.



# Archivos raíz

Aquí se tiene la configuración de proyecto y runtime.

`package.json` define scripts y dependencias. Está limpio. Las dependencias
nuevas: `clsx`, `tailwind-merge`, `class-variance-authority`,
`react-hook-form`, `zod`, `@hookform/resolvers`, `sonner`, todas las
piezas de Radix instaladas vía shadcn (`radix-ui` paquete monolítico).

`next.config.ts`, `tsconfig.json`, `postcss.config.mjs` son infraestructura
de framework.

`README.md` está bien para arrancar pero conviene actualizarlo a la
arquitectura real: explicar qué partes están ya conectadas a DB, cuáles
siguen mock, cuál es el flujo de quote y cómo correr el proyecto completo.



# Estado real del proyecto

La estructura ya no es el problema. La distribución por carpetas, después
del refactor, está bastante razonable y permite escalar sin sentirse
forzada.

El problema real sigue siendo: tienes una arquitectura que quiere ser
real, pero con un flujo de datos todavía híbrido.

Dicho más claro:

La UI ya parece producto.
La base de datos ya parece plataforma.
La estructura de carpetas también.
Pero la lógica todavía no está unificada.



# Problemas técnicos que siguen vigentes

- Auth real (Prisma) mezclada con auth mock (`session-store.ts`,
  `auth-service.ts`).
- Contraseñas guardadas en texto plano (campo se llama `passwordHash` pero
  no hay hash real).
- Dashboard modular pero con datos simulados como fuente de verdad para
  varios paneles (`workspace-store.tsx` fabrica entidades de negocio en
  cliente).
- Motor de cotización en frontend mientras la persistencia espera enums
  y relaciones reales.
- API routes haciendo lógica directa, mientras `src/server/` ya existe y
  debería centralizar eso.

(Lista actualizada después de la última iteración. La fractura de
carpetas que estaba en esta lista ya no aplica: `src/lib/`,
`src/components/` y `src/features/dashboard/components/` están
reorganizados.)



# Cómo mejorar (próximos pasos)

Primero, unificar el modelo de dominio. Define una sola verdad para
`planCategory`, `planTier`, `billingModel`, `projectType`, `priority`,
`status`. Esa verdad debe ser compatible entre Prisma, frontend,
formularios y correo.

Segundo, cerrar la migración de auth. O es mock o es real, pero ya no
ambos. Y si es real, hash de contraseña y sesiones reales.

Tercero, mover toda la lógica de quotes a dominio compartido. El builder
puede seguir en frontend, pero el cálculo y la validación final deben
vivir en una capa central. Idealmente `src/server/services/quotes` o
algo así.

Cuarto, hacer que el dashboard consuma datos reales por módulo. No
necesitas migrarlo todo de golpe. Empieza por overview y quotes, luego
proyectos, pagos, documentos.

Quinto, formalizar DTOs y validaciones de entrada en endpoints. Ya
tienes zod instalado para los formularios; cablearlo también en las API
routes.

Sexto, reducir dependencia de mocks como motor del producto. Los mocks
deben ayudar al desarrollo, no gobernar el negocio.
