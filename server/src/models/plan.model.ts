import mongoose, { Schema, Document } from 'mongoose';

export interface IPlan extends Document {
  name: string;
  shortDescription: string;
  monthlyPrice: number;
  annualPrice?: number;
  trialPeriodDays: number;
  requiresCardForTrial: boolean;
  isActive: boolean;
  features: {
    aiAgents: {
      numberOfAgents: number;
      allowAudio: boolean;
      allowPhoneVoice: boolean;
    };
    integrations: {
      numberOfPlatforms: number;
      dropi: boolean;
      whatsapp: boolean;
      apiAccess: boolean;
    };
    capacity: {
      conversationLimitMonthly: number;
      accessToMetrics: boolean;
      advancedDashboard: boolean;
    };
    others: {
      technicalSupport: 'email' | 'chat' | 'priority';
      smartFunnelsAccess: boolean;
      aiTemplatesAccess: boolean;
    };
  };
}

const PlanSchema: Schema = new Schema({
  name: { type: String, required: true, trim: true },
  shortDescription: { type: String, required: true, trim: true },
  monthlyPrice: { type: Number, required: true },
  annualPrice: { type: Number },
  trialPeriodDays: { type: Number, default: 0 },
  requiresCardForTrial: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  features: {
    aiAgents: {
      numberOfAgents: { type: Number, required: true },
      allowAudio: { type: Boolean, default: false },
      allowPhoneVoice: { type: Boolean, default: false },
    },
    integrations: {
      numberOfPlatforms: { type: Number, required: true },
      dropi: { type: Boolean, default: false },
      whatsapp: { type: Boolean, default: false },
      apiAccess: { type: Boolean, default: false },
    },
    capacity: {
      conversationLimitMonthly: { type: Number, required: true },
      accessToMetrics: { type: Boolean, default: false },
      advancedDashboard: { type: Boolean, default: false },
    },
    others: {
      technicalSupport: { type: String, enum: ['email', 'chat', 'priority'], default: 'email' },
      smartFunnelsAccess: { type: Boolean, default: false },
      aiTemplatesAccess: { type: Boolean, default: false },
    },
  },
}, { timestamps: true });

export default mongoose.model<IPlan>('Plan', PlanSchema);