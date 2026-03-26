import mongoose from 'mongoose';

const requirementPostSchema = new mongoose.Schema({
  title:       { type: String, required: true, trim: true, maxlength: 120 },
  category:    { type: String, required: true },
  location:    { type: String, default: '' },
  city:        { type: String, default: '' },
  pincode:     { type: String, default: '' },
  budget:      { type: Number, required: true },       // in INR
  description: { type: String, required: true, maxlength: 500 },
  image:       { type: String },                       // S3/Cloudinary URL or Base64
  features:    [{ type: String }],                     // Specific features they want
  
  // Who posted
  userId:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  // Highlighting/Boosting
  isBoosted:   { type: Boolean, default: false },
  boostOrder:  { type: String },                       // RZP order for boost if separate
  
  // Payment gate
  isPaid:      { type: Boolean, default: false },
  paymentId:   { type: String },                        // razorpay payment ID
  feePaid:     { type: Number, default: 500 },          // in paise (₹5)
  
  // Matching
  matchedFreelancers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  
  // Status
  status:      { type: String, enum: ['draft', 'pending_payment', 'active', 'fulfilled', 'expired', 'cancelled'], default: 'draft' },
  expiresAt:   { type: Date },
  
  // Analytics
  views:       { type: Number, default: 0 },
  responses:   { type: Number, default: 0 },
}, { timestamps: true });

requirementPostSchema.index({ category: 1, status: 1, city: 1 });
requirementPostSchema.index({ userId: 1, createdAt: -1 });
requirementPostSchema.index({ pincode: 1 });
requirementPostSchema.index({ title: 'text', description: 'text' });

export default mongoose.model('RequirementPost', requirementPostSchema);
