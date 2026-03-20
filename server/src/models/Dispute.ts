import mongoose from 'mongoose';

const disputeSchema = new mongoose.Schema({
  escrowId: { type: mongoose.Schema.Types.ObjectId, ref: 'Escrow', required: true },
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  freelancerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  raisedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  reason: { type: String, required: true },
  description: { type: String, required: true },
  evidence: [{ type: String }], // Array of file URLs
  status: { 
    type: String, 
    enum: ['open', 'under_review', 'resolved', 'rejected'], 
    default: 'open' 
  },
  resolution: { 
    type: String, 
    enum: ['refund_to_client', 'release_to_freelancer', 'split_payment', 'none'], 
    default: 'none' 
  },
  adminNotes: { type: String },
  resolvedAt: { type: Date }
}, { timestamps: true });

export default mongoose.model('Dispute', disputeSchema);
