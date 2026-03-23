import { Request, Response } from 'express';
import User from '../models/User';
import Dispute from '../models/Dispute';
import aiService from '../services/aiService';

export const getCreditScore = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // 1. Gather metrics
    const disputeCount = await Dispute.countDocuments({ 
       $or: [{ freelancerId: userId }, { orderId: { $in: await Dispute.find({ raisedBy: userId }).distinct('orderId') } }],
       status: 'resolved' 
    });

    const metrics = {
       rating: user.rating || 0,
       disputes: disputeCount,
       earnings: user.referralEarnings || 0, // Mocking earnings from referrals for now
       responseTime: user.avgResponseTime || 60,
       kyc: user.isKycVerified ? 'Verified' : 'Pending'
    };

    // 2. AI Scoring
    const scoring = await aiService.calculateCreditScore(metrics);

    res.json(scoring);
  } catch (err: any) {
    res.status(500).json({ message: 'Scoring failed', error: err.message });
  }
};
