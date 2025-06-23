# Política de Seguridad - Global Agent AI

## Resumen Ejecutivo

Global Agent AI implementa múltiples capas de seguridad para proteger la información de los usuarios, garantizar la integridad de los datos y mantener la disponibilidad del servicio. Este documento describe las medidas de seguridad implementadas y las mejores prácticas seguidas.

## Arquitectura de Seguridad

### Modelo de Seguridad por Capas

```
┌─────────────────────────────────────────┐
│           CAPA DE PRESENTACIÓN          │
│  • HTTPS/TLS 1.3                      │
│  • Content Security Policy             │
│  • Security Headers                    │
└─────────────────────────────────────────┘
┌─────────────────────────────────────────┐
│           CAPA DE APLICACIÓN            │
│  • Autenticación JWT                   │
│  • Autorización basada en roles        │
│  • Validación de entrada               │
│  • Rate Limiting                       │
└─────────────────────────────────────────┘
┌─────────────────────────────────────────┐
│           CAPA DE DATOS                 │
│  • Encriptación de contraseñas         │
│  • Sanitización de datos               │
│  • Conexiones seguras a BD             │
└─────────────────────────────────────────┘
┌─────────────────────────────────────────┐
│         CAPA DE INFRAESTRUCTURA         │
│  • Firewall                           │
│  • Fail2Ban                           │
│  • Monitoreo de seguridad             │
└─────────────────────────────────────────┘
```

## Protección de Datos del Usuario

### 1. Encriptación de Contraseñas

**Implementación**: Bcrypt con salt rounds = 12

```typescript
// Archivo: server/src/models/User.model.ts
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next()
  
  try {
    const salt = await bcrypt.genSalt(12) // Factor de costo alto
    this.password = await bcrypt.hash(this.password!, salt)
    next()
  } catch (error) {
    next(error as Error)
  }
})

// Método de comparación segura
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  if (!this.password) return false
  return bcrypt.compare(candidatePassword, this.password)
}
```

**Características de Seguridad**:
- Factor de costo 12 (4096 iteraciones)
- Salt único por contraseña
- Resistente a ataques de fuerza bruta
- Resistente a ataques de diccionario

### 2. Gestión de Tokens JWT

**Configuración Segura**:

```typescript
// Generación de token
const token = jwt.sign(
  { userId: user._id, email: user.email },
  process.env.JWT_SECRET!, // Mínimo 32 caracteres
  { 
    expiresIn: '7d',
    algorithm: 'HS256',
    issuer: 'global-agent-ai',
    audience: 'global-agent-ai-users'
  }
)

// Configuración de cookies seguras
res.cookie('token', token, {
  httpOnly: true,              // No accesible desde JavaScript
  secure: process.env.NODE_ENV === 'production', // Solo HTTPS en producción
  sameSite: 'strict',          // Protección CSRF
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días
  path: '/',                   // Disponible en toda la aplicación
  domain: process.env.DOMAIN   // Restringido al dominio
})
```

**Medidas de Protección**:
- Tokens con expiración automática
- Almacenamiento seguro en cookies HttpOnly
- Verificación de integridad en cada request
- Revocación automática al cerrar sesión

### 3. Validación y Sanitización de Datos

**Esquemas de Validación con Zod**:

```typescript
// Archivo: shared/validations/auth.schema.ts
export const registerSchema = z.object({
  name: z.string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres')
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'El nombre solo puede contener letras y espacios'),
  
  email: z.string()
    .email('Formato de email inválido')
    .toLowerCase()
    .transform(email => email.trim()),
  
  password: z.string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, 
           'La contraseña debe contener al menos: 1 minúscula, 1 mayúscula, 1 número y 1 carácter especial')
})
```

**Protecciones Implementadas**:
- Validación estricta de tipos de datos
- Sanitización automática de entrada
- Prevención de inyección de código
- Límites de longitud en todos los campos
- Expresiones regulares para formatos específicos

## Configuración HTTPS y TLS

### 1. Certificados SSL/TLS

**Configuración Let's Encrypt**:

```bash
# Obtención automática de certificados
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
```

**Características**:
- Certificados válidos y confiables
- Renovación automática cada 90 días
- Soporte para múltiples dominios
- Validación de dominio automática

### 2. Configuración TLS en Nginx

