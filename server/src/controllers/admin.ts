import { Request, Response } from 'express';
import ActivityLog from '../models/ActivityLog';
import Message from '../models/Message';

export const getActivityLogs = async (req: Request, res: Response) => {
  try {
    const logs = await ActivityLog.find()
      .populate('userId', 'name email role')
      .sort({ createdAt: -1 })
      .limit(100);
    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ error: 'Server error retrieving activities' });
  }
};

export const getMessages = async (req: Request, res: Response) => {
  try {
    const messages = await Message.find()
      .populate('senderId', 'name email role')
      .populate('receiverId', 'name email role')
      .sort({ createdAt: -1 })
      .limit(200);
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Server error retrieving messages' });
  }
};

export const getUserActivities = async (req: Request, res: Response) => {
  try {
    const logs = await ActivityLog.find({ userId: req.params.id })
      .populate('userId', 'name email role riskScore isFlagged')
      .sort({ createdAt: -1 });
      
    const User = require('../models/User').default;
    const user = await User.findById(req.params.id).select('-password');
    res.status(200).json({ user, logs });
  } catch (error) {
    res.status(500).json({ error: 'Server error retrieving user timeline' });
  }
};

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const User = require('../models/User').default;
    const usersCount = await User.countDocuments();
    const chatsCount = await Message.countDocuments();
    
    // Calculate simple revenue
    const Payment = require('../models/Transaction').default || require('../models/Escrow').default;
    const payments = await Payment?.find() || [];
    const revenue = payments.reduce((acc: any, curr: any) => acc + (curr.amount || 0), 0);

    // Get live user metrics
    const flaggedUsers = await User.countDocuments({ isFlagged: true });

    res.status(200).json({
      liveUsers: usersCount,
      liveChats: chatsCount,
      totalRevenue: revenue,
      signups: usersCount,
      flaggedUsers
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Server error retrieving stats' });
  }
};

// ── Dispute Tribunal ─────────────────────────────────────────────────────────
export const getAllDisputes = async (req: Request, res: Response) => {
  try {
    const Dispute = require('../models/Dispute').default;
    const disputes = await Dispute.find()
      .populate('orderId')
      .populate('freelancerId', 'name email trustScore')
      .populate('clientId', 'name email trustScore')
      .sort({ createdAt: -1 });

    res.json(disputes);
  } catch (err: any) {
    res.status(500).json({ message: 'Fetch failed', error: err.message });
  }
};

export const resolveDisputeFinal = async (req: Request, res: Response) => {
  try {
    const { disputeId, decision, reason, splitAmount } = req.body;
    const adminId = (req as any).user.id;
    const Dispute = require('../models/Dispute').default;
    const Escrow = require('../models/Escrow').default;
    const AuditLog = require('../models/AuditLog').default;
    const User = require('../models/User').default;

    const dispute = await Dispute.findById(disputeId);
    if (!dispute) return res.status(404).json({ message: 'Dispute not found' });

    const escrow = await Escrow.findOne({ orderId: dispute.orderId });
    if (!escrow) return res.status(404).json({ message: 'Escrow not found' });

    let finalAction = decision;
    if (finalAction === 'refund') {
       escrow.status = 'refunded';
       await User.findByIdAndUpdate(dispute.freelancerId, { $inc: { trustScore: -5 } });
    } else if (finalAction === 'release') {
       escrow.status = 'released';
       await User.findByIdAndUpdate(dispute.clientId, { $inc: { trustScore: -5 } });
    }
    await escrow.save();

    dispute.status = 'resolved';
    dispute.resolution = finalAction;
    await dispute.save();

    await AuditLog.create({
       adminId,
       action: `finalize_dispute_${finalAction}`,
       targetType: 'Dispute',
       targetId: disputeId,
       reason
    });

    res.json({ message: 'Dispute resolved', dispute });
  } catch (err: any) {
    res.status(500).json({ message: 'Resolution failed', error: err.message });
  }
};
