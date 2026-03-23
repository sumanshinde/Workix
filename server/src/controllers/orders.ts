import { Request, Response } from 'express';
import Order from '../models/Order';
import Job from '../models/Job';
import User from '../models/User';
import { createRazorpayOrder, verifyPaymentSignature } from '../services/paymentService';

export const createInstantOrder = async (req: Request, res: Response) => {
  try {
    const { jobId, freelancerId, amount } = req.body;
    const clientId = (req as any).user.id;

    if (!jobId || !freelancerId || !amount) {
      return res.status(400).json({ message: 'Job, freelancer, and amount are required' });
    }

    // 1. Initialize Razorpay Order
    const receipt = `hire_${Date.now()}`;
    const rzpOrder = await createRazorpayOrder(amount, receipt, { jobId, freelancerId, clientId });

    // 2. Create pending order in DB
    const order = await Order.create({
      clientId,
      freelancerId,
      jobId,
      amount: amount * 100, // store in paise
      razorpayOrderId: rzpOrder.id,
      status: 'pending'
    });

    res.json({ rzpOrder, orderId: order._id });
  } catch (err: any) {
    res.status(500).json({ message: 'Failed to create hire order', error: err.message });
  }
};

export const verifyHirePayment = async (req: Request, res: Response) => {
  try {
    const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

    // 1. Verify Signature
    const isValid = verifyPaymentSignature(razorpayOrderId, razorpayPaymentId, razorpaySignature);
    if (!isValid) return res.status(400).json({ message: 'Invalid payment signature' });

    // 2. Update Order
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    order.status = 'active';
    order.isPaid = true;
    order.paymentId = razorpayPaymentId;
    await order.save();

    // 3. Mark Job as 'in_progress'
    await Job.findByIdAndUpdate(order.jobId, { status: 'in_progress' });

    // 4. Trigger Referrer Qualification for Client and Freelancer
    const { qualifyReferral } = require('./referrals');
    await qualifyReferral(order.clientId);
    await qualifyReferral(order.freelancerId);

    console.log(`[NOTIFY] Freelancer ${order.freelancerId} hired for job ${order.jobId}`);

    res.json({ success: true, order });
  } catch (err: any) {
    res.status(500).json({ message: 'Payment verification failed', error: err.message });
  }
};
