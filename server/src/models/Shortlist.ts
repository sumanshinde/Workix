import mongoose from 'mongoose';

const shortlistSchema = new mongoose.Schema({
  leadId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Lead', 
    required: true 
  },
  freelancers: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    relevanceNote: { type: String },
    matchScore: { type: Number, default: 90 }
  }],
  notes: { 
    type: String 
  },
  status: { 
    type: String, 
    enum: ['draft', 'sent', 'approved', 'rejected'], 
    default: 'draft' 
  },
  expiresAt: { 
    type: Date 
  }
}, { timestamps: true });

export default mongoose.model('Shortlist', shortlistSchema);
