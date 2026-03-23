import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const otpSchema = new mongoose.Schema({
  phone: { 
    type: String, 
    required: true, 
    index: true 
  },
  code: { 
    type: String, 
    required: true 
  },
  expiresAt: { 
    type: Date, 
    required: true, 
    index: { expires: '5m' } // TTL index: auto-delete after 5 min
  },
  attempts: { 
    type: Number, 
    default: 0 
  }
}, { timestamps: true });

// Hash OTP before saving
otpSchema.pre('save', async function() {
  if (this.isModified('code')) {
    this.code = await bcrypt.hash(this.code, 10);
  }
});

// Compare OTP method
otpSchema.methods.compareOTP = async function(candidateOTP: string) {
  return await bcrypt.compare(candidateOTP, (this as any).code);
};

export default mongoose.model('OTP', otpSchema);
