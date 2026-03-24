import { Request, Response } from 'express';
import { razorpay, verifyWebhookSignature } from '../utils/razorpay';
import Order from '../models/Order';
import Subscription from '../models/Subscription';
import Transaction from '../models/Transaction';
import User from '../models/User';
import crypto from 'crypto';

/**
 * 1. Create Order (One-time payment)
 */
export const createOrder = async (req: Request, res: Response) => {
  try {
    const { amount, currency, receipt, jobId, freelancerId } = req.body;
    const clientId = (req as any).user.id;

    const options = {
      amount: amount * 100, // Amount in paise
      currency: currency || 'INR',
      receipt: receipt || `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    // Save initial pending order to MongoDB
    const newOrder = await Order.create({
      clientId,
      freelancerId,
      jobId,
      amount,
      razorpayOrderId: order.id,
      status: 'pending',
    });

    res.status(200).json({ success: true, order, dbOrderId: newOrder._id });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * 2. Verify Payment (Frontend calls this after successful Razorpay checkout)
 */
export const verifyPayment = async (req: Request, res: Response) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const secret = process.env.RAZORPAY_KEY_SECRET || 'dummy_key_secret';
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(body.toString())
      .digest('hex');

    if (expectedSignature === razorpay_signature) {
      // Find order and update status
      const order = await Order.findOneAndUpdate(
        { razorpayOrderId: razorpay_order_id },
        { paymentId: razorpay_payment_id, status: 'active', isPaid: true },
        { new: true }
      );

      if (order) {
        await Transaction.create({
          clientId: order.clientId,
          freelancerId: order.freelancerId,
          originalAmount: order.amount,
          clientFee: 0,
          freelancerFee: 0,
          platformRevenue: 0,
          netFreelancerAmount: order.amount,
          status: 'completed',
        });
      }

      res.status(200).json({ success: true, message: 'Payment verified successfully.' });
    } else {
      res.status(400).json({ success: false, message: 'Invalid payment signature.' });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * 3. Subscription Management - Create Subscription
 */
export const createSubscription = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { planId } = req.body;

    // Create razorpay subscription
    const subscription = await razorpay.subscriptions.create({
      plan_id: planId,
      total_count: 12,
      customer_notify: 1,
    });

    // Save pending subscription locally
    await Subscription.create({
      userId,
      planId,
      subscriptionId: subscription.id,
      status: 'created',
      currentStart: new Date(),
    });

    res.status(200).json({ success: true, subscription });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * 4. Webhook Handler
 */
export const webhookHandler = async (req: Request, res: Response) => {
  try {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET || 'webhook_secret';
    const signature = req.headers['x-razorpay-signature'] as string;
    
    // Verify Webhook Signature securely
    const isValid = verifyWebhookSignature(JSON.stringify(req.body), signature, secret);

    if (!isValid) {
      return res.status(400).json({ success: false, message: 'Invalid Webhook Signature' });
    }

    const { event, payload } = req.body;

    switch (event) {
      case 'order.paid':
        const orderParam = payload.payment.entity;
        await Order.findOneAndUpdate(
          { razorpayOrderId: orderParam.order_id },
          { isPaid: true, status: 'active', paymentId: orderParam.id }
        );
        break;

      case 'subscription.charged':
        const subData = payload.subscription.entity;
        await Subscription.findOneAndUpdate(
          { subscriptionId: subData.id },
          { 
            status: 'active',
            currentEnd: new Date(subData.current_end * 1000) 
          }
        );
        break;

      case 'subscription.halted':
      case 'subscription.cancelled':
        const subCancelledData = payload.subscription.entity;
        await Subscription.findOneAndUpdate(
          { subscriptionId: subCancelledData.id },
          { 
            status: 'cancelled',
            endedAt: new Date(subCancelledData.ended_at * 1000)
          }
        );
        break;

      default:
        console.log(`Unhandled webhook event: ${event}`);
    }

    res.status(200).json({ success: true });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
