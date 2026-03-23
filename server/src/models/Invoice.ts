import mongoose from 'mongoose';

const invoiceSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  clientId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  orderId: { 
    type: String, 
    required: true 
  },
  milestoneId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Milestone' 
  },
  invoiceNumber: { 
    type: String, 
    unique: true, 
    required: true 
  },
  baseAmount: { 
    type: Number, 
    required: true 
  }, // in paise
  gstAmount: { 
    type: Number, 
    required: true 
  },
  totalAmount: { 
    type: Number, 
    required: true 
  },
  gstType: { 
    type: String, 
    enum: ['CGST+SGST', 'IGST', 'NONE'], 
    default: 'NONE' 
  },
  taxBreakdown: {
    cgst: { type: Number, default: 0 },
    sgst: { type: Number, default: 0 },
    igst: { type: Number, default: 0 }
  },
  status: { 
    type: String, 
    enum: ['draft', 'issued', 'paid', 'cancelled'], 
    default: 'issued' 
  },
  pdfUrl: { 
    type: String 
  }
}, { timestamps: true });

export default mongoose.model('Invoice', invoiceSchema);
