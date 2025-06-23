# Guía de Despliegue en Producción - Global Agent AI

## Requisitos del Sistema

### Servidor Recomendado
- **CPU**: 2+ vCPUs
- **RAM**: 4GB+ (recomendado 8GB)
- **Almacenamiento**: 20GB+ SSD
- **Sistema Operativo**: Ubuntu 20.04 LTS o superior
- **Puertos**: 80, 443, 22 (SSH)

### Software Necesario
- Docker 20.10+
- Docker Compose 2.0+
- Git
- Nginx (incluido en Docker)
- Certbot (para SSL)

## Configuración de AWS EC2

### 1. Crear Instancia EC2

```bash
# Tipo de instancia recomendado: t3.medium o superior
# AMI: Ubuntu Server 20.04 LTS
# Almacenamiento: 20GB gp3
```

### 2. Configurar Security Groups

```bash
# Reglas de entrada necesarias:
# SSH (22) - Tu IP
# HTTP (80) - 0.0.0.0/0
# HTTPS (443) - 0.0.0.0/0
# Custom TCP (3000) - 0.0.0.0/0 (opcional para desarrollo)
# Custom TCP (3001) - 0.0.0.0/0 (opcional para desarrollo)
```

### 3. Conectar a la Instancia

```bash
# Conectar via SSH
ssh -i "tu-key.pem" ubuntu@tu-ip-publica

# Actualizar sistema
sudo apt update && sudo apt upgrade -y
```

## Instalación de Dependencias

### 1. Instalar Docker

```bash
# Instalar Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Agregar usuario al grupo docker
sudo usermod -aG docker ubuntu

# Reiniciar sesión o ejecutar:
newgrp docker

# Verificar instalación
docker --version
```

### 2. Instalar Docker Compose

```bash
# Instalar Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

# Dar permisos de ejecución
sudo chmod +x /usr/local/bin/docker-compose

# Verificar instalación
docker-compose --version
```

### 3. Instalar Git

```bash
# Instalar Git
sudo apt install git -y

# Verificar instalación
git --version
```

## Configuración del Dominio

### 1. Configurar DNS

```bash
# En tu proveedor de dominio (Namecheap, GoDaddy, etc.)
# Crear registros A:
# @ -> IP_DE_TU_SERVIDOR
# www -> IP_DE_TU_SERVIDOR

# Verificar propagación DNS
nslookup tu-dominio.com
dig tu-dominio.com
```

### 2. Verificar Conectividad

```bash
# Desde tu servidor, verificar que el dominio apunta correctamente
curl -I http://tu-dominio.com
```

## Despliegue de la Aplicación

### 1. Clonar el Repositorio

```bash
# Navegar al directorio home
cd /home/ubuntu

# Clonar repositorio
git clone https://github.com/tu-usuario/Global-agent-Ai.git
cd Global-agent-Ai

# Verificar estructura
ls -la
```

### 2. Configurar Variables de Entorno

```bash
# Crear archivo de variables de entorno
cp .env.example .env
nano .env
```

**Archivo**: `.env`

