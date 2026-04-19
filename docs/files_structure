En este archivo se definen a detalle lo que contienen los archivos dentro de las carpetas.
A su vez, se determinan aspectos a mejorar. 

## Qué ya está bien

### 1. Separación general del proyecto
La base está mejor de lo que parece a simple vista. El proyecto ya separa:

- `src/app` para rutas y endpoints de Next.js
- `src/features` para módulos de negocio y UI por dominio
- `src/lib` para utilidades, tipos y helpers compartidos
- `src/server` para correo, repositorios y servicios
- `prisma` para la capa de datos

Eso significa que la app ya está organizada como producto, no como landing improvisada.

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

Técnicamente eso está bien pensado porque cubre el ciclo completo: captación, venta, ejecución y seguimiento.

### 3. Módulo de marketing bastante ordenado
`src/features/marketing` está bien encapsulado. Tiene:

- componentes visuales
- data estática por página
- metadata
- tipos propios

Eso hace que la parte pública sea mantenible y fácil de escalar.

### 4. Dashboard modular por rol
El dashboard está separado por rol y sección:

- cliente
- PM
- admin

La resolución de vista se hace con `routes.ts` y `view.tsx`, lo cual es correcto porque evita meter condicionales gigantes en las páginas.

### 5. Sistema de correos relativamente limpio
La parte de email es de lo más sano del proyecto:

- `config.ts` resuelve remitentes y bandejas
- `send-email.ts` encapsula Resend
- `templates/` separa plantillas por contexto
- `index.ts` centraliza funciones públicas

Eso ya parece backend serio.

---

## Qué está frágil

### 1. Auth real y mock al mismo tiempo
Aquí está una de las fracturas más claras.

Por un lado:
- `src/app/api/auth/login/route.ts`
- `src/app/api/auth/register/route.ts`

ya usan Prisma y la base real.

Pero por otro:
- `src/features/auth/lib/auth-service.ts`
- `src/features/auth/lib/session-store.ts`
- `src/lib/mocks/auth.ts`

siguen sosteniendo lógica tipo demo.

Eso provoca que el sistema tenga dos fuentes de verdad. En proyectos pequeños esto parece tolerable, pero cuando empieces a conectar dashboard, usuarios y permisos reales, te va a pegar.

### 2. Cotizador con cálculo útil, pero todavía acoplado a mocks
La UI del cotizador está bien armada:

- `quote-builder.tsx`
- `quote-estimator.tsx`
- `quote-summary-card.tsx`

Pero el motor usa catálogos mock en `src/lib/mocks/catalogs.ts`.

Eso sirve para visualizar precios y tiempos, pero no para tener una fuente de negocio sólida. Hoy el cálculo vive más como comportamiento de interfaz que como motor de dominio.

### 3. Dashboard visualmente avanzado, pero con estado híbrido
`workspace-store.tsx` mezcla:

- datos levantados desde `/api/users`
- estado guardado en `sessionStorage`
- transformaciones locales
- acciones que fabrican proyectos, mensajes, milestones y cambios en cliente

Eso significa que el dashboard no es todavía una capa real contra base de datos. Es una simulación avanzada con partes conectadas.

### 4. Endpoints con lógica metida directamente en la ruta
Varios endpoints usan Prisma directo dentro del route handler:

- `/api/auth/login`
- `/api/auth/register`
- `/api/quotes`
- `/api/users`

Eso funciona, pero rompe el patrón que ya empezaste a construir con `src/server/repositories` y `src/server/services`.

---

## Qué está mal o peligrosamente incompleto

### 1. Contraseñas sin hash real
En login y register, el campo se llama `passwordHash`, pero realmente guarda y compara texto plano.

Eso no es un detalle. Eso está mal.

Si mañana esto sale de entorno controlado, ya tienes una falla básica de seguridad.

### 2. Inconsistencia entre frontend y modelo Prisma
El modelo Prisma define enums cerrados para:

- `ProjectType`
- `PlanCategory`
- `PlanTier`
- `BillingModel`
- `QuotePriority`
- `QuoteStatus`

Pero el frontend del cotizador maneja claves y labels propias en `src/lib/types/domain.ts` y `src/lib/mocks/catalogs.ts`.

Eso genera el riesgo de que la UI construya valores que la base no entiende, o que la base espere estados que la UI nunca manda.

### 3. `/api/quotes` está demasiado crudo
`src/app/api/quotes/route.ts` crea una cotización con validación mínima.

Problemas:

- crea `new PrismaClient()` local
- no usa `src/lib/db.ts`
- no usa servicio ni repositorio
- no valida enums ni shape con esquema formal
- depende de que el frontend mande datos perfectamente compatibles

