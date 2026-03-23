import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema({
  adminId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  action: { 
    type: String, 
    required: true 
  }, // e.g. 'resolve_dispute', 'override_payout'
  targetType: { 
    type: String, 
    required: true 
  }, // 'Dispute', 'User', 'Order'
  targetId: { 
    type: String, 
    required: true 
  },
  reason: { 
    type: String 
  },
  metadata: { 
    type: mongoose.Schema.Types.Mixed 
  }
}, { timestamps: true });

export default mongoose.model('AuditLog', auditLogSchema);
