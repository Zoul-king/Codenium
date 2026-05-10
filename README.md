# Codenium

Sitio corporativo construido con Next.js App Router, React y TypeScript. La base actual integra marketing público, acceso con sesión de prueba, cotizador interactivo, portafolio, dashboards por rol y una estructura lista para conectarse más adelante con backend y persistencia real.

## Estado actual

- Marketing público con páginas de contenido, contacto, portafolio y cotizador.
- Acceso principal desde el overlay del header con login y registro.
- Rutas `/login`, `/register` y `/forgot-password` como respaldo.
- Dashboards visuales para `client`, `pm` y `admin`.
- Mocks centralizados para cotizaciones, proyectos, mensajes, usuarios y sesión.
- Prisma preparado a nivel estructural, pero todavía sin integrarse a estas capas.

## Cuentas de prueba

Las cuentas oficiales de prueba se gestionan con `scripts/reset-test-accounts.ts`:

- `gzcm.manuel+admin@gmail.com` (ADMIN)
- `gzcm.manuel+pm@gmail.com` (PM)
- `gzcm.manuel+cliente@gmail.com` (CLIENT)

La contraseña la define ese script. No deben existir otras cuentas hardcodeadas en el repo.

## Estructura real

```text
src/
  app/
    (marketing)/        # Sitio público
    (auth)/             # Rutas de respaldo para acceso
    dashboard/          # Dashboards por rol
    api/                # Endpoints internos simples
  components/
    layout/             # Header y footer compartidos
    ui/                 # Iconos y piezas base reutilizables
  features/
    auth/               # UI y lógica de acceso mock
    dashboard/          # Shell, selectores y paneles por rol
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
public/
  icons/
  images/
  fonts/
```

## Flujos disponibles

### Marketing

- `/`
- `/about`
- `/plans`
- `/portfolio`
- `/contact`
- `/quote`
- `/privacy`

### Auth

- `/login`
- `/register`
- `/forgot-password`

### Dashboard

- `/dashboard/client`
- `/dashboard/pm`
- `/dashboard/admin`

Las secciones internas del dashboard se resuelven desde catálogos, selectores y vistas desacopladas para que el cambio a datos reales sea lo más directo posible.

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