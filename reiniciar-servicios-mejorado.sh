#!/bin/bash

# Script mejorado para reiniciar los servicios Docker después de los cambios

echo "===== Reiniciando servicios Docker ====="

# Cambiar al directorio donde está el archivo docker-compose.yml
cd "$(dirname "$0")/docker"

# Verificar que estamos en el directorio correcto
if [ ! -f "docker-compose.yml" ]; then
    echo "Error: No se encontró el archivo docker-compose.yml en el directorio actual"
    exit 1
fi

# Detener los contenedores
echo "\n[1/5] Deteniendo contenedores..."
docker-compose down

# Limpiar caché de Docker
echo "\n[2/5] Limpiando caché de Docker..."
docker system prune -f

# Reconstruir las imágenes
echo "\n[3/5] Reconstruyendo imágenes..."
docker-compose build --no-cache nginx client

# Reiniciar los contenedores
echo "\n[4/5] Reiniciando contenedores..."
docker-compose up -d

# Esperar a que los servicios estén listos
echo "\n[5/5] Esperando a que los servicios estén listos..."
sleep 10

# Verificar el estado de los servicios
echo "\n===== Estado de los servicios ====="
docker-compose ps

# Mostrar los logs de nginx y client para verificar
echo "\n===== Últimos logs de nginx ====="
docker-compose logs --tail=20 nginx

echo "\n===== Últimos logs del cliente ====="
docker-compose logs --tail=20 client

echo "\n===== Servicios reiniciados correctamente ====="
echo "Ahora deberías poder acceder a la página de usuarios en https://globalsolarco.shop/usuarios"
echo "Si persiste el problema, revisa los logs completos con: docker-compose logs -f"

# Instrucciones para probar
echo "\n===== Instrucciones para probar ====="
echo "1. Abre un navegador en modo incógnito"
echo "2. Navega a https://globalsolarco.shop"
echo "3. Inicia sesión con tu cuenta"
echo "4. Verifica que puedas acceder a https://globalsolarco.shop/usuarios"
echo "5. Si sigues teniendo problemas, revisa los logs con: docker-compose logs -f"