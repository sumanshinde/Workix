import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  escrowId: { type: mongoose.Schema.Types.ObjectId, ref: 'Escrow' },
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  freelancerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  originalAmount: { type: Number, required: true }, // in paise
  clientFee: { type: Number, required: true }, // amount added to client's bill
  freelancerFee: { type: Number, required: true }, // amount deducted from freelancer
  platformRevenue: { type: Number, required: true }, // clientFee + freelancerFee
  netFreelancerAmount: { type: Number, required: true }, // originalAmount - freelancerFee
  currency: { type: String, default: 'INR' },
  status: { type: String, enum: ['pending', 'completed', 'refunded'], default: 'pending' }
}, { timestamps: true });

// Performance Indices
transactionSchema.index({ escrowId: 1 });
transactionSchema.index({ clientId: 1, createdAt: -1 });
transactionSchema.index({ freelancerId: 1, createdAt: -1 });
transactionSchema.index({ status: 1 });

export default mongoose.model('Transaction', transactionSchema);
