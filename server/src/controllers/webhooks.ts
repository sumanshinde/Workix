import { Request, Response } from 'express';
import Stripe from 'stripe';
import crypto from 'crypto';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24-preview' as any,
});

export const handleStripeWebhook = async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'];

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      (req as any).rawBody || req.body, 
      sig!, 
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      console.log('PaymentIntent was successful!');
      // TODO: Full escrow release or activation logic
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
};

export const handleRazorpayWebhook = async (req: Request, res: Response) => {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET!;
  const signature = req.headers['x-razorpay-signature'];

  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(JSON.stringify(req.body))
    .digest('hex');

  if (signature === expectedSignature) {
    console.log('Razorpay Webhook Verified');
    const { event, payload } = req.body;
    
    if (event === 'payment.captured') {
        // Logic for successful payment
    }
    
    res.json({ status: 'ok' });
  } else {
    res.status(400).json({ status: 'invalid signature' });
  }
};
