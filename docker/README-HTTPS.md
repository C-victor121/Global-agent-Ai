# Configuración HTTPS para Producción - Global Agent AI

## Resumen de Cambios

Se ha configurado la aplicación para usar HTTPS en producción con el dominio `globalsolarco.shop` y la IP estática `107.20.220.167`.

### Componentes Agregados:

1. **Nginx Reverse Proxy** - Maneja SSL/TLS y redirige tráfico
2. **Certificados SSL** - Soporte para Let's Encrypt y certificados auto-firmados
3. **Configuración de Seguridad** - Headers de seguridad y configuraciones SSL

## Pasos para Configurar HTTPS

### 1. Configurar DNS

Asegúrate de que tu dominio apunte a la IP del servidor:

```
globalsolarco.shop → 107.20.220.167
www.globalsolarco.shop → 107.20.220.167
```

### 2. Verificar Configuración DNS

```bash
# En Windows (PowerShell)
Resolve-DnsName globalsolarco.shop

# En Linux/Mac
nslookup globalsolarco.shop
```

### 3. Ejecutar Script de Configuración SSL

**En Windows (PowerShell como Administrador):**
```powershell
cd "c:\Users\cvict\Desktop\Global Agent Ai\docker"
.\setup-ssl.ps1
```

**En Linux/Mac:**
```bash
cd /path/to/Global Agent Ai/docker
chmod +x setup-ssl.sh
./setup-ssl.sh
```

### 4. Configurar OAuth (Importante)

Actualiza las URLs de redirección en las consolas de desarrolladores:

**Google Cloud Console:**
- URL de redirección autorizada: `https://globalsolarco.shop/api/auth/callback/google`

**Facebook Developers:**
- URI de redirección OAuth válida: `https://globalsolarco.shop/api/auth/callback/facebook`
- Dominio de aplicación: `globalsolarco.shop`

## Estructura de la Aplicación

### URLs de Acceso:

- **Aplicación Principal:** `https://globalsolarco.shop`
- **API:** `https://globalsolarco.shop/api`
- **n8n (Restringido):** `https://globalsolarco.shop/n8n`
- **Webhooks n8n:** `https://globalsolarco.shop/webhook/*`

### Puertos Internos:

- **Nginx:** 80 (HTTP) → 443 (HTTPS)
- **Client (Next.js):** 3000 (interno)
- **Server (API):** 3001 (interno)
- **n8n:** 5678 (interno)
- **MongoDB:** 27017 (interno)

## Características de Seguridad

### SSL/TLS:
- **Protocolos:** TLSv1.2, TLSv1.3
- **Cifrados:** ECDHE-RSA-AES256-GCM-SHA512 y otros seguros
- **HSTS:** Habilitado con 1 año de duración

### Headers de Seguridad:
- `Strict-Transport-Security`
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `X-XSS-Protection`
- `Referrer-Policy`

### Acceso Restringido:
- **n8n Interface:** Solo accesible desde IP específica (107.20.220.167)
- **Webhooks:** Acceso público para funcionalidad

## Renovación de Certificados

Los certificados de Let's Encrypt se renuevan automáticamente cada 90 días. Para renovación manual:

```bash
docker-compose exec nginx certbot renew
docker-compose restart nginx
```

## Solución de Problemas

### Error: "Certificate not found"
1. Verifica que el dominio apunte a la IP correcta
2. Ejecuta el script de configuración SSL nuevamente
3. Si persiste, se usarán certificados auto-firmados

### Error: "OAuth redirect mismatch"
1. Actualiza las URLs en Google/Facebook Developer Console
2. Asegúrate de usar `https://` en todas las URLs

### Error: "n8n not accessible"
1. Verifica que estés accediendo desde la IP permitida
2. Usa `https://globalsolarco.shop/n8n` (no `:5678`)

## Comandos Útiles

```bash
# Ver logs de nginx
docker-compose logs nginx

# Reiniciar servicios
docker-compose restart

# Ver estado de certificados
docker-compose exec nginx certbot certificates

# Verificar configuración nginx
docker-compose exec nginx nginx -t
```

## Variables de Entorno Actualizadas

Las siguientes variables se han actualizado para HTTPS:

- `NEXT_PUBLIC_API_URL`: `https://globalsolarco.shop/api`
- `NEXTAUTH_URL`: `https://globalsolarco.shop`
- `CLIENT_URL`: `https://globalsolarco.shop`
- `N8N_CORS_ORIGIN`: `https://globalsolarco.shop`
- Todas las URLs de webhooks ahora usan HTTPS

## Notas Importantes

1. **Backup:** Siempre haz backup de tus datos antes de aplicar cambios
2. **DNS Propagation:** Puede tomar hasta 24-48 horas para que los cambios DNS se propaguen completamente
3. **Firewall:** Asegúrate de que los puertos 80 y 443 estén abiertos en tu servidor
4. **Monitoreo:** Configura monitoreo para verificar la validez de los certificados SSL