Eso es frágil.

### 4. La capa `server` existe, pero no gobierna todo
Tienes una dirección correcta, pero no completada. La lógica backend todavía está partida entre:

- route handlers
- utilidades de `lib`
- servicios en `server`
- estado local en `features`

Ese reparto hace que el proyecto se vea más avanzado de lo que realmente está integrado.

---

## Qué conviene arreglar primero

### Prioridad 1, cerrar auth
Haz esto primero:

- hashear contraseñas con `bcrypt` o `argon2`
- dejar de comparar texto plano
- centralizar login y register en servicios
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

Eso hay que alinearlo.

### Prioridad 3, sacar lógica de negocio de las API routes
Las rutas deberían hacer solo esto:

- recibir request
- validar
- delegar a servicio
- responder

No deberían decidir toda la lógica de negocio.

### Prioridad 4, reducir el peso de los mocks
Los mocks hoy no son solo apoyo visual. También determinan comportamiento. Eso está bien para arrancar, pero no para seguir creciendo.

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
- `src/server/` debería contener la lógica backend reutilizable
- `src/features/` contiene módulos visuales y parte de la lógica de dominio
- `src/lib/` contiene utilidades, tipos y mocks que hoy sostienen buena parte del flujo
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
- lo debería consumir cualquier servicio backend serio vía `src/lib/db.ts`
- condiciona qué valores son válidos al guardar cotizaciones, usuarios y proyectos

---

## `public/`

Esta carpeta no tiene lógica. Son recursos estáticos servidos tal cual por Next.js. Los consumen `next/image`, íconos SVG y branding de marketing.

### `public/fonts/`

#### `public/fonts/poppins/`
Fuentes locales Poppins usadas por la app mediante `next/font/local`.

- `poppins-300.ttf`, peso ligero
- `poppins-400.ttf`, peso regular
- `poppins-500.ttf`, peso medium
- `poppins-600.ttf`, peso semibold
- `poppins-700.ttf`, peso bold
- `poppins-800.ttf`, peso extra bold

Cómo se relaciona:
- `src/app/layout.tsx` registra la familia tipográfica global
- `globals.css` y componentes heredan esa fuente

### `public/icons/`

#### `public/icons/whatsapp.svg`
Ícono de WhatsApp usado en el botón flotante o elementos de contacto.

#### `public/icons/contact/`
Íconos del bloque de contacto.

- `location.svg`, ubicación
- `mail.svg`, correo
- `phone.svg`, teléfono

Cómo se relacionan:
- los usa `src/components/ui/icons.tsx`
- aparecen en `contact-form.tsx` y secciones de contacto

#### `public/icons/services/`
Íconos temáticos de servicios.

- `code.svg`, desarrollo
- `consulting.svg`, consultoría
- `idea.svg`, idea o descubrimiento
- `spark.svg`, innovación o impulso
- `support.svg`, soporte
- `team.svg`, equipo

Cómo se relacionan:
- `src/components/ui/icons.tsx` los convierte en componentes
- `src/features/marketing/components/services.tsx` y otros los renderizan

#### `public/icons/social/`
Íconos de redes sociales.

- `facebook.svg`
- `instagram.svg`
- `linkedin.svg`
- `tiktok.svg`
- `x.svg`

Cómo se relacionan:
- `Footer` y `Header` usan `SocialIcon`
- la info viene de `src/features/marketing/data/site.ts`

### `public/images/`

#### `public/images/brand/`
Branding, logos, clientes y marcas tecnológicas.

- `client-3.png`, logo de cliente
- `client-4.png`, logo de cliente
- `client-aurumtage.png`, logo de cliente
- `client-disver.png`, logo de cliente
- `client-goser.svg`, logo de cliente
- `client-larezza.svg`, logo de cliente
- `client-master-clean.svg`, logo de cliente
- `client-nutrition-lab.png`, logo de cliente
- `client-sittycia.png`, logo de cliente
- `client-valhui.png`, logo de cliente
- `codenium-footer.svg`, logo para footer
- `codenium-header.svg`, logo para header
- `logo-pink.webp`, variante de marca
- `logo-white.webp`, variante de marca
- `tech-adobe.svg`, marca de referencia
- `tech-apple.svg`, marca de referencia
- `tech-meta.svg`, marca de referencia
- `tech-netflix.svg`, marca de referencia
- `tech-nvidia.svg`, marca de referencia
- `tech-openai.svg`, marca de referencia
- `tech-oracle.svg`, marca de referencia
- `tech-samsung.svg`, marca de referencia

