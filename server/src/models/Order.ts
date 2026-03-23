import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  clientId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  freelancerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  jobId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Job', 
    required: true 
  },
  amount: { 
    type: Number, 
    required: true 
  }, // in paise
  status: { 
    type: String, 
    enum: ['pending', 'active', 'completed', 'cancelled', 'disputed'], 
    default: 'pending' 
  },
  paymentId: { 
    type: String 
  }, // Razorpay Payment ID
  razorpayOrderId: { 
    type: String 
  },
  isPaid: { 
    type: Boolean, 
    default: false 
  }
}, { timestamps: true });

export default mongoose.model('Order', orderSchema);
