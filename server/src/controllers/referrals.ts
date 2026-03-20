import { Request, Response } from 'express';
import User from '../models/User';
import Referral from '../models/Referral';

export const getReferralStats = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findById(userId).select('referralCode');
    if (!user) return res.status(404).json({ message: 'User not found' });

    const referrals = await Referral.find({ referrerId: userId })
      .populate('referredUserId', 'name role createdAt')
      .sort({ createdAt: -1 });

    const stats = {
      code: user.referralCode,
      totalReferrals: referrals.length,
      successful: referrals.filter(r => r.status === 'rewarded' || r.status === 'qualified').length,
      pending: referrals.filter(r => r.status === 'joined').length,
      totalEarned: referrals
        .filter(r => r.status === 'rewarded')
        .reduce((sum, r) => sum + (r.rewardAmount || 0), 0) / 100, // in INR
      history: referrals
    };

    res.json(stats);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching referral stats', error: err });
  }
};

export const validateReferralCode = async (req: Request, res: Response) => {
  try {
    const { code } = req.query;
    const referrer = await User.findOne({ referralCode: code as string }).select('name');
    
    if (!referrer) {
      return res.status(404).json({ valid: false, message: 'Invalid referral code' });
    }

    res.json({ valid: true, referrerName: referrer.name });
  } catch (err) {
    res.status(500).json({ message: 'Error validating code', error: err });
  }
};
