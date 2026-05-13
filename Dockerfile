# ==========================================
# Etapa 1: Dependencias Base
# ==========================================
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

# ==========================================
# Etapa 2: Builder
# ==========================================
FROM node:20-alpine AS builder
RUN apk add --no-cache openssl
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generar cliente de Prisma
RUN npx prisma generate

# IMPORTANTE: Deshabilitamos la telemetría de Next.js durante el build
ENV NEXT_TELEMETRY_DISABLED=1

# Compilar la aplicación
RUN npm run build

# ==========================================
# Etapa 3: Producción Runner
# ==========================================
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Configurar el directorio "public" si usas archivos estáticos
COPY --from=builder /app/public ./public

# Crear directorio para la db en caso de requerir SQLite u otros recursos locales
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Prisma: Se requieren para poder usar el cliente en producción
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
# Prisma binary y schema para poder correr migraciones al arrancar
COPY --from=builder /app/node_modules/prisma ./node_modules/prisma
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma

# Automáticamente usar los archivos standalone (requiere output: "standalone" en next.config.ts)
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Corre las migraciones pendientes y luego arranca la aplicación
# prisma migrate deploy es seguro en producción: solo aplica migraciones nuevas, nunca borra datos
CMD ["sh", "-c", "npx prisma migrate deploy && node server.js"]