```nginx
# Configuración SSL segura
ssl_protocols TLSv1.2 TLSv1.3;
ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
ssl_prefer_server_ciphers off;
ssl_session_cache shared:SSL:10m;
ssl_session_timeout 10m;
ssl_stapling on;
ssl_stapling_verify on;

# Forzar HTTPS
return 301 https://$server_name$request_uri;
```

**Características de Seguridad**:
- Solo protocolos TLS 1.2 y 1.3
- Cifrados seguros y modernos
- OCSP Stapling habilitado
- Redirección automática HTTP → HTTPS
- Perfect Forward Secrecy

## Configuración CORS

### Implementación Restrictiva

```typescript
// Archivo: server/src/index.ts
app.use(cors({
  origin: [
    process.env.CLIENT_URL || 'http://localhost:3000',
    'https://tu-dominio.com',
    'https://www.tu-dominio.com'
  ],
  credentials: true,              // Permitir cookies
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'X-Requested-With',
    'Accept',
    'Origin'
  ],
  exposedHeaders: ['Set-Cookie'],
  maxAge: 86400                   // Cache preflight por 24 horas
}))
```

**Protecciones**:
- Lista blanca de dominios permitidos
- Restricción de métodos HTTP
- Control de headers permitidos
- Soporte para credenciales seguras

## Headers de Seguridad

### Configuración Completa en Nginx

```nginx
# Security Headers
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
add_header X-Frame-Options DENY always;
add_header X-Content-Type-Options nosniff always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https:; style-src 'self' 'unsafe-inline' https:; img-src 'self' data: https:; font-src 'self' https:; connect-src 'self' https:; frame-src 'self' https:;" always;
add_header Permissions-Policy "geolocation=(), microphone=(), camera=()" always;
```

### Descripción de Headers

| Header | Propósito | Configuración |
|--------|-----------|---------------|
| **HSTS** | Forzar HTTPS | 1 año, incluye subdominios |
| **X-Frame-Options** | Prevenir clickjacking | DENY |
| **X-Content-Type-Options** | Prevenir MIME sniffing | nosniff |
| **X-XSS-Protection** | Protección XSS | Activado con bloqueo |
| **Referrer-Policy** | Control de referrer | strict-origin-when-cross-origin |
| **CSP** | Prevenir XSS/injection | Política restrictiva |
| **Permissions-Policy** | Control de APIs | Deshabilitar APIs sensibles |

## Autenticación y Autorización

### 1. Múltiples Métodos de Autenticación

```typescript
// Autenticación con credenciales
export const login = async (req: Request, res: Response) => {
  try {
    const validatedData = loginSchema.parse(req.body)
    const { email, password } = validatedData

    // Buscar usuario con contraseña
    const user = await User.findOne({ email }).select('+password')
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas' // Mensaje genérico
      })
    }

    // Verificar contraseña
    const isPasswordValid = await user.comparePassword(password)
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas' // Mensaje genérico
      })
    }

    // Actualizar último login
    user.lastLogin = new Date()
    await user.save()

    // Generar token seguro
    const token = generateSecureToken(user)
    
    // Configurar cookie segura
    setSecureCookie(res, token)

    res.json({
      success: true,
      user: sanitizeUser(user), // Remover datos sensibles
      token
    })
  } catch (error) {
    handleAuthError(error, res)
  }
}
```

### 2. OAuth Seguro (Google/Facebook)

```typescript
// Autenticación con Google
export const googleAuth = async (req: Request, res: Response) => {
  try {
    const { googleId, email, name, avatar } = req.body

    // Verificar token de Google (implementar verificación)
    const isValidGoogleToken = await verifyGoogleToken(req.body.token)
    if (!isValidGoogleToken) {
      return res.status(401).json({
        success: false,
        message: 'Token de Google inválido'
      })
    }

    // Buscar o crear usuario
    let user = await User.findOne({ 
      $or: [
        { email },
        { provider: 'google', providerId: googleId }
      ]
    })

    if (!user) {
      user = new User({
        name: sanitizeInput(name),
        email: sanitizeEmail(email),
        provider: 'google',
        providerId: googleId,
        avatar: validateImageUrl(avatar)
      })
      await user.save()
    }

    // Generar token y respuesta segura
    const token = generateSecureToken(user)
    setSecureCookie(res, token)

    res.json({
      success: true,
      user: sanitizeUser(user),
      token
    })
  } catch (error) {
    handleAuthError(error, res)
  }
}
```

### 3. Middleware de Autorización

