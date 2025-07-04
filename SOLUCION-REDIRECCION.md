# Solución al Problema de Redirección a /usuarios

## Problema Identificado

Se identificaron dos problemas principales que impedían la redirección correcta a la página de usuarios después del inicio de sesión:

1. **En el middleware**: No se estaba devolviendo explícitamente `NextResponse.next()` para las rutas de `/usuarios` cuando el usuario estaba autenticado, lo que podría causar comportamientos inesperados en la cadena de middleware.

2. **En la configuración de Nginx**: No había una configuración específica para la ruta `/usuarios`, lo que podría estar causando la redirección 307 que se observaba en los logs.

## Cambios Realizados

### 1. Modificación del Middleware

Se actualizó el archivo `client/src/middleware.ts` para asegurar que cuando un usuario autenticado accede a `/usuarios`, se devuelva explícitamente `NextResponse.next()` para permitir que la solicitud continúe sin redirecciones adicionales.

```typescript
// Proteger rutas que comienzan con /usuarios
if (pathname.startsWith('/usuarios')) {
    console.log('[Middleware] Verifying token for /usuarios...');

    if (!token) {
        console.log('[Middleware] No token found. Redirecting to /auth/signin.');
        const url = new URL('/auth/signin', req.url);
        // Guardar la URL completa a la que se intentaba acceder para redirigir después del login
        url.searchParams.set('callbackUrl', encodeURIComponent(req.nextUrl.href));
        return NextResponse.redirect(url, { status: 302 }); // Redirección explícita con 302
    }

    console.log('[Middleware] Token found. Allowing access to /usuarios.');
    console.log('[Middleware] Token details:', JSON.stringify(token, null, 2));
    
    // Asegurarse de que la solicitud continúe sin redirecciones adicionales
    return NextResponse.next();
}
```

### 2. Actualización de la Configuración de Nginx

Se añadió una configuración específica para la ruta `/usuarios` en el archivo `docker/nginx.conf` para asegurar que las solicitudes a esta ruta se manejen correctamente:

```nginx
# Ruta específica para /usuarios
location /usuarios {
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
}
```

## Aplicación de los Cambios

Para aplicar estos cambios, se ha creado un script PowerShell que reinicia los servicios Docker:

1. Ejecuta el script `restart-services.ps1` desde PowerShell:

```powershell
.\restart-services.ps1
```

Este script:
- Detiene los contenedores Docker actuales
- Reconstruye las imágenes con los cambios realizados
- Reinicia los servicios

## Verificación

Después de aplicar los cambios y reiniciar los servicios, deberías poder:

1. Iniciar sesión con Google o Facebook
2. Ser redirigido correctamente a la página `/usuarios`
3. Ver el panel de usuario con todas sus funcionalidades

## Logs para Depuración

Si persisten los problemas, puedes revisar los logs de los contenedores para obtener más información:

```bash
docker logs global-agent-ai_client_1
docker logs global-agent-ai_nginx_1
```

Estos logs te ayudarán a identificar cualquier problema adicional que pueda estar ocurriendo durante el proceso de autenticación y redirección.