import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true,
    unique: true
  },
  planId: { type: String, required: true }, // Razorpay Plan ID
  subscriptionId: { type: String, required: true, unique: true }, // Razorpay Subscription ID
  status: { 
    type: String, 
    enum: ['created', 'authenticated', 'active', 'pending', 'halted', 'cancelled', 'completed', 'expired'], 
    default: 'created' 
  },
  currentStart: { type: Date },
  currentEnd: { type: Date },
  endedAt: { type: Date },
  cancelAtPeriodEnd: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model('Subscription', subscriptionSchema);