```env
# Configuración del servidor
PORT=3001
NODE_ENV=production

# Base de datos
MONGODB_URI=mongodb://mongo:27017/global-agent-ai

# JWT
JWT_SECRET=tu-jwt-secret-muy-seguro-y-largo-aqui-min-32-caracteres
JWT_EXPIRES_IN=7d

# URLs - CAMBIAR POR TU DOMINIO
CLIENT_URL=https://tu-dominio.com
NEXTAUTH_URL=https://tu-dominio.com
NEXTAUTH_SECRET=tu-nextauth-secret-muy-seguro-aqui

# n8n Webhooks
N8N_CONTENT_GENERATION_WEBHOOK_URL=http://n8n:5678/webhook-test/content-generation
N8N_LEGAL_ASSISTANT_WEBHOOK_URL=http://n8n:5678/webhook-test/legal-assistant

# Twilio
TWILIO_ACCOUNT_SID=tu-twilio-account-sid
TWILIO_AUTH_TOKEN=tu-twilio-auth-token
TWILIO_PHONE_NUMBER=+1234567890

# MercadoPago
MERCADOPAGO_ACCESS_TOKEN=tu-mercadopago-access-token
MERCADOPAGO_PUBLIC_KEY=tu-mercadopago-public-key
MERCADOPAGO_WEBHOOK_SECRET=tu-mercadopago-webhook-secret

# OAuth - Google
GOOGLE_CLIENT_ID=tu-google-client-id
GOOGLE_CLIENT_SECRET=tu-google-client-secret

# OAuth - Facebook
FACEBOOK_CLIENT_ID=tu-facebook-client-id
FACEBOOK_CLIENT_SECRET=tu-facebook-client-secret

# Meta/WhatsApp
META_APP_SECRET=tu-meta-app-secret
META_VERIFY_TOKEN=tu-meta-verify-token

# Email (opcional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu-email@gmail.com
SMTP_PASS=tu-password-de-aplicacion

# Dominio para SSL
DOMAIN=tu-dominio.com
EMAIL=tu-email@gmail.com
```

### 3. Preparar Directorios para SSL

```bash
# Crear directorios necesarios para Certbot
mkdir -p certbot/accounts
mkdir -p certbot/archive
mkdir -p certbot/live
mkdir -p certbot/renewal
mkdir -p certbot-webroot

# Establecer permisos
sudo chown -R ubuntu:ubuntu certbot*
chmod -R 755 certbot*
```

### 4. Configurar Nginx para HTTP (temporal)

```bash
# Crear configuración temporal de Nginx
cp docker/nginx/nginx.conf docker/nginx/nginx.conf.backup
```

**Archivo**: `docker/nginx/nginx.conf` (configuración temporal)

```nginx
events {
    worker_connections 1024;
}

http {
    upstream client {
        server client:3000;
    }

    upstream server {
        server server:3001;
    }

    upstream n8n {
        server n8n:5678;
    }

    server {
        listen 80;
        server_name tu-dominio.com www.tu-dominio.com;

        # Certbot challenge
        location /.well-known/acme-challenge/ {
            root /var/www/certbot;
        }

        # Redirect to HTTPS (comentado temporalmente)
        # return 301 https://$server_name$request_uri;

        # Temporal: servir directamente
        location /api/ {
            proxy_pass http://server;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        location /n8n/ {
            proxy_pass http://n8n/;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        location / {
            proxy_pass http://client;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }
}
```

### 5. Construir y Ejecutar Contenedores

```bash
# Construir imágenes
docker-compose build --no-cache

# Ejecutar servicios
docker-compose up -d

# Verificar que todos los servicios estén ejecutándose
docker-compose ps

# Ver logs si hay problemas
docker-compose logs nginx
docker-compose logs client
docker-compose logs server
docker-compose logs mongo
docker-compose logs n8n
```

## Configuración SSL con Let's Encrypt

### 1. Script de Configuración SSL

**Archivo**: `setup-ssl.sh`

