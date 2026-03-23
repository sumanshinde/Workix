import mongoose from 'mongoose';

const walletSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true, 
    unique: true 
  },
  balance: { 
    type: Number, 
    default: 0 
  }, // stored in paise/cents of the primary currency (usually converted to INR for unified tracking)
  currency: { 
    type: String, 
    default: 'INR' 
  },
  stripeAccountId: { 
    type: String 
  }, // For Stripe Connect payouts
  razorpayAccountId: { 
    type: String 
  } // For Razorpay Route payouts
}, { timestamps: true });

const transactionSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  walletId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Wallet', 
    required: true 
  },
  type: { 
    type: String, 
    enum: ['deposit', 'withdrawal', 'payout', 'refund'], 
    required: true 
  },
  amount: { 
    type: Number, 
    required: true 
  },
  currency: { 
    type: String, 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['pending', 'completed', 'failed'], 
    default: 'pending' 
  },
  paymentGateway: { 
    type: String, 
    enum: ['stripe', 'razorpay'] 
  },
  gatewayTransactionId: { 
    type: String 
  }
}, { timestamps: true });

export { walletSchema };
export const Wallet = mongoose.model('Wallet', walletSchema);
export const Transaction = mongoose.model('WalletTransaction', transactionSchema);
