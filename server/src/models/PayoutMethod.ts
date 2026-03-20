import mongoose from 'mongoose';

const payoutMethodSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  contactId: { type: String, required: true }, // RazorpayX Contact ID
  fundAccountId: { type: String, required: true }, // RazorpayX Fund Account ID
  accountType: { type: String, enum: ['bank_account', 'vpa'], required: true },
  details: {
    accountNumber: String,
    ifsc: String,
    vpa: String, // UPI ID
    name: String
  },
  isVerified: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model('PayoutMethod', payoutMethodSchema);
