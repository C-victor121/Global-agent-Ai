# Script para reiniciar los servicios Docker después de los cambios

Write-Host "Reiniciando servicios Docker..." -ForegroundColor Cyan

# Cambiar al directorio donde está el archivo docker-compose.yml
Set-Location -Path "$PSScriptRoot\docker"

# Detener los contenedores
Write-Host "Deteniendo contenedores..." -ForegroundColor Yellow
docker-compose down

# Reconstruir y reiniciar los contenedores
Write-Host "Reconstruyendo y reiniciando contenedores..." -ForegroundColor Yellow
docker-compose up -d --build

Write-Host "Servicios reiniciados correctamente." -ForegroundColor Green
Write-Host "Ahora deberías poder acceder a la página de usuarios en https://globalsolarco.shop/usuarios" -ForegroundColor Cyan