```bash
#!/bin/bash

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Función para logging
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

warn() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}"
}

# Verificar que las variables estén configuradas
if [ -z "$DOMAIN" ] || [ -z "$EMAIL" ]; then
    error "Las variables DOMAIN y EMAIL deben estar configuradas en .env"
    exit 1
fi

log "Iniciando configuración SSL para $DOMAIN"

# Crear directorios necesarios
log "Creando directorios para Certbot..."
mkdir -p certbot/accounts certbot/archive certbot/live certbot/renewal certbot-webroot
sudo chown -R ubuntu:ubuntu certbot*
chmod -R 755 certbot*

# Detener servicios si están ejecutándose
log "Deteniendo servicios..."
docker-compose down

# Limpiar contenedores e imágenes anteriores
log "Limpiando contenedores e imágenes anteriores..."
docker system prune -f

# Construir imágenes
log "Construyendo imágenes..."
docker-compose build --no-cache

# Iniciar servicios temporalmente para obtener certificados
log "Iniciando servicios temporalmente..."
docker-compose up -d

# Esperar a que Nginx esté listo
log "Esperando a que Nginx esté listo..."
sleep 30

# Verificar que Nginx responda
log "Verificando conectividad HTTP..."
if ! curl -f http://$DOMAIN/.well-known/acme-challenge/test 2>/dev/null; then
    warn "No se puede acceder al endpoint de verificación, continuando..."
fi

# Obtener certificados SSL
log "Obteniendo certificados SSL..."
docker run --rm \
    -v "$(pwd)/certbot:/etc/letsencrypt" \
    -v "$(pwd)/certbot-webroot:/var/www/certbot" \
    certbot/certbot certonly \
    --webroot \
    --webroot-path=/var/www/certbot \
    --email $EMAIL \
    --agree-tos \
    --no-eff-email \
    --force-renewal \
    -d $DOMAIN \
    -d www.$DOMAIN

if [ $? -eq 0 ]; then
    log "Certificados SSL obtenidos exitosamente"
else
    error "Error al obtener certificados SSL"
    exit 1
fi

# Verificar que los certificados existan
if [ ! -f "certbot/live/$DOMAIN/fullchain.pem" ] || [ ! -f "certbot/live/$DOMAIN/privkey.pem" ]; then
    error "Los archivos de certificado no se encontraron"
    exit 1
fi

log "Certificados encontrados correctamente"

# Restaurar configuración completa de Nginx
log "Configurando Nginx con SSL..."
cp docker/nginx/nginx.conf.backup docker/nginx/nginx.conf

# Reiniciar servicios con SSL
log "Reiniciando servicios con SSL..."
docker-compose down
docker-compose up -d

# Verificar que todos los servicios estén ejecutándose
log "Verificando servicios..."
sleep 30
docker-compose ps

# Verificar conectividad HTTPS
log "Verificando conectividad HTTPS..."
if curl -f https://$DOMAIN 2>/dev/null; then
    log "✅ SSL configurado correctamente"
    log "✅ Sitio accesible en: https://$DOMAIN"
else
    warn "No se puede verificar HTTPS, revisa los logs"
fi

# Configurar renovación automática
log "Configurando renovación automática..."
(crontab -l 2>/dev/null; echo "0 12 * * * cd $(pwd) && docker run --rm -v \"$(pwd)/certbot:/etc/letsencrypt\" -v \"$(pwd)/certbot-webroot:/var/www/certbot\" certbot/certbot renew --quiet && docker-compose restart nginx") | crontab -

log "🎉 Configuración SSL completada exitosamente"
log "📝 Recuerda:"
log "   - Verificar que tu dominio apunte a esta IP"
log "   - Los certificados se renovarán automáticamente"
log "   - Revisa los logs si hay problemas: docker-compose logs nginx"
```

### 2. Ejecutar Configuración SSL

```bash
# Hacer el script ejecutable
chmod +x setup-ssl.sh

# Ejecutar configuración SSL
./setup-ssl.sh
```

### 3. Configuración Final de Nginx con SSL

**Archivo**: `docker/nginx/nginx.conf` (configuración final)