Cómo se relacionan:
- `BrandLogo` y componentes de logos las usan
- sirven para hero, social proof y branding

#### `public/images/marketing/`
Imágenes usadas por las páginas públicas.

- `about-story.webp`, historia o storytelling
- `company.webp`, imagen de empresa
- `faq.webp`, imagen de FAQ
- `gallery-1.webp` a `gallery-4.webp`, galería visual
- `hero-about.webp`, hero de About
- `hero-contact.webp`, hero de Contact
- `hero-home.webp`, hero principal
- `hero-plans.webp`, hero de planes
- `timeline-1.webp` a `timeline-7.webp`, imágenes de timeline

Cómo se relacionan:
- `Hero`, `Benefits`, `Faq`, `Timeline`, `Story` y páginas de marketing

#### `public/images/portfolio/`
Assets para portafolio.

- `chess-iq-logo.png`, logo de caso o proyecto

Cómo se relaciona:
- `portfolio-showcase.tsx`
- `portfolio.ts`

---

## `scripts/`

Scripts Node/TypeScript para automatizar tareas locales.

### `scripts/build-next.ts`
Lanza el proceso de build de Next.js.

Qué hace:
- sirve como wrapper de compilación
- permite encapsular lógica previa o posterior si se amplía

Cómo se relaciona:
- `package.json` puede invocarlo para construir el proyecto

### `scripts/clear-build-cache.ts`
Limpia caché del build.

Qué hace:
- borra caché local de compilación para evitar residuos corruptos
- útil cuando Next o el build quedan en estado raro

Cómo se relaciona:
- se usa antes del build
- evita errores fantasmas por archivos compilados viejos

### `scripts/free-port-3000.ts`
Libera el puerto 3000.

Qué hace:
- mata el proceso que esté ocupando ese puerto
- ayuda a levantar el dev server sin cerrar procesos manualmente

Cómo se relaciona:
- se ejecuta antes de `next dev`
- está pensado para flujo local en Windows

### `scripts/start-next.ts`
Arranca Next.js de forma controlada.

Qué hace:
- encapsula el arranque
- deja espacio para personalizar el inicio sin tocar comandos largos

Cómo se relaciona:
- forma parte del flujo local de ejecución

---

## `src/`

---

## `src/app/`

Es la capa de enrutamiento de Next.js App Router. Aquí están layouts, páginas y endpoints HTTP.

### `src/app/globals.css`
Hoja de estilos global.

Qué hace:
- define variables, reset parcial y estilos base
- sostiene la apariencia general de la app

Cómo se relaciona:
- se carga desde `src/app/layout.tsx`
- afecta todo el árbol de componentes

### `src/app/layout.tsx`
Layout raíz de toda la aplicación.

Qué hace:
- registra metadata global
- carga tipografía local
- envuelve toda la app

Cómo se relaciona:
- es el punto superior del árbol
- aplica a marketing, auth y dashboard

---

### `src/app/(auth)/`

Grupo de rutas para autenticación.

#### `src/app/(auth)/layout.tsx`
Layout exclusivo de auth.

Qué hace:
- define el contenedor visual de login, registro y recuperación
- separa auth del resto de layouts públicos

#### `src/app/(auth)/forgot-password/page.tsx`
Página para recuperar contraseña.

Qué hace:
- monta la UI del formulario de recuperación

Cómo se relaciona:
- usa componentes de `src/features/auth/components`
- hoy la validación es más visual que backend real

#### `src/app/(auth)/login/page.tsx`
Página de login.

Qué hace:
- muestra acceso de usuario
- dispara el flujo de autenticación

Cómo se relaciona:
- usa `LoginForm`
- termina hablando con `auth-service.ts` y la API de login

#### `src/app/(auth)/register/page.tsx`
Página de registro.

Qué hace:
- captura datos de alta
- conecta con el flujo de register

Cómo se relaciona:
- usa `RegisterForm`
- termina pegando al endpoint de registro

---

### `src/app/(marketing)/`

Grupo de rutas públicas.

#### `src/app/(marketing)/layout.tsx`
Layout público de marketing.

Qué hace:
- envuelve las páginas públicas con shell de marketing

Cómo se relaciona:
- delega en `MarketingShell`
- usa header, footer y botón flotante

#### `src/app/(marketing)/page.tsx`
Home pública.

Qué hace:
- arma la landing principal
- monta hero, servicios, logos, beneficios y strip de contacto

Cómo se relaciona:
- consume `home.ts`
- usa `MarketingShell`

#### `src/app/(marketing)/about/page.tsx`
Página About.

Qué hace:
- monta historia, misión, visión y timeline de la empresa

