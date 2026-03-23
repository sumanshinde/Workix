import mongoose from 'mongoose';

const milestoneSchema = new mongoose.Schema({
  orderId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Order', 
    required: true 
  },
  title: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String 
  },
  amount: { 
    type: Number, 
    required: true 
  }, // in paise
  status: { 
    type: String, 
    enum: ['pending', 'funded', 'released', 'disputed'], 
    default: 'pending' 
  },
  razorpayTransferId: { 
    type: String 
  }, // The transfer ID from Razorpay Route
  fundedAt: { 
    type: Date 
  },
  releasedAt: { 
    type: Date 
  }
}, { timestamps: true });

export default mongoose.model('Milestone', milestoneSchema);
