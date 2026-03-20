import mongoose from 'mongoose';

const referralSchema = new mongoose.Schema({
  referrerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  referredUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { 
    type: String, 
    enum: ['pending', 'joined', 'qualified', 'rewarded'], 
    default: 'joined' 
  },
  rewardAmount: { type: Number, default: 100000 }, // in paise (e.g. ₹1000)
  qualifiedAt: { type: Date }, // when they did their first transaction
  rewardedAt: { type: Date },
  metadata: {
    userRole: { type: String },
    ipAddress: { type: String },
  }
}, { timestamps: true });

export default mongoose.model('Referral', referralSchema);