Cómo se relaciona:
- consume `about.ts`
- usa componentes de marketing

#### `src/app/(marketing)/contact/page.tsx`
Página Contact.

Qué hace:
- expone el formulario de contacto general y datos de contacto

Cómo se relaciona:
- usa `ContactForm`
- envía a `/api/forms`

#### `src/app/(marketing)/legals/privacy/page.tsx`
Alias o reexport de privacidad legal.

Qué hace:
- reaprovecha la página de privacidad existente
- evita duplicar contenido

#### `src/app/(marketing)/plans/page.tsx`
Página de planes.

Qué hace:
- renderiza hero, pricing, servicios por plan y CTA

Cómo se relaciona:
- consume `plans.ts`
- puede alimentar el flujo de cotización por selección

#### `src/app/(marketing)/portfolio/page.tsx`
Página de portafolio.

Qué hace:
- muestra casos o tarjetas de trabajo

Cómo se relaciona:
- consume `portfolio.ts`
- usa `PortfolioShowcase`

#### `src/app/(marketing)/privacy/page.tsx`
Página de privacidad.

Qué hace:
- muestra texto de privacidad y metadatos asociados

Cómo se relaciona:
- consume `privacy.ts`
- usa `PrivacyCopy`

#### `src/app/(marketing)/quote/page.tsx`
Página del cotizador.

Qué hace:
- monta hero del quote y el builder principal

Cómo se relaciona:
- es la entrada pública al módulo `features/quotes`
- recibe contexto de selección por query params

---

### `src/app/api/`

Endpoints HTTP.

#### `src/app/api/auth/login/route.ts`
Endpoint de login.

Qué hace:
- recibe email y password
- busca usuario en Prisma
- devuelve `userId`, `role`, `name`, `email`

Problema:
- compara contraseña en texto plano
- instancia `PrismaClient` directo

Cómo se relaciona:
- lo consume el frontend de auth
- depende del schema `User`

#### `src/app/api/auth/register/route.ts`
Endpoint de registro.

Qué hace:
- valida datos mínimos
- crea usuario en Prisma con rol cliente

Problema:
- guarda password sin hash real
- también crea `PrismaClient` local

Cómo se relaciona:
- lo consume el formulario de registro
- persiste sobre el modelo `User`

#### `src/app/api/chat/route.ts`
Endpoint del chatbot.

Qué hace:
- recibe mensaje y contexto reciente
- construye prompt con `chatbotContext`
- llama a la API de Groq
- devuelve la respuesta del modelo

Cómo se relaciona:
- usa `src/features/marketing/data/chatbot-context.ts`
- depende de `GROQ_API_KEY`

#### `src/app/api/dashboard/notify/route.ts`
Endpoint de notificaciones del dashboard.

Qué hace:
- recibe un payload tipado
- valida el tipo de evento
- dispara correos según evento:
  - mensaje de proyecto
  - solicitud de cambio
  - entregable
  - asignación de cotización
  - alta de PM

Cómo se relaciona:
- consume `src/lib/email-payloads.ts`
- delega a `src/server/email/index.ts`

#### `src/app/api/forms/route.ts`
Endpoint para leads públicos.

Qué hace:
- recibe formularios públicos de contacto o quote
- valida datos
- manda correo al lead y a la empresa

Cómo se relaciona:
- lo usa `ContactForm`
- usa `src/server/email`

#### `src/app/api/health/route.ts`
Healthcheck simple.

Qué hace:
- responde si la app está viva
- indica si hay `DATABASE_URL`

Cómo se relaciona:
- útil para monitoreo básico

#### `src/app/api/quotes/route.ts`
Endpoint para crear cotizaciones.

Qué hace:
- recibe body con datos de quote
- crea registro `Quote` en Prisma

Problemas:
- validación mínima
- cliente Prisma local
- no usa `db.ts`
- no crea items
- no alinea todavía bien UI y enums de base

#### `src/app/api/users/route.ts`
Endpoint para listar usuarios.

Qué hace:
- lee todos los usuarios desde Prisma

Cómo se relaciona:
- `workspace-store.tsx` lo usa para hidratar dashboard

---

### `src/app/dashboard/`

Rutas del panel interno.

#### `src/app/dashboard/layout.tsx`
Layout del dashboard.

Qué hace:
- envuelve la zona privada
- monta el provider del workspace

Cómo se relaciona:
- depende de `DashboardWorkspaceProvider`

#### `src/app/dashboard/[role]/[[...section]]/page.tsx`
Página dinámica principal del dashboard.

Qué hace:
- resuelve rol
- valida sección
- renderiza el panel correcto

