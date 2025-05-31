import { Schema, model, Document, Types } from 'mongoose';

export interface IMessage extends Document {
  conversationId: Types.ObjectId;
  senderId: string; // Puede ser 'user:{userId}' o 'agent:{agentId}' o 'twilio:{phoneNumber}'
  receiverId: string; // Puede ser 'user:{userId}' o 'agent:{agentId}' o 'twilio:{phoneNumber}'
  twilioMessageSid?: string; // ID único del mensaje de Twilio
  body: string;
  timestamp: Date;
  status: 'sent' | 'delivered' | 'read' | 'failed' | 'received'; // 'received' para mensajes entrantes
  mediaUrl?: string; // Para mensajes MMS
  mediaContentType?: string; // Para mensajes MMS
}

const messageSchema = new Schema<IMessage>(
  {
    conversationId: { type: Schema.Types.ObjectId, ref: 'Conversation', required: true },
    senderId: { type: String, required: true },
    receiverId: { type: String, required: true },
    twilioMessageSid: { type: String, unique: true, sparse: true }, // sparse: true permite múltiples documentos con twilioMessageSid nulo
    body: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ['sent', 'delivered', 'read', 'failed', 'received'],
      default: 'sent',
    },
    mediaUrl: { type: String },
    mediaContentType: { type: String },
  },
  { timestamps: true } // Agrega createdAt y updatedAt automáticamente
);

export const Message = model<IMessage>('Message', messageSchema);