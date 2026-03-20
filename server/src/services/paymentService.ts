import Razorpay from 'razorpay';
import crypto from 'crypto';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'placeholder_secret',
});

export const createRazorpayOrder = async (amount: number, receipt: string, notes: any = {}) => {
  const options = {
    amount: Math.round(amount * 100), // Ensure it's an integer in paise
    currency: 'INR',
    receipt: receipt,
    notes: notes
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