Cómo se relaciona:
- `routes.ts` valida rol y sección
- `view.tsx` decide qué componente mostrar
- `DashboardShell` envuelve todo

---

## `src/components/`

Componentes transversales, no de un dominio específico.

### `src/components/layout/`

#### `footer.tsx`
Footer global.

Qué hace:
- muestra navegación secundaria, contacto y redes

Cómo se relaciona:
- consume `site.ts`
- lo usa `MarketingShell`

#### `header.tsx`
Header global público.

Qué hace:
- muestra navegación principal
- controla menú móvil
- abre overlay de acceso con `AuthPanel`

Cómo se relaciona:
- consume `site.ts`
- usa `AuthPanel`
- lo usa `MarketingShell`

### `src/components/ui/`

#### `form-controls.tsx`
Controles reutilizables de formulario.

Qué hace:
- exporta `TextField` y `TextAreaField`

Cómo se relaciona:
- los usan auth, marketing, quotes y dashboard

#### `icons.tsx`
Capa de abstracción para íconos.

Qué hace:
- mezcla íconos SVG propios, logos y algunos de `lucide-react`
- expone iconos de menú, cierre, marca, contacto, servicio y social

Cómo se relaciona:
- se usa en header, footer, contact, services y otros componentes visuales

---

## `src/features/`

Módulos por dominio.

---

### `src/features/auth/`

#### `components/auth-fields.tsx`
Campos reutilizables del módulo auth.

Qué hace:
- encapsula inputs y mensajes de estado para login, register y forgot password

#### `components/auth-panel.tsx`
Panel unificado de autenticación.

Qué hace:
- sirve como contenedor que cambia entre login, register y recuperación

Cómo se relaciona:
- lo usa el overlay del `Header`

#### `components/forgot-password-form.tsx`
Formulario de recuperación.

Qué hace:
- valida email y muestra mensaje de resultado

Cómo se relaciona:
- usa `auth-service.ts`

#### `components/login-form.tsx`
Formulario de login.

Qué hace:
- captura credenciales
- navega según rol
- escribe sesión local

Cómo se relaciona:
- usa `auth-service.ts`
- usa `session-store.ts`

#### `components/register-form.tsx`
Formulario de registro.

Qué hace:
- captura datos de alta
- valida y escribe sesión local tras registro

Cómo se relaciona:
- usa `auth-service.ts`
- usa `session-store.ts`

#### `components/session-status.tsx`
Pequeño estado visual de sesión.

Qué hace:
- lee sesión guardada y la presenta

#### `lib/auth-pages.ts`
Config visual de páginas auth.

Qué hace:
- centraliza textos, hero o contenido relacionado a auth

#### `lib/auth-service.ts`
Servicio de auth del lado cliente, todavía híbrido.

Qué hace:
- valida login
- valida register
- valida forgot password
- resuelve ruta de dashboard por rol

Problema:
- sigue apoyándose en mocks

#### `lib/session-store.ts`
Persistencia local de sesión mock.

Qué hace:
- lee, guarda y limpia sesión en `localStorage`

Cómo se relaciona:
- login y register lo usan para simular sesión

---

### `src/features/dashboard/`

#### `components/admin-deliverables-panel.tsx`
Panel admin para entregables.

#### `components/admin-overview-panel.tsx`
Panel admin de métricas generales.

#### `components/admin-payments-panel.tsx`
Panel admin de pagos.

#### `components/admin-quote-panel.tsx`
Panel admin de cotizaciones.

Qué hace:
- lista quotes visibles
- permite asignar PM
- permite convertir quote a proyecto
- dispara correos de asignación

Cómo se relaciona:
- usa `workspace-store`
- usa `selectors`
- usa `sendDashboardNotification`

#### `components/admin-team-panel.tsx`
Panel admin de equipo.

Qué hace:
- gestiona usuarios o PMs desde el dashboard visual

#### `components/change-request-panel.tsx`
Panel para solicitudes de cambio.

Qué hace:
- crea o muestra cambios sobre proyecto

#### `components/client-documents-panel.tsx`
Panel de documentos del cliente o PM.

#### `components/client-milestones-panel.tsx`
Panel de hitos del cliente.

#### `components/client-overview-panel.tsx`
Panel overview del cliente.

#### `components/dashboard-shell.tsx`
Marco del dashboard.

Qué hace:
- dibuja navegación lateral, cabecera y layout interno

#### `components/dashboard-ui.tsx`
Primitive UI del dashboard.

Qué hace:
- exporta bloques reutilizables:
  - tarjetas
  - headings
  - data rows
  - proveedor visual

