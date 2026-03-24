import { Router } from 'express';
import { createOrder, verifyPayment, createSubscription, webhookHandler } from '../controllers/payment.controller';
import { protect } from '../middleware/auth';

const router = Router();

// Order APIs
router.post('/create-order', protect, createOrder);
router.post('/verify', protect, verifyPayment);

// Subscription APIs
router.post('/create-subscription', protect, createSubscription);

// Webhook for Razorpay Server-to-Server communication
// Note: Webhooks don't need `protect` middleware as they use signature validation
router.post('/webhook', webhookHandler);

export default router;
