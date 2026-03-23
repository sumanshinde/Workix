import { Router } from 'express';
import { createSubscription, razorpayWebhook, getSubscriptionStatus } from '../controllers/subscriptions';

const router = Router();

// Subscription Management
router.post('/create', createSubscription);
router.get('/status/:userId', getSubscriptionStatus);

// Razorpay Webhook (Should be public from Razorpay)
router.post('/webhook', razorpayWebhook);

export default router;