#### `components/payments-panel.tsx`
Panel de pagos visible por rol.

#### `components/pm-overview-panel.tsx`
Overview del PM.

#### `components/pm-status-panel.tsx`
Panel de estado o hitos del PM.

#### `components/profile-panel.tsx`
Panel de perfil.

#### `components/project-chat-panel.tsx`
Panel de mensajería del proyecto.

Qué hace:
- permite ver y crear mensajes asociados a proyecto

#### `components/sidebar-actions.tsx`
Acciones laterales del dashboard.

Qué hace:
- controla navegación o acciones rápidas desde la barra lateral

---

#### `lib/recipients.ts`
Resolvedor de correos por usuario, proyecto o quote.

Qué hace:
- ayuda a saber a quién enviar notificaciones

#### `lib/routes.ts`
Mapa y validación de roles y secciones.

Qué hace:
- valida rol
- valida sección
- calcula sección por defecto

Cómo se relaciona:
- depende de `dashboardNav` en mocks

#### `lib/selectors.ts`
Selectores de datos del dashboard.

Qué hace:
- filtra por rol
- obtiene quote, proyecto, usuario y colecciones visibles
- calcula métricas derivadas

Cómo se relaciona:
- opera sobre el estado del `workspace-store`

#### `lib/view.tsx`
Router de componentes del dashboard.

Qué hace:
- dado un rol y una sección, decide qué panel renderizar

#### `lib/workspace-store.tsx`
Store principal del dashboard.

Qué hace:
- mantiene usuarios, quotes, projects, messages, milestones, payments, documents y changeRequests
- hidrata usuarios desde `/api/users`
- guarda estado en `sessionStorage`
- ejecuta acciones de negocio en cliente:
  - aceptar quote
  - crear proyecto
  - marcar hitos
  - agregar mensajes
  - agregar documentos
  - cambiar estados

Problema:
- es una simulación avanzada, no un backend real

---

### `src/features/marketing/`

#### `components/benefits.tsx`
Sección visual de beneficios.

#### `components/contact-form.tsx`
Formulario público reutilizable.

Qué hace:
- sirve tanto para contacto como para cotización
- arma payload con hidden fields
- envía a `/api/forms`

Cómo se relaciona:
- es la puerta de entrada de leads públicos
- la usa también el quote builder

#### `components/cta.tsx`
Bloque CTA.

#### `components/faq.tsx`
Preguntas frecuentes visuales.

#### `components/hero.tsx`
Hero reutilizable para páginas públicas.

#### `components/logos.tsx`
Muestra logos o social proof.

#### `components/marketing-shell.tsx`
Shell completo del sitio público.

Qué hace:
- monta header
- page shell
- footer
- botón de WhatsApp

#### `components/page-shell.tsx`
Wrapper cliente para animaciones de aparición.

Qué hace:
- ejecuta `useReveal()`

#### `components/portfolio-highlights.tsx`
Bloque corto de highlights de portafolio.

#### `components/portfolio-showcase.tsx`
Muestra tarjetas o piezas del portafolio.

#### `components/pricing.tsx`
Tarjetas de pricing.

Qué hace:
- permite iniciar el flujo hacia cotización con contexto de plan
- guarda perfil y selección

Cómo se relaciona:
- usa `plan-profile.ts`
- usa `quote-selection.ts`

#### `components/privacy-copy.tsx`
Contenido textual de privacidad.

#### `components/services-pricing.tsx`
Tabla o tarjetas de servicios con acción hacia cotización o contacto.

#### `components/services.tsx`
Bloque de servicios.

Qué hace:
- renderiza servicios y permite seleccionar uno para iniciar flujo

#### `components/story.tsx`
Bloque de historia o relato de marca.

#### `components/timeline.tsx`
Timeline visual.

#### `components/whatsapp-button.tsx`
Botón flotante de WhatsApp o contacto rápido.

---

#### `data/about.ts`
Contenido estático de la página about.

#### `data/chatbot-context.ts`
Prompt base del chatbot.

Qué hace:
- le da contexto comercial a Groq

#### `data/contact.ts`
Contenido de la página contact y FAQ asociadas.

#### `data/home.ts`
Contenido de la home.

#### `data/plans.ts`
Contenido de planes y servicios.

#### `data/portfolio.ts`
Contenido del portafolio.

#### `data/privacy.ts`
Contenido legal de privacidad.

#### `data/quote.ts`
Contenido de la página quote.

#### `data/site.ts`
Config central del sitio.

Qué hace:
- nav
- footer
- datos de contacto
- redes
- branding textual

Cómo se relaciona:
- header, footer y varias páginas la usan

