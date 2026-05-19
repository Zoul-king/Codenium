# Techina

Sitio corporativo construido con Next.js App Router, React y TypeScript. La base actual integra marketing público, acceso con sesión de prueba, cotizador interactivo, portafolio, dashboards por rol y una estructura lista para conectarse más adelante con backend y persistencia real.

## Estado actual

- Marketing público con páginas de contenido, contacto, portafolio y cotizador.
- Acceso principal desde el overlay del header con login y registro.
- Rutas `/login`, `/register` y `/forgot-password` como respaldo.
- Dashboards visuales para `client`, `pm` y `admin`.
- Mocks centralizados para cotizaciones, proyectos, mensajes, usuarios y sesión.
- Prisma preparado a nivel estructural, listo para conectarse con la base de datos.

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
    auth/               # UI y lógica de acceso
    dashboard/          # Shell, selectores y paneles por rol
    marketing/          # Contenido y componentes del sitio público
    messages/           # Vistas de mensajes
    projects/           # Vistas de proyectos
    quotes/             # Cotizador y cotizaciones
    users/              # Vistas de usuarios
  hooks/
  lib/
  config/
  server/
public/
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

## Configuración de licencia

El sistema requiere una licencia válida para ejecutarse. Configura las siguientes variables de entorno antes de iniciar la aplicación:

- `LICENSE_KEY` — clave de licencia provista por los autores.
- `LICENSE_EXPIRES_AT` — fecha de expiración de la licencia en formato ISO 8601 (por ejemplo `2026-12-31`).

Si la licencia no existe o está expirada, la aplicación bloqueará el acceso y mostrará una página de "Licencia expirada". Para reactivar el sistema, actualiza las variables de entorno con una licencia válida y reinicia la aplicación. No se eliminan ni modifican datos cuando una licencia expira.

## Propiedad Intelectual

- Este proyecto se comparte únicamente con fines de **revisión académica**.
- Los autores **conservan todos los derechos** sobre el código fuente y los recursos del proyecto.
- **No se permite** copiar, modificar, distribuir, sublicenciar, vender ni utilizar comercialmente el código, total o parcialmente.
- **No se permite** desplegar este sistema en producción sin autorización previa y por escrito de los autores.
- El uso no autorizado de este software puede constituir una **violación de derechos de autor** y conlleva las consecuencias legales correspondientes.

Consulta el archivo [`LICENSE`](./LICENSE) para más detalles.
