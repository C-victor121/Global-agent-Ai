#!/bin/bash

# Script para configurar SSL con Let's Encrypt para globalsolarco.shop
# Este script debe ejecutarse después de que el dominio apunte a la IP del servidor

echo "=== Configuración SSL para globalsolarco.shop ==="
echo "Asegúrate de que el dominio globalsolarco.shop apunte a tu IP 107.20.220.167"
echo ""

# Verificar que el dominio resuelve correctamente
echo "Verificando resolución DNS..."
nslookup globalsolarco.shop
echo ""

# Crear directorios necesarios
echo "Creando directorios para certificados..."
mkdir -p ./certbot
mkdir -p ./certbot-webroot
sudo mkdir -p certbot/accounts
sudo mkdir -p certbot/live
sudo mkdir -p certbot/archive
sudo mkdir -p certbot-webroot


# Detener contenedores si están corriendo
echo "Deteniendo contenedores..."
docker-compose down

# Construir y levantar solo nginx temporalmente para obtener certificados
echo "Iniciando nginx temporal para verificación de dominio..."
docker-compose up --build -d nginx

# Esperar a que nginx esté listo
echo "Esperando a que nginx esté listo..."
sleep 15

# Verificar que nginx esté respondiendo
echo "Verificando que nginx esté funcionando..."
for i in {1..5}; do
    if curl -f http://107.20.220.167 >/dev/null 2>&1; then
        echo "Nginx está funcionando correctamente"
        break
    fi
    echo "Intento $i/5: Esperando a que nginx responda..."
    sleep 5
done

# Obtener certificados SSL
echo "Obteniendo certificados SSL de Let's Encrypt..."
docker-compose exec nginx /letsencrypt.sh

if [ $? -eq 0 ]; then
    echo "¡Certificados SSL obtenidos exitosamente!"
    
    # Reiniciar todos los servicios
    echo "Reiniciando todos los servicios..."
    docker-compose down
    docker-compose up -d
    
    echo ""
    echo "=== Configuración completada ==="
    echo "Tu aplicación ahora está disponible en:"
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
    
    # Reiniciar todos los servicios de todos modos
    docker-compose down
    docker-compose up -d
fi

echo "Para renovar certificados SSL en el futuro, ejecuta:"
echo "docker-compose exec nginx certbot renew"
echo "docker-compose restart nginx"