#### `lib/metadata.ts`
Factory de metadata para páginas.

#### `types/index.ts`
Tipos de marketing.

Qué hace:
- centraliza iconos, variantes de header, links y shapes de contenido

---

### `src/features/messages/`

#### `components/message-list.tsx`
Lista visual de mensajes.

Cómo se relaciona:
- usa el store del dashboard y selectors
- sirve como vista derivada del módulo de mensajes

---

### `src/features/projects/`

#### `components/project-list.tsx`
Lista visual de proyectos.

Cómo se relaciona:
- usa selectors del dashboard
- presenta proyectos filtrados por rol

---

### `src/features/quotes/`

#### `components/quote-builder.tsx`
Orquestador del cotizador.

Qué hace:
- lee selección de plan o servicio desde URL/localStorage
- arma el draft de quote
- calcula estimado
- genera hidden fields
- monta:
  - `QuoteEstimator`
  - `QuoteSummaryCard`
  - `ContactForm`

Es el archivo más importante del flujo público de cotización.

#### `components/quote-estimator.tsx`
Formulario técnico del cotizador.

Qué hace:
- deja elegir tipo de proyecto, objetivo, infraestructura, timeline y módulos
- va actualizando el draft

Cómo se relaciona:
- usa `estimate.ts`
- usa `content.ts`
- usa mocks de catálogo

#### `components/quote-list.tsx`
Lista visual de quotes, más ligada al dashboard.

#### `components/quote-summary-card.tsx`
Resumen lateral o final del draft.

Qué hace:
- presenta selección actual, capacidades y estimado

Cómo se relaciona:
- consume `estimate.ts`
- consume `content.ts`

#### `lib/content.ts`
Capa de traducción del cotizador.

Qué hace:
- define secciones del quote
- mapea módulos seleccionados a contenido legible
- traduce infraestructura y resume secciones

#### `lib/estimate.ts`
Motor actual del cotizador.

Qué hace:
- calcula rango de build
- calcula rango mensual
- calcula tiempo estimado
- da viabilidad básica
- formatea moneda

Cómo se relaciona:
- depende de `quoteProjectTypes` y `quoteModules` en mocks
- lo usan builder, estimator, summary y panels de dashboard

---

### `src/features/users/`

#### `components/user-list.tsx`
Lista visual de usuarios.

Cómo se relaciona:
- deriva del panel de equipo admin

---

## `src/hooks/`

### `src/hooks/use-reveal.ts`
Hook de animaciones de aparición.

Qué hace:
- usa GSAP para animar elementos al entrar en viewport

Cómo se relaciona:
- `PageShell` lo ejecuta en páginas públicas

---

## `src/lib/`

Es la capa de utilidades y tipos. Hoy también contiene demasiada lógica de producto temporal.

### `src/lib/client-api.ts`
Cliente HTTP del frontend.

Qué hace:
- encapsula POST a `/api/forms`
- encapsula POST a `/api/dashboard/notify`

#### Relación
Lo usan el formulario de contacto y algunos paneles del dashboard.

### `src/lib/db.ts`
Singleton de Prisma Client.

Qué hace:
- crea un cliente Prisma compartido
- evita múltiples instancias en desarrollo

#### Relación
Debería ser la única puerta a Prisma desde código backend.

### `src/lib/email-payloads.ts`
Contratos de payload para endpoints de correo y notificaciones.

Qué hace:
- define tipos de lead público
- define tipos de notificaciones internas

### `src/lib/env.ts`
Reader tipado de variables de entorno.

Qué hace:
- da defaults razonables
- expone `requireServerEnv`

Cómo se relaciona:
- lo usan DB, health y email config

### `src/lib/plan-profile.ts`
Persistencia del perfil de plan.

Qué hace:
- guarda si el usuario viene por perfil `personal` o `business`

Cómo se relaciona:
- pricing y quote builder lo usan

### `src/lib/presenters.ts`
Funciones de presentación de estados y fechas.

Qué hace:
- formatea fechas
- traduce estados a labels legibles

Cómo se relaciona:
- dashboard y auth lo usan para UI

### `src/lib/quote-selection.ts`
Persistencia y parsing de selección inicial de quote.

Qué hace:
- genera hrefs hacia `/quote` o `/contact`
- guarda y recupera la selección de plan o servicio
- interpreta query params

Cómo se relaciona:
- pricing, services y quote builder lo usan

### `src/lib/utils.ts`
Helpers generales.

#### `cn`
Combina clases CSS. Base típica para Tailwind.

---

### `src/lib/mocks/`

Esta carpeta hoy sostiene mucho comportamiento.

