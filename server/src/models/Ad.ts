import mongoose from 'mongoose';

const adSchema = new mongoose.Schema({
  // ── Original Fields (unchanged) ──
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String },
  adType: { type: String, enum: ['PROMOTION', 'SERVICE', 'post', 'image', 'category'], default: 'PROMOTION' },
  target: { type: String, enum: ['USER', 'FREELANCER', 'BOTH'], default: 'BOTH' },
  location: { type: String },
  latitude: { type: Number },
  longitude: { type: Number },
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  isActive: { type: Boolean, default: true },
  budget: { type: Number, default: 0 },
  clicks: { type: Number, default: 0 },
  views: { type: Number, default: 0 },

  // ── GigIndia Marketplace Layer (new) ──
  // Duration-based pricing
  durationDays: { type: Number, default: 7, min: 1, max: 90 },
  pricePerDay:  { type: Number, default: 0 },   // in paise, auto-calculated
  totalPrice:   { type: Number, default: 0 },    // in paise, auto-calculated
  
  // Payment gate
  isPaid:       { type: Boolean, default: false },
  paymentId:    { type: String },                // razorpay payment ID
  
  // Scheduling
  startsAt:     { type: Date },
  expiresAt:    { type: Date },
  
  // Status workflow
  status:       { type: String, enum: ['draft', 'pending_payment', 'active', 'paused', 'expired', 'rejected'], default: 'draft' },
  
  // Category / boost
  category:     { type: String, default: '' },
  isBoosted:    { type: Boolean, default: false },
  
  // Admin review
  adminApproved: { type: Boolean, default: true },
  rejectionReason: { type: String, default: '' },
}, { timestamps: true });

adSchema.index({ ownerId: 1, createdAt: -1 });
adSchema.index({ status: 1, expiresAt: 1 });
adSchema.index({ category: 1, isActive: 1 });

export default mongoose.model('Ad', adSchema);

