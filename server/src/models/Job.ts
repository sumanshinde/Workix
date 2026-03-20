import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  title:           { type: String, required: true, trim: true },
  description:     { type: String, required: true },
  category:        { type: String, required: true },
  skills:          [{ type: String }],
  budget:          { type: Number, required: true },
  budgetType:      { type: String, enum: ['fixed', 'hourly'], default: 'fixed' },
  budgetMin:       { type: Number },
  budgetMax:       { type: Number },
  experienceLevel: { type: String, enum: ['entry', 'intermediate', 'expert'], default: 'intermediate' },
  scope:           { type: String, enum: ['small', 'medium', 'large'], default: 'medium' },
  deadline:        { type: Date },
  status:          { type: String, enum: ['open', 'in_progress', 'completed', 'cancelled', 'closed'], default: 'open' },
  isFeatured:      { type: Boolean, default: false },
  clientId:        { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  proposals:       [{ type: mongoose.Schema.Types.ObjectId, ref: 'Proposal' }],
  views:           { type: Number, default: 0 },
}, { timestamps: true });

jobSchema.index({ title: 'text', description: 'text' });
jobSchema.index({ category: 1, status: 1 });

export default mongoose.model('Job', jobSchema);
