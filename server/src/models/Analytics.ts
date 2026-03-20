import mongoose from 'mongoose';

const analyticsSchema = new mongoose.Schema({
  event: { type: String, required: true }, // e.g., 'onboarding_complete', 'checkout_success'
  category: { type: String, enum: ['onboarding', 'profile', 'growth', 'payment', 'system'], required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  metadata: { type: Object }, // e.g., { role: 'freelancer', amount: 50000, variant: 'blue_button' }
  timestamp: { type: Date, default: Date.now },
  sessionId: { type: String }
}, { timestamps: true });

// Index for fast reporting
analyticsSchema.index({ event: 1, timestamp: -1 });
analyticsSchema.index({ category: 1 });

export default mongoose.model('Analytics', analyticsSchema);
