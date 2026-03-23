import Stripe from 'stripe';
import Razorpay from 'razorpay';
import crypto from 'crypto';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'placeholder_secret',
});

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
  apiVersion: '2023-10-16' as any,
});

export const getExchangeRate = async (from: string, to: string) => {
  // Mocking real-time exchange rates. 
  // In production, fetch from https://v6.exchangerate-api.com/v6/YOUR-KEY/latest/USD
  const rates: any = {
    'USD': { 'INR': 83.20, 'EUR': 0.92, 'GBP': 0.79 },
    'INR': { 'USD': 0.012, 'EUR': 0.011, 'GBP': 0.0095 },
  };
  return rates[from] ? rates[from][to] : 1;
};

export const createStripeIntent = async (amount: number, currency: string) => {
  return await stripe.paymentIntents.create({
    amount: Math.round(amount * 100), // convert to cents
    currency: currency.toLowerCase(),
    automatic_payment_methods: { enabled: true },
  });
};

export const createRazorpayOrder = async (amount: number, receipt: string, notes: any = {}) => {
  const options = {
    amount: Math.round(amount * 100), // Ensure it's an integer in paise
    currency: 'INR',
    receipt: receipt,
    notes: notes
  };
  return await razorpay.orders.create(options);
};

/**
 * Razorpay Route: Automatically Transfer 90% of funds to Freelancer account.
 */
export const createSplitOrder = async (amount: number, freelancerAccountId: string, receipt: string, notes: any = {}) => {
  const amountInPaise = Math.round(amount * 100);
  const platformFee = Math.round(amountInPaise * 0.10); // 10% Fee
  const transferAmount = amountInPaise - platformFee;

  const options = {
    amount: amountInPaise,
    currency: 'INR',
    receipt: receipt,
    notes: notes,
    // Razorpay Route Split Logic
    transfers: [
      {
        account: freelancerAccountId,
        amount: transferAmount,
        currency: 'INR',
        notes: {
          platform_fee_percent: '10%'
        },
        linked_account_notes: ['platform_fee_percent'],
        on_hold: 0 // Set to 1 if you want to release after milestones
      }
    ]
  };
  
  return await razorpay.orders.create(options);
};

export const verifyPaymentSignature = (
  orderId: string,
  paymentId: string,
  signature: string
) => {
  const generated_signature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'placeholder_secret')
    .update(orderId + '|' + paymentId)
    .digest('hex');

  return generated_signature === signature;
};

export const initiateRefund = async (paymentId: string, amount?: number) => {
  const options: any = {};
  if (amount) options.amount = amount * 100;
  return await razorpay.payments.refund(paymentId, options);
};

// RazorpayX Payouts (Requires RazorpayX Account)
export const createContact = async (name: string, email: string, contact: string) => {
  // Mocking RazorpayX API call - in production, this would use fetch/axios with basic auth
  return { id: `cont_${Math.random().toString(36).substr(2, 9)}` };
};

export const createFundAccount = async (contactId: string, accountType: 'bank_account' | 'vpa', details: any) => {
  return { id: `fa_${Math.random().toString(36).substr(2, 9)}` };
};

export const createPayout = async (fundAccountId: string, amount: number, mode: string = 'IMPS') => {
  // amount in paise
  return { id: `pout_${Math.random().toString(36).substr(2, 9)}`, status: 'processing' };
};
