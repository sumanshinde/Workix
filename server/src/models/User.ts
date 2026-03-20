import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: function(this: any) { 
    return !this.googleId && !this.githubId && !this.linkedinId; 
  }},
  role: { type: String, enum: ['client', 'freelancer', 'admin'], default: 'freelancer' },
  avatar: { type: String, default: '' },
  googleId: { type: String, unique: true, sparse: true },
  githubId: { type: String, unique: true, sparse: true },
  linkedinId: { type: String, unique: true, sparse: true },
  description: { type: String, default: '' },
  skills: [{ type: String }],
  walletBalance: { type: Number, default: 0 }, // in paise
  referralCode: { type: String, unique: true, sparse: true },
  referredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  referralEarnings: { type: Number, default: 0 },
  
  // Growth & Ranking
  rating: { type: Number, default: 0 },
  reviewsCount: { type: Number, default: 0 },
  badge: { type: String, enum: ['', 'Top Rated', 'Rising Talent', 'Level 1', 'Level 2'], default: '' },
  isFeatured: { type: Boolean, default: false },
  isVerified: { type: Boolean, default: false },
  
  // Security & Fraud Control
  riskScore: { type: Number, default: 0 },
  isFlagged: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model('User', userSchema);
