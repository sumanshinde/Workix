import { Request, Response } from 'express';
import Stripe from 'stripe';
import crypto from 'crypto';
import Razorpay from 'razorpay';

const stripeKey = process.env.STRIPE_SECRET_KEY && process.env.STRIPE_SECRET_KEY.trim() !== "" 
  ? process.env.STRIPE_SECRET_KEY 
  : 'sk_test_placeholder';

const stripe = new Stripe(stripeKey, {
  apiVersion: '2025-02-24-preview' as any,
});

export const handleStripeWebhook = async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !webhookSecret) {
    console.error('[STRIPE] Missing signature or webhook secret');
    return res.status(400).send('Webhook Error: Missing signature or secret');
  }

  let event: Stripe.Event;

  try {
    const rawBody = (req as any).rawBody || req.body;
    event = stripe.webhooks.constructEvent(rawBody, sig!, webhookSecret);
  } catch (err: any) {
    console.error(`[STRIPE] Signature verification failed: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log(`[STRIPE] PaymentIntent ${paymentIntent.id} was successful!`);
        // TODO: Full escrow release or activation logic
        break;
      default:
        console.log(`[STRIPE] Unhandled event type ${event.type}`);
    }
    res.json({ received: true });
  } catch (err: any) {
    console.error(`[STRIPE] Event processing failed: ${err.message}`);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const handleRazorpayWebhook = async (req: Request, res: Response) => {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET!;
  const signature = req.headers['x-razorpay-signature'] as string;

  if (!signature || !secret) {
     console.error('[RAZORPAY] Missing signature or webhook secret');
     return res.status(400).json({ status: 'missing credentials' });
  }

  try {
    const rawBody = ((req as any).rawBody || req.body).toString();
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(rawBody)
      .digest('hex');

    if (signature === expectedSignature) {
      console.log('[RAZORPAY] Webhook Verified');
      const { event, payload } = req.body;
      
      if (event === 'payment.captured') {
          console.log(`[RAZORPAY] Payment captured: ${payload.payment.entity.id}`);
          // Logic for successful payment
      }
      
      res.json({ status: 'ok' });
    } else {
      console.warn('[RAZORPAY] Signature mismatch');
      res.status(400).json({ status: 'invalid signature' });
    }
  } catch (err: any) {
    console.error(`[RAZORPAY] Webhook processing failed: ${err.message}`);
    res.status(500).json({ status: 'error', message: err.message });
  }
};
