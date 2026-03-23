import mongoose from 'mongoose';

const readyAppSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  demoUrl: { type: String },
  buyPrice: { type: Number, required: true },
  images: [{ type: String }],
  features: [{ type: String }],
  developerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category: { type: String, enum: ['Mobile', 'Web', 'Desktop', 'AI', 'Blockchain'], default: 'Web' },
  isFeatured: { type: Boolean, default: false },
  version: { type: String, default: '1.0.0' },
  salesCount: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model('ReadyApp', readyAppSchema);
