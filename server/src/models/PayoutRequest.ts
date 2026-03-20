import mongoose from 'mongoose';

const payoutRequestSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true }, // in paise
  currency: { type: String, default: 'INR' },
  payoutMethodId: { type: mongoose.Schema.Types.ObjectId, ref: 'PayoutMethod', required: true },
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected', 'processing', 'processed', 'reversed', 'failed'], 
    default: 'pending' 
  },
  payoutId: { type: String }, // Razorpay Payout ID
  failureReason: { type: String },
  adminNotes: { type: String },
  processedAt: { type: Date }
}, { timestamps: true });

export default mongoose.model('PayoutRequest', payoutRequestSchema);
