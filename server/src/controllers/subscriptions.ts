import { Request, Response } from 'express';
import { SubscriptionService } from '../services/subscriptionService';
import Subscription from '../models/Subscription';

export const createSubscription = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ message: 'User ID required' });

    const sub = await SubscriptionService.createSubscription(userId);
    res.json(sub);
  } catch (err: any) {
    res.status(500).json({ message: 'Failed to create subscription', error: err.message });
  }
};

export const getSubscriptionStatus = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const sub = await Subscription.findOne({ userId });
    res.json(sub || { status: 'none' });
  } catch (err: any) {
    res.status(500).json({ message: 'Failed to find subscription', error: err.message });
  }
};

/**
 * Razorpay Webhook Endpoint:
 * Handles events like `subscription.activated`, `subscription.charged`, etc.
 */
export const razorpayWebhook = async (req: Request, res: Response) => {
  try {
    const signature = req.headers['x-razorpay-signature'] as string;
    const bodyString = JSON.stringify(req.body);

    const isValid = SubscriptionService.verifyWebhook(bodyString, signature);
    if (!isValid) return res.status(400).json({ message: 'Invalid webhook signature' });

    // Handle event based on type
    const event = req.body;
    await SubscriptionService.handleWebhookEvent(event);

    res.json({ status: 'ok' });
  } catch (err: any) {
    console.error('Webhook Error:', err);
    res.status(500).json({ message: 'Webhook processing failed', error: err.message });
  }
};
