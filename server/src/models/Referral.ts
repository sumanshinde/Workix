import mongoose from 'mongoose';

const referralSchema = new mongoose.Schema({
  referrerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  referredUserId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true,
    unique: true
  },
  referralCode: { 
    type: String, 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['pending', 'joined', 'qualified', 'rewarded'], 
    default: 'joined' 
  },
  rewardAmount: { 
    type: Number, 
    default: 10000 
  }, // in paise (e.g. ₹100)
  tier: { 
    type: Number, 
    default: 1 
  }, // 1: Direct, 2: Secondary
  qualifiedAt: { 
    type: Date 
  },
  rewardedAt: { 
    type: Date 
  }
}, { timestamps: true });

export default mongoose.model('Referral', referralSchema);