#### `auth.ts`
Cuentas mock para auth demo.

#### `catalogs.ts`
Catálogos clave del sistema.

Qué hace:
- tipos de proyecto
- módulos del cotizador
- opciones de infraestructura
- navegación del dashboard
- permisos por rol

Es uno de los archivos más influyentes del proyecto actual.

#### `change-requests.ts`
Solicitudes de cambio simuladas.

#### `index.ts`
Barrel file de mocks.

Qué hace:
- reexporta todos los mocks

#### `messages.ts`
Mensajes simulados.

#### `project-meta.ts`
Metadatos de proyecto simulados.

Qué hace:
- milestones
- documents
- payments

#### `projects.ts`
Proyectos simulados.

#### `quotes.ts`
Cotizaciones simuladas.

#### `users.ts`
Usuarios simulados.

---

### `src/lib/types/`

#### `domain.ts`
Tipos del dominio frontend.

Qué hace:
- define roles
- draft de quote
- records de proyecto, mensaje, pago, documento, usuario, cambio
- claves internas de módulo y proyecto

Problema:
- representa una realidad frontend que no coincide del todo con Prisma

---

## `src/server/`

Es la semilla de una capa backend ordenada.

### `src/server/email/`

#### `config.ts`
Configuración de correo.

Qué hace:
- resuelve remitente
- resuelve inboxes de empresa
- resuelve email visible al público
- valida variables mínimas

#### `index.ts`
Barrel y capa pública del módulo de correo.

Qué hace:
- expone funciones como:
  - confirmaciones de contacto
  - confirmaciones de quote
  - notificaciones internas
  - notificaciones del dashboard

#### `send-email.ts`
Adaptador de envío.

Qué hace:
- inicializa Resend
- intenta enviar
- aplica fallback si falla el remitente principal

#### `templates/dashboard-events.ts`
Plantillas para eventos internos de dashboard.

Qué hace:
- construye subject, text y html para:
  - mensajes
  - cambios
  - entregables
  - asignaciones
  - cuentas PM

#### `templates/public-leads.ts`
Plantillas para formularios públicos.

Qué hace:
- correo a empresa
- correo de confirmación al lead

#### `templates/shared.ts`
Helpers HTML y text para correos.

Qué hace:
- escapa HTML
- arma tablas key-value
- envuelve layout base de email

---

### `src/server/repositories/`

#### `contact-repository.ts`
Repositorio de leads de contacto.

Qué hace:
- usa `db.ts`
- encapsula acceso a datos de leads

#### `index.ts`
Barrel file de repositorios.

---

### `src/server/services/`

#### `contact-service.ts`
Servicio del dominio contacto.

Qué hace:
- delega a repositorio para listar leads

#### `index.ts`
Barrel file de servicios.

---

# Cómo se relaciona todo el flujo principal

## Flujo de marketing y cotización
1. El usuario entra a una página pública en `src/app/(marketing)`.
2. Selecciona un plan o servicio desde `pricing.ts` o `services.ts`.
3. Esa selección se guarda en `quote-selection.ts` y `plan-profile.ts`.
4. Entra a `/quote`.
5. `quote-builder.tsx` reconstruye el contexto.
6. `quote-estimator.tsx` arma el draft técnico.
7. `estimate.ts` calcula rangos con base en `lib/mocks/catalogs.ts`.
8. `quote-summary-card.tsx` muestra el resumen.
9. `contact-form.tsx` envía el lead a `/api/forms`.
10. `/api/forms` usa `src/server/email` para mandar correos.

## Flujo de auth
1. Login y register se presentan desde páginas en `(auth)`.
2. Los formularios usan `auth-service.ts`.
3. Ese flujo todavía mezcla validación mock y uso de API real.
4. Los endpoints auth guardan y leen desde Prisma.

## Flujo de dashboard
1. El usuario entra a `/dashboard/[role]/...`.
2. `page.tsx` resuelve la sección.
3. `DashboardShell` monta la UI.
4. `workspace-store.tsx` hidrata usuarios desde `/api/users`.
5. El resto de entidades sigue más del lado mock o sessionStorage.
6. Los paneles usan `selectors.ts` para derivar vistas.
7. Algunas acciones disparan `/api/dashboard/notify`.

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
Todo debería pasar por `src/lib/db.ts`.

## 5. Completar `src/server/`
Ya tienes la intención correcta. Solo falta que auth, quotes y users la usen de verdad.

## 6. Reducir estado de negocio en `workspace-store.tsx`
Ese store debería terminar siendo:
- cache de UI
- selección local
- optimistic state

No la fábrica principal de proyectos y operaciones.
