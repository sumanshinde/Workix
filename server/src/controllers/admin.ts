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
