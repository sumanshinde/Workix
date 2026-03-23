import mongoose from 'mongoose';

const leadSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true 
  },
  company: { 
    type: String 
  },
  requirement: { 
    type: String, 
    required: true 
  },
  source: { 
    type: String, 
    default: 'landing_page' 
  },
  status: { 
    type: String, 
    enum: ['new', 'contacted', 'qualified', 'converted', 'lost'], 
    default: 'new' 
  },
  isManagedLead: { 
    type: Boolean, 
    default: false 
  },
  notes: [{
    text: { type: String },
    adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

export default mongoose.model('Lead', leadSchema);
