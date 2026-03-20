import mongoose from 'mongoose';

const platformFeeSchema = new mongoose.Schema({
  clientFeePercent: { type: Number, default: 5 }, // e.g., 5%
  freelancerFeePercent: { type: Number, default: 10 }, // e.g., 10%
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model('PlatformFee', platformFeeSchema);
