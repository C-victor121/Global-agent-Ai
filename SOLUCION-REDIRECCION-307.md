# Solución al Problema de Redirección 307 en la Ruta /usuarios

## Problema Identificado

Se identificó un problema de redirección 307 (Temporary Redirect) cuando se intentaba acceder a la ruta `/usuarios` después de la autenticación. A pesar de que el usuario se autenticaba correctamente con Google y se le asignaba el rol de 'admin', al intentar acceder a `/usuarios`, se producía una redirección 307 a la página principal (`/`).

## Causa del Problema

Después de analizar los logs y la configuración, se identificaron dos posibles causas:

1. **Configuración de Nginx**: La configuración original de la ruta `/usuarios` en Nginx no manejaba correctamente las solicitudes con parámetros de consulta (query parameters) o las solicitudes de recursos específicos de Next.js (como las solicitudes con el parámetro `_rsc`).

2. **Buffering de Nginx**: La configuración predeterminada de buffering en Nginx podría estar causando problemas con las respuestas de la aplicación Next.js, especialmente para rutas dinámicas como `/usuarios`.

## Solución Implementada

### 1. Mejora en la Configuración de Nginx

Se modificó el bloque `location` para la ruta `/usuarios` en el archivo `nginx.conf` para:

- Usar una expresión regular que capture todas las variantes de la ruta `/usuarios` (con o sin parámetros de consulta)
- Desactivar el buffering y ajustar los tamaños de buffer para evitar problemas con respuestas grandes

```nginx
# Ruta específica para /usuarios y sus subrutas
location ~ ^/usuarios($|/|\?|\?.+) {
    proxy_pass http://client;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_cache_bypass $http_upgrade;
    proxy_redirect off;
    proxy_set_header Cookie $http_cookie;
    add_header Set-Cookie $upstream_http_set_cookie;
    # Evitar redirecciones 307
    proxy_buffering off;
    proxy_buffer_size 128k;
    proxy_buffers 4 256k;
    proxy_busy_buffers_size 256k;
}
```

### 2. Script de Reinicio

Se creó un script `reiniciar-servicios.sh` para facilitar el reinicio de los servicios Docker después de aplicar los cambios:

```bash
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
```

## Cómo Aplicar la Solución

1. Asegúrate de que los cambios en `nginx.conf` estén aplicados
2. Haz ejecutable el script de reinicio:
   ```bash
   chmod +x reiniciar-servicios.sh
   ```
3. Ejecuta el script para reiniciar los servicios:
   ```bash
   ./reiniciar-servicios.sh
   ```
4. Verifica que puedes acceder a la ruta `/usuarios` después de autenticarte

## Explicación Técnica

### Expresión Regular en la Configuración de Nginx

La expresión regular `^/usuarios($|/|\?|\?.+)` captura:
- `/usuarios` exactamente (con el final de línea `$`)
- `/usuarios/` (con una barra al final)
- `/usuarios?` (con un signo de interrogación para parámetros de consulta)
- `/usuarios?param=value` (con parámetros de consulta completos)

Esto asegura que todas las variantes de la ruta `/usuarios` sean manejadas correctamente.

### Configuración de Buffering

Las directivas añadidas:
```nginx
proxy_buffering off;
proxy_buffer_size 128k;
proxy_buffers 4 256k;
proxy_busy_buffers_size 256k;
```

Estas configuraciones ayudan a manejar mejor las respuestas de la aplicación Next.js, especialmente para rutas dinámicas que pueden generar respuestas grandes o complejas.

## Verificación

Después de aplicar estos cambios, deberías poder acceder a la ruta `/usuarios` sin problemas de redirección. Si el problema persiste, revisa los logs de Nginx para obtener más información:

```bash
docker-compose logs -f nginx
```