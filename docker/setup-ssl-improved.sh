#!/bin/bash

# Script mejorado para configurar SSL con Let's Encrypt para globalsolarco.shop
# Este script debe ejecutarse después de que el dominio apunte a la IP del servidor

set -e  # Salir si cualquier comando falla

echo "=== Configuración SSL Mejorada para globalsolarco.shop ==="
echo "Asegúrate de que el dominio globalsolarco.shop apunte a tu IP 107.20.220.167"
echo ""

# Función para verificar si un comando existe
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Verificar dependencias
echo "Verificando dependencias..."
if ! command_exists docker; then
    echo "Error: Docker no está instalado"
    exit 1
fi

if ! command_exists docker-compose; then
    echo "Error: Docker Compose no está instalado"
    exit 1
fi

# Verificar que el dominio resuelve correctamente
echo "Verificando resolución DNS..."
if command_exists nslookup; then
    nslookup globalsolarco.shop
else
    echo "nslookup no disponible, continuando..."
fi
echo ""

# Crear directorios necesarios con permisos correctos
echo "Creando directorios para certificados..."
mkdir -p ./certbot/conf
mkdir -p ./certbot/www
mkdir -p ./certbot/logs
sudo chown -R $USER:$USER ./certbot
chmod -R 755 ./certbot

# Detener contenedores si están corriendo
echo "Deteniendo contenedores existentes..."
docker-compose down --remove-orphans

# Limpiar volúmenes y contenedores huérfanos
echo "Limpiando recursos Docker..."
docker system prune -f

# Construir imágenes frescas
echo "Construyendo imágenes Docker..."
docker-compose build --no-cache nginx

# Levantar solo nginx para obtener certificados
echo "Iniciando nginx temporal para verificación de dominio..."
docker-compose up -d nginx

# Esperar a que nginx esté listo con verificación más robusta
echo "Esperando a que nginx esté listo..."
for i in {1..30}; do
    if docker-compose ps nginx | grep -q "Up"; then
        echo "Nginx container está corriendo"
        break
    fi
    echo "Intento $i/30: Esperando a que nginx inicie..."
    sleep 2
done

# Verificar que nginx esté respondiendo
echo "Verificando que nginx esté funcionando..."
sleep 5
for i in {1..10}; do
    if curl -f -s http://107.20.220.167 >/dev/null 2>&1; then
        echo "Nginx está respondiendo correctamente"
        break
    fi
    echo "Intento $i/10: Esperando respuesta de nginx..."
    sleep 3
done

# Verificar logs de nginx si hay problemas
echo "Verificando logs de nginx..."
docker-compose logs nginx | tail -20

# Obtener certificados SSL con manejo de errores mejorado
echo "Obteniendo certificados SSL de Let's Encrypt..."
if docker-compose exec -T nginx /letsencrypt.sh; then
    echo "¡Certificados SSL obtenidos exitosamente!"
    
    # Verificar que los certificados se crearon correctamente
    if docker-compose exec -T nginx test -f /etc/ssl/certs/globalsolarco.shop.crt; then
        echo "Certificados verificados correctamente"
    else
        echo "Advertencia: Los certificados no se encontraron en la ubicación esperada"
    fi
    
    # Reiniciar todos los servicios
    echo "Reiniciando todos los servicios..."
    docker-compose down
    sleep 5
    docker-compose up -d
    
    # Esperar a que todos los servicios estén listos
    echo "Esperando a que todos los servicios estén listos..."
    sleep 30
    
    # Verificar que HTTPS funciona
    echo "Verificando HTTPS..."
    for i in {1..5}; do
        if curl -f -s -k https://107.20.220.167 >/dev/null 2>&1; then
            echo "HTTPS está funcionando"
            break
        fi
        echo "Intento $i/5: Verificando HTTPS..."
        sleep 5
    done
    
    echo ""
    echo "=== Configuración completada exitosamente ==="
    echo "Tu aplicación está disponible en:"
    echo "- https://globalsolarco.shop (Principal)"
    echo "- https://www.globalsolarco.shop (WWW)"
    echo "- https://globalsolarco.shop/n8n (n8n - acceso restringido)"
    echo ""
    echo "Configuración de OAuth:"
    echo "- Google: https://globalsolarco.shop/api/auth/callback/google"
    echo "- Facebook: https://globalsolarco.shop/api/auth/callback/facebook"
    echo ""
else
    echo "Error al obtener certificados SSL. Usando certificados auto-firmados."
    echo "La aplicación funcionará pero los navegadores mostrarán advertencias de seguridad."
    
    # Mostrar logs para debugging
    echo "Logs de nginx para debugging:"
    docker-compose logs nginx | tail -50
    
    # Reiniciar todos los servicios de todos modos
    echo "Reiniciando servicios con certificados auto-firmados..."
    docker-compose down
    sleep 5
    docker-compose up -d
fi

echo ""
echo "Para renovar certificados SSL en el futuro, ejecuta:"
echo "docker-compose exec nginx certbot renew"
echo "docker-compose restart nginx"
echo ""
echo "Para ver logs en tiempo real:"
echo "docker-compose logs -f"
echo ""
echo "Para verificar el estado de los servicios:"
echo "docker-compose ps"