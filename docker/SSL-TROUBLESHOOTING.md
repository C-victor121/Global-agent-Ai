# Guía de Solución de Problemas SSL - Global Agent AI

## Problemas Identificados y Soluciones

Basándome en el análisis de tu configuración, he identificado varios problemas que estaban causando fallos en la generación de certificados SSL:

### 1. Configuración de nginx.conf

**Problema:** El servidor HTTP redirigía todo el tráfico a HTTPS, incluyendo las solicitudes de verificación de Let's Encrypt.

**Solución:** Modificé `nginx.conf` para permitir que las solicitudes de verificación de Let's Encrypt (`.well-known/acme-challenge/`) sean servidas por HTTP mientras redirige el resto del tráfico a HTTPS.

### 2. Script de configuración SSL

**Problema:** El script original `setup-ssl.sh` tenía lógica básica sin manejo robusto de errores.

**Solución:** Creé `setup-ssl-improved.sh` con:
- Verificación de dependencias
- Manejo robusto de errores
- Verificaciones de estado más detalladas
- Logs mejorados para debugging
- Limpieza de recursos Docker

### 3. Script de Let's Encrypt en nginx.Dockerfile

**Problema:** El script de certificación no tenía verificaciones previas ni manejo detallado de errores.

**Solución:** Mejoré el script `/letsencrypt.sh` con:
- Verificación de accesibilidad del dominio
- Flags adicionales para certbot (`--non-interactive --verbose`)
- Mejor manejo de códigos de salida
- Recarga automática de nginx tras obtener certificados

## Instrucciones de Uso

### Opción 1: Script Mejorado (Recomendado)

```bash
# En tu servidor SSH
cd /path/to/Global\ Agent\ Ai/docker
chmod +x setup-ssl-improved.sh
./setup-ssl-improved.sh
```

### Opción 2: Script Original Corregido

```bash
# En tu servidor SSH
cd /path/to/Global\ Agent\ Ai/docker
./setup-ssl.sh
```

## Verificaciones Previas

Antes de ejecutar cualquier script, asegúrate de:

1. **DNS configurado correctamente:**
   ```bash
   nslookup globalsolarco.shop
   # Debe resolver a 107.20.220.167
   ```

2. **Puertos abiertos:**
   - Puerto 80 (HTTP)
   - Puerto 443 (HTTPS)

3. **Variables de entorno configuradas:**
   Verifica que tu archivo `.env` contenga todas las variables necesarias (ya está configurado correctamente).

## Debugging

### Ver logs en tiempo real:
```bash
docker-compose logs -f
```

### Ver logs específicos de nginx:
```bash
docker-compose logs nginx
```

### Verificar estado de contenedores:
```bash
docker-compose ps
```

### Probar certificados manualmente:
```bash
# Dentro del contenedor nginx
docker-compose exec nginx certbot certificates
```

### Verificar configuración de nginx:
```bash
docker-compose exec nginx nginx -t
```

## Solución de Problemas Comunes

### Error: "Domain not accessible"
- Verifica que el dominio apunte a tu IP
- Asegúrate de que los puertos 80 y 443 estén abiertos
- Verifica que nginx esté respondiendo en puerto 80

### Error: "Rate limit exceeded"
- Let's Encrypt tiene límites de solicitudes
- Espera una hora antes de intentar nuevamente
- Usa el modo staging para pruebas: `--staging`

### Error: "Container not responding"
- Verifica que Docker tenga suficientes recursos
- Reinicia Docker: `sudo systemctl restart docker`
- Limpia recursos: `docker system prune -f`

## Renovación de Certificados

Los certificados se renovarán automáticamente. Para renovación manual:

```bash
docker-compose exec nginx certbot renew
docker-compose restart nginx
```

## Configuración de Producción

Tu configuración actual está optimizada para producción con:
- Certificados SSL de Let's Encrypt
- Redirección automática HTTP → HTTPS
- Headers de seguridad configurados
- Acceso restringido a n8n por IP
- Configuración de CORS apropiada

## Monitoreo

Para monitorear el estado de tus certificados:

```bash
# Verificar expiración
docker-compose exec nginx certbot certificates

# Verificar HTTPS
curl -I https://globalsolarco.shop
```

## Contacto

Si continúas experimentando problemas, revisa:
1. Los logs detallados con `docker-compose logs -f`
2. La conectividad de red desde el servidor
3. La configuración DNS del dominio

Las mejoras implementadas deberían resolver los problemas de certificación SSL que estabas experimentando.