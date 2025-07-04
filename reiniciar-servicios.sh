#!/bin/bash

# Script para reiniciar los servicios Docker después de los cambios

echo "===== Reiniciando servicios Docker ====="

# Cambiar al directorio donde está el archivo docker-compose.yml
cd "$(dirname "$0")/docker"

# Verificar que estamos en el directorio correcto
if [ ! -f "docker-compose.yml" ]; then
    echo "Error: No se encontró el archivo docker-compose.yml en el directorio actual"
    exit 1
fi

# Detener los contenedores
echo "\n[1/4] Deteniendo contenedores..."
docker-compose down

# Limpiar caché de Docker
echo "\n[2/4] Limpiando caché de Docker..."
docker system prune -f

# Reconstruir las imágenes
echo "\n[3/4] Reconstruyendo imágenes..."
docker-compose build --no-cache nginx

# Reiniciar los contenedores
echo "\n[4/4] Reiniciando contenedores..."
docker-compose up -d

# Verificar el estado de los servicios
echo "\n===== Estado de los servicios ====="
docker-compose ps

# Mostrar los logs de nginx para verificar
echo "\n===== Últimos logs de nginx ====="
docker-compose logs --tail=20 nginx

echo "\n===== Servicios reiniciados correctamente ====="
echo "Ahora deberías poder acceder a la página de usuarios en https://globalsolarco.shop/usuarios"
echo "Si persiste el problema, revisa los logs completos con: docker-compose logs -f"