```typescript
// Middleware de autenticación
export const authMiddleware = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    // Obtener token de múltiples fuentes
    let token = extractTokenFromHeader(req) || extractTokenFromCookie(req)

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token de acceso requerido'
      })
    }

    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any
    
    // Verificar que el usuario existe y está activo
    const user = await User.findById(decoded.userId)
    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no válido o inactivo'
      })
    }

    // Verificar expiración del token
    if (decoded.exp < Date.now() / 1000) {
      return res.status(401).json({
        success: false,
        message: 'Token expirado'
      })
    }

    // Agregar información del usuario a la request
    req.user = {
      userId: user._id.toString(),
      email: user.email,
      plan: user.plan
    }

    next()
  } catch (error) {
    handleAuthError(error, res)
  }
}

// Middleware de autorización por roles
export const requirePlan = (requiredPlan: string) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const userPlan = req.user?.plan
    const planHierarchy = ['free', 'basic', 'premium', 'enterprise']
    
    const userPlanLevel = planHierarchy.indexOf(userPlan || 'free')
    const requiredPlanLevel = planHierarchy.indexOf(requiredPlan)
    
    if (userPlanLevel < requiredPlanLevel) {
      return res.status(403).json({
        success: false,
        message: 'Plan insuficiente para acceder a esta funcionalidad'
      })
    }
    
    next()
  }
}
```

## Rate Limiting y Protección DDoS

### 1. Configuración en Nginx

```nginx
# Rate limiting zones
limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
limit_req_zone $binary_remote_addr zone=login:10m rate=5r/m;
limit_req_zone $binary_remote_addr zone=register:10m rate=2r/m;

# Aplicar rate limiting
location /api/ {
    limit_req zone=api burst=20 nodelay;
    # ... resto de configuración
}

location /api/auth/login {
    limit_req zone=login burst=5 nodelay;
    # ... resto de configuración
}

location /api/auth/register {
    limit_req zone=register burst=2 nodelay;
    # ... resto de configuración
}
```

### 2. Rate Limiting en Express

```typescript
import rateLimit from 'express-rate-limit'

// Rate limiting general
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 requests por IP
  message: {
    success: false,
    message: 'Demasiadas solicitudes, intenta de nuevo más tarde'
  },
  standardHeaders: true,
  legacyHeaders: false
})

// Rate limiting estricto para autenticación
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // máximo 5 intentos de login por IP
  message: {
    success: false,
    message: 'Demasiados intentos de inicio de sesión, intenta de nuevo en 15 minutos'
  },
  skipSuccessfulRequests: true
})

// Aplicar limiters
app.use('/api/', generalLimiter)
app.use('/api/auth/login', authLimiter)
app.use('/api/auth/register', authLimiter)
```

## Seguridad de Base de Datos

### 1. Configuración Segura de MongoDB

```javascript
// Configuración de conexión segura
const mongoOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  bufferMaxEntries: 0,
  authSource: 'admin',
  ssl: process.env.NODE_ENV === 'production',
  sslValidate: true
}

mongoose.connect(process.env.MONGODB_URI!, mongoOptions)
```

### 2. Prevención de Inyección NoSQL

```typescript
import mongoSanitize from 'express-mongo-sanitize'

// Sanitizar datos de entrada
app.use(mongoSanitize({
  replaceWith: '_',
  onSanitize: ({ req, key }) => {
    console.warn(`Intento de inyección detectado: ${key} en ${req.path}`)
  }
}))

// Validación adicional en modelos
const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    validate: {
      validator: function(email: string) {
        // Validar que no contenga operadores MongoDB
        return !/[\$\.]/.test(email)
      },
      message: 'Email contiene caracteres no permitidos'
    }
  }
})
```

### 3. Índices y Optimización

```typescript
// Índices para seguridad y rendimiento
userSchema.index({ email: 1 }, { unique: true })
userSchema.index({ provider: 1, providerId: 1 }, { sparse: true })
userSchema.index({ isActive: 1 })
userSchema.index({ createdAt: 1 })

// Índice TTL para tokens de recuperación
const passwordResetSchema = new Schema({
  userId: { type: ObjectId, required: true },
  token: { type: String, required: true },
  createdAt: { 
    type: Date, 
    default: Date.now, 
    expires: 3600 // Expira en 1 hora
  }
})
```

## Logging y Monitoreo de Seguridad

### 1. Logging de Eventos de Seguridad

