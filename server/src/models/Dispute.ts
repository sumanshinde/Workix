import mongoose from 'mongoose';

const disputeSchema = new mongoose.Schema({
  orderId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Order', 
    required: true 
  },
  milestoneId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Milestone' 
  },
  raisedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  reason: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  attachments: [{ 
    type: String 
  }],
  status: { 
    type: String, 
    enum: ['open', 'reviewing', 'resolved', 'escalated'], 
    default: 'open' 
  },
  resolution: { 
    type: String, 
    enum: ['none', 'refund', 'partial', 'release'], 
    default: 'none' 
  },
  aiSummary: { 
    type: String 
  },
  aiFaultProbability: { 
    client: { type: Number, default: 0 },
    freelancer: { type: Number, default: 0 }
  },
  aiRecommendedResolution: { 
    type: String 
  },
  adminOverride: { 
    type: Boolean, 
    default: false 
  }
}, { timestamps: true });

export default mongoose.model('Dispute', disputeSchema);
