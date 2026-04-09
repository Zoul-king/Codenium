# Codenium

Sitio corporativo construido con Next.js App Router, React y TypeScript. La base actual ya incluye marketing, auth mock, cotizador inicial y dashboards mock por rol sin backend real todavía.

## Estado actual

- Marketing público con rutas de contenido, contacto y cotizador.
- Auth mock con `/login`, `/register` y `/forgot-password`.
- Dashboards mock para `client`, `pm` y `admin`.
- Prisma preparado a nivel estructural, pero sin persistencia conectada a estas nuevas capas.

## Estructura real

```text
src/
  app/
    (marketing)/        # Sitio público
    (auth)/             # Login, registro y recuperación mock
    dashboard/          # Dashboards por rol
    api/                # Endpoints internos simples
  components/
    layout/             # Header y footer compartidos
    ui/                 # Iconos y piezas base
  features/
    auth/               # UI y lógica mock de acceso
    dashboard/          # Shell, resolución y vistas del dashboard
    marketing/          # Contenido y componentes del sitio público
    messages/           # Vistas mock de mensajes
    projects/           # Vistas mock de proyectos
    quotes/             # Cotizador y cotizaciones mock
    users/              # Vistas mock de usuarios
  hooks/
  lib/
    mocks/              # Catálogos y datos mock centralizados
    types/              # Tipos de dominio
    utils.ts
    env.ts
    db.ts
  server/
    repositories/
    services/
```

## Flujos mock

### Marketing

- `/`
- `/about`
- `/plans`
- `/portfolio`
- `/contact`
- `/quote`

### Auth

- `/login`
- `/register`
- `/forgot-password`

### Dashboard

- `/dashboard/client`
- `/dashboard/pm`
- `/dashboard/admin`

Las secciones internas del dashboard se resuelven desde catálogos mock y quedan listas para sustituirse por permisos y datos reales.

## Desarrollo

```bash
npm install
npm run dev
```

## Producción

```bash
npm run build
npm run start
```

## Próximos puntos de integración real

- Reemplazar `src/features/auth/lib/session-store.ts` por Auth.js o la estrategia real de sesión.
- Sustituir `src/lib/mocks/*` por repositorios conectados a Prisma.
- Mover validaciones mock de formularios a endpoints/server actions cuando se habilite backend real.
