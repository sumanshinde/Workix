import mongoose from 'mongoose';

const coinTransactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  type: { type: String, enum: ['CREDIT', 'DEBIT'], required: true },
  reason: { type: String, required: true }, // 'PLAN_PURCHASE', 'POST_JOB_DESIGN', etc.
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('CoinTransaction', coinTransactionSchema);