```typescript
import winston from 'winston'

// Configuración de logger
const securityLogger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'global-agent-ai-security' },
  transports: [
    new winston.transports.File({ 
      filename: 'logs/security.log',
      level: 'warn'
    }),
    new winston.transports.File({ 
      filename: 'logs/security-error.log',
      level: 'error'
    })
  ]
})

// Logging de eventos de seguridad
export const logSecurityEvent = (event: string, details: any, req?: Request) => {
  securityLogger.warn({
    event,
    details,
    ip: req?.ip,
    userAgent: req?.get('User-Agent'),
    timestamp: new Date().toISOString()
  })
}

// Ejemplos de uso
logSecurityEvent('FAILED_LOGIN_ATTEMPT', { email, attempts: 3 }, req)
logSecurityEvent('SUSPICIOUS_ACTIVITY', { userId, action: 'multiple_rapid_requests' }, req)
logSecurityEvent('UNAUTHORIZED_ACCESS', { endpoint: req.path, method: req.method }, req)
```

### 2. Monitoreo de Anomalías

```typescript
// Detector de anomalías simple
class SecurityMonitor {
  private failedAttempts = new Map<string, number>()
  private lastActivity = new Map<string, number>()
  
  checkFailedLogins(ip: string): boolean {
    const attempts = this.failedAttempts.get(ip) || 0
    this.failedAttempts.set(ip, attempts + 1)
    
    if (attempts >= 5) {
      logSecurityEvent('BRUTE_FORCE_DETECTED', { ip, attempts })
      return false // Bloquear
    }
    
    return true
  }
  
  resetFailedAttempts(ip: string) {
    this.failedAttempts.delete(ip)
  }
  
  checkRapidRequests(userId: string): boolean {
    const now = Date.now()
    const lastTime = this.lastActivity.get(userId) || 0
    
    if (now - lastTime < 1000) { // Menos de 1 segundo
      logSecurityEvent('RAPID_REQUESTS', { userId, interval: now - lastTime })
      return false
    }
    
    this.lastActivity.set(userId, now)
    return true
  }
}

const securityMonitor = new SecurityMonitor()
export { securityMonitor }
```

## Configuración de Firewall y Fail2Ban

### 1. Configuración UFW

```bash
#!/bin/bash
# Script de configuración de firewall

# Configurar UFW
sudo ufw default deny incoming
sudo ufw default allow outgoing

# Permitir SSH (cambiar puerto si es necesario)
sudo ufw allow 22/tcp

# Permitir HTTP y HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Permitir puertos de desarrollo (solo si es necesario)
# sudo ufw allow from 192.168.1.0/24 to any port 3000
# sudo ufw allow from 192.168.1.0/24 to any port 3001

# Activar firewall
sudo ufw enable

# Mostrar estado
sudo ufw status verbose
```

### 2. Configuración Fail2Ban

**Archivo**: `/etc/fail2ban/jail.local`

```ini
[DEFAULT]
# Configuración global
bantime = 3600          # 1 hora de ban
findtime = 600          # Ventana de tiempo de 10 minutos
maxretry = 5            # Máximo 5 intentos

# Configuración de email (opcional)
destemail = admin@tu-dominio.com
sender = fail2ban@tu-dominio.com
mta = sendmail

[sshd]
enabled = true
port = ssh
filter = sshd
logpath = /var/log/auth.log
maxretry = 3
bantime = 3600

[nginx-http-auth]
enabled = true
filter = nginx-http-auth
logpath = /var/log/nginx/error.log
maxretry = 3
bantime = 3600

[nginx-limit-req]
enabled = true
filter = nginx-limit-req
logpath = /var/log/nginx/error.log
maxretry = 10
bantime = 600

# Filtro personalizado para la aplicación
[global-agent-ai]
enabled = true
filter = global-agent-ai
logpath = /home/ubuntu/Global-agent-Ai/logs/security.log
maxretry = 5
bantime = 1800
```

**Archivo**: `/etc/fail2ban/filter.d/global-agent-ai.conf`

```ini
[Definition]
failregex = .*"event":"FAILED_LOGIN_ATTEMPT".*"ip":"<HOST>"
            .*"event":"BRUTE_FORCE_DETECTED".*"ip":"<HOST>"
            .*"event":"UNAUTHORIZED_ACCESS".*"ip":"<HOST>"

ignoreregex =
```

## Backup y Recuperación

### 1. Estrategia de Backup

