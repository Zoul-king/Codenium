En este archivo se define la estructura general del proyecto, 
con una breve descripción del contenido dentro de las carpetas y archivos de la raíz.

Nota: La información es general sobre el contenido dentro de las carpetas.



# Build de Next.js
.next/
├── cache/                → Caché de compilación
├── server/               → Código backend compilado (API routes, SSR)
├── static/               → Archivos estáticos generados
├── trace/                → Información de ejecución
└── build-manifest.json   → Mapa interno de assets

´´´

#Dependencias
node_modules/
→ Librerías instaladas (React, Next, Prisma, etc.)

´´´

# Base de Datos
prisma/
├── schema.prisma         → Modelo completo de base de datos (usuarios, quotes, proyectos, etc.)
├── seed.ts               → Script para datos iniciales
└── migrations/           → Historial de cambios en la DB

Nota: seed.ts & migrations no se encuentrarán en tu copia local sin antes ejecutar comando prisma:migration

´´´

# Archivos Publicos
public/
├── images/               → Imágenes del sitio
├── icons/                → Íconos
└── favicon.ico           → Ícono del sitio

´´´

# Scripts Utilitarios
scripts/
├── clear-build-cache.ts  → Limpia caché antes de build

´´´

## Rutas y Backend
src/app/
├── (marketing)/          → Landing pública
├── (auth)/               → Login, register
├── (dashboard)/          → Panel por roles (admin, pm, client)
├── api/                  → Endpoints backend (quotes, auth, forms)
│   ├── auth/             → Login API real con Prisma
│   ├── quotes/           → Crear cotizaciones en DB
│   └── forms/            → Envío de formularios + emails
├── layout.tsx            → Layout global
├── page.tsx              → Página principal
└── globals.css           → Estilos globales


## Modulos Funcionales
src/features/
├── auth/
│   ├── components/       → Formularios login/register
│   ├── lib/              → Lógica mock de sesión/auth
│   └── types/            → Tipos de auth

├── quotes/
│   ├── components/       → Cotizador UI
│   ├── utils/            → Cálculo de precios
│   └── types/            → Tipos de cotización

├── dashboard/
│   ├── components/       → UI del panel
│   ├── lib/              → Lógica de navegación y estado
│   └── data/             → Datos mock del dashboard


## Utilidades y Base
src/lib/
├── prisma.ts             → Cliente de Prisma (conexión DB)
├── api-client.ts         → Wrapper para llamadas API
├── types/                → Tipos globales del sistema
├── mocks/                → Datos simulados (usuarios, catálogos)
├── utils.ts              → Funciones helper generales


## Logica Backend Real
src/server/
├── email/
│   ├── resend.ts         → Configuración de Resend
│   ├── templates/        → Plantillas de correo
│   └── services/         → Envío de emails

├── repositories/         → Acceso a datos (DB layer)
└── services/             → Lógica de negocio backend

´´´

# Archivos en la Raíz
.env                      → Variables de entorno (DB, Resend, etc.)
.env.local                → Variables locales
.env.production           → Variables para producción

.gitignore                → Archivos ignorados por Git

README.md                 → Documentación general (desactualizada vs código)

next.config.ts            → Configuración de Next.js

package.json              → Dependencias y scripts del proyecto
package-lock.json         → Versiones exactas de dependencias

tsconfig.json             → Configuración de TypeScript

postcss.config.js         → Configuración de PostCSS (Tailwind)
tailwind.config.ts        → Configuración de Tailwind CSS

eslint.config.mjs         → Reglas de linting

prisma.config.ts          → Configuración nueva de Prisma (reemplaza package.json)



