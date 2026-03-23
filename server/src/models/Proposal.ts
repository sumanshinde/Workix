import mongoose from 'mongoose';

const proposalSchema = new mongoose.Schema({
  jobId:        { type: mongoose.Schema.Types.ObjectId, ref: 'Job',  required: true },
  freelancerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  coverLetter:  { type: String, required: true },
  bidAmount:    { type: Number, required: true },
  deliveryDays: { type: Number, required: true },
  attachments:  [{ type: String }],
  status:       { type: String, enum: ['pending', 'viewed', 'accepted', 'rejected', 'withdrawn', 'refunded'], default: 'pending' },
  isViewed:     { type: Boolean, default: false },
  
  // Lead Lock (Fair-Bid) System
  creditCost:   { type: Number, default: 2 },
  creditStatus: { type: String, enum: ['paid', 'refunded'], default: 'paid' },
}, { timestamps: true });

proposalSchema.index({ jobId: 1, freelancerId: 1 }, { unique: true });

export default mongoose.model('Proposal', proposalSchema);