```bash
#!/bin/bash
# Script de backup seguro

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/home/ubuntu/backups"
ENCRYPTION_KEY="/home/ubuntu/.backup-key"

# Crear backup encriptado de MongoDB
docker exec global-agent-ai_mongo_1 mongodump --out /tmp/backup
docker cp global-agent-ai_mongo_1:/tmp/backup ./backup_temp

# Encriptar backup
tar -czf - backup_temp | gpg --cipher-algo AES256 --compress-algo 1 --symmetric --output "$BACKUP_DIR/mongodb_$DATE.tar.gz.gpg"

# Limpiar archivos temporales
rm -rf backup_temp

# Backup de certificados SSL
tar -czf - certbot | gpg --cipher-algo AES256 --compress-algo 1 --symmetric --output "$BACKUP_DIR/ssl_$DATE.tar.gz.gpg"

# Backup de logs de seguridad
tar -czf - logs | gpg --cipher-algo AES256 --compress-algo 1 --symmetric --output "$BACKUP_DIR/logs_$DATE.tar.gz.gpg"

# Subir a almacenamiento seguro (S3, etc.)
# aws s3 cp "$BACKUP_DIR/" s3://tu-bucket-backup/ --recursive --storage-class GLACIER

# Limpiar backups locales antiguos (mantener 7 días)
find $BACKUP_DIR -name "*.gpg" -mtime +7 -delete

echo "Backup seguro completado: $DATE"
```

### 2. Plan de Recuperación

```bash
#!/bin/bash
# Script de recuperación

BACKUP_FILE=$1
RECOVERY_DIR="/tmp/recovery"

if [ -z "$BACKUP_FILE" ]; then
    echo "Uso: $0 <archivo_backup.tar.gz.gpg>"
    exit 1
fi

# Crear directorio de recuperación
mkdir -p $RECOVERY_DIR

# Desencriptar y extraer backup
gpg --decrypt "$BACKUP_FILE" | tar -xzf - -C $RECOVERY_DIR

# Detener servicios
docker-compose down

# Restaurar MongoDB
docker run --rm -v "$RECOVERY_DIR:/backup" -v "$(pwd)/mongo-data:/data/db" mongo:latest mongorestore /backup

# Restaurar certificados si es necesario
if [ -d "$RECOVERY_DIR/certbot" ]; then
    cp -r "$RECOVERY_DIR/certbot" ./
fi

# Reiniciar servicios
docker-compose up -d

# Limpiar
rm -rf $RECOVERY_DIR

echo "Recuperación completada"
```

## Auditoría y Compliance

### 1. Checklist de Seguridad

- [ ] **Autenticación**
  - [ ] Contraseñas encriptadas con bcrypt
  - [ ] Tokens JWT seguros
  - [ ] OAuth implementado correctamente
  - [ ] Rate limiting en endpoints de auth

- [ ] **Autorización**
  - [ ] Middleware de autenticación en rutas protegidas
  - [ ] Validación de permisos por rol
  - [ ] Sanitización de datos de entrada

- [ ] **Comunicación**
  - [ ] HTTPS forzado en producción
  - [ ] Certificados SSL válidos
  - [ ] Headers de seguridad configurados
  - [ ] CORS configurado restrictivamente

- [ ] **Base de Datos**
  - [ ] Conexiones seguras
  - [ ] Prevención de inyección NoSQL
  - [ ] Índices de seguridad
  - [ ] Backups encriptados

- [ ] **Infraestructura**
  - [ ] Firewall configurado
  - [ ] Fail2Ban activo
  - [ ] Monitoreo de logs
  - [ ] Actualizaciones automáticas

### 2. Reporte de Vulnerabilidades

Si encuentras una vulnerabilidad de seguridad:

1. **NO** la reportes públicamente
2. Envía un email a: security@tu-dominio.com
3. Incluye:
   - Descripción detallada
   - Pasos para reproducir
   - Impacto potencial
   - Sugerencias de mitigación

### 3. Política de Divulgación

- **Tiempo de respuesta**: 48 horas
- **Tiempo de resolución**: 30 días para vulnerabilidades críticas
- **Reconocimiento**: Hall of Fame para reportes válidos

## Contacto de Seguridad

- **Email**: security@tu-dominio.com
- **PGP Key**: [Enlace a clave pública]
- **Responsable**: Equipo de Seguridad Global Agent AI

---

**Última actualización**: $(date +%Y-%m-%d)
**Versión del documento**: 1.0
**Próxima revisión**: $(date -d "+3 months" +%Y-%m-%d)