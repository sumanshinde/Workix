import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  fromUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  toUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  role: { type: String, enum: ['client', 'freelancer'], required: true } // who is giving the review
}, { timestamps: true });

// Performance Indices
reviewSchema.index({ toUserId: 1, createdAt: -1 });
reviewSchema.index({ jobId: 1 });

export default mongoose.model('Review', reviewSchema);
