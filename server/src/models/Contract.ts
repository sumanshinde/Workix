import mongoose from 'mongoose';

const contractSchema = new mongoose.Schema({
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  proposalId: { type: mongoose.Schema.Types.ObjectId, ref: 'Proposal', required: true },
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  freelancerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true }, // Total amount in paise
  currency: { type: String, default: 'INR' },
  status: { 
    type: String, 
    enum: ['active', 'completed', 'disputed', 'cancelled', 'pending_approval'], 
    default: 'active' 
  },
  workSubmission: [{
    content: String,
    attachments: [String],
    submittedAt: { type: Date, default: Date.now },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' }
  }],
  paymentStatus: { 
    type: String, 
    enum: ['pending', 'escrowed', 'released', 'refunded'], 
    default: 'pending' 
  },
  escrowId: { type: mongoose.Schema.Types.ObjectId, ref: 'Escrow' },
}, { timestamps: true });

contractSchema.index({ clientId: 1, status: 1 });
contractSchema.index({ freelancerId: 1, status: 1 });
contractSchema.index({ jobId: 1 }, { unique: true });

export default mongoose.model('Contract', contractSchema);
