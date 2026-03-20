import mongoose from 'mongoose';

const packageSchema = new mongoose.Schema({
  title:        { type: String, required: true },
  description:  { type: String },
  price:        { type: Number, required: true },
  deliveryDays: { type: Number, required: true },
  revisions:    { type: Number, default: 1 },
  features:     [{ type: String }],
}, { _id: false });

const gigSchema = new mongoose.Schema({
  freelancerId:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title:         { type: String, required: true, trim: true },
  description:   { type: String, required: true },
  category:      { type: String, required: true },
  tags:          [{ type: String }],
  images:        [{ type: String }],
  packages: {
    basic:    packageSchema,
    standard: packageSchema,
    premium:  packageSchema,
  },
  status:        { type: String, enum: ['active', 'paused', 'deleted'], default: 'active' },
  averageRating: { type: Number, default: 0 },
  totalReviews:  { type: Number, default: 0 },
  totalOrders:   { type: Number, default: 0 },
}, { timestamps: true });

gigSchema.index({ title: 'text', description: 'text' });
gigSchema.index({ category: 1, status: 1 });

export default mongoose.model('Gig', gigSchema);
