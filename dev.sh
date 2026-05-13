#!/bin/bash
set -e

echo "🚀 Iniciando entorno de desarrollo con Docker..."

# Asegurarse de que no haya contenedores huérfanos anteriores
docker compose -f docker-compose.dev.yml down

# Iniciar los contenedores construyéndolos de nuevo
docker compose -f docker-compose.dev.yml up --build

# El script quedará en el foreground viendo los logs de los contenedores
