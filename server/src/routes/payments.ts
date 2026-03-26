import { Router } from 'express';
import crypto from 'crypto';
import Escrow from '../models/Escrow';
import { createOrder, verifyPayment, releasePayment, refundPayment, createGlobalPayment, verifyGlobalPayment, withdrawFunds, getWallet } from '../controllers/payments';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.post('/create-order', authenticate, createOrder);
router.post('/verify', authenticate, verifyPayment);
router.post('/verify-global', authenticate, verifyGlobalPayment);
router.post('/release/:escrowId', authenticate, authorize(['client', 'admin']), releasePayment);
router.post('/refund/:escrowId', authenticate, authorize(['admin']), refundPayment);

router.post('/create-global', authenticate, createGlobalPayment);
router.get('/wallet', authenticate, getWallet);
router.post('/withdraw', authenticate, withdrawFunds);

// Webhook for Razorpay
router.post('/webhook', async (req, res) => {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET || 'webhook_secret';
  const signature = req.headers['x-razorpay-signature'];

  const shasum = crypto.createHmac('sha256', secret);
  shasum.update(JSON.stringify(req.body));
  const digest = shasum.digest('hex');

  if (digest === signature) {
    const event = req.body.event;
    if (event === 'payment.captured') {
      const { order_id, id: payment_id } = req.body.payload.payment.entity;
      await Escrow.findOneAndUpdate(
        { orderId: order_id },
        { paymentId: payment_id, status: 'escrowed', paymentStatus: 'captured' }
      );
    }
    res.status(200).json({ status: 'ok' });
  } else {
    res.status(403).json({ message: 'Invalid signature' });
  }
});

export default router;
