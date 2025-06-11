# Integración de Pasarelas de Pago

Esta documentación describe la implementación de las pasarelas de pago en Global Agent AI, incluyendo Mercado Pago y la futura integración con PayPal.

## Tecnologías Utilizadas

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express, TypeScript
- **Base de Datos**: MongoDB
- **Pasarelas de Pago**:
  - Mercado Pago (PSE y Efecty)
  - PayPal (próximamente - tarjetas de crédito/débito)

## Estructura del Proyecto

```
├── client/
│   ├── src/
│   │   ├── components/Payment/
│   │   │   ├── PlanSelector.tsx
│   │   │   └── SubscriptionManager.tsx
│   │   ├── services/
│   │   │   └── paymentService.ts
│   │   └── app/suscripciones/
│   │       └── page.tsx
├── server/
│   ├── src/
│   │   ├── controllers/
│   │   │   └── payment.controller.ts
│   │   ├── models/
│   │   │   └── subscription.model.ts
│   │   ├── routes/
│   │   │   └── payment.routes.ts
│   │   └── services/
│   │       └── mercadopago.service.ts
```

## Configuración

### 1. Variables de Entorno

Copia el archivo `.env.example` a `.env` y configura las siguientes variables:

```bash
# Mercado Pago
MERCADOPAGO_ACCESS_TOKEN=your_access_token
MERCADOPAGO_PUBLIC_KEY=your_public_key
MERCADOPAGO_WEBHOOK_SECRET=your_webhook_secret

# URLs de la aplicación
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:5000
```

### 2. Obtener Credenciales de Mercado Pago

1. Regístrate en [Mercado Pago Developers](https://www.mercadopago.com.co/developers)
2. Crea una aplicación
3. Obtén tus credenciales de prueba y producción
4. Configura las URLs de notificación (webhooks)

### 3. Configurar Webhooks

Configura la siguiente URL en tu panel de Mercado Pago:
```
https://tu-dominio.com/api/payments/mercadopago/webhook
```

## Modelos de Datos

### Subscription Model

```typescript
interface Subscription {
  userId: ObjectId;
  planId: Plan;
  status: 'active' | 'cancelled' | 'expired' | 'pending' | 'paused';
  paymentMethod: 'mercadopago_pse' | 'mercadopago_efecty' | 'paypal_card';
  mercadopagoSubscriptionId?: string;
  paypalSubscriptionId?: string;
  startDate: Date;
  endDate: Date;
  nextBillingDate?: Date;
  isTrialActive: boolean;
  trialEndDate?: Date;
  autoRenew: boolean;
  paymentHistory: PaymentRecord[];
  cancelledAt?: Date;
  cancelReason?: string;
  metadata?: Record<string, any>;
}
```

## API Endpoints

### Rutas de Pago

- `POST /api/payments/subscription` - Crear nueva suscripción
- `GET /api/payments/subscriptions` - Obtener suscripciones del usuario
- `GET /api/payments/subscription/:id` - Obtener estado de suscripción
- `PUT /api/payments/subscription/:id/cancel` - Cancelar suscripción
- `POST /api/payments/mercadopago/webhook` - Webhook de Mercado Pago

### Ejemplo de Uso

```typescript
// Crear suscripción
const subscription = await paymentService.createSubscription({
  planId: 'plan_id',
  paymentMethod: 'mercadopago_pse',
  billingType: 'monthly'
});

// Redirigir a Mercado Pago
if (subscription.success && subscription.data?.paymentUrl) {
  window.location.href = subscription.data.paymentUrl;
}
```

## Componentes Frontend

### PlanSelector

Componente para seleccionar planes y métodos de pago:

- Muestra planes disponibles
- Permite seleccionar tipo de facturación (mensual/anual)
- Calcula descuentos automáticamente
- Integra con Mercado Pago para PSE y Efecty

### SubscriptionManager

Componente para gestionar suscripciones existentes:

- Lista suscripciones activas
- Muestra historial de pagos
- Permite cancelar suscripciones
- Indica períodos de prueba

## Métodos de Pago Soportados

### Mercado Pago

1. **PSE (Débito a Cuenta)**
   - Pago directo desde cuenta bancaria
   - Disponible 24/7
   - Confirmación inmediata

2. **Efecty**
   - Pago en efectivo
   - Red de puntos físicos
   - Confirmación en 1-2 días hábiles

### PayPal (Próximamente)

- Tarjetas de crédito y débito
- PayPal balance
- Procesamiento internacional

## Flujo de Pago

1. **Selección de Plan**: Usuario elige plan y método de pago
2. **Creación de Preferencia**: Backend crea preferencia en Mercado Pago
3. **Redirección**: Usuario es redirigido a Mercado Pago
4. **Procesamiento**: Mercado Pago procesa el pago
5. **Webhook**: Mercado Pago notifica el resultado
6. **Actualización**: Backend actualiza estado de suscripción
7. **Confirmación**: Usuario recibe confirmación

## Manejo de Webhooks

El sistema maneja automáticamente las notificaciones de Mercado Pago:

- Pagos aprobados → Activa suscripción
- Pagos rechazados → Mantiene estado pendiente
- Pagos cancelados → Cancela suscripción

## Seguridad

- Validación de webhooks con firma secreta
- Tokens de acceso seguros
- Validación de datos en backend
- Sanitización de inputs
- Rate limiting en endpoints

## Testing

### Credenciales de Prueba

Usa las credenciales de prueba de Mercado Pago para desarrollo:

```bash
MERCADOPAGO_ACCESS_TOKEN=TEST-your-test-token
MERCADOPAGO_PUBLIC_KEY=TEST-your-test-public-key
```

### Tarjetas de Prueba

Para PSE, usa los datos de prueba proporcionados por Mercado Pago.

## Monitoreo y Logs

- Logs de transacciones en base de datos
- Monitoreo de webhooks
- Alertas por fallos de pago
- Métricas de conversión

## Próximas Funcionalidades

1. **Integración PayPal**
   - Pagos con tarjeta
   - Suscripciones recurrentes
   - Múltiples monedas

2. **Funcionalidades Adicionales**
   - Cupones de descuento
   - Facturación automática
   - Reportes de ingresos
   - Gestión de reembolsos

## Soporte

Para problemas relacionados con pagos:

1. Revisa los logs del servidor
2. Verifica la configuración de webhooks
3. Consulta la documentación de Mercado Pago
4. Contacta al equipo de desarrollo

## Referencias

- [Documentación Mercado Pago](https://www.mercadopago.com.co/developers)
- [SDK Mercado Pago Node.js](https://github.com/mercadopago/sdk-nodejs)
- [Webhooks Mercado Pago](https://www.mercadopago.com.co/developers/es/guides/notifications/webhooks)