import mongoose from 'mongoose';

const adSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String },
  adType: { type: String, enum: ['PROMOTION', 'SERVICE'], default: 'PROMOTION' },
  target: { type: String, enum: ['USER', 'FREELANCER', 'BOTH'], default: 'BOTH' },
  location: { type: String },
  latitude: { type: Number },
  longitude: { type: Number },
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  isActive: { type: Boolean, default: true },
  budget: { type: Number, default: 0 },
  clicks: { type: Number, default: 0 },
  views: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model('Ad', adSchema);
