#!/bin/bash

# Script de verificación de requisitos para SSL
# Ejecuta este script antes de setup-ssl.sh para verificar que todo esté listo

echo "=== Verificación de Requisitos SSL ==="
echo ""

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Función para mostrar resultados
show_result() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✓${NC} $2"
    else
        echo -e "${RED}✗${NC} $2"
        ERRORS=$((ERRORS + 1))
    fi
}

show_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
    WARNINGS=$((WARNINGS + 1))
}

ERRORS=0
WARNINGS=0

echo "1. Verificando dependencias del sistema..."

# Verificar Docker
if command -v docker >/dev/null 2>&1; then
    show_result 0 "Docker está instalado"
    
    # Verificar que Docker esté corriendo
    if docker info >/dev/null 2>&1; then
        show_result 0 "Docker está corriendo"
    else
        show_result 1 "Docker no está corriendo"
    fi
else
    show_result 1 "Docker no está instalado"
fi

# Verificar Docker Compose
if command -v docker-compose >/dev/null 2>&1; then
    show_result 0 "Docker Compose está instalado"
else
    show_result 1 "Docker Compose no está instalado"
fi

# Verificar curl
if command -v curl >/dev/null 2>&1; then
    show_result 0 "curl está disponible"
else
    show_result 1 "curl no está instalado"
fi

echo ""
echo "2. Verificando configuración de red..."

# Verificar resolución DNS
if nslookup globalsolarco.shop >/dev/null 2>&1; then
    IP=$(nslookup globalsolarco.shop | grep -A1 "Name:" | grep "Address:" | awk '{print $2}' | head -1)
    if [ "$IP" = "107.20.220.167" ]; then
        show_result 0 "DNS resuelve correctamente a 107.20.220.167"
    else
        show_result 1 "DNS resuelve a $IP, debería ser 107.20.220.167"
    fi
else
    show_result 1 "No se puede resolver globalsolarco.shop"
fi

# Verificar conectividad HTTP
if curl -f -s --connect-timeout 10 http://107.20.220.167 >/dev/null 2>&1; then
    show_result 0 "Puerto 80 (HTTP) es accesible"
else
    show_warning "Puerto 80 (HTTP) no responde (normal si nginx no está corriendo)"
fi

echo ""
echo "3. Verificando archivos de configuración..."

# Verificar que existe docker-compose.yml
if [ -f "docker-compose.yml" ]; then
    show_result 0 "docker-compose.yml existe"
else
    show_result 1 "docker-compose.yml no encontrado"
fi

# Verificar que existe .env
if [ -f ".env" ]; then
    show_result 0 ".env existe"
    
    # Verificar variables críticas en .env
    if grep -q "N8N_BASIC_AUTH_USER=" .env && grep -q "N8N_BASIC_AUTH_PASSWORD=" .env; then
        show_result 0 "Variables de N8N configuradas"
    else
        show_result 1 "Variables de N8N faltantes en .env"
    fi
    
    if grep -q "NEXTAUTH_SECRET=" .env; then
        show_result 0 "NEXTAUTH_SECRET configurado"
    else
        show_result 1 "NEXTAUTH_SECRET faltante en .env"
    fi
else
    show_result 1 ".env no encontrado"
fi

# Verificar nginx.conf
if [ -f "nginx.conf" ]; then
    show_result 0 "nginx.conf existe"
else
    show_result 1 "nginx.conf no encontrado"
fi

# Verificar nginx.Dockerfile
if [ -f "nginx.Dockerfile" ]; then
    show_result 0 "nginx.Dockerfile existe"
else
    show_result 1 "nginx.Dockerfile no encontrado"
fi

echo ""
echo "4. Verificando permisos y directorios..."

# Verificar permisos de escritura
if [ -w "." ]; then
    show_result 0 "Permisos de escritura en directorio actual"
else
    show_result 1 "Sin permisos de escritura en directorio actual"
fi

# Verificar si los directorios de certbot existen
if [ -d "./certbot" ]; then
    show_warning "Directorio certbot ya existe (se recreará)"
else
    show_result 0 "Directorio certbot listo para crear"
fi

echo ""
echo "5. Verificando recursos del sistema..."

# Verificar espacio en disco
DISK_USAGE=$(df . | tail -1 | awk '{print $5}' | sed 's/%//')
if [ "$DISK_USAGE" -lt 90 ]; then
    show_result 0 "Espacio en disco suficiente ($DISK_USAGE% usado)"
else
    show_result 1 "Poco espacio en disco ($DISK_USAGE% usado)"
fi

# Verificar memoria disponible
if command -v free >/dev/null 2>&1; then
    MEM_AVAILABLE=$(free -m | awk 'NR==2{printf "%.0f", $7*100/$2 }')
    if [ "$MEM_AVAILABLE" -gt 20 ]; then
        show_result 0 "Memoria suficiente disponible"
    else
        show_warning "Poca memoria disponible ($MEM_AVAILABLE%)"
    fi
fi

echo ""
echo "=== Resumen ==="

if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}✓ Todos los requisitos están cumplidos${NC}"
    echo "Puedes proceder con ./setup-ssl-improved.sh"
else
    echo -e "${RED}✗ Se encontraron $ERRORS errores críticos${NC}"
    echo "Corrige los errores antes de continuar"
fi

if [ $WARNINGS -gt 0 ]; then
    echo -e "${YELLOW}⚠ Se encontraron $WARNINGS advertencias${NC}"
    echo "Revisa las advertencias pero puedes continuar"
fi

echo ""
echo "Comandos útiles:"
echo "- Ver logs: docker-compose logs -f"
echo "- Limpiar Docker: docker system prune -f"
echo "- Verificar DNS: nslookup globalsolarco.shop"
echo "- Probar conectividad: curl -I http://107.20.220.167"

exit $ERRORS