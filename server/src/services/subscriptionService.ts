import Razorpay from 'razorpay';
import Subscription from '../models/Subscription';
import User from '../models/User';
import crypto from 'crypto';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'placeholder_secret',
});

// Standard BharatGig Pro Plan ID from Razorpay Dashboard
const PRO_PLAN_ID = process.env.RAZORPAY_PRO_PLAN_ID || 'plan_O8I9G4K2H0L3';

export const SubscriptionService = {
  /**
   * Generates a new subscription URL/ID for a user.
   */
  createSubscription: async (userId: string) => {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');

    // Razorpay Subscription Creation
    const options = {
      plan_id: PRO_PLAN_ID,
      total_count: 12, // For 1 year max auto-renew
      quantity: 1,
      customer_notify: 1 as 0 | 1 | boolean,
      notes: {
        userId: userId,
        tier: 'BharatGig Pro'
      }
    };

    const sub = (await razorpay.subscriptions.create(options as any)) as any;

    // Save initial record in our DB
    await Subscription.findOneAndUpdate(
      { userId },
      { 
        subscriptionId: sub.id, 
        planId: sub.plan_id, 
        status: 'created' 
      },
      { upsert: true, new: true }
    );

    return sub;
  },

  /**
   * Verifies the webhook signature from Razorpay.
   */
  verifyWebhook: (body: string, signature: string) => {
    const expected = crypto
      .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET || 'webhook_secret_key')
      .update(body)
      .digest('hex');
    return expected === signature;
  },

  /**
   * Processes subscription events from Razorpay Webhook.
   */
  handleWebhookEvent: async (event: any) => {
    const { payload, event: eventType } = event;
    const subData = payload.subscription.entity;
    const userId = subData.notes.userId;

    if (!userId) return;

    let subStatus = subData.status;

    // Update Subscription Record
    await Subscription.findOneAndUpdate(
      { subscriptionId: subData.id },
      { 
        status: subStatus,
        currentStart: new Date(subData.current_start * 1000),
        currentEnd: new Date(subData.current_end * 1000)
      }
    );

    // Update User Profile Status
    const userStatus = (subStatus === 'active') ? 'pro' : 'free';
    const userBadge = (subStatus === 'active') ? 'BharatGig Pro' : '';

    await User.findByIdAndUpdate(userId, {
      subscriptionStatus: userStatus,
      badge: userBadge
    });

    console.log(`[SUBSCRIPTION] Status updated for ${userId}: ${subStatus}`);
  }
};