```nginx
events {
    worker_connections 1024;
}

http {
    # Configuración básica
    include /etc/nginx/mime.types;
    default_type application/octet-stream;
    sendfile on;
    keepalive_timeout 65;
    client_max_body_size 10M;

    # Configuración de logs
    access_log /var/log/nginx/access.log;
    error_log /var/log/nginx/error.log;

    # Configuración de gzip
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

    # Upstreams
    upstream client {
        server client:3000;
    }

    upstream server {
        server server:3001;
    }

    upstream n8n {
        server n8n:5678;
    }

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    limit_req_zone $binary_remote_addr zone=login:10m rate=5r/m;

    # Redirect HTTP to HTTPS
    server {
        listen 80;
        server_name tu-dominio.com www.tu-dominio.com;

        # Certbot challenge
        location /.well-known/acme-challenge/ {
            root /var/www/certbot;
        }

        # Redirect all other traffic to HTTPS
        location / {
            return 301 https://$server_name$request_uri;
        }
    }

    # HTTPS Server
    server {
        listen 443 ssl http2;
        server_name tu-dominio.com www.tu-dominio.com;

        # SSL Configuration
        ssl_certificate /etc/letsencrypt/live/tu-dominio.com/fullchain.pem;
        ssl_certificate_key /etc/letsencrypt/live/tu-dominio.com/privkey.pem;
        
        # SSL Security
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
        ssl_prefer_server_ciphers off;
        ssl_session_cache shared:SSL:10m;
        ssl_session_timeout 10m;
        ssl_stapling on;
        ssl_stapling_verify on;
        
        # Security Headers
        add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
        add_header X-Frame-Options DENY always;
        add_header X-Content-Type-Options nosniff always;
        add_header X-XSS-Protection "1; mode=block" always;
        add_header Referrer-Policy "strict-origin-when-cross-origin" always;
        add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https:; style-src 'self' 'unsafe-inline' https:; img-src 'self' data: https:; font-src 'self' https:; connect-src 'self' https:; frame-src 'self' https:;" always;

        # API Routes
        location /api/ {
            limit_req zone=api burst=20 nodelay;
            
            proxy_pass http://server;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_set_header X-Forwarded-Host $host;
            proxy_set_header X-Forwarded-Port $server_port;
            
            # Timeouts
            proxy_connect_timeout 60s;
            proxy_send_timeout 60s;
            proxy_read_timeout 60s;
        }

        # Auth routes with stricter rate limiting
        location /api/auth/ {
            limit_req zone=login burst=5 nodelay;
            
            proxy_pass http://server;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # n8n Routes
        location /n8n/ {
            proxy_pass http://n8n/;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            
            # WebSocket support
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";
        }

        # Frontend Routes
        location / {
            proxy_pass http://client;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            
            # WebSocket support for Next.js dev
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";
        }

        # Static files caching
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
            proxy_pass http://client;
        }
    }
}
```

## Monitoreo y Mantenimiento

### 1. Scripts de Monitoreo

**Archivo**: `scripts/monitor.sh`

```bash
#!/bin/bash

# Verificar estado de servicios
echo "=== Estado de Servicios ==="
docker-compose ps

echo -e "\n=== Uso de Recursos ==="
docker stats --no-stream

echo -e "\n=== Espacio en Disco ==="
df -h

echo -e "\n=== Logs Recientes (últimas 50 líneas) ==="
docker-compose logs --tail=50

echo -e "\n=== Conectividad ==="
curl -I https://tu-dominio.com
```

### 2. Script de Backup

**Archivo**: `scripts/backup.sh`

```bash
#!/bin/bash

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/home/ubuntu/backups"
APP_DIR="/home/ubuntu/Global-agent-Ai"

# Crear directorio de backup
mkdir -p $BACKUP_DIR

echo "Iniciando backup - $DATE"

# Backup de MongoDB
echo "Backing up MongoDB..."
docker exec global-agent-ai_mongo_1 mongodump --out /tmp/backup
docker cp global-agent-ai_mongo_1:/tmp/backup $BACKUP_DIR/mongodb_$DATE

# Backup de archivos de aplicación
echo "Backing up application files..."
tar -czf $BACKUP_DIR/app_$DATE.tar.gz -C $APP_DIR .

# Backup de certificados SSL
echo "Backing up SSL certificates..."
tar -czf $BACKUP_DIR/ssl_$DATE.tar.gz -C $APP_DIR certbot

# Limpiar backups antiguos (mantener últimos 7 días)
find $BACKUP_DIR -name "*" -mtime +7 -delete

echo "Backup completado - $DATE"
```

### 3. Script de Actualización

**Archivo**: `scripts/update.sh`

```bash
#!/bin/bash

echo "Iniciando actualización..."

# Backup antes de actualizar
./scripts/backup.sh

# Obtener últimos cambios
git pull origin main

# Reconstruir y reiniciar servicios
docker-compose down
docker-compose build --no-cache
docker-compose up -d

# Verificar que todo esté funcionando
sleep 30
docker-compose ps
curl -I https://tu-dominio.com

echo "Actualización completada"
```

