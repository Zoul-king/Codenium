En este archivo se define la estructura general del proyecto, con una breve
descripción del contenido dentro de las carpetas y archivos de la raíz.

Última revisión: tras el refactor estructural y rediseño de los 3 dashboards
(PRs #1 y #2 ya en main).

Nota: La información es general sobre el contenido dentro de las carpetas.



# Build de Next.js
.next/
├── cache/                → Caché de compilación
├── server/               → Código backend compilado (API routes, SSR)
├── static/               → Archivos estáticos generados
├── trace/                → Información de ejecución
└── build-manifest.json   → Mapa interno de assets

```

# Dependencias
node_modules/
→ Librerías instaladas (Next 15, React 19, Prisma 6, Tailwind 4,
  shadcn/ui + Radix, react-hook-form, zod, sonner, lucide-react, etc.)

```

# Base de Datos
prisma/
├── schema.prisma         → Modelo completo de base de datos (usuarios, quotes,
│                           proyectos, hitos, mensajes, documentos, pagos, etc.)
├── seed.ts               → Script para datos iniciales
└── migrations/           → Historial de cambios en la DB

Nota: seed.ts y migrations no se encuentran en una copia local sin antes
ejecutar el comando prisma:migrate.

```

# Archivos Públicos
public/
├── fonts/poppins/        → Fuentes locales Poppins (300–800)
├── images/               → Imágenes del sitio (brand, marketing, portfolio)
├── icons/                → Íconos (services, contact, social, whatsapp)
└── favicon.ico           → Ícono del sitio

```

# Scripts Utilitarios
scripts/
├── build-next.ts         → Wrapper de build
├── clear-build-cache.ts  → Limpia caché antes de build
├── free-port-3000.ts     → Libera el puerto 3000 antes de dev (Windows)
└── start-next.ts         → Wrapper de arranque

```

# Configuración shadcn/ui
components.json
→ Config de shadcn/ui con Tailwind v4 (cssVariables=true, sin tailwind.config),
  alias @/components, @/lib/utils, @/components/ui, etc.

```

## Rutas y Backend
src/app/
├── (marketing)/          → Landing pública (home, about, plans, portfolio,
│                           quote, contact, privacy)
├── (auth)/               → Login, register, forgot-password
├── dashboard/
│   ├── layout.tsx        → Wrapper con DashboardWorkspaceProvider
│   └── [role]/[[...section]]/page.tsx
│                         → Página dinámica única que resuelve los 3 dashboards
│                           (cliente, PM, admin) y sus secciones
├── api/                  → Endpoints backend
│   ├── auth/             → Login y register (Prisma directo, sin hash real aún)
│   ├── chat/             → Chatbot público (Groq)
│   ├── dashboard/notify/ → Notificaciones por email tras eventos del dashboard
│   ├── forms/            → Leads públicos (contacto/quote → email)
│   ├── health/           → Healthcheck
│   ├── plans/            → CRUD de catálogo de planes
│   ├── quotes/           → Crear/leer cotizaciones
│   └── users/            → Listado de usuarios
├── layout.tsx            → Layout global (Poppins, TooltipProvider, Toaster)
├── globals.css           → Tailwind v4 + tokens (marca + estado + role)
└── favicon.ico

```

## Componentes Transversales
src/components/
├── ui/                   → 25 primitivas shadcn/ui (button, dialog, sheet,
│                           dropdown-menu, popover, tabs, table, tooltip,
│                           command, sonner, form, etc.)
├── layout/               → Header y footer del sitio público
└── common/               → Iconografía propia + form-field wrapper sobre
                            shadcn (TextField/TextAreaField legacy API)

```

## Módulos Funcionales
src/features/
├── auth/
│   ├── components/       → AuthPanel + login/register/forgot forms
│   │                       (con react-hook-form + zod)
│   └── lib/              → auth-pages, auth-service (mock híbrido), session-store

├── dashboard/
│   ├── components/
│   │   ├── shell/        → DashboardShell, sidebar, command palette
│   │   ├── primitives/   → DashboardCard, SectionHeading, StatusBadge,
│   │   │                   ProgressBar, ChromeProvider
│   │   ├── client/       → overview, milestones, documents (warm storytelling)
│   │   ├── pm/           → overview (kanban), status (status board)
│   │   ├── admin/        → overview (KPIs), quote, team, plan, payments,
│   │   │                   deliverables (command center denso)
│   │   └── shared/       → payments, project-chat, profile
│   ├── lib/              → routes, view, workspace-store, selectors, recipients
│   └── hooks/            → use-dashboard-theme

├── marketing/
│   ├── components/       → Hero, Pricing, Services, Portfolio, ContactForm,
│   │                       Faq, Timeline, etc.
│   ├── data/             → Contenido estático por página (home, about, plans…)
│   ├── lib/              → metadata, plan-catalog, plan-profile-store
│   └── types/            → Tipos UI de marketing (PlanItem, ServiceItem, etc.)

├── messages/components/  → message-list (vista derivada del store)
├── projects/components/  → project-list (vista derivada del store)
├── quotes/
│   ├── components/       → quote-builder, quote-estimator, quote-summary-card
│   └── lib/              → content, estimate, quote-selection
└── users/components/     → user-list (vista derivada del store)

```

## Hooks Globales
src/hooks/
└── use-reveal.ts         → Animaciones de aparición con GSAP (marketing)

```

## Utilidades y Base
src/lib/
├── api/                  → client-api (POST a /api/forms y /api/dashboard/notify)
├── db/                   → Cliente Prisma singleton (db.ts era esto antes)
├── mocks/                → Datos simulados (auth, users, projects, quotes,
│                           messages, change-requests, catalogs, project-meta)
├── types/                → Tipos globales del sistema
│   ├── domain.ts         → Roles, status, records (frontend)
│   ├── api.ts            → Re-export de payloads (server/email/types)
│   └── index.ts          → Barrel
└── utils/                → cn (clsx + tailwind-merge), presenters de fechas/labels

```

## Configuración del Entorno
src/config/
└── env.ts                → Reader tipado de variables (DATABASE_URL, RESEND_*,
                            EMAIL_*, NODE_ENV, etc.) — antes en src/lib/env.ts

```

## Lógica Backend Real
src/server/
├── email/
│   ├── config.ts         → Resuelve remitentes y bandejas
│   ├── send-email.ts     → Adaptador de Resend (con fallback)
│   ├── index.ts          → Capa pública: confirmaciones y notificaciones
│   ├── types.ts          → Contratos de payload (antes lib/email-payloads.ts)
│   └── templates/        → dashboard-events, public-leads, shared
├── repositories/         → Acceso a datos (contact-repository por ahora)
└── services/             → Lógica de negocio backend (contact-service por ahora)

```

# Documentación
docs/
├── folders_structure     → Este archivo (mapa general)
├── folders_general_use   → Explicación por carpeta + estado del sistema
└── files_structure       → Detalle archivo por archivo

```

# Archivos en la Raíz
.env                      → Variables de entorno (DB, Resend, etc.)
.env.local                → Variables locales
.env.production           → Variables para producción

.gitignore                → Archivos ignorados por Git (incluye .claude/)

README.md                 → Documentación general

next.config.ts            → Configuración de Next.js
package.json              → Dependencias y scripts del proyecto
package-lock.json         → Versiones exactas
tsconfig.json             → Configuración de TypeScript (alias @/* → ./src/*)
postcss.config.mjs        → Configuración de PostCSS (Tailwind v4)
prisma.config.ts          → Configuración nueva de Prisma
components.json           → Config de shadcn/ui (ver sección de configuración)

Notas:
- No hay `tailwind.config.{js,ts}`. Tailwind 4 vive 100 % en `globals.css`
  vía `@theme` + `@theme inline` (también para los tokens shadcn).
- No hay `eslint.config.mjs` instalado todavía.
