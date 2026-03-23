import mongoose from 'mongoose';

const onboardingSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true,
    unique: true
  },
  role: { 
    type: String, 
    enum: ['client', 'freelancer', 'unassigned'], 
    default: 'unassigned' 
  },
  completedSteps: [{ 
    type: String 
  }],
  progress: { 
    type: Number, 
    default: 0 
  },
  isCompleted: { 
    type: Boolean, 
    default: false 
  },
  onboardingRewardClaimed: { 
    type: Boolean, 
    default: false 
  }
}, { timestamps: true });

export default mongoose.model('Onboarding', onboardingSchema);
