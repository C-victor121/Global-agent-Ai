import { Schema, model, Document } from 'mongoose';

export interface IContentGeneration extends Document {
  userId: Schema.Types.ObjectId;
  intencion: string;
  tono: string;
  objetivo: string;
  producto_servicio: string;
  audiencia: string;
  palabras_clave: string;
  longitud: string;
  formato: string;
  generatedText?: string; // Texto generado por n8n
  n8nWebhookResponse?: any; // Respuesta completa del webhook de n8n por si se necesita para debug
  createdAt: Date;
}

const ContentGenerationSchema = new Schema<IContentGeneration>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // Asumiendo que tienes un modelo User
  intencion: { type: String, required: true },
  tono: { type: String, required: true },
  objetivo: { type: String, required: true },
  producto_servicio: { type: String, required: true },
  audiencia: { type: String, required: true },
  palabras_clave: { type: String, required: true },
  longitud: { type: String, required: true },
  formato: { type: String, required: true },
  generatedText: { type: String },
  n8nWebhookResponse: { type: Schema.Types.Mixed }, 
  createdAt: { type: Date, default: Date.now },
});

export default model<IContentGeneration>('ContentGeneration', ContentGenerationSchema);