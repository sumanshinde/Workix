import User from '../models/User';
import Referral from '../models/Referral';
import { createNotification } from './notificationService';

export const processReferralReward = async (newUserId: string) => {
  try {
    // Find the referral record for this new user
    const referral = await Referral.findOne({ 
      referredUserId: newUserId, 
      status: 'joined' 
    });

    if (!referral) return;

    // Check if they were already rewarded (Idempotency)
    // and prevent self-referral if not already caught
    if (referral.referrerId.toString() === newUserId.toString()) {
      console.warn(`Self-referral detected for user ${newUserId}`);
      return;
    }

    // Check if the referred user has already completed a payment (is qualified)
    // For simplicity, we assume this function is called after their first successful payment
    
    referral.status = 'rewarded';
    referral.qualifiedAt = new Date();
    referral.rewardedAt = new Date();
    await referral.save();

    // Credit the REFFERER (the person who shared the link)
    await User.findByIdAndUpdate(referral.referrerId, {
      $inc: { walletBalance: referral.rewardAmount }
    });

    // Notify the Referrer
    const referredUser = await User.findById(newUserId).select('name');
    await createNotification(
      referral.referrerId as unknown as string,
      'Referral Reward Earned! 💸',
      `Your friend ${referredUser?.name} just completed their first project! ₹${referral.rewardAmount / 100} has been added to your wallet.`,
      'payment',
      '/dashboard/wallet'
    );

    console.log(`Referral reward processed for referrer ${referral.referrerId}`);
  } catch (err) {
    console.error('Error processing referral reward:', err);
  }
};
