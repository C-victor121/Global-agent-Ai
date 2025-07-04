# Solución Detallada al Problema de Redirección 307 en la Ruta /usuarios

## Diagnóstico del Problema

Después de analizar el código y los logs del sistema, se identificaron varios factores que contribuían al problema de redirección 307 cuando se intentaba acceder a la ruta `/usuarios`:

1. **Problema en la gestión del ciclo de vida del componente**: El componente de la página de usuarios no manejaba correctamente la hidratación en Next.js, lo que podía causar problemas durante la renderización inicial.

2. **Configuración de Nginx para rutas con parámetros RSC**: Los logs mostraban que las solicitudes a `/usuarios?_rsc=1ld0r` estaban siendo redirigidas con código 307, lo que indica un problema con cómo Nginx manejaba las rutas de React Server Components.

3. **Manejo de sesión no óptimo**: La página no utilizaba la opción `required: true` de `useSession`, lo que podría causar comportamientos inconsistentes durante la carga inicial.

## Cambios Implementados

### 1. Mejora en el Componente de Página de Usuarios

Se realizaron las siguientes modificaciones en el archivo `client/src/app/usuarios/page.tsx`:

```typescript
// Antes
const { data: session, status } = useSession();

// Después
const { data: session, status } = useSession({ required: true });
const [isClient, setIsClient] = useState(false);

// Verificar que estamos en el cliente
useEffect(() => {
  setIsClient(true);
}, []);
```

**Explicación**: 
- La opción `required: true` en `useSession` indica a NextAuth que esta página requiere autenticación, lo que mejora el manejo de redirecciones.
- El estado `isClient` nos permite detectar si estamos en el navegador, evitando operaciones del lado del cliente durante la renderización del servidor.

```typescript
// Antes
useEffect(() => {
  // Código de efecto
}, [status, router, session]);

// Después
useEffect(() => {
  if (!isClient) return;
  
  // Código de efecto
}, [status, router, session, isClient]);
```

**Explicación**: 
- Añadimos una comprobación para evitar que el efecto se ejecute durante la renderización del servidor.
- Agregamos `isClient` como dependencia para que el efecto se ejecute cuando cambie a `true`.

```typescript
// Antes
if (status === 'loading') {
  return (
    // Componente de carga
  );
}

// Después
if (status === 'loading' || !isClient) {
  return (
    // Componente de carga
  );
}

// Protección adicional contra renderizado sin sesión
if (!session) {
  return null;
}
```

**Explicación**:
- Mostramos el componente de carga tanto durante la carga de la sesión como cuando estamos en el servidor.
- Añadimos una protección adicional para evitar renderizar el contenido si no hay sesión, lo que podría ocurrir en casos extremos.

### 2. Mejora en la Configuración de Nginx

Se modificó la configuración de Nginx para manejar mejor las rutas de `/usuarios` con parámetros de consulta:

```nginx
# Antes
location /usuarios {
  proxy_pass http://client;
  // Configuración existente
}

# Después
location ~ ^/usuarios($|/|\?|\?.+) {
  proxy_pass http://client;
  // Configuración existente
  
  # Evitar redirecciones 307
  proxy_buffering off;
  proxy_buffer_size 128k;
  proxy_buffers 4 256k;
  proxy_busy_buffers_size 256k;
}
```

**Explicación**:
- La expresión regular `^/usuarios($|/|\?|\?.+)` captura todas las variantes de la ruta `/usuarios`:
  - `/usuarios` exactamente (con el final de línea `$`)
  - `/usuarios/` (con una barra al final)
  - `/usuarios?` (con un signo de interrogación para parámetros de consulta)
  - `/usuarios?param=value` (con parámetros de consulta completos)
- Desactivamos el buffering y ajustamos los tamaños de buffer para evitar problemas con respuestas grandes o streaming.

## Explicación Técnica del Problema

### ¿Por qué ocurría la redirección 307?

El código de estado HTTP 307 (Temporary Redirect) indica que el recurso solicitado se ha movido temporalmente a otra URL. En este caso, había varios factores contribuyendo:

1. **Manejo de React Server Components (RSC)**: Next.js utiliza parámetros `_rsc` para las solicitudes de React Server Components. Nginx no estaba configurado para manejar estas rutas correctamente.

2. **Buffering de Nginx**: Cuando Nginx hace buffering de respuestas, puede causar problemas con respuestas de streaming o respuestas que dependen de un estado específico del cliente.

3. **Hidratación de React**: Durante la hidratación, React intenta hacer coincidir el DOM generado en el servidor con el que se renderizaría en el cliente. Si hay discrepancias (como cuando el estado de autenticación cambia), pueden ocurrir problemas.

### Cómo funciona la solución

1. **Mejora en la detección del entorno cliente/servidor**: Al usar el estado `isClient`, podemos evitar ejecutar código específico del cliente durante la renderización del servidor.

2. **Uso de `useSession({ required: true })` de NextAuth**: Esto mejora el manejo de la autenticación, asegurando que la página solo se renderice cuando hay una sesión válida.

3. **Configuración de Nginx para rutas RSC**: La expresión regular y la configuración de buffering permiten que Nginx maneje correctamente las solicitudes de React Server Components.

## Verificación de la Solución

Para verificar que la solución funciona correctamente:

1. Ejecuta el script `reiniciar-servicios-mejorado.sh` para aplicar los cambios.
2. Abre un navegador en modo incógnito y navega a `https://globalsolarco.shop`.
3. Inicia sesión con tu cuenta.
4. Intenta acceder a `https://globalsolarco.shop/usuarios`.
5. Verifica en los logs que no hay redirecciones 307:
   ```bash
   docker-compose logs -f nginx
   ```

## Consideraciones Adicionales

### Mejoras Futuras

1. **Implementar middleware de autenticación más robusto**: Crear un middleware específico para manejar la autenticación y autorización por rol.

2. **Mejorar el manejo de errores**: Implementar un sistema global de manejo de errores para capturar y registrar problemas de autenticación y redirección.

3. **Optimizar la carga de la página**: Implementar estrategias como Suspense y lazy loading para mejorar la experiencia de usuario durante la carga.

### Monitoreo

Se recomienda monitorear los logs de Nginx y del cliente para detectar posibles problemas de redirección en el futuro:

```bash
# Monitorear logs de Nginx
docker-compose logs -f nginx

# Monitorear logs del cliente
docker-compose logs -f client
```

Buscar específicamente códigos de estado 307 y errores relacionados con la autenticación o redirección.