import { Request, Response } from 'express';
import User from '../models/User';
import Referral from '../models/Referral';

export const submitReferral = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { code } = req.body;
    
    // Find referrer
    const referrer = await User.findOne({ referralCode: code });
    if (!referrer) return res.status(404).json({ message: 'Invalid referral code' });
    if (referrer._id.toString() === userId) return res.status(400).json({ message: 'Cannot refer self' });

    // Mark as referred
    const user = await User.findById(userId);
    if (user?.referredBy) return res.status(400).json({ message: 'Already referred' });

    await User.findByIdAndUpdate(userId, { referredBy: referrer._id });

    // Track in Referral Model
    await Referral.create({
      referrerId: referrer._id,
      referredUserId: userId,
      referralCode: code,
      tier: 1,
      status: 'joined'
    });

    res.json({ message: 'Referral submitted' });
  } catch (err: any) {
    res.status(500).json({ message: 'Referral failed', error: err.message });
  }
};

export const getReferralStats = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Direct (Tier 1)
    const tier1 = await Referral.find({ referrerId: userId, tier: 1 }).populate('referredUserId', 'name status avatar');
    
    // Global stats
    const totalEarned = user.referralEarnings || 0;

    res.json({
       referralCode: user.referralCode || `BHRT-${userId.slice(-5)}`,
       stats: {
          totalEarned: totalEarned / 100,
          pending: tier1.filter(r => r.status === 'joined').length,
          completed: tier1.filter(r => r.status === 'rewarded').length
       },
       invites: tier1
    });
  } catch (err: any) {
    res.status(500).json({ message: 'Fetch stats failed', error: err.message });
  }
};

export const validateReferralCode = async (req: Request, res: Response) => {
  try {
    const { code } = req.query;
    const referrer = await User.findOne({ referralCode: code as string }).select('name');
    if (!referrer) return res.status(404).json({ valid: false, message: 'Invalid code' });
    res.json({ valid: true, referrerName: referrer.name });
  } catch (err: any) {
    res.status(500).json({ message: 'Error validating code', error: err.message });
  }
};

/**
 * Triggered on First Job / Hire
 */
export const qualifyReferral = async (userId: string) => {
  try {
    const referral = await Referral.findOne({ referredUserId: userId, status: 'joined' });
    if (!referral) return;

    // 1. Reward Referrer (Tier 1) - ₹100
    await User.findByIdAndUpdate(referral.referrerId, { 
       $inc: { referralEarnings: 10000, walletBalance: 10000, availableCredits: 2 } 
    });

    // 2. Reward New User - ₹50
    await User.findByIdAndUpdate(userId, { 
       $inc: { walletBalance: 5000 } 
    });

    // 3. Mark as Qualified & Rewarded
    referral.status = 'rewarded';
    referral.qualifiedAt = new Date();
    referral.rewardedAt = new Date();
    await referral.save();

  } catch (err) {
    console.error('Referral qualification failed:', err);
  }
};
