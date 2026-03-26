import Razorpay from 'razorpay';
import crypto from 'crypto';

if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  console.warn('[PAYMENT] Warning: Razorpay credentials missing. Payment features will fail.');
}

export const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_none',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'secret_none',
});

export const verifyWebhookSignature = (
  payload: string,
  signature: string,
  secret: string
): boolean => {
  if (!signature || !secret || !payload) return false;
  
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');

  return expectedSignature === signature;
};