### 4. Configurar Cron Jobs

```bash
# Editar crontab
crontab -e

# Agregar las siguientes líneas:
# Backup diario a las 2 AM
0 2 * * * cd /home/ubuntu/Global-agent-Ai && ./scripts/backup.sh >> /var/log/backup.log 2>&1

# Monitoreo cada 5 minutos
*/5 * * * * cd /home/ubuntu/Global-agent-Ai && ./scripts/monitor.sh >> /var/log/monitor.log 2>&1

# Renovación SSL (ya configurado por setup-ssl.sh)
0 12 * * * cd /home/ubuntu/Global-agent-Ai && docker run --rm -v "$(pwd)/certbot:/etc/letsencrypt" -v "$(pwd)/certbot-webroot:/var/www/certbot" certbot/certbot renew --quiet && docker-compose restart nginx
```

## Troubleshooting

### Problemas Comunes

#### 1. Error de Certificados SSL

```bash
# Verificar certificados
sudo ls -la certbot/live/tu-dominio.com/

# Regenerar certificados
./setup-ssl.sh

# Verificar logs de Nginx
docker-compose logs nginx
```

#### 2. Servicios No Responden

```bash
# Verificar estado
docker-compose ps

# Reiniciar servicios
docker-compose restart

# Ver logs detallados
docker-compose logs --follow
```

#### 3. Error de Conexión a Base de Datos

```bash
# Verificar MongoDB
docker-compose logs mongo

# Conectar a MongoDB
docker exec -it global-agent-ai_mongo_1 mongo

# Verificar espacio en disco
df -h
```

#### 4. Error 502 Bad Gateway

```bash
# Verificar que los servicios estén ejecutándose
docker-compose ps

# Verificar logs de Nginx
docker-compose logs nginx

# Verificar conectividad interna
docker exec global-agent-ai_nginx_1 curl http://client:3000
docker exec global-agent-ai_nginx_1 curl http://server:3001/api/health
```

### Comandos Útiles

```bash
# Ver logs en tiempo real
docker-compose logs -f

# Reiniciar un servicio específico
docker-compose restart nginx

# Ejecutar comando en contenedor
docker exec -it global-agent-ai_server_1 bash

# Verificar uso de recursos
docker stats

# Limpiar sistema Docker
docker system prune -a

# Verificar conectividad
curl -I https://tu-dominio.com
ping tu-dominio.com

# Verificar puertos abiertos
sudo netstat -tlnp
```

## Seguridad Adicional

### 1. Configurar Firewall

```bash
# Instalar UFW
sudo apt install ufw -y

# Configurar reglas
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443

# Activar firewall
sudo ufw enable

# Verificar estado
sudo ufw status
```

### 2. Configurar Fail2Ban

```bash
# Instalar Fail2Ban
sudo apt install fail2ban -y

# Configurar
sudo cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local
sudo nano /etc/fail2ban/jail.local

# Iniciar servicio
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

### 3. Actualizaciones Automáticas

```bash
# Instalar unattended-upgrades
sudo apt install unattended-upgrades -y

# Configurar
sudo dpkg-reconfigure -plow unattended-upgrades
```

## Optimización de Rendimiento

### 1. Configuración de Docker

```bash
# Configurar límites de recursos en docker-compose.yml
services:
  nginx:
    deploy:
      resources:
        limits:
          memory: 512M
        reservations:
          memory: 256M
  
  client:
    deploy:
      resources:
        limits:
          memory: 1G
        reservations:
          memory: 512M
```

### 2. Configuración de MongoDB

```bash
# Optimizar MongoDB
docker exec -it global-agent-ai_mongo_1 mongo

# En MongoDB shell:
db.adminCommand({setParameter: 1, internalQueryExecMaxBlockingSortBytes: 335544320})
```

Esta guía proporciona un proceso completo para desplegar Global Agent AI en producción con todas las mejores prácticas de seguridad, monitoreo y mantenimiento.