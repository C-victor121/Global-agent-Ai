# Script de PowerShell para configurar SSL con Let's Encrypt para globalsolarco.shop
# Este script debe ejecutarse después de que el dominio apunte a la IP del servidor

Write-Host "=== Configuración SSL para globalsolarco.shop ===" -ForegroundColor Green
Write-Host "Asegúrate de que el dominio globalsolarco.shop apunte a tu IP 107.20.220.167" -ForegroundColor Yellow
Write-Host ""

# Verificar que el dominio resuelve correctamente
Write-Host "Verificando resolución DNS..." -ForegroundColor Cyan
try {
    $dnsResult = Resolve-DnsName globalsolarco.shop -Type A
    Write-Host "Dominio resuelve a: $($dnsResult.IPAddress)" -ForegroundColor Green
} catch {
    Write-Host "Error al resolver el dominio. Verifica la configuración DNS." -ForegroundColor Red
}
Write-Host ""

# Crear directorios necesarios
Write-Host "Creando directorios para certificados..." -ForegroundColor Cyan
if (!(Test-Path "./certbot")) { New-Item -ItemType Directory -Path "./certbot" }
if (!(Test-Path "./certbot-webroot")) { New-Item -ItemType Directory -Path "./certbot-webroot" }

# Detener contenedores si están corriendo
Write-Host "Deteniendo contenedores..." -ForegroundColor Cyan
docker-compose down

# Construir y levantar solo nginx temporalmente para obtener certificados
Write-Host "Iniciando nginx temporal para verificación de dominio..." -ForegroundColor Cyan
docker-compose up --build -d nginx

# Esperar a que nginx esté listo
Write-Host "Esperando a que nginx esté listo..." -ForegroundColor Cyan
Start-Sleep -Seconds 10

# Obtener certificados SSL
Write-Host "Obteniendo certificados SSL de Let's Encrypt..." -ForegroundColor Cyan
$sslResult = docker-compose exec nginx /letsencrypt.sh

if ($LASTEXITCODE -eq 0) {
    Write-Host "¡Certificados SSL obtenidos exitosamente!" -ForegroundColor Green
    
    # Reiniciar todos los servicios
    Write-Host "Reiniciando todos los servicios..." -ForegroundColor Cyan
    docker-compose down
    docker-compose up -d
    
    Write-Host ""
    Write-Host "=== Configuración completada ===" -ForegroundColor Green
    Write-Host "Tu aplicación ahora está disponible en:" -ForegroundColor White
    Write-Host "- https://globalsolarco.shop (Principal)" -ForegroundColor Yellow
    Write-Host "- https://www.globalsolarco.shop (WWW)" -ForegroundColor Yellow
    Write-Host "- https://globalsolarco.shop/n8n (n8n - acceso restringido)" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Configuración de OAuth:" -ForegroundColor White
    Write-Host "- Google: https://globalsolarco.shop/api/auth/callback/google" -ForegroundColor Cyan
    Write-Host "- Facebook: https://globalsolarco.shop/api/auth/callback/facebook" -ForegroundColor Cyan
    Write-Host ""
} else {
    Write-Host "Error al obtener certificados SSL. Usando certificados auto-firmados." -ForegroundColor Red
    Write-Host "La aplicación funcionará pero los navegadores mostrarán advertencias de seguridad." -ForegroundColor Yellow
    
    # Reiniciar todos los servicios de todos modos
    docker-compose down
    docker-compose up -d
}

Write-Host "Para renovar certificados SSL en el futuro, ejecuta:" -ForegroundColor White
Write-Host "docker-compose exec nginx certbot renew" -ForegroundColor Cyan
Write-Host "docker-compose restart nginx" -ForegroundColor Cyan