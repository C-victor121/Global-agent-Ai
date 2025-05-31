import { Schema, model, Document, Types } from 'mongoose';
import { IMessage } from './message.model'; // Asegúrate de que la ruta sea correcta

export interface IConversation extends Document {
  userId: Types.ObjectId; // ID del usuario de la plataforma al que pertenece esta conversación
  contactPhoneNumber: string; // Número de teléfono del contacto externo (ej. cliente de WhatsApp)
  platformPhoneNumber: string; // Número de teléfono de Twilio de la plataforma usado en esta conversación
  lastMessage?: Types.ObjectId | IMessage; // Referencia al último mensaje
  unreadCount: number;
  status: 'open' | 'closed' | 'pending';
  createdAt: Date;
  updatedAt: Date;
}

const conversationSchema = new Schema<IConversation>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    contactPhoneNumber: { type: String, required: true },
    platformPhoneNumber: { type: String, required: true },
    lastMessage: { type: Schema.Types.ObjectId, ref: 'Message' },
    unreadCount: { type: Number, default: 0 },
    status: { type: String, enum: ['open', 'closed', 'pending'], default: 'open' },
  },
  {
    timestamps: true, // Agrega createdAt y updatedAt automáticamente
    // Asegurar que la combinación de userId, contactPhoneNumber y platformPhoneNumber sea única
    // para evitar duplicados de conversaciones para el mismo usuario y contacto con el mismo número de Twilio.
    // Esto es opcional y depende de la lógica de negocio.
    // indexes: [{ unique: true, fields: ['userId', 'contactPhoneNumber', 'platformPhoneNumber'] }]
  }
);

// Middleware para actualizar unreadCount o realizar otras acciones antes de guardar (opcional)
// conversationSchema.pre('save', async function (next) {
//   if (this.isModified('messages')) {
//     // Lógica para actualizar unreadCount o lastMessage
//   }
//   next();
// });

export const Conversation = model<IConversation>('Conversation', conversationSchema);