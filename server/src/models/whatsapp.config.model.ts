import { Schema, model, Document } from 'mongoose';

export interface IWhatsAppConfig extends Document {
  userId: Schema.Types.ObjectId; // Referencia al modelo User
  facebookId: string; // ID de usuario de Facebook (si es diferente del userId de Auth0)
  accessToken: string; // Token de acceso de larga duración para la API de Meta
  businessId?: string; // ID de la cuenta comercial de Meta
  wabaId: string; // WhatsApp Business Account ID
  phoneNumberId: string; // ID del número de teléfono registrado en WhatsApp
  webhookUrl?: string; // URL del webhook de n8n (o el webhook interno si se procesa primero)
  // Otros campos que puedan ser necesarios, como fecha de expiración del token, etc.
  tokenExpiresAt?: Date;
  isWebhookConfigured?: boolean;
  trialStartDate?: Date; // Fecha de inicio de la prueba gratuita
  trialEndDate?: Date;   // Fecha de fin de la prueba gratuita
}

const WhatsAppConfigSchema = new Schema<IWhatsAppConfig>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true, // Cada usuario solo puede tener una configuración de WhatsApp
    },
    facebookId: {
      type: String,
      required: true, // Asumiendo que se obtiene del login de Meta
    },
    accessToken: {
      type: String,
      required: true,
    },
    businessId: {
      type: String,
      // Puede que no siempre se obtenga o necesite directamente si se usa el token del sistema
    },
    wabaId: {
      type: String,
      required: true,
    },
    phoneNumberId: {
      type: String,
      required: true,
    },
    webhookUrl: {
      type: String, // URL del webhook de n8n proporcionada por el usuario o configurada
    },
    tokenExpiresAt: {
      type: Date,
    },
    isWebhookConfigured: {
      type: Boolean,
      default: false,
    },
    trialStartDate: {
      type: Date,
    },
    trialEndDate: {
      type: Date,
    }
  },
  {
    timestamps: true, // Para createdAt y updatedAt
  }
);

const WhatsAppConfig = model<IWhatsAppConfig>('WhatsAppConfig', WhatsAppConfigSchema);

export default WhatsAppConfig;