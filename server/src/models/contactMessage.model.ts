import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IContactMessage extends Document {
  userId: Types.ObjectId;
  // Información del visitante
  visitorName: string;
  visitorEmail: string;
  visitorPhone?: string;
  // Contenido del mensaje
  subject?: string;
  message: string;
  // Información del sitio WordPress
  wordpressUrl: string;
  formId?: string;
  // Respuesta generada por IA
  aiResponse?: string;
  responseStatus: 'pending' | 'generated' | 'sent' | 'failed';
  // Metadatos
  ipAddress?: string;
  userAgent?: string;
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

const contactMessageSchema = new Schema<IContactMessage>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Información del visitante
  visitorName: {
    type: String,
    required: [true, 'El nombre del visitante es requerido'],
    trim: true,
    maxlength: [100, 'El nombre no puede tener más de 100 caracteres']
  },
  visitorEmail: {
    type: String,
    required: [true, 'El email del visitante es requerido'],
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Por favor ingrese un correo electrónico válido']
  },
  visitorPhone: {
    type: String,
    trim: true,
    maxlength: [20, 'El teléfono no puede tener más de 20 caracteres']
  },
  // Contenido del mensaje
  subject: {
    type: String,
    trim: true,
    maxlength: [200, 'El asunto no puede tener más de 200 caracteres']
  },
  message: {
    type: String,
    required: [true, 'El mensaje es requerido'],
    trim: true,
    maxlength: [5000, 'El mensaje no puede tener más de 5000 caracteres']
  },
  // Información del sitio WordPress
  wordpressUrl: {
    type: String,
    required: [true, 'La URL de WordPress es requerida'],
    trim: true
  },
  formId: {
    type: String,
    trim: true
  },
  // Respuesta generada por IA
  aiResponse: {
    type: String,
    trim: true
  },
  responseStatus: {
    type: String,
    enum: ['pending', 'generated', 'sent', 'failed'],
    default: 'pending'
  },
  // Metadatos
  ipAddress: {
    type: String,
    trim: true
  },
  userAgent: {
    type: String,
    trim: true
  }
}, {
  timestamps: true,
  versionKey: false
});

// Índices para mejorar el rendimiento
contactMessageSchema.index({ userId: 1, createdAt: -1 });
contactMessageSchema.index({ responseStatus: 1 });
contactMessageSchema.index({ visitorEmail: 1 });

const ContactMessage = mongoose.models.ContactMessage || mongoose.model('ContactMessage', contactMessageSchema);

export default ContactMessage;