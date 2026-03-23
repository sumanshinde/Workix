import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, sparse: true },
  phone: { type: String, unique: true, sparse: true }, // For India-first mobile auth
  password: { type: String }, // Optional for SSO or legacy users
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
  badge: { type: String, enum: ['', 'Top Rated', 'Rising Talent', 'Level 1', 'Level 2', 'BharatGig Pro'], default: '' },
  isFeatured: { type: Boolean, default: false },
  
  // KYC & Verification
  isKycVerified: { type: Boolean, default: false },
  panNumber: { type: String, sparse: true },
  aadhaarHash: { type: String, sparse: true },
  upiId: { type: String, sparse: true },
  address: { type: String, default: '' },
  state: { type: String, default: 'Maharashtra' }, // Default for mock
  gstin: { type: String, sparse: true },
  
  // Lead Lock & Credits
  availableCredits: { type: Number, default: 10 },
  coins: { type: Number, default: 0 },
  subscriptionStatus: { type: String, enum: ['free', 'pro', 'enterprise'], default: 'free' },
  
  // Geolocation
  latitude: { type: Number },
  longitude: { type: Number },
  locationName: { type: String },

  // Security & Fraud Control
  riskScore: { type: Number, default: 0 },
  isFlagged: { type: Boolean, default: false },

  // Performance Metrics (Fixing TS Errors)
  avgResponseTime: { type: Number, default: 60 },
  completedJobs: { type: Number, default: 0 },
  trustScore: { type: Number, default: 75 },
  hourlyRate: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model('User', userSchema);
