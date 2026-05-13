#!/bin/bash
set -e

echo "🚀 Iniciando entorno de PRODUCCIÓN con Docker..."

# Verificar que existe el archivo de variables de entorno
if [ ! -f ".env.production" ]; then
  echo "❌ ERROR: No se encontró el archivo .env.production"
  echo "   Crea este archivo en el servidor con las credenciales reales."
  echo "   Consulta .env.example para ver qué variables se requieren."
  exit 1
fi

echo "✅ Archivo .env.production encontrado."

# Construir y levantar en modo detached (segundo plano)
docker compose up --build -d

echo ""
echo "✅ Contenedores desplegados correctamente."
echo "🌐 La aplicación está disponible en el puerto 23000"
echo "📋 Mostrando logs (pulsa Ctrl+C para salir, los contenedores seguirán activos):"
echo ""

# Mostrar logs en vivo
docker compose logs -f
