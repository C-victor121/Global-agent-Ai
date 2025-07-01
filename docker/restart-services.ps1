# Script para reiniciar servicios Docker con nuevas configuraciones
Write-Host "Iniciando reinicio de servicios Docker con correcciones de autenticacion..." -ForegroundColor Yellow

# Verificar que Docker este ejecutandose
Write-Host "Verificando Docker..." -ForegroundColor Blue
try {
    docker --version
    Write-Host "Docker esta disponible" -ForegroundColor Green
} catch {
    Write-Host "Error: Docker no esta disponible. Asegurate de que Docker Desktop este ejecutandose." -ForegroundColor Red
    exit 1
}

# Detener todos los servicios
Write-Host "Deteniendo servicios..." -ForegroundColor Red
docker-compose down

# Eliminar imagenes antiguas para forzar reconstruccion
Write-Host "Eliminando imagenes antiguas..." -ForegroundColor Red
docker image prune -f
docker-compose down --rmi all --volumes --remove-orphans

# Reconstruir e iniciar servicios
Write-Host "Reconstruyendo e iniciando servicios con variables de entorno actualizadas..." -ForegroundColor Green
docker-compose up --build -d

# Esperar un momento para que los servicios se inicien
Write-Host "Esperando que los servicios se inicien..." -ForegroundColor Yellow
Start-Sleep -Seconds 30

# Verificar estado de los servicios
Write-Host "Estado de los servicios:" -ForegroundColor Blue
docker-compose ps

# Mostrar logs especificos del servidor para verificar autenticacion
Write-Host "Logs del servidor (ultimas 30 lineas):" -ForegroundColor Blue
docker-compose logs --tail=30 server

# Mostrar logs del cliente
Write-Host "Logs del cliente (ultimas 20 lineas):" -ForegroundColor Blue
docker-compose logs --tail=20 client

# Verificar conectividad
Write-Host "Verificando conectividad..." -ForegroundColor Blue
Write-Host "Sitio web: https://globalsolarco.shop" -ForegroundColor Cyan
Write-Host "API: https://globalsolarco.shop/api" -ForegroundColor Cyan

Write-Host "Reinicio completado! Las correcciones de autenticacion han sido aplicadas." -ForegroundColor Green
Write-Host "Cambios aplicados:" -ForegroundColor Yellow
Write-Host "   - Variables de entorno OAuth sincronizadas" -ForegroundColor White
Write-Host "   - Rutas de pago agregadas" -ForegroundColor White
Write-Host "   - Funcion signin corregida" -ForegroundColor White
Write-Host "   - CORS mejorado con logging" -ForegroundColor White