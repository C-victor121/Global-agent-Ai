import mongoose, { Schema, Document } from 'mongoose';

export interface ISubscription extends Document {
  userId: mongoose.Types.ObjectId;
  planId: mongoose.Types.ObjectId;
  status: 'active' | 'cancelled' | 'expired' | 'pending' | 'paused';
  paymentMethod: 'mercadopago_pse' | 'mercadopago_efecty' | 'paypal_card';
  mercadopagoSubscriptionId?: string;
  paypalSubscriptionId?: string;
  startDate: Date;
  endDate: Date;
  nextBillingDate?: Date;
  trialEndDate?: Date;
  isTrialActive: boolean;
  autoRenew: boolean;
  cancelledAt?: Date;
  cancelReason?: string;
  paymentHistory: {
    paymentId: string;
    amount: number;
    currency: string;
    status: 'approved' | 'pending' | 'rejected' | 'cancelled';
    paymentMethod: string;
    paidAt?: Date;
    mercadopagoData?: any;
    paypalData?: any;
  }[];
  metadata?: {
    mercadopagoPreferenceId?: string;
    lastPaymentAttempt?: Date;
    failedPaymentAttempts?: number;
  };
}

const SubscriptionSchema: Schema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  planId: {
    type: Schema.Types.ObjectId,
    ref: 'Plan',
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'cancelled', 'expired', 'pending', 'paused'],
    default: 'pending',
    index: true
  },
  paymentMethod: {
    type: String,
    enum: ['mercadopago_pse', 'mercadopago_efecty', 'paypal_card'],
    required: true
  },
  mercadopagoSubscriptionId: {
    type: String,
    sparse: true,
    index: true
  },
  paypalSubscriptionId: {
    type: String,
    sparse: true,
    index: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  nextBillingDate: {
    type: Date
  },
  trialEndDate: {
    type: Date
  },
  isTrialActive: {
    type: Boolean,
    default: false
  },
  autoRenew: {
    type: Boolean,
    default: true
  },
  cancelledAt: {
    type: Date
  },
  cancelReason: {
    type: String
  },
  paymentHistory: [{
    paymentId: {
      type: String,
      required: true
    },
    amount: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      default: 'COP'
    },
    status: {
      type: String,
      enum: ['approved', 'pending', 'rejected', 'cancelled'],
      required: true
    },
    paymentMethod: {
      type: String,
      required: true
    },
    paidAt: {
      type: Date
    },
    mercadopagoData: {
      type: Schema.Types.Mixed
    },
    paypalData: {
      type: Schema.Types.Mixed
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  metadata: {
    mercadopagoPreferenceId: String,
    lastPaymentAttempt: Date,
    failedPaymentAttempts: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true,
  versionKey: false
});

// Índices compuestos para consultas eficientes
SubscriptionSchema.index({ userId: 1, status: 1 });
SubscriptionSchema.index({ status: 1, nextBillingDate: 1 });
SubscriptionSchema.index({ mercadopagoSubscriptionId: 1 }, { sparse: true });
SubscriptionSchema.index({ paypalSubscriptionId: 1 }, { sparse: true });

export default mongoose.model<ISubscription>('Subscription', SubscriptionSchema);