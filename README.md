# Codenium

Sitio corporativo construido con Next.js App Router, React y TypeScript. La base actual integra marketing público, acceso con sesión de prueba, cotizador interactivo y dashboards por rol, todo listo para conectarse más adelante con backend y persistencia real.

## Estado actual

- Marketing público con páginas de contenido, contacto y cotizador.
- Flujo de acceso con `/login`, `/register` y `/forgot-password`.
- Registro público limitado a cuentas cliente.
- Dashboards visuales para `client`, `pm` y `admin`.
- Mocks centralizados para cotizaciones, proyectos, mensajes, usuarios y sesión.
- Prisma preparado a nivel estructural, pero todavía sin integrarse a estas capas.

## Estructura real

```text
src/
  app/
    (marketing)/        # Sitio público
    (auth)/             # Acceso, registro y recuperación
    dashboard/          # Dashboards por rol
    api/                # Endpoints internos simples
  components/
    layout/             # Header y footer compartidos
    ui/                 # Iconos y piezas base
  features/
    auth/               # UI y lógica de acceso
    dashboard/          # Shell, contenido y vistas del dashboard
    marketing/          # Contenido y componentes del sitio público
    messages/           # Vistas de mensajes
    projects/           # Vistas de proyectos
    quotes/             # Cotizador y cotizaciones
    users/              # Vistas de usuarios
  hooks/
  lib/
    mocks/              # Catálogos y datos centralizados
    types/              # Tipos de dominio
    presenters.ts       # Labels y formatos visibles en UI
    utils.ts
    env.ts
    db.ts
  server/
    repositories/
    services/
```

## Flujos disponibles

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

Las secciones internas del dashboard se resuelven desde catálogos y vistas desacopladas para que el cambio a datos reales sea lo más directo posible.

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

## Siguientes integraciones reales

- Sustituir `src/features/auth/lib/session-store.ts` por la estrategia real de sesión.
- Conectar `src/features/auth/lib/auth-service.ts` a endpoints o server actions.
- Reemplazar `src/lib/mocks/*` por repositorios conectados a Prisma.
- Mover validaciones y envíos de formularios a backend cuando se habilite la siguiente fase.
