import mongoose from 'mongoose';

const escrowSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true }, // Razorpay Order ID
  paymentId: { type: String }, // Razorpay Payment ID (after success)
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' },
  gigId: { type: mongoose.Schema.Types.ObjectId, ref: 'Gig' },
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  freelancerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  originalAmount: { type: Number, required: true }, // base price in paise
  clientFee: { type: Number, required: true }, // paise
  freelancerFee: { type: Number, required: true }, // paise
  totalAmount: { type: Number, required: true }, // originalAmount + clientFee
  netFreelancerAmount: { type: Number, required: true }, // originalAmount - freelancerFee
  currency: { type: String, default: 'INR' },
  status: { 
    type: String, 
    enum: ['created', 'captured', 'escrowed', 'released', 'refunded', 'disputed', 'failed'], 
    default: 'created' 
  },
  paymentStatus: { type: String, default: 'pending' }, // Razorpay payment status
  payoutId: { type: String }, // For releasing funds later
}, { timestamps: true });

// Performance Indices
escrowSchema.index({ clientId: 1, status: 1 });
escrowSchema.index({ freelancerId: 1, status: 1 });
escrowSchema.index({ orderId: 1 });

export default mongoose.model('Escrow', escrowSchema);
