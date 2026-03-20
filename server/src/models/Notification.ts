import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['payment', 'payout', 'dispute', 'milestone', 'system', 'message'], 
    default: 'system' 
  },
  isRead: { type: Boolean, default: false },
  link: { type: String } // optional link to a page (e.g., /dashboard/disputes)
}, { timestamps: true });

// Performance Indices
notificationSchema.index({ userId: 1, createdAt: -1 });
notificationSchema.index({ userId: 1, isRead: 1 });

export default mongoose.model('Notification', notificationSchema);
