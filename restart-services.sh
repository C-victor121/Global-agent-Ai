#!/bin/bash

# Script para reiniciar los servicios Docker después de los cambios

echo "Reiniciando servicios Docker..."

# Cambiar al directorio donde está el archivo docker-compose.yml
cd "$(dirname "$0")/docker"

# Detener los contenedores
echo "Deteniendo contenedores..."
docker-compose down

# Reconstruir y reiniciar los contenedores
echo "Reconstruyendo y reiniciando contenedores..."
docker-compose up -d --build

echo "Servicios reiniciados correctamente."
echo "Ahora deberías poder acceder a la página de usuarios en https://globalsolarco.shop/usuarios"