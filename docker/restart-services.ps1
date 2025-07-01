# Script para reiniciar los servicios con las nuevas configuraciones

Write-Host "Deteniendo servicios actuales..." -ForegroundColor Yellow
docker-compose down

Write-Host "Eliminando imágenes antiguas..." -ForegroundColor Yellow
docker-compose rm -f
docker image prune -f

Write-Host "Reconstruyendo servicios..." -ForegroundColor Green
docker-compose build --no-cache

Write-Host "Iniciando servicios..." -ForegroundColor Green
docker-compose up -d

Write-Host "Verificando estado de los servicios..." -ForegroundColor Blue
docker-compose ps

Write-Host "Mostrando logs del servidor..." -ForegroundColor Blue
docker-compose logs server

Write-Host "¡Servicios reiniciados exitosamente!" -ForegroundColor Green
Write-Host "Puedes verificar los logs con: docker-compose logs -f" -ForegroundColor Cyan